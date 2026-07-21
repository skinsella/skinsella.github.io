import { CONSTANTS, DEFAULTS, FISCAL_BRIDGE, PRESETS, SERVICE_BASES, initialPopulation, simulateAdvanced, summary } from "./advanced_model.mjs";

export const STATUS_QUO_DEFAULTS = Object.freeze({
  horizon: 25,
  northProductivityGrowth: 1.3,
  revenueElasticity: 1,
  healthRealGrowth: 2,
  educationRealGrowth: 1,
  welfareRealGrowth: 1.5,
  otherSpendingRealGrowth: 1,
});

export const UNCERTAINTY_ASSUMPTIONS = Object.freeze([
  { key: "northGrowth", centre: 3.5, low: 1.3, high: 4.8, dependence: "macro and convergence factor", status: "structured range" },
  { key: "southGrowth", centre: 2.5, low: 1.5, high: 3.5, dependence: "macro factor", status: "structured range" },
  { key: "ukPensionShare", centre: 75, low: 0, high: 100, dependence: "shared settlement factor", status: "negotiation range" },
  { key: "ukDebtShare", centre: 75, low: 0, high: 100, dependence: "shared settlement factor", status: "negotiation range" },
  { key: "reratingScope", centre: 45, low: 25, high: 100, dependence: "policy and settlement factor", status: "structured range" },
  { key: "interestRate", centre: 3.5, low: 2, high: 6, dependence: "inverse macro factor", status: "stress range" },
  { key: "taxMultiplier", centre: 0.5, low: 0.2, high: 0.9, dependence: "inverse macro factor", status: "research range" },
  { key: "investmentOutputReturn", centre: 0.08, low: 0.02, high: 0.14, dependence: "convergence factor", status: "structured range" },
  { key: "oneOffTransitionCost", centre: 5, low: 0, high: 12, dependence: "delivery factor", status: "planning range" },
]);

const clip = (value, low, high) => Math.min(high, Math.max(low, value));
const round = (value, places = 2) => Number(value.toFixed(places));

export function simulateStatusQuo(input = {}) {
  const p = { ...STATUS_QUO_DEFAULTS, ...input };
  const demographicRows = simulateAdvanced({
    ...DEFAULTS,
    horizon: p.horizon,
    northGrowth: p.northProductivityGrowth,
    southGrowth: p.northProductivityGrowth,
    employmentGain: 0,
    investment: 0,
    reratingScope: 0,
    borrowingShare: 0,
    taxMultiplier: 0,
  });
  const basePopulation = initialPopulation().north;
  const baseRevenue = 21.5 * CONSTANTS.gbpEur2023;
  const healthBase = SERVICE_BASES.health.eurBn;
  const educationBase = SERVICE_BASES.education.eurBn;
  const welfareBase = SERVICE_BASES.welfare.eurBn;
  const totalManaged = 36 * CONSTANTS.gbpEur2023;
  const otherBase = totalManaged - healthBase - educationBase - welfareBase;
  let cumulativeDeficit = 0;
  return demographicRows.map(row => {
    const year = row.year;
    const populationIndex = row.northPopulation / CONSTANTS.northPopulation;
    const childIndex = row.northChildren / basePopulation.child;
    const workingIndex = row.northWorking / basePopulation.working;
    const olderIndex = row.northOlder / basePopulation.older;
    const revenue = baseRevenue * populationIndex * (1 + p.northProductivityGrowth / 100) ** year * p.revenueElasticity;
    const health = healthBase * (0.45 * populationIndex + 0.55 * olderIndex) * (1 + p.healthRealGrowth / 100) ** year;
    const education = educationBase * childIndex * (1 + p.educationRealGrowth / 100) ** year;
    const welfare = welfareBase * (0.65 * workingIndex + 0.35 * olderIndex) * (1 + p.welfareRealGrowth / 100) ** year;
    const other = otherBase * populationIndex * (1 + p.otherSpendingRealGrowth / 100) ** year;
    const expenditure = health + education + welfare + other;
    const deficit = expenditure - revenue;
    cumulativeDeficit += deficit;
    return { year, revenue: round(revenue), expenditure: round(expenditure), deficit: round(deficit), cumulativeDeficit: round(cumulativeDeficit), health: round(health), education: round(education), welfare: round(welfare), other: round(other), northPopulation: row.northPopulation };
  });
}

export function compareWithStatusQuo(unityInput = {}, statusInput = {}) {
  const unity = simulateAdvanced({ ...DEFAULTS, ...unityInput });
  const statusQuo = simulateStatusQuo({ horizon: unity.length, ...statusInput });
  return unity.map((row, index) => ({
    year: row.year,
    irishExchequerUnityCost: row.netCost,
    ukFinancedStatusQuoDeficit: statusQuo[index].deficit,
    statusQuoResourceDeficit: statusQuo[index].deficit,
    unityTransitionDebt: row.debt,
    note: "Financing-incidence comparison, not a claim that the status-quo deficit disappears under unity",
  }));
}

function mulberry32(seed) {
  return function random() {
    let value = seed += 0x6D2B79F5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function normal(random) {
  const u = Math.max(random(), 1e-12);
  const v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function quantile(values, probability) {
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

export function uncertaintySimulation({ draws = 2000, seed = 20260721, horizon = 25 } = {}) {
  const random = mulberry32(seed);
  const results = [];
  for (let draw = 0; draw < draws; draw += 1) {
    const macro = normal(random);
    const convergence = 0.55 * macro + Math.sqrt(1 - 0.55 ** 2) * normal(random);
    const settlement = normal(random);
    const delivery = -0.35 * macro + Math.sqrt(1 - 0.35 ** 2) * normal(random);
    const input = {
      ...DEFAULTS,
      horizon,
      northGrowth: clip(3.5 + 0.75 * convergence, 1.3, 4.8),
      southGrowth: clip(2.5 + 0.4 * macro, 1.5, 3.5),
      ukPensionShare: clip(75 + 23 * settlement, 0, 100),
      ukDebtShare: clip(75 + 23 * settlement, 0, 100),
      reratingScope: clip(45 - 14 * settlement + 10 * delivery, 25, 100),
      interestRate: clip(3.5 - 0.55 * macro + 0.25 * delivery, 2, 6),
      taxMultiplier: clip(0.5 - 0.12 * macro, 0.2, 0.9),
      investmentOutputReturn: clip(0.08 + 0.022 * convergence, 0.02, 0.14),
      oneOffTransitionCost: clip(5 + 2.2 * delivery, 0, 12),
    };
    const rows = simulateAdvanced(input);
    const fiscal = summary(rows);
    results.push({ draw: draw + 1, cumulative: fiscal.cumulative, peakDebt: fiscal.peakDebt, breakEven: fiscal.breakEven, year10Cost: rows[Math.min(9, rows.length - 1)].netCost, ...Object.fromEntries(UNCERTAINTY_ASSUMPTIONS.map(item => [item.key, round(input[item.key], 4)])) });
  }
  const metrics = {};
  for (const key of ["cumulative", "peakDebt", "year10Cost"]) {
    const values = results.map(row => row[key]);
    metrics[key] = { p10: round(quantile(values, 0.10)), median: round(quantile(values, 0.50)), p90: round(quantile(values, 0.90)) };
  }
  const breakEvenShares = [10, 15, 25].map(year => ({ year, share: round(results.filter(row => row.breakEven !== null && row.breakEven <= year).length / results.length * 100, 1) }));
  return { seed, draws, horizon, metrics, breakEvenShares, results, warning: "Structured uncertainty draws, not estimated forecast probabilities" };
}

export function fiscalRuleTests(input = {}) {
  const rows = simulateAdvanced({ ...DEFAULTS, ...input });
  return rows.map(row => {
    const denominator = CONSTANTS.southGNIStar * (1 + (input.southGrowth ?? DEFAULTS.southGrowth) / 100) ** row.year;
    return {
      year: row.year,
      netCostPctGNI: round(row.netCost / denominator * 100),
      debtPctGNI: round(row.debt / denominator * 100),
      taxFundingPctGNI: round(row.taxFunding / denominator * 100),
      belowTwoPctAnnualCost: row.netCost / denominator * 100 <= 2,
      belowTenPctTransitionDebt: row.debt / denominator * 100 <= 10,
    };
  });
}

export function validationScorecard() {
  const base = initialPopulation();
  const central = simulateAdvanced(DEFAULTS);
  const bridge = FISCAL_BRIDGE.reduce((total, item) => total + item.value, 0);
  const serviceTotal = Object.values(SERVICE_BASES).reduce((total, item) => total + item.eurBn, 0);
  return [
    { test: "Fiscal bridge reconciliation", observed: 1.74, modelled: round(bridge), errorPct: round(Math.abs(bridge - 1.74) / 1.74 * 100), status: "identity check", independence: "in-sample" },
    { test: "Northern 2024 population", observed: 1.927855, modelled: round(base.north.bands.reduce((a, b) => a + b, 0), 6), errorPct: 0, status: "source reproduction", independence: "in-sample" },
    { test: "NISRA 2025 principal population", observed: 1.931301, modelled: central[0].northPopulation, errorPct: round(Math.abs(central[0].northPopulation - 1.931301) / 1.931301 * 100), status: "projection benchmark", independence: "external benchmark" },
    { test: "NISRA 2034 principal population", observed: 1.939054, modelled: central[9].northPopulation, errorPct: round(Math.abs(central[9].northPopulation - 1.939054) / 1.939054 * 100), status: "projection benchmark", independence: "external benchmark" },
    { test: "ONS four-service base", observed: 24.22, modelled: round(serviceTotal), errorPct: round(Math.abs(serviceTotal - 24.22) / 24.22 * 100), status: "source reproduction", independence: "in-sample" },
    { test: "Revenue response", observed: null, modelled: null, errorPct: null, status: "not validated", independence: "requires historical series" },
    { test: "Service outcome response", observed: null, modelled: null, errorPct: null, status: "not validated", independence: "requires outcome and unit-cost series" },
    { test: "Investment productivity return", observed: null, modelled: null, errorPct: null, status: "not validated", independence: "requires programme appraisal or econometric estimate" },
  ];
}

export function scenarioResults(horizon = 25) {
  return Object.entries(PRESETS).map(([key, preset]) => {
    const rows = simulateAdvanced({ ...preset.values, horizon });
    const fiscal = summary(rows);
    const rules = fiscalRuleTests({ ...preset.values, horizon });
    return { scenario: key, label: preset.label, year1Cost: rows[0].netCost, year10Cost: rows[Math.min(9, rows.length - 1)].netCost, cumulative: fiscal.cumulative, peakDebt: fiscal.peakDebt, breakEven: fiscal.breakEven, maxAnnualCostPctGNI: Math.max(...rules.map(row => row.netCostPctGNI)), maxDebtPctGNI: Math.max(...rules.map(row => row.debtPctGNI)) };
  });
}
