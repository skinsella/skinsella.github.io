import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CONSTANTS, FORMS, breakEven, inheritedDeficit, payback, pensionTransitionCost, simulate } from "../model_core.mjs";
import { DEFAULTS as ADVANCED_DEFAULTS, FISCAL_BRIDGE, PRESETS, SERVICE_BASES, breakEvenFrontier, convergenceTests, initialPopulation, requiredGrowthForBreakEven, sensitivity, simulateAdvanced, summary as advancedSummary } from "../advanced_model.mjs";
import { compareWithStatusQuo, scenarioResults, simulateStatusQuo, uncertaintySimulation, validationScorecard } from "../validation_model.mjs";

const structural = { southGrowth: 2.5, ageing: 1.0, shift: 0 };
const settings = (form, switches = { pensionsUK: true, debtUK: true }) => ({ ...form.defaults, ...switches });

assert.equal(Number(inheritedDeficit(true, true).toFixed(2)), 1.74);
assert.equal(Number(inheritedDeficit(false, false).toFixed(2)), 12.53);
assert.equal(pensionTransitionCost(1), CONSTANTS.PENSION_ANNUAL_STEP);
assert.equal(Number(pensionTransitionCost(10).toFixed(3)), 1.15);
assert.equal(pensionTransitionCost(100), CONSTANTS.PENSIONS);

const noDifferential = simulate({ ...settings(FORMS.glide), gNI: 2.5 }, 5, { southGrowth: 2.5, ageing: 0, shift: 0 });
assert.ok(noDifferential.every((row) => row.gain === 0));

const glide = simulate(settings(FORMS.glide), 50, structural);
assert.equal(glide[0].cost, 3.2);
assert.equal(glide[9].pensionTransition, 1.3);
assert.equal(breakEven(glide), 10);
assert.equal(payback(glide), 15);

const worst = simulate(settings(FORMS.worst, FORMS.worst.switches), 50, structural);
assert.equal(worst[0].cost, 23.5);
assert.equal(breakEven(worst), null);
assert.equal(payback(worst), null);

const canonicalHtml = readFileSync(new URL("../simulator.html", import.meta.url), "utf8");
const compatibilityHtml = readFileSync(new URL("../unification_fiscal_simulator.html", import.meta.url), "utf8");
assert.equal(compatibilityHtml, canonicalHtml);
assert.match(canonicalHtml, /Math\.min\(t \* PENSION_ANNUAL_STEP, PENSIONS\)/);
assert.match(canonicalHtml, /% of \\u20AC11bn gap/);
assert.match(canonicalHtml, /site-theme\.css/);

const population = initialPopulation();
assert.ok(population.north.child > 0 && population.north.working > 0 && population.north.older > 0);
assert.equal(population.north.bands.length, 21);
assert.ok(population.south.child > 0 && population.south.working > 0 && population.south.older > 0);
const advanced = simulateAdvanced(ADVANCED_DEFAULTS);
assert.equal(advanced.length, ADVANCED_DEFAULTS.horizon);
assert.ok(advanced.every(row => Number.isFinite(row.netCost) && Number.isFinite(row.debt)));
assert.ok(advanced.every(row => row.northPopulation > 0 && row.supportRatio > 0));
assert.ok(advanced.every(row => row.debt >= 0));
assert.equal(Number(FISCAL_BRIDGE.reduce((total, item) => total + item.value, 0).toFixed(2)), 1.74);
assert.equal(SERVICE_BASES.health.onsGbpBn, 6.181);
assert.ok(advanced[1].financingInterest > 0);
assert.ok(advanced.every(row => Math.abs(row.primaryNetCost + row.financingInterest - row.netCost) <= 0.011));
assert.ok(advanced.every((row, index) => index === 0 || Math.abs(row.debt - Math.max(0, advanced[index - 1].debt + row.borrowing + Math.min(row.netCost, 0))) <= 0.021));
const serviceStress = simulateAdvanced({ ...ADVANCED_DEFAULTS, healthUplift: 10, educationUplift: 10, administrationUplift: 10 });
assert.ok(serviceStress[9].serviceTransition.health > 0);
assert.ok(serviceStress[9].netCost > advanced[9].netCost);
const outcomeStress = simulateAdvanced({ ...ADVANCED_DEFAULTS, healthOutcomeTarget: 25, educationOutcomeTarget: 25, administrationOutcomeTarget: 25 });
assert.ok(outcomeStress[9].serviceTransition.health > 0);
const noTaxFeedback = simulateAdvanced({ ...ADVANCED_DEFAULTS, taxMultiplier: 0 });
assert.ok(advanced.some(row => row.taxFeedbackRevenueLoss > 0));
assert.ok(advanced[9].netCost >= noTaxFeedback[9].netCost);
const noInvestmentReturn = simulateAdvanced({ ...ADVANCED_DEFAULTS, investmentOutputReturn: 0 });
assert.ok(advanced.some(row => row.investmentRevenue > 0));
assert.ok(advanced[9].netCost <= noInvestmentReturn[9].netCost);
const sharedLiabilities = simulateAdvanced({ ...ADVANCED_DEFAULTS, ukPensionShare: 50, ukDebtShare: 50 });
assert.equal(sharedLiabilities[0].ukPensionShare, 50);
assert.equal(sharedLiabilities[0].ukDebtShare, 50);
assert.ok(sharedLiabilities[0].pension > advanced[0].pension);
const transitionPlan = simulateAdvanced({ ...ADVANCED_DEFAULTS, oneOffTransitionCost: 10 });
assert.ok(Math.abs(transitionPlan.reduce((total, row) => total + row.oneOffTransition, 0) - 10) <= 0.05);
assert.ok(transitionPlan[0].transitionPlan.digital > 0);
assert.ok(Number.isFinite(advancedSummary(advanced).cumulative));
assert.ok(advancedSummary(advanced).peakDebt >= advancedSummary(advanced).debt);
assert.ok(advancedSummary(advanced).peakBorrowing >= 0);
assert.ok(advancedSummary(advanced).peakTaxFunding >= 0);
assert.equal(Object.keys(PRESETS).length, 4);
for (const preset of Object.values(PRESETS)) {
  const rows = simulateAdvanced(preset.values);
  assert.ok(rows.every(row => Number.isFinite(row.netCost)));
}
const sensitivityRows = sensitivity(ADVANCED_DEFAULTS);
assert.equal(sensitivityRows.length, 5);
assert.ok(sensitivityRows.every(row => row.span >= 0 && Number.isFinite(row.span)));
const frontier = breakEvenFrontier(ADVANCED_DEFAULTS);
assert.equal(frontier.cells.length, frontier.growthRates.length * frontier.reratingScopes.length);
assert.ok(frontier.cells.every(cell => cell.breakEven === null || cell.breakEven >= 1));
const requiredGrowth10 = requiredGrowthForBreakEven(ADVANCED_DEFAULTS, 10);
assert.ok(requiredGrowth10 !== null && requiredGrowth10 >= ADVANCED_DEFAULTS.southGrowth);
const thresholdRows = [5, 10, 15, 20].map(year => requiredGrowthForBreakEven(ADVANCED_DEFAULTS, year));
assert.ok(thresholdRows.every(value => value === null || Number.isFinite(value)));
assert.ok(thresholdRows.filter(value => value !== null).every((value, index, values) => index === 0 || value <= values[index - 1]));
const tests = convergenceTests(ADVANCED_DEFAULTS);
assert.equal(tests.fiscal.checks.length, 4);
assert.equal(tests.productive.checks.length, 3);
assert.equal(tests.services.domains.length, 4);
assert.ok(["pass", "fail"].includes(tests.fiscal.status));
assert.ok(["provisional", "fail"].includes(tests.productive.status));

const statusQuo = simulateStatusQuo();
assert.equal(statusQuo.length, ADVANCED_DEFAULTS.horizon);
assert.ok(statusQuo.every(row => Number.isFinite(row.deficit) && row.deficit > 0));
assert.equal(compareWithStatusQuo().length, ADVANCED_DEFAULTS.horizon);
const uncertaintyA = uncertaintySimulation({ draws: 100, seed: 42 });
const uncertaintyB = uncertaintySimulation({ draws: 100, seed: 42 });
assert.deepEqual(uncertaintyA.metrics, uncertaintyB.metrics);
assert.ok(uncertaintyA.metrics.cumulative.p10 <= uncertaintyA.metrics.cumulative.median);
assert.ok(uncertaintyA.metrics.cumulative.median <= uncertaintyA.metrics.cumulative.p90);
assert.equal(scenarioResults().length, 4);
assert.ok(validationScorecard().some(row => row.status === "not validated"));

const advancedHtml = readFileSync(new URL("../advanced.html", import.meta.url), "utf8");
assert.match(advancedHtml, /Copy scenario link/);
assert.match(advancedHtml, /Export CSV/);
assert.match(advancedHtml, /Evidence and parameters/);
assert.match(advancedHtml, /Compare paths/);
assert.match(advancedHtml, /Sensitivity/);
assert.match(advancedHtml, /Financing exposure/);
assert.match(advancedHtml, /Print briefing/);
assert.match(advancedHtml, /Break-even frontier/);
assert.match(advancedHtml, /Required growth/);
assert.match(advancedHtml, /site-theme\.css/);
assert.match(advancedHtml, /Interest on opening transition debt/);
assert.match(advancedHtml, /target-based service additions/i);
assert.match(advancedHtml, /Tax-funded output multiplier/);
assert.match(advancedHtml, /five-year age bands/);
const convergenceHtml = readFileSync(new URL("../convergence.html", import.meta.url), "utf8");
assert.match(convergenceHtml, /Fiscal resilience/);
assert.match(convergenceHtml, /Productive convergence/);
assert.match(convergenceHtml, /Services and institutions/);
assert.match(convergenceHtml, /site-theme\.css/);
const assumptionsHtml = readFileSync(new URL("../assumptions.html", import.meta.url), "utf8");
assert.match(assumptionsHtml, /site-theme\.css/);
assert.match(assumptionsHtml, /page-hero/);
for (const page of ["baseline.html", "uncertainty.html", "validation.html", "distribution.html", "evidence.html"]) {
  const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
  assert.match(html, /The Price of Unity|Audit the model|Compared with what|Who could gain or lose|Ranges, not promises/);
}

console.log("Model checks passed");
