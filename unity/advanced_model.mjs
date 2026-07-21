export const SOURCES = Object.freeze([
  { id: "ons", label: "ONS Country and regional public sector finances", status: "Official statistics", url: "https://www.ons.gov.uk/releases/countryandregionalpublicsectorfinancesuk" },
  { id: "nisra", label: "NISRA 2024 mid-year population estimates", status: "Official statistics", url: "https://datavis.nisra.gov.uk/population/2024-mid-year-estimates-for-northern-ireland.html" },
  { id: "cso", label: "CSO Population and Labour Force Projections 2023 to 2057", status: "Official statistics", url: "https://www.cso.ie/en/releasesandpublications/ep/p-plfp/populationandlabourforceprojections2023-2057/populationprojectionsresults/" },
  { id: "ons-spend", label: "ONS 2022 to 2023 country and regional expenditure tables", status: "Official statistics", url: "https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicsectorfinance/datasets/countryandregionalpublicsectorfinancesexpendituretables" },
  { id: "esri-productivity", label: "ESRI Modelling productivity levels in Ireland and Northern Ireland", status: "Research study", url: "https://www.esri.ie/publications/modelling-productivity-levels-in-ireland-and-northern-ireland" },
  { id: "esri-overview", label: "ESRI Economic overview of Ireland and Northern Ireland", status: "Research study", url: "https://www.esri.ie/publications/economic-overview-of-ireland-and-northern-ireland" },
  { id: "ifac-multipliers", label: "Irish Fiscal Advisory Council spending multipliers", status: "Research paper", url: "https://www.fiscalcouncil.ie/irelands-spending-multipliers/" },
  { id: "nisra-projections", label: "NISRA 2024-based population projections", status: "Official statistics", url: "https://www.nisra.gov.uk/publications/2024-based-population-projections-northern-ireland" },
  { id: "doyle", label: "Doyle, Public Finances in a New Ireland", status: "Research study", url: "https://all-islandeconomy.com/wp-content/uploads/2025/06/21614_Public_Finances_UPDATED.pdf" },
]);

export const DEFAULTS = Object.freeze({
  horizon: 25, northGrowth: 3.5, southGrowth: 2.5, employmentGain: 0,
  reratingScope: 25, reratingYears: 15, investment: 1.5, duplication: 0.25,
  pensionsUK: true, debtUK: true, stall: false, borrowingShare: 70,
  interestRate: 3, northBirthRate: 10.5, southBirthRate: 10.2,
  northMigrationRate: 2.0, southMigrationRate: 5.0, pensionLongevity: 18,
  healthUplift: 0, educationUplift: 0, administrationUplift: 0,
  servicePhaseInYears: 10, oneOffTransitionCost: 0, oneOffTransitionYears: 5,
  healthOutcomeTarget: 0, educationOutcomeTarget: 0, administrationOutcomeTarget: 0,
  serviceCostPerOutcomePoint: 0.5,
  taxMultiplier: 0.5, investmentOutputReturn: 0.08, investmentLag: 3, investmentDepreciation: 4,
  ukPensionShare: 100, ukDebtShare: 100, pensionAccrualYears: 40,
});

export const PRESETS = Object.freeze({
  central: { label: "Prudent convergence", description: "A one-point Northern productivity premium, gradual harmonisation and no separate employment dividend.", evidence: "Conservative scenario within the 1 to 2 point regional convergence range in the literature synthesis.", values: { ...DEFAULTS } },
  negotiated: { label: "Conditional convergence", description: "A two-point productivity premium with UK retention of legacy liabilities and slower harmonisation.", evidence: "Barro and Sala-i-Martin conditional convergence benchmark, treated as an upside rather than a forecast.", values: { ...DEFAULTS, northGrowth: 4.5, reratingScope: 25, reratingYears: 18, borrowingShare: 60 } },
  cautious: { label: "Historical trend", description: "Northern productivity remains near its 2000 to 2024 trend while administrative overlap persists.", evidence: "Doyle and UUEPC report Northern real growth averaging about 1.3 per cent from 2000 to 2024.", values: { ...DEFAULTS, northGrowth: 1.3, reratingScope: 60, reratingYears: 15, duplication: 0.5, stall: false, borrowingShare: 75, interestRate: 4 } },
  adverse: { label: "Adverse settlement", description: "Historical Northern growth, transferred legacy liabilities, rapid rerating and higher financing costs.", evidence: "Negotiation downside combined with a no-convergence growth path.", values: { ...DEFAULTS, northGrowth: 1.3, reratingScope: 100, reratingYears: 3, investment: 0.5, duplication: 0.5, pensionsUK: false, debtUK: false, ukPensionShare: 0, ukDebtShare: 0, stall: true, interestRate: 5 } },
});

export const SENSITIVITY_SPECS = Object.freeze([
  { key: "northGrowth", label: "Northern productivity", delta: 1, unit: "percentage point" },
  { key: "employmentGain", label: "Employment convergence", delta: 2, unit: "percentage points" },
  { key: "reratingScope", label: "Rerating scope", delta: 15, unit: "percentage points" },
  { key: "interestRate", label: "Financing rate", delta: 1, unit: "percentage point" },
  { key: "northMigrationRate", label: "Northern net migration", delta: 2, unit: "per 1,000" },
]);

export const CONSTANTS = Object.freeze({
  northGNI: 73.8, southGNIStar: 290.9, taxShare: 0.35,
  publishedBalance: 16.58, pensions: 6.67, debtInterest: 4.12,
  defenceNet: 1.59, otherNonIdentifiable: 0.67, taxAdjustment: 1.79,
  fullRerating: 11, pensionAnnualStep: 0.115,
  northPopulation: 1.9279, northChildShare: 0.20, northOlderShare: 0.181,
  southPopulation: 5.149139, southChildren: 1.0143, southOlder: 0.776315,
  gbpEur2023: 1.165,
});

export const FISCAL_BRIDGE = Object.freeze([
  { key: "publishedBalance", label: "ONS Northern net fiscal deficit", value: 16.58, treatment: "starting point", status: "official-derived" },
  { key: "defenceNet", label: "Net defence adjustment", value: -1.59, treatment: "excluded under the study settlement", status: "study-derived" },
  { key: "otherNonIdentifiable", label: "Other non-identifiable and outside-UK spending", value: -0.67, treatment: "excluded under the study settlement", status: "study-derived" },
  { key: "taxAdjustment", label: "Additional Northern tax attribution", value: -1.79, treatment: "revenue re-attribution", status: "study-derived" },
  { key: "pensions", label: "Legacy state pensions", value: -6.67, treatment: "negotiated switch", status: "negotiation-dependent" },
  { key: "debtInterest", label: "Allocated UK debt interest", value: -4.12, treatment: "negotiated switch", status: "negotiation-dependent" },
]);

export const SERVICE_BASES = Object.freeze({
  health: { label: "Health", eurBn: 7.20, onsGbpBn: 6.181, status: "ONS identifiable expenditure" },
  education: { label: "Education and training", eurBn: 3.99, onsGbpBn: 3.427, status: "ONS identifiable expenditure" },
  welfare: { label: "Social protection", eurBn: 12.42, onsGbpBn: 10.658, status: "ONS identifiable expenditure" },
  administration: { label: "General public services", eurBn: 0.61, onsGbpBn: 0.525, status: "ONS identifiable expenditure" },
});

export const SERVICE_TARGETS = Object.freeze({
  health: { outcome: "Closing a selected share of the health access and outcome gap", unitCost: SERVICE_BASES.health.eurBn / CONSTANTS.northPopulation, unit: "€bn per million residents", status: "ONS base divided by NISRA population" },
  education: { outcome: "Closing a selected share of the education participation and attainment gap", unitCost: SERVICE_BASES.education.eurBn / (CONSTANTS.northPopulation * CONSTANTS.northChildShare), unit: "€bn per million children", status: "ONS base divided by NISRA child population" },
  administration: { outcome: "Closing a selected share of the administrative capacity gap", unitCost: SERVICE_BASES.administration.eurBn / CONSTANTS.northPopulation, unit: "€bn per million residents", status: "ONS base divided by NISRA population" },
});

export const TRANSITION_PLAN = Object.freeze([
  { key: "legal", label: "Constitutional, legal and treaty work", share: 0.15, start: 1, end: 2 },
  { key: "digital", label: "Digital, identity and data migration", share: 0.30, start: 1, end: 5 },
  { key: "payments", label: "Tax, payroll and benefit systems", share: 0.25, start: 1, end: 5 },
  { key: "institutions", label: "Regulators and institutional integration", share: 0.20, start: 1, end: 8 },
  { key: "contingency", label: "Delivery contingency", share: 0.10, start: 1, end: 8 },
]);

export const NORTH_AGE_BANDS_2024 = Object.freeze([
  107266, 122239, 129134, 123630, 103636, 115889, 123331, 130736, 128194,
  117946, 125015, 130254, 121391, 101720, 83780, 71602, 49228, 28213, 11573, 2784, 294,
].map(value => value / 1e6));

const round = (n, places = 2) => Number(n.toFixed(places));

export function initialPopulation() {
  const c = CONSTANTS;
  return {
    north: summariseBands([...NORTH_AGE_BANDS_2024]),
    south: { child: c.southChildren, working: c.southPopulation - c.southChildren - c.southOlder, older: c.southOlder },
  };
}

function summariseBands(bands) {
  return {
    bands,
    child: bands.slice(0, 3).reduce((a, b) => a + b, 0),
    working: bands.slice(3, 13).reduce((a, b) => a + b, 0),
    older: bands.slice(13).reduce((a, b) => a + b, 0),
  };
}

function advanceFiveYearBands(pop, birthRate, migrationRate) {
  const bands = pop.bands;
  const total = bands.reduce((a, b) => a + b, 0);
  const births = total * birthRate / 1000;
  const migration = total * migrationRate / 1000;
  const mortality = [0.0005,0.0002,0.0002,0.0003,0.0004,0.0005,0.0007,0.001,0.0015,0.0022,0.0035,0.0055,0.009,0.014,0.022,0.035,0.055,0.09,0.15,0.24,0.34];
  const migrationWeights = [0.03,0.04,0.04,0.09,0.13,0.14,0.13,0.11,0.08,0.06,0.05,0.035,0.025,0.015,0.01,0.005,0.003,0.002,0.001,0,0];
  const next = bands.map((value, index) => {
    const survival = 1 - mortality[index];
    const ageingOut = index === bands.length - 1 ? 0 : value / 5;
    const ageingIn = index === 0 ? births : bands[index - 1] / 5 * (1 - mortality[index - 1]);
    return Math.max(0, (value - ageingOut) * survival + ageingIn + migration * migrationWeights[index]);
  });
  return summariseBands(next);
}

function advanceCohort(pop, birthRate, migrationRate, longevity) {
  const total = pop.child + pop.working + pop.older;
  const births = total * birthRate / 1000;
  const migration = total * migrationRate / 1000;
  const enteringWork = pop.child / 16;
  const retiring = pop.working / 49;
  const olderDeaths = pop.older / longevity;
  return {
    child: Math.max(0, pop.child + births - enteringWork + migration * 0.15),
    working: Math.max(0, pop.working + enteringWork - retiring + migration * 0.80),
    older: Math.max(0, pop.older + retiring - olderDeaths + migration * 0.05),
  };
}

export function simulateAdvanced(input = {}) {
  const p = { ...DEFAULTS, ...input };
  const c = CONSTANTS;
  let population = initialPopulation();
  const base = initialPopulation();
  const core = c.publishedBalance - c.defenceNet - c.otherNonIdentifiable - c.taxAdjustment - c.pensions - c.debtInterest;
  let cumulative = 0;
  let debt = 0;
  let stallFactor = null;
  let previousTaxFunding = 0;
  let productiveInvestmentStock = 0;
  const investmentPipeline = [];
  const rows = [];

  for (let year = 1; year <= p.horizon; year += 1) {
    population = {
      north: advanceFiveYearBands(population.north, p.northBirthRate, p.northMigrationRate),
      south: advanceCohort(population.south, p.southBirthRate, p.southMigrationRate, p.pensionLongevity),
    };
    const northTotal = population.north.child + population.north.working + population.north.older;
    const baseNorthTotal = base.north.child + base.north.working + base.north.older;
    const populationIndex = northTotal / baseNorthTotal;
    const childIndex = population.north.child / base.north.child;
    const workingIndex = population.north.working / base.north.working;
    const olderIndex = population.north.older / base.north.older;
    const employmentIndex = workingIndex * (1 + (p.employmentGain / 100) * Math.min(year / 15, 1));
    const relativeRate = (1 + p.northGrowth / 100) / (1 + p.southGrowth / 100);
    let outputIndex;
    if (p.stall && year > 7) {
      stallFactor ??= relativeRate ** 7;
      outputIndex = stallFactor * 1.004 ** (year - 7) * employmentIndex;
    } else outputIndex = relativeRate ** year * employmentIndex;
    outputIndex = Math.min(outputIndex, 2);
    const investment = year <= 10 ? p.investment : 0;
    investmentPipeline.push(investment);
    const maturedInvestment = year > p.investmentLag ? investmentPipeline[year - p.investmentLag - 1] : 0;
    productiveInvestmentStock = productiveInvestmentStock * (1 - p.investmentDepreciation / 100) + maturedInvestment;
    const investmentOutputGain = productiveInvestmentStock * p.investmentOutputReturn;
    const taxFeedbackOutputLoss = previousTaxFunding * p.taxMultiplier;
    const convergenceRevenue = c.taxShare * c.northGNI * (outputIndex - 1);
    const investmentRevenue = c.taxShare * investmentOutputGain;
    const taxFeedbackRevenueLoss = c.taxShare * taxFeedbackOutputLoss;
    const revenueGain = convergenceRevenue + investmentRevenue - taxFeedbackRevenueLoss;
    const revenue = {
      labour: revenueGain * 0.45, consumption: revenueGain * 0.30,
      corporation: revenueGain * 0.12, propertyOther: revenueGain * 0.13,
    };
    const residualServices = {
      health: core * 0.35 * (0.45 * populationIndex + 0.55 * olderIndex),
      education: core * 0.20 * childIndex,
      welfare: core * 0.25 * workingIndex,
      administration: core * 0.20 * populationIndex,
    };
    const servicePhase = Math.min(year / Math.max(p.servicePhaseInYears, 1), 1);
    const serviceTransition = {
      health: SERVICE_BASES.health.eurBn * (p.healthUplift + p.healthOutcomeTarget * p.serviceCostPerOutcomePoint) / 100 * servicePhase * (0.45 * populationIndex + 0.55 * olderIndex),
      education: SERVICE_BASES.education.eurBn * (p.educationUplift + p.educationOutcomeTarget * p.serviceCostPerOutcomePoint) / 100 * servicePhase * childIndex,
      administration: SERVICE_BASES.administration.eurBn * (p.administrationUplift + p.administrationOutcomeTarget * p.serviceCostPerOutcomePoint) / 100 * servicePhase * populationIndex,
    };
    const rerating = Math.min(year / Math.max(p.reratingYears, 1), 1) * c.fullRerating * p.reratingScope / 100;
    const ukPensionShare = Math.min(100, Math.max(0, p.ukPensionShare ?? (p.pensionsUK ? 100 : 0))) / 100;
    const ukDebtShare = Math.min(100, Math.max(0, p.ukDebtShare ?? (p.debtUK ? 100 : 0))) / 100;
    const legacyPensionTransferred = c.pensions * (1 - ukPensionShare);
    const newIrishPensionAccrual = Math.min(year * c.pensionAnnualStep, c.pensionAnnualStep * p.pensionAccrualYears) * ukPensionShare;
    const pension = (legacyPensionTransferred + newIrishPensionAccrual) * olderIndex;
    const inheritedDebtInterest = c.debtInterest * (1 - ukDebtShare);
    const transitionPlan = Object.fromEntries(TRANSITION_PLAN.map(item => [item.key, year >= item.start && year <= item.end ? p.oneOffTransitionCost * item.share / (item.end - item.start + 1) : 0]));
    const oneOffTransition = Object.values(transitionPlan).reduce((a, b) => a + b, 0);
    const financingInterest = debt * p.interestRate / 100;
    const primaryGross = Object.values(residualServices).reduce((a, b) => a + b, 0)
      + Object.values(serviceTransition).reduce((a, b) => a + b, 0)
      + rerating + pension + inheritedDebtInterest + investment + p.duplication + oneOffTransition;
    const gross = primaryGross + financingInterest;
    const netCost = gross - revenueGain;
    const borrowing = Math.max(netCost, 0) * p.borrowingShare / 100;
    const taxFunding = Math.max(netCost, 0) - borrowing;
    debt = Math.max(0, debt + borrowing + Math.min(netCost, 0));
    previousTaxFunding = taxFunding;
    cumulative += netCost;
    const combinedWorking = population.north.working + population.south.working;
    const combinedOlder = population.north.older + population.south.older;
    rows.push({
      year, netCost: round(netCost), gross: round(gross), revenueGain: round(revenueGain), cumulative: round(cumulative),
      borrowing: round(borrowing), taxFunding: round(taxFunding), debt: round(debt),
      pctGNI: round(netCost / (c.southGNIStar * (1 + p.southGrowth / 100) ** year) * 100),
      supportRatio: round(combinedWorking / combinedOlder), northPopulation: round(northTotal, 3),
      northChildren: round(population.north.child, 3), northWorking: round(population.north.working, 3), northOlder: round(population.north.older, 3),
      revenue: Object.fromEntries(Object.entries(revenue).map(([k, v]) => [k, round(v)])),
      services: Object.fromEntries(Object.entries(residualServices).map(([k, v]) => [k, round(v)])),
      serviceTransition: Object.fromEntries(Object.entries(serviceTransition).map(([k, v]) => [k, round(v)])),
      rerating: round(rerating), pension: round(pension), investment: round(investment),
      oneOffTransition: round(oneOffTransition), financingInterest: round(financingInterest), primaryNetCost: round(primaryGross - revenueGain),
      transitionPlan: Object.fromEntries(Object.entries(transitionPlan).map(([k, v]) => [k, round(v)])),
      convergenceRevenue: round(convergenceRevenue), investmentRevenue: round(investmentRevenue), taxFeedbackRevenueLoss: round(taxFeedbackRevenueLoss),
      productiveInvestmentStock: round(productiveInvestmentStock), investmentOutputGain: round(investmentOutputGain),
      ukPensionShare: round(ukPensionShare * 100), ukDebtShare: round(ukDebtShare * 100),
      northAgeBands: population.north.bands.map(value => round(value, 4)),
    });
  }
  return rows;
}

export function summary(rows) {
  const breakEven = rows.find(row => row.netCost <= 0)?.year ?? null;
  const peak = rows.reduce((a, b) => b.netCost > a.netCost ? b : a, rows[0]);
  const peakDebt = Math.max(...rows.map(row => row.debt));
  const peakDebtRow = rows.find(row => row.debt === peakDebt);
  const peakTaxFunding = Math.max(...rows.map(row => row.taxFunding));
  const peakBorrowing = Math.max(...rows.map(row => row.borrowing));
  return {
    breakEven, peakYear: peak.year, peakCost: peak.netCost,
    cumulative: rows.at(-1).cumulative, debt: rows.at(-1).debt,
    peakDebt, peakDebtYear: peakDebtRow?.year ?? null, peakTaxFunding, peakBorrowing,
  };
}

export function sensitivity(input = {}) {
  const p = { ...DEFAULTS, ...input };
  const base = summary(simulateAdvanced(p));
  return SENSITIVITY_SPECS.map(spec => {
    const lowInput = { ...p, [spec.key]: p[spec.key] - spec.delta };
    const highInput = { ...p, [spec.key]: p[spec.key] + spec.delta };
    const low = summary(simulateAdvanced(lowInput));
    const high = summary(simulateAdvanced(highInput));
    const metric = spec.key === "interestRate" ? "Peak debt stock" : "Cumulative fiscal cost";
    const baseValue = spec.key === "interestRate" ? base.peakDebt : base.cumulative;
    const lowValue = spec.key === "interestRate" ? low.peakDebt : low.cumulative;
    const highValue = spec.key === "interestRate" ? high.peakDebt : high.cumulative;
    return { ...spec, metric, base: baseValue, low: lowValue, high: highValue, span: Math.abs(highValue - lowValue) };
  }).sort((a, b) => b.span - a.span);
}

export function breakEvenFrontier(input = {}) {
  const p = { ...DEFAULTS, ...input };
  const growthRates = [2.5, 3.5, 4.5, 5.5];
  const reratingScopes = [0, 25, 50, 75, 100];
  return {
    growthRates,
    reratingScopes,
    cells: growthRates.flatMap(northGrowth => reratingScopes.map(reratingScope => {
      const result = summary(simulateAdvanced({ ...p, northGrowth, reratingScope }));
      return { northGrowth, reratingScope, breakEven: result.breakEven, cumulative: result.cumulative, peakDebt: result.peakDebt };
    })),
  };
}

export function requiredGrowthForBreakEven(input = {}, targetYear = 15) {
  const horizon = Math.max(1, Math.round(targetYear));
  const p = { ...DEFAULTS, ...input, horizon };
  const reachesTarget = northGrowth => {
    const year = summary(simulateAdvanced({ ...p, northGrowth })).breakEven;
    return year !== null && year <= horizon;
  };
  if (reachesTarget(0)) return 0;
  if (!reachesTarget(10)) return null;
  let low = 0;
  let high = 10;
  for (let i = 0; i < 24; i += 1) {
    const middle = (low + high) / 2;
    if (reachesTarget(middle)) high = middle;
    else low = middle;
  }
  return round(high, 2);
}

export function convergenceTests(input = {}) {
  const p = { ...DEFAULTS, ...input };
  const rows = simulateAdvanced(p);
  const fiscalSummary = summary(rows);
  const peakCostRow = rows.reduce((a, b) => b.netCost > a.netCost ? b : a, rows[0]);
  const peakDebtRow = rows.reduce((a, b) => b.debt > a.debt ? b : a, rows[0]);
  const debtDenominator = CONSTANTS.southGNIStar * (1 + p.southGrowth / 100) ** peakDebtRow.year;
  const peakDebtPctGNI = peakDebtRow.debt / debtDenominator * 100;
  const stressedRows = simulateAdvanced({ ...p, interestRate: p.interestRate + 2 });
  const stressedSummary = summary(stressedRows);
  const fiscalChecks = [
    { label: "Peak annual cost below 2% of GNI*", pass: peakCostRow.pctGNI <= 2, value: `${round(peakCostRow.pctGNI)}%` },
    { label: "Peak transition debt below 10% of GNI*", pass: peakDebtPctGNI <= 10, value: `${round(peakDebtPctGNI)}%` },
    { label: "Annual break-even within 15 years", pass: fiscalSummary.breakEven !== null && fiscalSummary.breakEven <= 15, value: fiscalSummary.breakEven ? `Year ${fiscalSummary.breakEven}` : "Not reached" },
    { label: "Debt declines after a 2-point rate stress", pass: stressedRows.at(-1).debt < stressedSummary.peakDebt, value: `Peak €${round(stressedSummary.peakDebt, 1)}bn` },
  ];
  const targetYear = Math.min(15, rows.length);
  const targetRow = rows[targetYear - 1];
  const requiredGrowth = requiredGrowthForBreakEven(p, targetYear);
  const recurringTransition = targetRow.rerating + targetRow.pension;
  const productiveChecks = [
    { label: `Selected growth meets the year ${targetYear} break-even threshold`, pass: requiredGrowth !== null && p.northGrowth >= requiredGrowth, value: requiredGrowth === null ? "Above 10% required" : `${round(p.northGrowth)}% vs ${round(requiredGrowth)}%` },
    { label: `Revenue gain covers rerating and pension costs in year ${targetYear}`, pass: targetRow.revenueGain >= recurringTransition, value: `€${round(targetRow.revenueGain, 1)}bn vs €${round(recurringTransition, 1)}bn` },
    { label: "Convergence does not stall after year 7", pass: !p.stall, value: p.stall ? "Stalled path" : "Sustained path" },
  ];
  return {
    fiscal: { status: fiscalChecks.every(check => check.pass) ? "pass" : "fail", checks: fiscalChecks, peakDebt: fiscalSummary.peakDebt },
    productive: { status: productiveChecks.every(check => check.pass) ? "provisional" : "fail", checks: productiveChecks, requiredGrowth },
    services: {
      status: "data-gap",
      domains: [
        { label: "Health", measures: "Waiting time, access, avoidable mortality, workforce" },
        { label: "Education", measures: "Attainment, participation, class size, skills" },
        { label: "Housing and welfare", measures: "Housing cost, poverty, replacement rates, access" },
        { label: "Institutional capacity", measures: "Staffing, capital plan, implementation milestones" },
      ],
    },
  };
}
