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


export { FORMS, ECONOMIC_PARAMETERS, DEFAULT_STRUCTURAL, MODEL_CONSTANTS, simulate, inheritedDeficit, breakEven, payback, policyForForm, validateInputs, MANAGED_CASES, managedCase, UNITY_CASES, unityCase };
