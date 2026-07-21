export const CONSTANTS = Object.freeze({
  GNI_STAR: 290.9, NORTH_GNI: 73.8, TAX_SHARE: 0.35, PUBLISHED: 16.58,
  PENSIONS: 6.67, DEBT_INT: 4.12, DEFENCE_NET: 1.59, OTHER_NONID: 0.67,
  TAX_ADD: 1.79, RERATE_FULL: 11.0, PENSION_ANNUAL_STEP: 0.115,
  PARITY: 2.0, AGE_SHARE: 0.35, SHIFT_YEARS: 30, STALL_YEAR: 7,
  POST_STALL_RELATIVE_GROWTH: 0.004,
});

export const FORMS = Object.freeze({
  unitary: {
    key: "unitary", name: "Unitary", model: "German 1990 model", color: "#A63D2F",
    desc: "Full absorption on day one. Welfare and pay harmonise immediately, duplication ends fast, but the wage shock hits Northern competitiveness.",
    defaults: { reratingScope: 100, reratingYears: 1, investment: 0.5, duplication: 0, gNI: 3.5, stall: true },
  },
  federal: {
    key: "federal", name: "Federal", model: "Belgian model", color: "#2E5E9E",
    desc: "A continuing Stormont inside an all-island state. Harmonisation is deferred over two decades, but two administrations run permanently.",
    defaults: { reratingScope: 60, reratingYears: 20, investment: 0.5, duplication: 0.5, gNI: 4.0, stall: false },
  },
  glide: {
    key: "glide", name: "Asymmetric glide path", model: "Spanish and DCU-inspired", color: "#177052",
    desc: "Harmonisation follows a glide path tied to convergence benchmarks, with front-loaded investment before more of the welfare bill transfers.",
    defaults: { reratingScope: 25, reratingYears: 15, investment: 1.5, duplication: 0.25, gNI: 5.0, stall: false },
  },
  worst: {
    key: "worst", name: "Worst case", model: "FitzGerald and Morgenroth-inspired", color: "#444B52",
    desc: "Dublin absorbs pensions and debt interest, welfare and pay harmonise on day one, no investment surge occurs, and convergence stalls.",
    defaults: { reratingScope: 100, reratingYears: 1, investment: 0, duplication: 0, gNI: 3.0, stall: true },
    switches: { pensionsUK: false, debtUK: false },
  },
});

export const round1 = (x) => Math.round(x * 10) / 10;
export const round2 = (x) => Math.round(x * 100) / 100;

export function inheritedDeficit(pensionsUK, debtUK) {
  const c = CONSTANTS;
  return c.PUBLISHED - c.DEFENCE_NET - c.OTHER_NONID - c.TAX_ADD
    - (pensionsUK ? c.PENSIONS : 0) - (debtUK ? c.DEBT_INT : 0);
}

export function pensionTransitionCost(year, ageingFactor = 1) {
  const c = CONSTANTS;
  return Math.min(year * c.PENSION_ANNUAL_STEP, c.PENSIONS) * ageingFactor;
}

export function simulate(p, horizon, s) {
  const c = CONSTANTS;
  const core = c.PUBLISHED - c.DEFENCE_NET - c.OTHER_NONID - c.TAX_ADD - c.PENSIONS - c.DEBT_INT;
  const pensionsBorne = p.pensionsUK ? 0 : c.PENSIONS;
  const debtBorne = p.debtUK ? 0 : c.DEBT_INT;
  const relativeGrowth = (1 + p.gNI / 100) / (1 + s.southGrowth / 100);
  const rows = [];
  let cumulative = 0;
  let factorAtStall = null;

  for (let year = 1; year <= horizon; year += 1) {
    let relativeOutput;
    if (p.stall && year > c.STALL_YEAR) {
      if (factorAtStall === null) factorAtStall = relativeGrowth ** c.STALL_YEAR;
      relativeOutput = Math.min(factorAtStall * (1 + c.POST_STALL_RELATIVE_GROWTH) ** (year - c.STALL_YEAR), c.PARITY);
    } else {
      relativeOutput = Math.min(relativeGrowth ** year, c.PARITY);
    }
    const gain = c.TAX_SHARE * c.NORTH_GNI * (relativeOutput - 1);
    const ageingFactor = (1 + s.ageing / 100) ** year;
    const coreAged = core * (1 - c.AGE_SHARE) + core * c.AGE_SHARE * ageingFactor;
    const shiftErosion = (s.shift / 100) * core * Math.min(year / c.SHIFT_YEARS, 1);
    const rerating = Math.min(year / p.reratingYears, 1) * c.RERATE_FULL * (p.reratingScope / 100);
    const investment = year <= 10 ? p.investment : 0;
    const pensionTransition = p.pensionsUK ? pensionTransitionCost(year, ageingFactor) : 0;
    const cost = coreAged - shiftErosion + pensionsBorne * ageingFactor + debtBorne
      + pensionTransition + rerating + investment + p.duplication - gain;
    const denominator = c.GNI_STAR * (1 + s.southGrowth / 100) ** year;
    cumulative += cost;
    rows.push({
      year, cost: round1(cost), pctGNI: round2(cost / denominator * 100), cumulative: round1(cumulative),
      gross: round1(coreAged + pensionsBorne * ageingFactor + debtBorne + pensionTransition + rerating + investment + p.duplication),
      gain: round1(-gain), pensionTransition: round1(pensionTransition),
    });
  }
  return rows;
}

export function breakEven(rows) {
  const hit = rows.find((row) => row.cost <= 0);
  return hit ? hit.year : null;
}

export function payback(rows) {
  let incurredDeficit = false;
  for (const row of rows) {
    if (row.cumulative > 0) incurredDeficit = true;
    if (incurredDeficit && row.cumulative <= 0) return row.year;
  }
  return null;
}

