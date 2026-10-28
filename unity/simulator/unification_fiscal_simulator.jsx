import React, { useMemo, useState } from "react";
import {
  ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend,
} from "recharts";

// ---------------------------------------------------------------
// Constant 2023 euros. Fiscal bridge follows data/rebased.json. Northern Ireland GDP £63.3bn × €1.14970.
// Existing baseline retained pending the agreed ONS update. No new official-data claims.

// ---------------------------------------------------------------
const GNI_STAR = 290.9;
const NORTH_GNI = 63.3 / 0.86979; // Project output anchor remains unverified. Arithmetic now follows the recorded FX input.
// Original sterling observations from F&M 2024 Tables 6 and 7, not reverse-converted euro totals.
const UK_2019_TO_2023_EUR = ((90.7406+92.0952+92.7667+92.7151)/(76.6540+77.4590+77.9213+78.3396))/0.86979;
const UK_FY2022_TO_2023_EUR = ((90.7406+92.0952+92.7667+92.7151)/(85.7671+87.1467+89.3502+90.7406))/0.86979;
const BASE_REVENUE = 21.773*UK_FY2022_TO_2023_EUR;
const BASE_SPENDING = BASE_REVENUE+17.058; // Preserve the agreed frozen rounded deficit exactly.
const GROSS_PAY_FULL = 4.306*UK_2019_TO_2023_EUR;
const GROSS_WELFARE_FULL = 4.809*UK_2019_TO_2023_EUR;
const SOURCE_PAY_BASE = 6.797*UK_2019_TO_2023_EUR;
const MODEL_VERSION = '2026-10-28-accounting-repair';
const PUBLISHED = 17.058;
const PENSIONS = 6.864;
const DEBT_INT = 4.238;
const DEFENCE_NET = 1.640;
const OTHER_NONID = 0.692;
const TAX_ADD = 1.840;
const RERATE_FULL = (18.104-9.577)*UK_2019_TO_2023_EUR;


const FORMS = {
  unitary: {
    key: "unitary", name: "Unitary", model: "Merge both systems at once",
    color: "#A63D2F",
    desc: "Full absorption on day one. Welfare and pay harmonise immediately, duplication ends fast, with growth selected independently.",
    defaults: { reratingScope: 100, reratingYears: 1, investment: 0.5, duplication: 0, gNI: 2.5, stall: false },
  },
  federal: {
    key: "federal", name: "Federal", model: "Keep two governments for decades",
    color: "#2E5E9E",
    desc: "A continuing Stormont inside an all-island state. Full harmonisation phased over two decades, but two administrations run permanently.",
    defaults: { reratingScope: 100, reratingYears: 20, investment: 0.5, duplication: 0.5, gNI: 2.5, stall: false },
  },
  glide: {
    key: "glide", name: "Managed Integration", model: "Phase it in, invest early",
    color: "#177052",
    desc: "An illustrative linear harmonisation schedule with additional expenditure during the first decade. Growth is a separate assumption.",
    defaults: { reratingScope: 100, reratingYears: 15, investment: 1.5, duplication: 0.25, gNI: 2.5, stall: false },
  },
  worst: {
    key: "worst", name: "Higher initial cost", model: "Immediate harmonisation, no extra investment",
    color: "#444B52",
    desc: "Immediate pay and welfare harmonisation without additional investment. Liability choices and growth are controlled separately and apply to every policy bundle.",
    defaults: { reratingScope: 100, reratingYears: 1, investment: 0, duplication: 0, gNI: 2.5, stall: false },
  },
  statusquo: {
    key: "statusquo", name: "UK status quo", model: "UK-funded regional balance",
    color: "#786A90", desc: "Northern Ireland remains in the UK. Its regional deficit remains UK-funded. No incremental Republic expenditure is assumed.",
    defaults: { reratingScope: 0, reratingYears: 1, investment: 0, duplication: 0, gNI: 2.5, stall: false },
    counterfactual: true,
  },
  shared: {
    key: "shared", name: "Shared Island", model: "Cooperation without constitutional change",
    color: "#AA7A19", desc: "Northern Ireland remains in the UK. The Republic funds the investment selected below. UK liabilities do not transfer.",
    defaults: { reratingScope: 0, reratingYears: 1, investment: 0.5, duplication: 0, gNI: 2.5, stall: false },
    counterfactual: true,
  },
};

// ---------------------------------------------------------------
// Simulation
// ---------------------------------------------------------------
function inheritedDeficit(pensionsUK, debtUK, s = {}) {
  return PUBLISHED - DEFENCE_NET*(s.defenceSavingShare??0)/100 - OTHER_NONID*(s.centralSavingShare??0)/100 - TAX_ADD*(s.taxAdjustmentShare??0)/100
    - (pensionsUK ? PENSIONS : 0) - (debtUK ? DEBT_INT : 0);
}

// Published benchmarks are transferred evidence, not Northern Ireland estimates.
// All other response settings below are explicitly illustrative calibrations.
const ECONOMIC_PARAMETERS = [
  {key:'investmentCapitalShare',label:'Capital share of additional expenditure',value:0,min:0,max:100,step:5,unit:'%',basis:'Unallocated by default. Health, welfare and education expenditure is not automatically capital'},
  {key:'spareCapacity',label:'Spare capacity for temporary demand',value:0,min:0,max:20,step:1,unit:'%',basis:'Explicit fixed-price capacity constraint. No demand dividend without capacity'},
  {key:'baselineGrowth',label:'Northern Ireland counterfactual growth',value:2.5,min:0,max:4,step:0.25,unit:'% pa',basis:'Illustrative reference path, independent of Republic growth'},
  {key:'investmentEfficiency',label:'Investment delivered as productive capital',value:80,min:0,max:100,step:5,unit:'%',basis:'Illustrative delivery efficiency'},
  {key:'investmentLag',label:'Investment completion delay',value:2,min:0,max:10,step:1,unit:' years',basis:'Illustrative construction delay'},
  {key:'capitalDepreciation',label:'Capital depreciation',value:4,min:0,max:10,step:0.5,unit:'% pa',basis:'Illustrative depreciation rate'},
  {key:'publicCapitalRatio',label:'Reference public capital stock',value:100,min:25,max:200,step:5,unit:'% of reference output',basis:'Illustrative stock normalisation, not measured NI capital'},
  {key:'publicCapitalElasticity',label:'Public-capital output elasticity',value:0.106,min:0,max:0.25,step:0.001,unit:'',basis:'External meta-analysis average, not an NI causal estimate',url:'https://doi.org/10.1111/joes.12037'},
  {key:'privateCapitalRatio',label:'Reference private capital stock',value:150,min:50,max:300,step:10,unit:'% of reference output',basis:'Illustrative stock normalisation'},
  {key:'privateCrowdIn',label:'Private capital response to productivity',value:1,min:0,max:3,step:0.1,unit:' elasticity',basis:'Illustrative investment response'},
  {key:'privateAdjustment',label:'Private capital adjustment period',value:5,min:1,max:15,step:1,unit:' years',basis:'Illustrative adjustment lag'},
  {key:'privateCapitalElasticity',label:'Private-capital output elasticity',value:0.3,min:0,max:0.6,step:0.05,unit:'',basis:'Illustrative production-function parameter'},
  {key:'publicPayBase',label:'Reference public pay bill',value:Math.round(SOURCE_PAY_BASE*1000)/1000,min:5,max:20,step:0.001,unit:' €bn',basis:'F&M 2024 Table 6, 2019 public pay £6.797bn, rebased with UK deflator and 2023 FX. Historical benchmark, not a current measured pay bill',url:'https://www.iiea.com/images/uploads/resources/Northern_Ireland_Subvention_Possible_Unification_Effects.pdf'},
  {key:'payDisposableShare',label:'Pay increase reaching household disposable income',value:65,min:0,max:100,step:5,unit:'%',basis:'Illustrative after-tax income share. No separate fiscal tax add-back'},
  {key:'payMPC',label:'Consumption from additional disposable pay',value:0.6,min:0,max:1,step:0.05,unit:' share',basis:'Illustrative propensity to consume'},
  {key:'welfareMPC',label:'Consumption from additional welfare',value:0.8,min:0,max:1,step:0.05,unit:' share',basis:'Illustrative propensity to consume'},
  {key:'domesticRetention',label:'Additional consumption retained domestically',value:50,min:0,max:100,step:5,unit:'%',basis:'Illustrative import leakage. Spending effects are uncertain',url:'https://www.fiscalcouncil.ie/irelands-spending-multipliers/'},
  {key:'demandRealisation',label:'Domestic demand translated into real output',value:50,min:0,max:100,step:5,unit:'%',basis:'Illustrative spare-capacity and price adjustment'},
  {key:'wageSpillover',label:'Public-to-private wage spillover',value:20,min:0,max:100,step:5,unit:'%',basis:'Illustrative wage transmission'},
  {key:'labourSupplyElasticity',label:'Labour-supply response to real wages',value:0.2,min:0,max:0.6,step:0.05,unit:' elasticity',basis:'Illustrative aggregate value. Irish estimates differ across household groups',url:'https://www.ucd.ie/economics/t4media/WP09.30.pdf'},
  {key:'welfareIncomeElasticity',label:'Welfare income effect on labour supply',value:0.05,min:0,max:0.3,step:0.01,unit:' elasticity',basis:'Illustrative income effect, not benefit-withdrawal microsimulation'},
  {key:'labourDemandElasticity',label:'Employment response to output and labour costs',value:0.5,min:0,max:1,step:0.05,unit:' elasticity',basis:'Illustrative labour-demand parameter'},
  {key:'labourSlack',label:'Available resident labour above reference employment',value:5,min:0,max:15,step:0.5,unit:'%',basis:'Illustrative labour availability'},
  {key:'publicRecruitmentElasticity',label:'Public-service recruitment response to pay',value:0.2,min:0,max:0.6,step:0.05,unit:' elasticity',basis:'Illustrative recruitment index. Not an output or tax gain'},
  {key:'baselineEmployment',label:'Reference employment for job equivalents',value:900000,min:700000,max:1100000,step:10000,unit:' jobs',basis:'Illustrative employment scale, not an official employment estimate'},
  {key:'migrationResponse',label:'Unfilled labour demand met through migration',value:0,min:0,max:100,step:5,unit:'%',basis:'Illustrative response. Disabled by default'},
  {key:'migrantHouseholdSize',label:'Additional residents per migrant worker',value:1.5,min:1,max:3,step:0.1,unit:' people',basis:'Illustrative household size'},
  {key:'serviceCostPerResident',label:'Annual service cost per additional resident',value:15000,min:0,max:30000,step:1000,unit:' € per resident',basis:'Illustrative marginal cost, not average public spending'},
];

const DEFAULT_STRUCTURAL = { southGrowth: 2.5, ageing: 0, shift: 0, realInterest: 2, discountRate: 2,
    businessUplift: 0, labourUplift: 0, transitionShock: 0, privateMaturity: 10, privateRecovery: 5,
    fundOpening: 0, fundReturn: 2, fundContribution: 0, fundContributionYears: 10, fundDrawCap: 5, linkedMechanisms: false, growthRevenue: false,
    taxShare: 35, baselineRevenueGrowth: 0, baselineSpendingGrowth: 0,
    defenceSavingShare: 0, centralSavingShare: 0, taxAdjustmentShare: 0,
    pensionTransferYears: 40, ageSensitiveSpending: 0, outputCeiling: 0,
    ...Object.fromEntries(ECONOMIC_PARAMETERS.map(item => [item.key, item.value])) };
// Conditional feasibility examples. These are selected assumptions, not estimated forecasts.
const MANAGED_CASES = {
  negotiated_growth: {label:'Negotiated-growth illustration',gNI:4.5},
  faster_growth: {label:'Stronger-growth illustration',gNI:5.0},
};
function managedCase(key) {
  const example=MANAGED_CASES[key];
  if(!example)throw new RangeError('Unknown Managed Integration example');
  return {label:example.label,policy:{...FORMS.glide.defaults,gNI:example.gNI,stall:false,pensionsUK:true,debtUK:true,counterfactual:false,shared:false},structural:{...DEFAULT_STRUCTURAL,growthRevenue:true,taxShare:35,defenceSavingShare:100,centralSavingShare:100,taxAdjustmentShare:100,linkedMechanisms:false}};
}

// Selected fiscal scenarios, not forecasts or estimated policy effects.
const UNITY_CASES = {
 federal_balance:{label:'Federal · annual balance',form:'federal',growth:4.5,fiscalGrowth:1},
 managed_balance:{label:'Managed Integration · annual balance',form:'glide',growth:5,fiscalGrowth:1},
 federal_payback:{label:'Federal · cumulative payback',form:'federal',growth:5,fiscalGrowth:1},
 managed_payback:{label:'Managed Integration · cumulative payback',form:'glide',growth:5.5,fiscalGrowth:1},
 unitary_payback:{label:'Unitary · faster growth',form:'unitary',growth:6,fiscalGrowth:1},
 managed_spending:{label:'Managed Integration · faster service spending',form:'glide',growth:6,fiscalGrowth:2.5},
};
function unityCase(key) {
 const c=UNITY_CASES[key];
 if(!c)throw new RangeError('Unknown fiscal scenario');
 const seed=managedCase('faster_growth');
 return {label:c.label,form:c.form,policy:{...seed.policy,...FORMS[c.form].defaults,gNI:c.growth},structural:{...seed.structural,baselineRevenueGrowth:c.fiscalGrowth,baselineSpendingGrowth:c.fiscalGrowth}};
}

const MODEL_CONSTANTS = { GNI_STAR, NORTH_GNI, UK_2019_TO_2023_EUR, UK_FY2022_TO_2023_EUR, BASE_REVENUE, BASE_SPENDING, GROSS_PAY_FULL, GROSS_WELFARE_FULL, SOURCE_PAY_BASE, PUBLISHED, PENSIONS, DEBT_INT, DEFENCE_NET, OTHER_NONID, TAX_ADD, RERATE_FULL };

function validateInputs(p,horizon,s) {
  if(!Number.isInteger(horizon)||horizon<1||horizon>100)throw new RangeError('Horizon must be an integer from 1 to 100');
  for(const [key,value] of Object.entries({...s,...p}))if(typeof value==='number'&&!Number.isFinite(value))throw new RangeError('Non-finite input '+key);
  for(const key of Object.keys(s))if(!(key in DEFAULT_STRUCTURAL))throw new TypeError('Unknown structural input '+key);
  for(const [key,value] of Object.entries(s))if(typeof DEFAULT_STRUCTURAL[key]==='number'&&!Number.isFinite(value))throw new TypeError('Non-numeric input '+key);
  for(const key of Object.keys(p))if(!['gNI','stall','reratingScope','reratingYears','investment','duplication','pensionsUK','debtUK','counterfactual','shared'].includes(key))throw new TypeError('Unknown policy input '+key);
  for(const key of ['linkedMechanisms','growthRevenue'])if(s[key]!==undefined&&typeof s[key]!=='boolean')throw new TypeError('Invalid switch '+key);
  for(const key of ['stall','counterfactual','shared'])if(p[key]!==undefined&&typeof p[key]!=='boolean')throw new TypeError('Invalid switch '+key);
  for(const key of ['gNI','reratingScope','reratingYears','investment','duplication'])if(!Number.isFinite(p[key]))throw new TypeError('Missing policy input '+key);
  for(const key of ['pensionsUK','debtUK'])if(typeof p[key]!=='boolean')throw new TypeError('Missing liability switch '+key);
  if(p.gNI<0||p.gNI>7||p.reratingScope<0||p.reratingScope>100||p.reratingYears<1||p.investment<0||p.duplication<0)throw new RangeError('Policy input outside supported domain');
  for(const item of ECONOMIC_PARAMETERS){const v=s[item.key]??item.value;if(!Number.isFinite(v)||v<item.min||v>item.max)throw new RangeError('Economic input outside supported domain '+item.key);}
  for(const key of ['southGrowth','ageing'])if(!Number.isFinite(s[key])||s[key]<0||s[key]>10)throw new RangeError('Invalid structural input '+key);
  for(const key of ['fundOpening','fundContribution','fundDrawCap','realInterest','discountRate','ageSensitiveSpending'])if((s[key]??0)<0)throw new RangeError('Negative input '+key);
  if((s.fundReturn??0)<-100)throw new RangeError('Fund return cannot be below minus 100 percent');
  if((s.pensionTransferYears??40)<1||(s.outputCeiling??0)<0||((s.outputCeiling??0)>0&&s.outputCeiling<1))throw new RangeError('Invalid transfer period or ceiling');
  for(const key of ['defenceSavingShare','centralSavingShare','taxAdjustmentShare','taxShare'])if((s[key]??(key==='taxShare'?35:100))<0||(s[key]??0)>100)throw new RangeError('Invalid percentage '+key);
  for(const key of ['baselineRevenueGrowth','baselineSpendingGrowth'])if((s[key]??0)<-10||(s[key]??0)>10)throw new RangeError('Invalid fiscal baseline growth '+key);
  if(s.shift)throw new RangeError('Unspecified compositional deficit erosion has been removed');
}
function policyForForm(key, common, selected = null) {
  if(!FORMS[key])throw new RangeError('Unknown policy bundle');
  return {...FORMS[key].defaults,...(selected??{}),...common,counterfactual:!!FORMS[key].counterfactual,shared:key==='shared'};
}

function simulate(p, horizon, s) {
  const e = Object.fromEntries(ECONOMIC_PARAMETERS.map(item => [item.key, s[item.key] ?? item.value]));
  validateInputs(p,horizon,s);
  const linked = s.linkedMechanisms === true;
  const core = inheritedDeficit(true,true,s);
  const pensionsBorne = p.pensionsUK ? 0 : PENSIONS;
  const debtBorne = p.debtUK ? 0 : DEBT_INT;
  const r = (1 + p.gNI / 100) / (1 + e.baselineGrowth / 100);
  const gs = s.southGrowth / 100, ag = s.ageing / 100;
  const isStatusQuo = p.counterfactual && !p.shared;
  const openingFund = isStatusQuo ? 0 : Math.max(0, s.fundOpening ?? 0);
  let cumulative=0, debt=0, presentValue=0, cashSavings=0, fundBalance=openingFund;
  let totalDraws=0, totalFundReturns=0, factorAtStall=null, publicCapital=0, privateCapital=0, migrantWorkers=0;
  const rows=[];
  const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
  for(let t=1;t<=horizon;t++) {
    let factor;
    if(p.stall && t>7) {
      if(factorAtStall===null) factorAtStall=Math.pow(r,7);
      factor=factorAtStall*Math.pow(Math.min(r,1.004),t-7);
    } else factor=Math.pow(r,t);
    const baselineOutput=NORTH_GNI*Math.pow(1+e.baselineGrowth/100,t);
    // The no-change case follows the reference NI path, not the policy growth input.
    const policyOutput=isStatusQuo ? baselineOutput : baselineOutput*factor;
    const ageF=Math.pow(1+ag,t);
    const baselineRevenue=BASE_REVENUE*Math.pow(1+(s.baselineRevenueGrowth??0)/100,t);
    const baselineSpending=BASE_SPENDING*Math.pow(1+(s.baselineSpendingGrowth??0)/100,t);
    const fiscalDrift=(baselineSpending-BASE_SPENDING)-(baselineRevenue-BASE_REVENUE);
    const coreAged=core+fiscalDrift+(s.ageSensitiveSpending??0)*(ageF-1);
    const shiftErosion=0; // Unsupported disappearance of a residual deficit removed.
    const rerating=p.counterfactual ? 0 : Math.min(t/p.reratingYears,1)*RERATE_FULL*p.reratingScope/100;
    const invest=!isStatusQuo && t<=10 ? p.investment : 0;
    const payIncrease=rerating/RERATE_FULL*GROSS_PAY_FULL, welfareIncrease=rerating/RERATE_FULL*GROSS_WELFARE_FULL;
    const privateRamp=Math.min(t/Math.max(1,s.privateMaturity??10),1);
    const shockDecay=Math.max(0,1-(t-1)/Math.max(1,s.privateRecovery??5));
    const businessResidual=isStatusQuo ? 0 : (s.businessUplift??0)*privateRamp/100;
    const labourResidual=isStatusQuo ? 0 : (s.labourUplift??0)*privateRamp/100;
    const disruption=isStatusQuo ? 0 : (s.transitionShock??0)*shockDecay/100;
    let publicProductivity=1, privateProductivity=1, consumptionOutput=0, employmentChange=0;
    let residentEmploymentChange=0, privateWagePressure=0, publicRecruitment=0, serviceCost=0, completedCapital=0;
    if(linked && !isStatusQuo) {
      const completionYear=t-Math.round(e.investmentLag);
      completedCapital=completionYear>=1 && completionYear<=10 ? p.investment*e.investmentCapitalShare/100*e.investmentEfficiency/100 : 0;
      publicCapital=publicCapital*(1-e.capitalDepreciation/100)+completedCapital;
      const publicReference=baselineOutput*e.publicCapitalRatio/100;
      publicProductivity=Math.pow(1+publicCapital/publicReference,e.publicCapitalElasticity);
      const publicWageChange=payIncrease/e.publicPayBase;
      privateWagePressure=publicWageChange*e.wageSpillover/100;
      publicRecruitment=clamp(e.publicRecruitmentElasticity*publicWageChange,0,0.5);
      const disposablePay=payIncrease*e.payDisposableShare/100;
      const consumptionSpending=(e.payMPC*disposablePay+e.welfareMPC*welfareIncrease)*e.domesticRetention/100;
      consumptionOutput=consumptionSpending*e.demandRealisation/100;
      const privateReference=baselineOutput*e.privateCapitalRatio/100;
      const targetPrivate=privateReference*clamp(e.privateCrowdIn*(publicProductivity-1)-privateWagePressure,-0.5,0.5);
      // Target is an additional net stock. Replacement is implicit in maintaining it.
      privateCapital=privateCapital+(targetPrivate-privateCapital)/e.privateAdjustment;
      privateCapital=Math.max(privateCapital,-0.8*privateReference);
      privateProductivity=Math.pow(1+privateCapital/privateReference,e.privateCapitalElasticity);
      // Private labour demand responds to productivity/capital and wage pressure.
      // Consumption output is a separate first-round effect, not counted again in this employment channel.
      const labourDemand=clamp(e.labourDemandElasticity*(publicProductivity*privateProductivity-1-privateWagePressure),-0.5,0.5);
      const welfareIncomeEffect=e.welfareIncomeElasticity*welfareIncrease/(0.6*baselineOutput);
      const labourSupply=clamp(e.labourSlack/100+e.labourSupplyElasticity*privateWagePressure-welfareIncomeEffect+labourResidual,-0.5,0.5);
      residentEmploymentChange=Math.min(labourDemand,labourSupply);
      const unfilledJobs=Math.max(0,(labourDemand-residentEmploymentChange)*e.baselineEmployment-migrantWorkers);
      migrantWorkers+=unfilledJobs*e.migrationResponse/100;
      const employedMigrantWorkers=Math.min(migrantWorkers,Math.max(0,(labourDemand-residentEmploymentChange)*e.baselineEmployment));
      employmentChange=clamp(residentEmploymentChange+employedMigrantWorkers/e.baselineEmployment,-0.5,0.5);
      const extraResidents=migrantWorkers*e.migrantHouseholdSize;
      serviceCost=extraResidents*e.serviceCostPerResident/1e9;
    }
    // The public-capital benchmark is a reduced-form output response. Do not add its
    // induced private-capital and job responses to output again. They remain diagnostics.
    const labourFactor=1+labourResidual;
    const supplyOutput=policyOutput*publicProductivity*labourFactor;
    const capacityOutput=supplyOutput/(1-e.spareCapacity/100);
    consumptionOutput=Math.min(consumptionOutput,Math.max(0,capacityOutput-supplyOutput));
    const uncappedOutput=(supplyOutput+consumptionOutput)*(1+businessResidual-disruption);
    const ceiling=(s.outputCeiling??0)>0 ? baselineOutput*s.outputCeiling : Number.MAX_VALUE;
    const actualOutput=isStatusQuo ? baselineOutput : clamp(uncappedOutput,0,ceiling);
    const marginalRevenue=s.growthRevenue===true ? (s.taxShare??35)/100 : 0;
    const baselineGain=marginalRevenue*(policyOutput-baselineOutput);
    const privateOutput=actualOutput-policyOutput;
    const privateRevenue=marginalRevenue*privateOutput;
    const gain=baselineGain+privateRevenue;
    // Transfer the same frozen pension envelope, so the endpoints reconcile.
    // This is a linear funding scenario, not a cohort-based actuarial forecast.
    const pension=p.pensionsUK ? PENSIONS*Math.min(t/(s.pensionTransferYears??40),1)*ageF : 0;
    // Includes inherited debt interest. This is not a textbook primary balance.
    const preFinancingCost=coreAged-shiftErosion+pensionsBorne*ageF+debtBorne+pension+rerating+invest+p.duplication+serviceCost-gain;
    const regionalDeficit=baselineSpending-baselineRevenue+(s.ageSensitiveSpending??0)*(ageF-1)+serviceCost+invest+rerating-gain;
    const primary=p.counterfactual ? (p.shared ? invest : 0) : preFinancingCost;
    const interest=debt*((s.realInterest??2)/100), cost=primary+interest;
    const fundReturn=fundBalance*((s.fundReturn??0)/100);
    const availableFund=Math.max(0,fundBalance+fundReturn);
    const contribution=!isStatusQuo && t<=(s.fundContributionYears??10) ? Math.max(0,s.fundContribution??0) : 0;
    const fundDraw=Math.min(availableFund,Math.max(0,cost),Math.max(0,s.fundDrawCap??5));
    fundBalance=availableFund+contribution-fundDraw;
    totalDraws+=fundDraw; totalFundReturns+=fundReturn;
    const financingNeed=cost+contribution-fundDraw;
    const cashUsed=Math.min(cashSavings,Math.max(0,financingNeed));
    cashSavings-=cashUsed;
    const debtBeforeFloor=debt+financingNeed-cashUsed;
    cashSavings+=Math.max(0,-debtBeforeFloor);
    const borrowing=Math.max(0,financingNeed-cashUsed);
    debt=Math.max(0,debtBeforeFloor);
    const netLiabilities=debt-fundBalance-cashSavings, wealthCost=netLiabilities+openingFund;
    presentValue+=cost/Math.pow(1+(s.discountRate??2)/100,t);
    const denom=GNI_STAR*Math.pow(1+gs,t);
    cumulative+=cost;
    rows.push({
      year:t, baselineRevenue:round2(baselineRevenue), baselineSpending:round2(baselineSpending), pensionTransfer:round2(pension), pensionCost:round2(pensionsBorne*ageF+pension), harmonisation:round2(rerating), grossPayIncrease:round2(payIncrease), grossWelfareIncrease:round2(welfareIncrease), capacityOutput:round2(capacityOutput), annualNonPositive:cost<=0 ? 1 : 0, cumulativeNonPositive:cumulative<=0 ? 1 : 0, primaryCost:round1(primary), interest:round2(interest), debt:round1(debt), presentValue:round1(presentValue),
      regionalDeficit:round2(regionalDeficit), cost:round1(cost), pctGNI:round2(cost/denom*100), cumulative:round1(cumulative),
      privateOutput:round2(privateOutput), privateRevenue:round2(privateRevenue), fundBalance:round2(fundBalance),
      fundReturn:round2(fundReturn), fundContribution:round2(contribution), fundDraw:round2(fundDraw),
      totalDraws:round2(totalDraws), totalFundReturns:round2(totalFundReturns), financingNeed:round2(financingNeed),
      borrowing:round2(borrowing), netLiabilities:round2(netLiabilities), cashSavings:round2(cashSavings), wealthCost:round2(wealthCost),
      gross:round1(coreAged+pensionsBorne*ageF+debtBorne+pension+rerating+invest+p.duplication+serviceCost), gain:round1(-gain),
      baselineOutput:round2(baselineOutput), actualOutput:round2(actualOutput), completedCapital:round2(completedCapital),
      publicCapital:round2(publicCapital), privateCapital:round2(privateCapital), consumptionOutput:round2(consumptionOutput),
      privateWagePressure:round2(privateWagePressure*100), publicRecruitmentIndex:round2(100*(1+publicRecruitment)),
      additionalJobs:round0(employmentChange*e.baselineEmployment), migrantWorkers:round0(migrantWorkers),
      additionalResidents:round0(migrantWorkers*e.migrantHouseholdSize), serviceCost:round2(serviceCost),
      outputCapped:uncappedOutput>ceiling ? 1 : 0,
    });
  }
  return rows;
}

function breakEven(rows) {
  const hit = rows.find((r) => r.annualNonPositive === 1);
  return hit ? hit.year : null;
}
function payback(rows) {
  let started = false;
  for (const r of rows) {
    if (r.cumulativeNonPositive === 0) started = true;
    if (started && r.cumulativeNonPositive === 1) return r.year;
  }
  return null;
}
const round0 = (x) => { const rounded=Math.round(x); return rounded===0 ? 0 : rounded; };
const round1 = (x) => { const rounded=Math.round(x*10)/10; return rounded===0 ? 0 : rounded; };
const round2 = (x) => { const rounded=Math.round(x*100)/100; return rounded===0 ? 0 : rounded; };

// ---------------------------------------------------------------
// UI primitives
// ---------------------------------------------------------------
function Slider({ label, value, onChange, min, max, step, unit, marks, referencePoints }) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs tracking-wide uppercase" style={{ color: "#5C6B63", letterSpacing: "0.08em" }}>{label}</span>
        <span className="font-medium" style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: 15, color: "#182420" }}>
          {value}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label} className="w-full accent-current" style={{ color: "#177052", height: 22 }} />
      {referencePoints && (
        <div className="relative mt-1" style={{ height: 28 }}>
          {referencePoints.map((point) => (
            <button key={point.label} type="button" onClick={() => onChange(point.value)}
              title={`Set Northern Ireland real growth to ${round2(point.value)}% per year`}
              className="absolute text-[10px] whitespace-nowrap"
              style={{ left: `${100 * (point.value - min) / (max - min)}%`, transform: "translateX(-50%)", color: "#177052" }}>
              <span className="block mx-auto" style={{ width: 1, height: 5, background: "#177052" }} />
              {point.label}
            </button>
          ))}
        </div>
      )}
      {marks && (
        <div className="flex justify-between mt-0.5">
          {marks.map((m) => (
            <span key={m} className="text-[10px]" style={{ color: "#8A968E" }}>{m}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ label, sub, on, onChange, amount }) {
  return (
    <button onClick={() => onChange(!on)}
      className="w-full flex items-center justify-between py-2.5 px-3 mb-2 rounded-md border text-left transition-colors"
      style={{ borderColor: on ? "#177052" : "#DCE2DC", background: on ? "#EDF5F0" : "#FFFFFF" }}>
      <div>
        <div className="text-sm font-medium" style={{ color: "#182420" }}>{label}</div>
        <div className="text-xs" style={{ color: "#5C6B63" }}>{sub}</div>
      </div>
      <div className="flex items-center gap-3">
        <span style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: 13, color: on ? "#177052" : "#8A968E" }}>
          {on ? `−€${amount}bn` : `€${amount}bn included`}
        </span>
        <div className="w-9 h-5 rounded-full relative transition-colors" style={{ background: on ? "#177052" : "#C9D2CB" }}>
          <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: on ? 18 : 2 }} />
        </div>
      </div>
    </button>
  );
}

// Signature element: the ledger waterfall
function Waterfall({ pensionsUK, debtUK, structural }) {
  const segs = [
    { label: "Defence, non-ID, tax", value: DEFENCE_NET*structural.defenceSavingShare/100 + OTHER_NONID*structural.centralSavingShare/100 + TAX_ADD*structural.taxAdjustmentShare/100, off: true },
    { label: "Pensions", value: PENSIONS, off: pensionsUK },
    { label: "Debt interest", value: DEBT_INT, off: debtUK },
  ];
  const residual = inheritedDeficit(pensionsUK, debtUK, structural);
  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs uppercase tracking-wide" style={{ color: "#5C6B63", letterSpacing: "0.08em" }}>
          Starting balance and selected adjustments
        </span>
        <span className="text-xs" style={{ color: "#8A968E" }}>Frozen study-based starting gap €{PUBLISHED}bn</span>
      </div>
      <div className="flex w-full h-9 rounded-md overflow-hidden border" style={{ borderColor: "#DCE2DC" }}>
        {segs.filter(s=>s.off&&s.value>0).map((s) => (
          <div key={s.label} className="relative h-full transition-all duration-500 flex items-center justify-center"
            style={{
              width: `${(s.value / PUBLISHED) * 100}%`,
              background: s.off ? "repeating-linear-gradient(45deg,#EDF1ED,#EDF1ED 4px,#E2E8E2 4px,#E2E8E2 8px)" : "#C48A7E",
              opacity: s.off ? 1 : 0.95,
            }}
            title={`${s.label}: €${round1(s.value)}bn ${s.off ? "(stays with London)" : "(transfers to Dublin)"}`}>
            <span className="text-[10px] px-1 truncate" style={{ color: s.off ? "#8A968E" : "#5A2A20" }}>{s.label}</span>
          </div>
        ))}
        <div className="h-full flex items-center justify-center transition-all duration-500"
          style={{ width: `${(Math.max(residual, 0) / PUBLISHED) * 100}%`, background: "#182420", minWidth: 76 }}>
          <span className="text-[11px] font-medium text-white px-1" style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
            €{round1(residual)}bn
          </span>
        </div>
      </div>
      <div className="text-[11px] mt-1.5" style={{ color: "#5C6B63" }}>
        Hatched segments are selected deductions, not agreed savings. The dark block is the adjusted opening gap before new pension accrual, harmonisation and additional expenditure.
      </div>
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-lg border px-4 py-3" style={{ borderColor: "#DCE2DC", background: "#FFFFFF" }}>
      <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: "#5C6B63", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 600, color: "#182420", lineHeight: 1.05 }}>{value}</div>
      {sub && <div className="text-[11px] mt-1" style={{ color: "#8A968E" }}>{sub}</div>}
    </div>
  );
}

// ---------------------------------------------------------------
// Main
// ---------------------------------------------------------------
export default function UnificationSimulator() {
  const [form, setForm] = useState("glide");
  const [custom, setCustom] = useState(false);
  const [caseLabel, setCaseLabel] = useState(null);
  const [pensionsUK, setPensionsUK] = useState(false);
  const [debtUK, setDebtUK] = useState(false);
  const [params, setParams] = useState({ ...FORMS.glide.defaults });
  const [metric, setMetric] = useState("annual"); // annual | pct | cumulative | compare
  const [chartType, setChartType] = useState("area"); // area | line | bar
  const [horizon, setHorizon] = useState(25);
  const [structural, setStructural] = useState({ ...DEFAULT_STRUCTURAL });

  const setP = (k, v) => { setParams((p) => ({ ...p, [k]: v })); setCustom(true); setCaseLabel(null); };
  const setS = (k, v) => { setStructural((s) => ({ ...s, [k]: v })); setCaseLabel(null); };
  const pickForm = (k) => {
    setForm(k); setCustom(false); setCaseLabel(null); setParams((previous) => ({ ...FORMS[k].defaults, gNI: previous.gNI, stall: previous.stall }));

  };

  const loadManagedCase = (key) => {
    const example=managedCase(key);
    setForm('glide');setCustom(true);setCaseLabel(example.label);
    setParams({...FORMS.glide.defaults,gNI:example.policy.gNI,stall:false});
    setPensionsUK(example.policy.pensionsUK);setDebtUK(example.policy.debtUK);
    setStructural({...example.structural});
  };

  const loadUnityCase = (key) => {
    const example=unityCase(key);
    setForm(example.form);setCustom(true);setCaseLabel(example.label);setHorizon(25);
    const {gNI,stall,reratingScope,reratingYears,investment,duplication}=example.policy;
    setParams({gNI,stall,reratingScope,reratingYears,investment,duplication});
    setPensionsUK(example.policy.pensionsUK);setDebtUK(example.policy.debtUK);
    setStructural({...example.structural});
  };

  const active = policyForForm(form,{gNI:params.gNI,stall:params.stall,pensionsUK,debtUK},params);
  const rows = useMemo(() => simulate(active, horizon, structural), [params, pensionsUK, debtUK, horizon, structural, form]);
  const be = breakEven(rows);
  const rows50 = useMemo(
    () => (horizon === 50 ? rows : simulate(active, 50, structural)),
    [params, pensionsUK, debtUK, horizon, structural, rows, form]
  );
  const pb50 = payback(rows50);
  const cumEnd = rows[rows.length - 1].cumulative;
  const yearOne = rows[0];
  const lastYear = rows[rows.length - 1];
  const noFundRows = useMemo(() => simulate(active, horizon, { ...structural, fundOpening: 0, fundContribution: 0 }), [params, pensionsUK, debtUK, horizon, structural, form]);
  const fundInterestSaved = round2(noFundRows.reduce((total, row) => total + row.interest, 0) - rows.reduce((total, row) => total + row.interest, 0));

  const compareData = useMemo(() => {
    const runs = Object.values(FORMS).map((f) => ({
      f,
      rows: simulate(policyForForm(f.key,{gNI:params.gNI,stall:params.stall,pensionsUK,debtUK},f.key===form?params:null), horizon, structural),
    }));
    return Array.from({ length: horizon }, (_, i) => {
      const o = { year: i + 1 };
      runs.forEach(({ f, rows: rr }) => { o[f.key] = rr[i].cost; });
      return o;
    });
  }, [pensionsUK, debtUK, horizon, structural, params, form]);

  const exportRun = () => {
    const comparedPolicies=Object.fromEntries(Object.keys(FORMS).map(key=>[key,policyForForm(key,{gNI:params.gNI,stall:params.stall,pensionsUK,debtUK},key===form?params:null)]));
    const payload={modelVersion:MODEL_VERSION,modelSha256:typeof BUILD_FINGERPRINT==='string'?BUILD_FINGERPRINT:null,createdAt:new Date().toISOString(),caseLabel,form,horizon,policy:active,structural,comparedPolicies,rows,comparison:compareData,qualification:'Conditional accounting and explicit experiments. Not an estimated forecast or welfare ranking.'};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download='reunification_scenario.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),0);
  };

  const color = FORMS[form].color;

  const yLabel = metric === "pct" ? "% of GNI*" : "€bn (2023 prices)";
  const dataKey = metric === "pct" ? "pctGNI" : metric === "cumulative" ? "cumulative" : "cost";

  return (
    <div className="min-h-screen" style={{ background: "#F6F7F4", color: "#182420" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer;}
        input[type=range]::-webkit-slider-runnable-track{height:3px;background:#D5DCD5;border-radius:2px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;height:16px;width:16px;border-radius:50%;background:#177052;margin-top:-6.5px;border:2px solid #F6F7F4;box-shadow:0 1px 2px rgba(0,0,0,.2);}
        input[type=range]::-moz-range-track{height:3px;background:#D5DCD5;border-radius:2px;}
        input[type=range]::-moz-range-thumb{height:14px;width:14px;border-radius:50%;background:#177052;border:2px solid #F6F7F4;}
        body{font-family:'IBM Plex Sans',system-ui,sans-serif;}`}</style>

      <div className="max-w-6xl mx-auto px-5 py-8">
        <header className="mb-7">
          <div className="text-xs uppercase tracking-wide mb-2" style={{ color: "#5C6B63", letterSpacing: "0.14em" }}>
            Conditional fiscal accounting · constant 2023 euros · frozen source vintage
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: "clamp(26px,4vw,38px)", lineHeight: 1.1 }}>
            Reunification Scenarios
          </h1>
          <a href="model_reference.html" target="_blank" rel="noreferrer" className="inline-block mt-3 underline text-sm" style={{ color: "#177052" }}>Model reference · variables, parameters and sources</a>
          <p className="mt-2 max-w-2xl text-sm" style={{ color: "#5C6B63" }}>
            Every published estimate of the cost of Irish unification is a bundle of assumptions about
            constitutional form, negotiated liabilities and convergence speed. Set the bundle yourself. Selecting a bundle changes policy spending and timing only, while negotiated terms and growth stay explicit.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Controls */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#DCE2DC", background: "#FFFFFF" }}>
              <div className="text-xs uppercase tracking-wide mb-3" style={{ color: "#5C6B63", letterSpacing: "0.08em" }}>
                Policy bundle
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {Object.values(FORMS).map((f) => (
                  <button key={f.key} onClick={() => pickForm(f.key)} aria-pressed={form === f.key}
                    className="rounded-md border px-2 py-2 text-left transition-all"
                    style={{
                      borderColor: form === f.key ? f.color : "#DCE2DC",
                      background: form === f.key ? `${f.color}12` : "#FFF",
                      boxShadow: form === f.key ? `inset 0 0 0 1px ${f.color}` : "none",
                    }}>
                    <div className="w-2.5 h-2.5 rounded-full mb-1.5" style={{ background: f.color }} />
                    <div className="text-[13px] font-semibold leading-tight">{f.name}</div>
                    <div className="text-[10px]" style={{ color: "#8A968E" }}>{f.model}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#5C6B63" }}>
                {caseLabel ? caseLabel : custom ? "Custom settings. Pick a bundle to reset its policy controls." : FORMS[form].desc}
              </p>
              <div role="status" aria-live="polite" className="mt-3 rounded-md p-3 text-xs" style={{background:'#F6F7F4'}}>
                <p className="font-semibold mb-2">{FORMS[form].name}{custom ? ' · edited settings' : ' · policy settings loaded'}</p>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <dt>Final harmonisation target</dt><dd>{params.reratingScope}%</dd>
                  <dt>Rerating phase-in</dt><dd>{params.reratingYears === 1 ? 'Immediate' : `${params.reratingYears} years`}</dd>
                  <dt>Additional expenditure</dt><dd>€{params.investment}bn a year in years 1–10</dd>
                  <dt>Duplication cost</dt><dd>€{params.duplication}bn a year</dd>
                </dl>
                <p className="mt-2">These policy dials update below. Growth, negotiated terms, economic responses and financing keep your current settings when you switch bundles.</p>
                {FORMS[form].counterfactual && <p className="mt-2">Northern Ireland remains UK-funded in this comparison. Only selected Republic of Ireland cooperation spending enters its cost.</p>}
              </div>
            </div>

            <div className="rounded-xl border p-5 mb-4" style={{borderColor:'#DCE2DC',background:'#FFFFFF'}}>
              <div className="text-xs uppercase tracking-wide mb-3" style={{color:'#5C6B63'}}>United Ireland fiscal scenarios</div>
              <p className="text-xs mb-3">Choose a complete conditional setup for annual balance or cumulative payback. These examples replace all settings and use a 25-year horizon.</p>
              <div className="grid grid-cols-1 gap-2">{Object.entries(UNITY_CASES).map(([key,c])=><button key={key} type="button" onClick={()=>loadUnityCase(key)} className="border rounded px-3 py-2 text-xs text-left" style={{borderColor:'#DCE2DC'}}>{c.label}<span className="block mt-1" style={{color:'#5C6B63'}}>NI growth {c.growth}% · baseline receipts and spending growth {c.fiscalGrowth}%</span></button>)}</div>
              <p className="text-xs mt-3">All assume favourable UK pension and interest terms, acceptance of all study adjustments, a 35% marginal revenue response and full harmonisation. Growth rates are selected hypotheses, not forecasts.</p>
              <a href="../book/united_ireland_fiscal_cases.md" target="_blank" rel="noreferrer" className="underline text-xs">Outcomes, affordability measures and less favourable variants</a>
            </div>

            {form === 'glide' && <div className="rounded-xl border p-5 mb-4" style={{borderColor:'#DCE2DC',background:'#FFFFFF'}}>
              <div className="text-xs uppercase tracking-wide mb-3" style={{color:'#5C6B63'}}>Managed Integration over 25 years</div>
              <p className="text-xs mb-3">Test favourable negotiated terms with an explicit growth-related revenue response. Each button replaces the complete current setup with an illustrative case.</p>
              <div className="flex gap-2 mb-3">{Object.entries(MANAGED_CASES).map(([key,example])=><button type="button" key={key} onClick={()=>loadManagedCase(key)} className="border rounded px-3 py-2 text-xs" style={{borderColor:'#177052',color:'#177052'}}>Test {example.gNI}% real growth</button>)}</div>
              <p className="text-xs mb-2">These examples assume UK retention of accrued pensions and allocated interest, all study deductions, a 35% marginal revenue response, and a 2.5% Northern Ireland reference growth path. Baseline real receipts and spending are held constant, and no additional linked dividend or fund is added.</p>
              <a href="../book/managed_integration_25_year_tests.md" target="_blank" rel="noreferrer" className="underline text-xs" style={{color:'#177052'}}>Required growth, repayment tests and sensitivity</a>
            </div>}

            <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#DCE2DC", background: "#FFFFFF" }}>
              <div className="text-xs uppercase tracking-wide mb-3" style={{ color: "#5C6B63", letterSpacing: "0.08em" }}>
                Elements to Negotiate
              </div>
              <Toggle label="UK retains accrued pension liabilities" sub="Negotiated pension allocation, not an established entitlement" on={pensionsUK} onChange={v=>{setPensionsUK(v);setCaseLabel(null);}} amount={PENSIONS} />
              <Toggle label="UK retains debt interest" sub="Negotiated allocation, not a legal conclusion" on={debtUK} onChange={v=>{setDebtUK(v);setCaseLabel(null);}} amount={DEBT_INT} />
              <p className="text-xs mb-3">The switches and accepted shares below define the assumed settlement. They are not agreed terms.</p>
              <Slider label="Share of study defence deduction accepted" value={structural.defenceSavingShare} onChange={v=>setS('defenceSavingShare',v)} min={0} max={100} step={5} unit="%" />
              <Slider label="Share of study central-spending deduction accepted" value={structural.centralSavingShare} onChange={v=>setS('centralSavingShare',v)} min={0} max={100} step={5} unit="%" />
              <Slider label="Share of study revenue adjustment accepted" value={structural.taxAdjustmentShare} onChange={v=>setS('taxAdjustmentShare',v)} min={0} max={100} step={5} unit="%" />
              <Slider label="Pension funding transfer period if UK retains accrued liabilities" value={structural.pensionTransferYears} onChange={v=>setS('pensionTransferYears',v)} min={1} max={60} step={1} unit=" years" />
              <p className="text-xs">The pension envelope transfers linearly to the Republic over this period. Its endpoint matches the same envelope used when there is no UK retention, without assuming additional tax recovery.</p>
            </div>

            <div className="rounded-xl border p-5" style={{ borderColor: "#DCE2DC", background: "#FFFFFF" }}>
              <div className="text-xs uppercase tracking-wide mb-4" style={{ color: "#5C6B63", letterSpacing: "0.08em" }}>
                Independent growth assumptions
              </div>
              <Slider label="Northern Ireland growth before policy effects" value={params.gNI} onChange={(v) => setP("gNI", v)}
                min={0} max={7} step={0.25} unit="% pa"
                referencePoints={[
                  { label: "C +1%", value: structural.baselineGrowth + 1 },
                  { label: "B +2%", value: structural.baselineGrowth + 2 },
                  { label: "A +3%", value: structural.baselineGrowth + 3 },
                ]} />
              <p className="text-[11px] mb-4" style={{ color: "#5C6B63" }}>
                A, B and C are markers inspired by Doyle’s growth scenarios. Here the premiums apply to the selected Northern Ireland counterfactual and do not reproduce the paper’s per-capita, population or fiscal calculations. Click a point to select it.
              </p>
              <Slider label="Republic of Ireland real growth (GNI*)" value={structural.southGrowth} onChange={(v) => setS("southGrowth", v)}
                min={0} max={4} step={0.25} unit="% pa"
                marks={["No real growth", "Higher real growth"]} />
              <div className="text-[11px] mb-4 -mt-2 px-1 rounded" style={{ color: "#5C6B63" }}>
                Convergence differential {" "}
                <span style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: "#182420" }}>
                  {round2(((1 + params.gNI / 100) / (1 + structural.baselineGrowth / 100) - 1) * 100)}% pa
                </span>
                {" "} relative to the Northern Ireland counterfactual, not a measured rate of closure of the income gap. Baseline growth is retained when switching forms. Linked mechanisms add policy effects separately.
              </div>
              <label className="flex items-center gap-2 mb-5 cursor-pointer">
                <input type="checkbox" checked={params.stall} onChange={(e) => setP("stall", e.target.checked)} className="accent-current" style={{ color }} />
                <span className="text-xs" style={{ color: "#5C6B63" }}>Illustrative slowdown after year 7, relative catch-up capped at 0.4% and never increased by this switch</span>
              </label>
              <div className="text-xs uppercase tracking-wide mb-4 mt-2" style={{ color: "#5C6B63", letterSpacing: "0.08em" }}>
                Policy dials
              </div>
              <Slider label="Final harmonisation target" value={params.reratingScope} onChange={(v) => setP("reratingScope", v)}
                min={0} max={100} step={5} unit="% of net envelope"
                marks={["Permanent partial alignment", "Full alignment"]} />
              <p className="text-xs mb-4">Full net fiscal envelope €{round2(RERATE_FULL)}bn. Gross pay and welfare components are kept separate. See the source reconciliation on the reference page.</p>
              <Slider label="Rerating phase-in" value={params.reratingYears} onChange={(v) => setP("reratingYears", v)}
                min={1} max={25} step={1} unit=" yrs" marks={["Day one", "A generation"]} />
              <Slider label="Additional expenditure (yrs 1–10)" value={params.investment} onChange={(v) => setP("investment", v)}
                min={0} max={2.5} step={0.25} unit=" €bn/yr" />
              <Slider label="Duplication cost" value={params.duplication} onChange={(v) => setP("duplication", v)}
                min={0} max={1} step={0.05} unit=" €bn/yr" marks={["Unitary", "Two of everything"]} />
            </div>

            <div className="rounded-xl border p-5 mt-4" style={{ borderColor: "#DCE2DC", background: "#FFFFFF" }}>
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "#5C6B63", letterSpacing: "0.08em" }}>
                Structural and financing assumptions
              </div>
              <p className="text-xs mb-4" style={{ color: "#8A968E" }}>
                Baseline receipts and spending have separate real growth assumptions. Age-sensitive services must have an explicit spending base. Republic growth changes the affordability denominator, not Northern Ireland revenue.
              </p>
              <Slider label="Ageing drift" value={structural.ageing} onChange={(v) => setS("ageing", v)}
                min={0} max={2} step={0.25} unit="% pa"
                marks={["Off", "Faster Northern Ireland ageing"]} />
              <Slider label="Real borrowing rate" value={structural.realInterest} onChange={(v) => setS("realInterest", v)} min={0} max={6} step={0.25} unit="% pa" />
              <Slider label="Real discount rate" value={structural.discountRate} onChange={(v) => setS("discountRate", v)} min={0} max={6} step={0.25} unit="% pa" />
              <p className="text-xs mb-4">Rates are illustrative assumptions. Interest applies to opening transition debt. Surpluses repay debt before accumulating net savings.</p>
              <Slider label="Baseline receipts real growth" value={structural.baselineRevenueGrowth} onChange={v=>setS('baselineRevenueGrowth',v)} min={-2} max={4} step={0.25} unit="% pa" />
              <Slider label="Baseline spending real growth" value={structural.baselineSpendingGrowth} onChange={v=>setS('baselineSpendingGrowth',v)} min={-2} max={4} step={0.25} unit="% pa" />
              <Slider label="Additional age-sensitive service spending base" value={structural.ageSensitiveSpending} onChange={v=>setS('ageSensitiveSpending',v)} min={0} max={15} step={0.5} unit=" €bn" />
              <p className="text-xs mb-4">This service base excludes pensions and any ageing already allowed for in baseline spending growth. No share of the net deficit is automatically treated as age-sensitive spending.</p>
              <label className="flex gap-2 text-xs mb-3"><input type="checkbox" checked={structural.growthRevenue} onChange={e=>setS('growthRevenue',e.target.checked)} />Apply assumed extra-output revenue to fiscal costs</label>
              <Slider label="Marginal revenue from additional output" value={structural.taxShare} onChange={v=>setS('taxShare',v)} min={0} max={60} step={1} unit="%" />
              <p className="text-xs mb-4">Revenue feedback is off initially. Turning it on applies an assumed marginal rate, not an estimated tax elasticity.</p>
              <Slider label="Optional output ceiling, zero disables" value={structural.outputCeiling} onChange={v=>setS('outputCeiling',v)} min={0} max={4} step={1} unit=" times reference output" />
            </div>
            <div className="rounded-xl border p-5 mt-4" style={{ borderColor: "#DCE2DC", background: "#FFFFFF" }}>
              <div className="text-xs uppercase tracking-wide mb-3" style={{ color: "#5C6B63" }}>Linked economic mechanisms</div>
              <label className="flex items-center gap-2 mb-3 text-xs"><input type="checkbox" checked={structural.linkedMechanisms} onChange={(event) => setS("linkedMechanisms", event.target.checked)} />Enable experimental economic responses</label>
              <p className="text-xs mb-3">Investment builds depreciating capital after a delivery lag. Harmonisation affects household consumption, private wages, labour supply and recruitment. Firms adjust capital and employment, with migration and service costs if enabled.</p>
              <p className="text-xs mb-3">The public-capital benchmark is a reduced-form response. Induced private capital and jobs are diagnostics and do not add a second output dividend. Demand is limited by selected spare capacity. All response parameters remain unestimated for Northern Ireland, and growth must exclude any effects entered separately.</p>
              <details><summary className="cursor-pointer text-sm mb-4">Response parameters and evidence</summary>
                {ECONOMIC_PARAMETERS.map(item => <div key={item.key}>
                  <Slider label={item.label} value={structural[item.key]} onChange={value => setS(item.key, value)} min={item.min} max={item.max} step={item.step} unit={item.unit} />
                  <p className="text-[11px] mb-4 -mt-3" style={{ color: "#5C6B63" }}>{item.basis}{item.url && <> <a href={item.url} target="_blank" rel="noreferrer" className="underline">Source</a></>}</p>
                </div>)}
              </details>
            </div>
            <div className="rounded-xl border p-5 mt-4" style={{ borderColor: "#DCE2DC", background: "#FFFFFF" }}>
              <div className="text-xs uppercase tracking-wide mb-3" style={{ color: "#5C6B63" }}>Private-sector responses</div>
              <p className="text-xs mb-4" style={{ color: "#5C6B63" }}>Residual output shocks beyond the linked investment and harmonisation channels. Leave these at zero unless they represent effects excluded from both the baseline growth path and the linked mechanisms.</p>
              <Slider label="Residual business and FDI output uplift" value={structural.businessUplift} onChange={(v) => setS("businessUplift", v)} min={0} max={15} step={0.5} unit="% of output at maturity" />
              <Slider label="Residual labour output contribution" value={structural.labourUplift} onChange={(v) => setS("labourUplift", v)} min={0} max={10} step={0.5} unit="% of output at maturity" />
              <Slider label="Years to mature private response" value={structural.privateMaturity} onChange={(v) => setS("privateMaturity", v)} min={1} max={20} step={1} unit=" years" />
              <Slider label="Initial business and consumption disruption" value={structural.transitionShock} onChange={(v) => setS("transitionShock", v)} min={0} max={15} step={0.5} unit="% of output lost" />
              <Slider label="Years to recover from disruption" value={structural.privateRecovery} onChange={(v) => setS("privateRecovery", v)} min={1} max={15} step={1} unit=" years" />
              <p className="text-[11px]" style={{ color: "#5C6B63" }}>Residual business effects phase in linearly. The labour residual is a separate assumed output contribution, not a job estimate. Disruption fades linearly. Shared Island revenue and service costs affect the UK-funded regional balance. These controls are inactive for UK status quo.</p>
            </div>
            <div className="rounded-xl border p-5 mt-4" style={{ borderColor: "#DCE2DC", background: "#FFFFFF" }}>
              <div className="text-xs uppercase tracking-wide mb-3" style={{ color: "#5C6B63" }}>Reunification sovereign wealth fund</div>
              <p className="text-xs mb-4" style={{ color: "#5C6B63" }}>A hypothetical dedicated fund. Opening capital must already be available at year one. No existing Irish fund is assumed to be legally available for reunification.</p>
              <Slider label="Opening fund capital" value={structural.fundOpening} onChange={(v) => setS("fundOpening", v)} min={0} max={100} step={1} unit=" €bn" />
              <Slider label="Real annual investment return" value={structural.fundReturn} onChange={(v) => setS("fundReturn", v)} min={-10} max={8} step={0.5} unit="% pa" />
              <Slider label="Annual Exchequer contribution" value={structural.fundContribution} onChange={(v) => setS("fundContribution", v)} min={0} max={5} step={0.25} unit=" €bn/yr" />
              <Slider label="Contribution period from year one" value={structural.fundContributionYears} onChange={(v) => setS("fundContributionYears", v)} min={1} max={25} step={1} unit=" years" />
              <Slider label="Maximum annual fund withdrawal" value={structural.fundDrawCap} onChange={(v) => setS("fundDrawCap", v)} min={0} max={15} step={0.5} unit=" €bn/yr" />
              <p className="text-[11px]" style={{ color: "#5C6B63" }}>Returns accrue on opening assets. Withdrawals cannot exceed available assets, annual costs or the withdrawal cap. Contributions are financial transfers and increase financing needs. Borrowing falls when assets fund spending, but spending itself does not disappear. Returns are assumed, not guaranteed. Fund controls are inactive for UK status quo.</p>
            </div>
          </div>

          {/* Output */}
          <div className="lg:col-span-3">
            {FORMS[form].counterfactual ? <div className="rounded-xl border p-5 mb-5 bg-white text-sm">Republic fiscal perspective. Northern Ireland remains UK-funded. The investment dial affects Shared Island only. The UK status quo has zero incremental Republic cost by definition.</div> : <Waterfall pensionsUK={pensionsUK} debtUK={debtUK} structural={structural} />}

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wide" style={{ color: "#5C6B63", letterSpacing: "0.08em" }}>Horizon</span>
              <div className="flex rounded-md border overflow-hidden" style={{ borderColor: "#DCE2DC" }}>
                {[25, 50].map((h) => (
                  <button key={h} onClick={() => setHorizon(h)}
                    className="px-3 py-1 text-xs font-medium transition-colors"
                    style={{ background: horizon === h ? "#182420" : "#FFF", color: horizon === h ? "#FFF" : "#5C6B63" }}>
                    {h} years
                  </button>
                ))}
              </div>
            </div>

            <button type="button" onClick={exportRun} className="mb-4 px-4 py-2 rounded border text-sm" style={{borderColor:"#177052",color:"#177052"}}>Download this scenario and comparison settings</button>
            <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "#8A968E", letterSpacing: "0.08em" }}>
              All euro figures in constant 2023 prices
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <Stat label="Present value" value={`€${rows[rows.length - 1].presentValue}bn`} sub={`${structural.discountRate}% real discount rate`} />
              <Stat label="Transition debt at horizon" value={`€${rows[rows.length - 1].debt}bn`} sub="Incremental borrowing only" />
              <Stat label="Year-one cost" value={`€${yearOne.cost}bn`} sub={`2023 prices · ${yearOne.pctGNI}% of GNI*`} />
              <Stat label="Annual break-even" value={be ? `Year ${be}` : `None by yr ${horizon}`} sub={be ? "First non-positive annual cost" : "No balance within selected horizon"} />
              <Stat label="Financing-inclusive payback" value={pb50 ? `Year ${pb50}` : "None by yr 50"}
                sub={pb50 ? "Early deficits repaid by surpluses" : "No cumulative payback within 50 years"} />
              <Stat label={`${horizon}-yr cumulative`} value={cumEnd < 0 ? `€${Math.abs(Math.round(cumEnd))}bn surplus` : `€${Math.round(cumEnd)}bn`}
                sub={`2023 prices · ${round1((Math.abs(cumEnd) / GNI_STAR) * 100)}% of one year's GNI*`} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
              <Stat label="Transition debt as share of Republic GNI*" value={`${round1(lastYear.debt/(GNI_STAR*Math.pow(1+structural.southGrowth/100,horizon))*100)}%`} sub="Incremental debt only, not total sovereign debt" />
              <Stat label="Annual cost at horizon" value={`${lastYear.pctGNI}% of Republic GNI*`} sub="Negative means a fiscal surplus. Not a welfare measure." />
              <Stat label="Delivered public capital" value={`€${lastYear.publicCapital}bn`} sub="Additional stock after delays and depreciation" />
              <Stat label="Additional private job equivalents" value={lastYear.additionalJobs.toLocaleString()} sub="Experimental diagnostic. Not added to GDP." />
              <Stat label="Public recruitment index" value={lastYear.publicRecruitmentIndex} sub="Reference = 100. Does not itself add GDP." />
              <Stat label="Additional residents" value={lastYear.additionalResidents.toLocaleString()} sub={`€${lastYear.serviceCost}bn annual service cost`} />
              <Stat label="Additional response revenue" value={`€${lastYear.privateRevenue}bn/yr`} sub={`Year ${horizon}, beyond baseline. Negative means revenue loss.`} />
              <Stat label="Remaining fund" value={`€${lastYear.fundBalance}bn`} sub={`€${lastYear.totalDraws}bn drawn over the horizon`} />
              <Stat label="Fund investment returns" value={`€${lastYear.totalFundReturns}bn`} sub="Cumulative real investment returns earned by the fund" />
              <Stat label="Interest avoided by fund" value={`€${fundInterestSaved}bn`} sub="Against no fund with the same private response. Can be negative." />
              <Stat label="Year-one borrowing" value={`€${yearOne.borrowing}bn`} sub={`€${yearOne.fundDraw}bn fund withdrawal`} />
              <Stat label="Change in net liabilities" value={`€${lastYear.wealthCost}bn`} sub="Debt less fund and cash, relative to opening assets" />
            </div>
            <div className="rounded-xl border p-5" style={{ borderColor: "#DCE2DC", background: "#FFFFFF" }}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex rounded-md border overflow-hidden" style={{ borderColor: "#DCE2DC" }}>
                  {[["annual", "Annual €bn"], ["pct", "% of GNI*"], ["cumulative", "Cumulative"], ["compare", "Compare forms"], ["fund", "Debt and fund"]].map(([k, l]) => (
                    <button key={k} onClick={() => setMetric(k)}
                      className="px-3 py-1.5 text-xs font-medium transition-colors"
                      style={{ background: metric === k ? "#182420" : "#FFF", color: metric === k ? "#FFF" : "#5C6B63" }}>
                      {l}
                    </button>
                  ))}
                </div>
                {metric !== "compare" && metric !== "fund" && (
                  <div className="flex rounded-md border overflow-hidden" style={{ borderColor: "#DCE2DC" }}>
                    {[["area", "Area"], ["line", "Line"], ["bar", "Bars"]].map(([k, l]) => (
                      <button key={k} onClick={() => setChartType(k)}
                        className="px-2.5 py-1.5 text-xs transition-colors"
                        style={{ background: chartType === k ? "#EDF1ED" : "#FFF", color: chartType === k ? "#182420" : "#8A968E" }}>
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ResponsiveContainer width="100%" height={340}>
                <ComposedChart data={metric === "compare" ? compareData : rows} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                  <CartesianGrid stroke="#EAEEE9" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#8A968E" }} tickLine={false} axisLine={{ stroke: "#DCE2DC" }}
                    label={{ value: "Years after scenario start", position: "insideBottom", offset: -2, fontSize: 11, fill: "#8A968E" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#8A968E", fontFamily: "'IBM Plex Mono', monospace" }} tickLine={false} axisLine={false}
                    label={{ value: yLabel, angle: -90, position: "insideLeft", fontSize: 11, fill: "#8A968E" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #DCE2DC", fontSize: 12, fontFamily: "'IBM Plex Sans', sans-serif" }}
                    formatter={(v, n) => [metric === "pct" ? `${v}%` : `€${v}bn`,
                      metric === "compare" ? FORMS[n]?.name || n : { cost: "Net annual cost", pctGNI: "Net cost", cumulative: "Cumulative cost" }[n] || n]}
                    labelFormatter={(l) => `Year ${l}`} />
                  <ReferenceLine y={0} stroke="#182420" strokeWidth={1.2} />
                  {metric === "compare" ? (
                    <>
                      <Legend formatter={(v) => <span style={{ fontSize: 12, color: "#5C6B63" }}>{FORMS[v]?.name || v}</span>} />
                      {Object.values(FORMS).map((f) => (
                        <Line key={f.key} type="monotone" dataKey={f.key} stroke={f.color} strokeWidth={2.2} dot={false} />
                      ))}
                    </>
                  ) : metric === "fund" ? (
                    <>
                      <Legend />
                      <Line name="Transition debt" type="monotone" dataKey="debt" stroke="#A63D2F" strokeWidth={2.2} dot={false} />
                      <Line name="Fund assets" type="monotone" dataKey="fundBalance" stroke="#177052" strokeWidth={2.2} dot={false} />
                      <Line name="Net liabilities" type="monotone" dataKey="netLiabilities" stroke="#2E5E9E" strokeWidth={2.2} dot={false} />
                    </>
                  ) : chartType === "bar" ? (
                    <Bar dataKey={dataKey} fill={color} radius={[3, 3, 0, 0]} />
                  ) : chartType === "area" ? (
                    <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.2} fill={`${color}22`} />
                  ) : (
                    <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.4} dot={false} />
                  )}
                  {be && metric !== "compare" && metric !== "cumulative" && metric !== "fund" && (
                    <ReferenceLine x={be} stroke="#C9971F" strokeDasharray="4 3"
                      label={{ value: `Break-even, yr ${be}`, fontSize: 11, fill: "#C9971F", position: "top" }} />
                  )}
                </ComposedChart>
              </ResponsiveContainer>

              <div className="text-[11px] mt-3 leading-relaxed" style={{ color: "#8A968E" }}>
                <p>Annual and cumulative costs include transition-debt interest. Present value discounts those costs at the selected real rate.</p>
                <p className="mt-2">Negotiated deductions, growth-related revenue and economic responses use the settings selected above. Sources, equations and remaining limitations are listed on the <a href="model_reference.html" target="_blank" rel="noreferrer" className="underline">model reference page</a>.</p>
                <p className="mt-2">Fund withdrawals affect financing rather than underlying spending. Opening assets have prior funding and opportunity costs outside this horizon.</p>
                <p className="mt-2">The UK status quo has zero incremental Republic cost by definition. The chart compares conditional fiscal paths and does not rank welfare outcomes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
