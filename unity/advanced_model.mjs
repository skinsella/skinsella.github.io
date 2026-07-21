export const SOURCES = Object.freeze([
  { id: "ons", label: "ONS Country and regional public sector finances", status: "Official statistics", url: "https://www.ons.gov.uk/releases/countryandregionalpublicsectorfinancesuk" },
  { id: "nisra", label: "NISRA 2024 mid-year population estimates", status: "Official statistics", url: "https://datavis.nisra.gov.uk/population/2024-mid-year-estimates-for-northern-ireland.html" },
  { id: "cso", label: "CSO Population and Labour Force Projections 2023 to 2057", status: "Official statistics", url: "https://www.cso.ie/en/releasesandpublications/ep/p-plfp/populationandlabourforceprojections2023-2057/populationprojectionsresults/" },
  { id: "doyle", label: "Doyle, Public Finances in a New Ireland", status: "Research study", url: "https://all-islandeconomy.com/wp-content/uploads/2025/06/21614_Public_Finances_UPDATED.pdf" },
]);

export const DEFAULTS = Object.freeze({
  horizon: 25, northGrowth: 4.5, southGrowth: 2.5, employmentGain: 4,
  reratingScope: 25, reratingYears: 15, investment: 1.5, duplication: 0.25,
  pensionsUK: true, debtUK: true, stall: false, borrowingShare: 70,
  interestRate: 3, northBirthRate: 10.5, southBirthRate: 10.2,
  northMigrationRate: 2.0, southMigrationRate: 5.0, pensionLongevity: 18,
});

export const PRESETS = Object.freeze({
  central: { label: "Central path", description: "Gradual harmonisation with sustained but moderate convergence.", values: { ...DEFAULTS } },
  negotiated: { label: "Negotiated glide path", description: "Legacy liabilities stay with the UK and harmonisation follows a longer timetable.", values: { ...DEFAULTS, northGrowth: 5, employmentGain: 5, reratingScope: 25, reratingYears: 18, borrowingShare: 60 } },
  cautious: { label: "Cautious path", description: "Slower convergence, wider rerating and a persistent administrative overlap.", values: { ...DEFAULTS, northGrowth: 3, employmentGain: 2, reratingScope: 60, reratingYears: 15, duplication: 0.5, stall: true, borrowingShare: 75, interestRate: 4 } },
  adverse: { label: "Adverse settlement", description: "Ireland assumes both legacy liabilities while convergence stalls.", values: { ...DEFAULTS, northGrowth: 2.5, employmentGain: 0, reratingScope: 100, reratingYears: 3, investment: 0.5, duplication: 0.5, pensionsUK: false, debtUK: false, stall: true, interestRate: 5 } },
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
});

const round = (n, places = 2) => Number(n.toFixed(places));

export function initialPopulation() {
  const c = CONSTANTS;
  return {
    north: { child: c.northPopulation * c.northChildShare, working: c.northPopulation * (1 - c.northChildShare - c.northOlderShare), older: c.northPopulation * c.northOlderShare },
    south: { child: c.southChildren, working: c.southPopulation - c.southChildren - c.southOlder, older: c.southOlder },
  };
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
  const rows = [];

  for (let year = 1; year <= p.horizon; year += 1) {
    population = {
      north: advanceCohort(population.north, p.northBirthRate, p.northMigrationRate, p.pensionLongevity),
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
    const revenueGain = c.taxShare * c.northGNI * (outputIndex - 1);
    const revenue = {
      labour: revenueGain * 0.45, consumption: revenueGain * 0.30,
      corporation: revenueGain * 0.12, propertyOther: revenueGain * 0.13,
    };
    const services = {
      health: core * 0.35 * (0.45 * populationIndex + 0.55 * olderIndex),
      education: core * 0.20 * childIndex,
      welfare: core * 0.25 * workingIndex,
      administration: core * 0.20 * populationIndex,
    };
    const rerating = Math.min(year / Math.max(p.reratingYears, 1), 1) * c.fullRerating * p.reratingScope / 100;
    const pension = p.pensionsUK ? Math.min(year * c.pensionAnnualStep, c.pensions) * olderIndex : c.pensions * olderIndex;
    const inheritedDebtInterest = p.debtUK ? 0 : c.debtInterest;
    const investment = year <= 10 ? p.investment : 0;
    const gross = Object.values(services).reduce((a, b) => a + b, 0) + rerating + pension + inheritedDebtInterest + investment + p.duplication;
    const netCost = gross - revenueGain;
    const borrowing = Math.max(netCost, 0) * p.borrowingShare / 100;
    const taxFunding = Math.max(netCost, 0) - borrowing;
    debt = Math.max(0, debt * (1 + p.interestRate / 100) + borrowing + Math.min(netCost, 0));
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
      services: Object.fromEntries(Object.entries(services).map(([k, v]) => [k, round(v)])),
      rerating: round(rerating), pension: round(pension), investment: round(investment),
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
