// ---------------------------------------------------------------
// Constant 2023 euros. Fiscal bridge follows data/rebased.json. Northern Ireland GDP £63.3bn × €1.14970.
// Existing baseline retained pending the agreed ONS update. No new official-data claims.

// ---------------------------------------------------------------
const GNI_STAR = 290.9;
const NORTH_GNI = 63.265 / 0.86979; // Verified ONS Table 1, release 17 April 2025, 2023 GDP £63.265bn. Frozen vintage.
// Original sterling observations from F&M 2024 Tables 6 and 7, not reverse-converted euro totals.
const UK_2019_TO_2023_EUR = ((90.7406+92.0952+92.7667+92.7151)/(76.6540+77.4590+77.9213+78.3396))/0.86979;
const UK_FY2022_TO_2023_EUR = ((90.7406+92.0952+92.7667+92.7151)/(85.7671+87.1467+89.3502+90.7406))/0.86979;
const BASE_REVENUE = 21.773*UK_FY2022_TO_2023_EUR;
const BASE_SPENDING = BASE_REVENUE+17.058; // Preserve the agreed frozen rounded deficit exactly.
const GROSS_PAY_FULL = 4.306*UK_2019_TO_2023_EUR;
const GROSS_WELFARE_FULL = 4.809*UK_2019_TO_2023_EUR;
const SOURCE_PAY_BASE = 6.797*UK_2019_TO_2023_EUR;
const MODEL_VERSION = '2026-10-29-component-fiscal';
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
    key: "worst", name: "Higher Cost", model: "Immediate harmonisation, larger administration allowance",
    color: "#444B52",
    desc: "Immediate pay and welfare harmonisation without additional investment. Liability choices and growth are controlled separately and apply to every policy bundle.",
    defaults: { reratingScope: 100, reratingYears: 1, investment: 0, duplication: 1, gNI: 2.5, stall: false },
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
  {key:'baselineGrowth',label:'Northern Ireland counterfactual growth',value:2,min:0,max:4,step:0.25,unit:'% pa',basis:'Illustrative reference path, independent of Republic growth'},
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

const DEFAULT_STRUCTURAL = { southGrowth: 2, ageing: 0, shift: 0, realInterest: 2, discountRate: 2,
    payGrowthPassThrough:1, niPayGrowth:1, niBenefitGrowth:1, pensionRateGrowth:1, southPayGrowth:1, southBenefitGrowth:1,
    nonPensionWelfareBase:9.615*UK_2019_TO_2023_EUR-PENSIONS,
    populationVolumes:true, populationVariant:'M2', inheritedInterestYears:25,
    businessUplift: 0, labourUplift: 0, transitionShock: 0, privateMaturity: 10, privateRecovery: 5,
    fundOpening: 0, fundReturn: 2, fundContribution: 0, fundContributionYears: 10, fundDrawCap: 5, linkedMechanisms: false, growthRevenue: true,
    taxShare: 35, baselineRevenueGrowth: 0, baselineSpendingGrowth: 1,
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
 federal_balance:{label:'Federal · 4.5% NI growth',form:'federal',growth:4.5,fiscalGrowth:1},
 managed_balance:{label:'Managed Integration · 5% NI growth',form:'glide',growth:5,fiscalGrowth:1},
 federal_payback:{label:'Federal · 5% NI growth',form:'federal',growth:5,fiscalGrowth:1},
 managed_payback:{label:'Managed Integration · 5.5% NI growth',form:'glide',growth:5.5,fiscalGrowth:1},
 unitary_payback:{label:'Unitary · 6% NI growth',form:'unitary',growth:6,fiscalGrowth:1},
 managed_spending:{label:'Managed Integration · faster service spending',form:'glide',growth:6,fiscalGrowth:2.5},
};
function unityCase(key) {
 const c=UNITY_CASES[key];
 if(!c)throw new RangeError('Unknown fiscal scenario');
 const seed=managedCase('faster_growth');
 return {label:c.label,form:c.form,policy:{...seed.policy,...FORMS[c.form].defaults,gNI:c.growth},structural:{...seed.structural,baselineRevenueGrowth:0,baselineSpendingGrowth:c.fiscalGrowth}};
}

const POPULATION_PROJECTIONS = {"baseYear":2024,"ni":{"2024":{"total":1927855.0,"over65":349194.0},"2025":{"total":1931301.0,"over65":357695.0},"2026":{"total":1934180.0,"over65":366755.0},"2027":{"total":1936545.0,"over65":375613.0},"2028":{"total":1938324.0,"over65":384768.0},"2029":{"total":1939582.0,"over65":394243.0},"2030":{"total":1940347.0,"over65":403900.0},"2031":{"total":1940634.0,"over65":413012.0},"2032":{"total":1940471.0,"over65":421637.0},"2033":{"total":1939927.0,"over65":430027.0},"2034":{"total":1939054.0,"over65":437794.0},"2035":{"total":1937878.0,"over65":444859.0},"2036":{"total":1936429.0,"over65":451740.0},"2037":{"total":1934818.0,"over65":457615.0},"2038":{"total":1933097.0,"over65":463004.0},"2039":{"total":1931313.0,"over65":467365.0},"2040":{"total":1929481.0,"over65":470627.0},"2041":{"total":1927624.0,"over65":473832.0},"2042":{"total":1925677.0,"over65":476453.0},"2043":{"total":1923707.0,"over65":479525.0},"2044":{"total":1921673.0,"over65":483750.0},"2045":{"total":1919518.0,"over65":488871.0},"2046":{"total":1917172.0,"over65":493111.0},"2047":{"total":1914584.0,"over65":497114.0},"2048":{"total":1911750.0,"over65":501159.0},"2049":{"total":1908622.0,"over65":505183.0},"2050":{"total":1905145.0,"over65":509615.0},"2051":{"total":1901280.0,"over65":514259.0},"2052":{"total":1897000.0,"over65":518589.00000000006},"2053":{"total":1892289.0,"over65":522676.00000000006},"2054":{"total":1887160.0,"over65":526306.0},"2055":{"total":1881601.0,"over65":529986.0},"2056":{"total":1875649.0,"over65":533125.0},"2057":{"total":1869316.0,"over65":535964.0},"2058":{"total":1862660.0,"over65":538146.0},"2059":{"total":1855716.0,"over65":540216.0},"2060":{"total":1848496.0,"over65":541873.0},"2061":{"total":1841061.0,"over65":543408.0},"2062":{"total":1833449.0,"over65":545618.0},"2063":{"total":1825686.0,"over65":547389.0},"2064":{"total":1817821.0,"over65":548338.0},"2065":{"total":1809896.0,"over65":547391.0},"2066":{"total":1801926.0,"over65":546048.0},"2067":{"total":1793928.0,"over65":544403.0},"2068":{"total":1785923.0,"over65":543239.0},"2069":{"total":1777923.0,"over65":543174.0},"2070":{"total":1769940.0,"over65":543050.0},"2071":{"total":1761958.0,"over65":543206.0},"2072":{"total":1754004.0,"over65":544209.0},"2073":{"total":1746067.0,"over65":546391.0},"2074":{"total":1738122.0,"over65":548554.0}},"roi":{"M1":{"2022":5184000,"2027":5581800.0,"2032":5872400.0,"2037":6142300.0,"2042":6396300.0,"2047":6633600.0,"2052":6839200.0,"2057":7005400.0},"M2":{"2022":5184000,"2027":5530500.0,"2032":5761000,"2037":5946900.0,"2042":6113200.0,"2047":6259900.0,"2052":6373200.0,"2057":6446300.0},"M3":{"2022":5184000,"2027":5489700.0,"2032":5645500.0,"2037":5721200.0,"2042":5771500.0,"2047":5797300.0,"2052":5786300.0,"2057":5733700.0}}};

function populationAt(year,variant='M2') {
 const years=Object.keys(POPULATION_PROJECTIONS.roi[variant]).map(Number).sort((a,b)=>a-b);
 const clamped=Math.max(years[0],Math.min(years.at(-1),year));
 const left=years.filter(y=>y<=clamped).at(-1),right=years.find(y=>y>=clamped);
 const roi=left===right?POPULATION_PROJECTIONS.roi[variant][left]:POPULATION_PROJECTIONS.roi[variant][left]+(POPULATION_PROJECTIONS.roi[variant][right]-POPULATION_PROJECTIONS.roi[variant][left])*(clamped-left)/(right-left);
 const niYear=Math.max(2024,Math.min(2074,year)),ni=POPULATION_PROJECTIONS.ni[niYear];
 return {ni:ni.total,niOver65:ni.over65,roi,heldBeyondSource:year>2057||year>2074};
}
function fiscalComponents(p,s,t) {
 const start=populationAt(2024,s.populationVariant),pop=populationAt(2024+t,s.populationVariant);
 const volumes=s.populationVolumes?pop.ni/start.ni:1,pensionVolumes=s.populationVolumes?pop.niOver65/start.niOver65:1;
 const payBase=s.publicPayBase,benefitBase=s.nonPensionWelfareBase;
 const purchasesBase=BASE_SPENDING-payBase-benefitBase-PENSIONS-DEBT_INT-DEFENCE_NET-OTHER_NONID;
 if(purchasesBase<0)throw new RangeError('Component allocations exceed frozen gross spending');
 const relativeRate=p.counterfactual&&!p.shared?1:(1+p.gNI/100)/(1+s.baselineGrowth/100);
 const relativeOutput=p.stall&&t>7?Math.pow(relativeRate,7)*Math.pow(Math.min(relativeRate,1.004),t-7):Math.pow(relativeRate,t);
 const pay=payBase*Math.pow(1+s.niPayGrowth/100,t)*Math.pow(relativeOutput,s.payGrowthPassThrough)*volumes;
 const benefits=benefitBase*Math.pow(1+s.niBenefitGrowth/100,t)*volumes;
 const pensionEnvelope=PENSIONS*Math.pow(1+s.pensionRateGrowth/100,t)*pensionVolumes*Math.pow(1+s.ageing/100,t);
 const purchasesFactor=Math.pow(1+s.baselineSpendingGrowth/100,t)*volumes;
 const purchases=purchasesBase*purchasesFactor;
 const defence=DEFENCE_NET*purchasesFactor*(1-s.defenceSavingShare/100);
 const central=OTHER_NONID*purchasesFactor*(1-s.centralSavingShare/100);
 const allocatedInterest=t<=s.inheritedInterestYears?DEBT_INT:0;
 const pensionShare=p.pensionsUK?Math.min(t/s.pensionTransferYears,1):1;
 const pensionCost=pensionEnvelope*pensionShare;
 const spending=pay+benefits+pensionCost+purchases+defence+central+(p.debtUK?0:allocatedInterest);
 const baselineSpending=pay+benefits+pensionEnvelope+purchases+(DEFENCE_NET+OTHER_NONID)*purchasesFactor+allocatedInterest;
 const referenceFactor=Math.pow(1+s.baselineGrowth/100,t);
 const baselineRevenue=BASE_REVENUE*referenceFactor*Math.pow(1+s.baselineRevenueGrowth/100,t);
 const revenueAdjustment=TAX_ADD*s.taxAdjustmentShare/100*referenceFactor;
 const phase=p.counterfactual?0:Math.min(t/p.reratingYears,1)*p.reratingScope/100;
 const payTarget=(payBase+GROSS_PAY_FULL)*Math.pow(1+s.southPayGrowth/100,t)*volumes;
 const grossPayIncrease=phase*Math.max(0,payTarget-pay);
 const welfareBase=benefitBase+PENSIONS;
 const pensionWeight=PENSIONS/welfareBase;
 const welfareVolumes=(1-pensionWeight)*volumes+pensionWeight*pensionVolumes;
 const welfareTarget=(welfareBase+GROSS_WELFARE_FULL)*Math.pow(1+s.southBenefitGrowth/100,t)*welfareVolumes;
 const welfareBefore=benefits+pensionEnvelope;
 const grossWelfareIncrease=phase*Math.max(0,welfareTarget-welfareBefore);
 // Source net/gross bridge is applied once. This is not an estimated tax schedule.
 const netRecoveryShare=1-RERATE_FULL/(GROSS_PAY_FULL+GROSS_WELFARE_FULL);
 const harmonisation=(grossPayIncrease+grossWelfareIncrease)*(1-netRecoveryShare);
 return {pay,benefits,pensionEnvelope,pensionCost,purchases,defence,central,allocatedInterest,spending,baselineSpending,baselineRevenue,revenueAdjustment,harmonisation,grossPayIncrease,grossWelfareIncrease,volumes,pensionVolumes,niPopulation:pop.ni,roiPopulation:pop.roi,populationHeld:pop.heldBeyondSource?1:0};
}

const MODEL_CONSTANTS = { GNI_STAR, NORTH_GNI, UK_2019_TO_2023_EUR, UK_FY2022_TO_2023_EUR, BASE_REVENUE, BASE_SPENDING, GROSS_PAY_FULL, GROSS_WELFARE_FULL, SOURCE_PAY_BASE, PUBLISHED, PENSIONS, DEBT_INT, DEFENCE_NET, OTHER_NONID, TAX_ADD, RERATE_FULL };

function validateInputs(p,horizon,s) {
  if(!Number.isInteger(horizon)||horizon<1||horizon>100)throw new RangeError('Horizon must be an integer from 1 to 100');
  for(const [key,value] of Object.entries({...s,...p}))if(typeof value==='number'&&!Number.isFinite(value))throw new RangeError('Non-finite input '+key);
  for(const key of Object.keys(s))if(!(key in DEFAULT_STRUCTURAL))throw new TypeError('Unknown structural input '+key);
  for(const [key,value] of Object.entries(s))if(typeof DEFAULT_STRUCTURAL[key]==='number'&&!Number.isFinite(value))throw new TypeError('Non-numeric input '+key);
  for(const key of Object.keys(p))if(!['gNI','stall','reratingScope','reratingYears','investment','duplication','pensionsUK','debtUK','counterfactual','shared'].includes(key))throw new TypeError('Unknown policy input '+key);
  for(const key of ['linkedMechanisms','growthRevenue','populationVolumes'])if(s[key]!==undefined&&typeof s[key]!=='boolean')throw new TypeError('Invalid switch '+key);
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
  if(!Number.isFinite(s.payGrowthPassThrough)||s.payGrowthPassThrough<0||s.payGrowthPassThrough>1)throw new RangeError('Invalid public pay pass-through');
  if(!['M1','M2','M3'].includes(s.populationVariant))throw new RangeError('Unknown CSO population variant');
  for(const key of ['niPayGrowth','niBenefitGrowth','pensionRateGrowth','southPayGrowth','southBenefitGrowth'])if(!Number.isFinite(s[key])||s[key]<-2||s[key]>6)throw new RangeError('Invalid indexation rate '+key);
  if(s.nonPensionWelfareBase<0||s.inheritedInterestYears<0||s.inheritedInterestYears>100)throw new RangeError('Invalid component settings');
  if(s.shift)throw new RangeError('Unspecified compositional deficit erosion has been removed');
}
function policyForForm(key, common, selected = null) {
  if(!FORMS[key])throw new RangeError('Unknown policy bundle');
  return {...FORMS[key].defaults,...(selected??{}),...common,counterfactual:!!FORMS[key].counterfactual,shared:key==='shared'};
}

function simulate(p, horizon, s, extension = null) {
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
    const components=fiscalComponents(p,s,t);
    const baselineRevenue=components.baselineRevenue,baselineSpending=components.baselineSpending;
    const fiscalDrift=0;
    const coreAged=components.spending-components.baselineRevenue-components.revenueAdjustment+(s.ageSensitiveSpending??0)*(ageF-1);
    const shiftErosion=0; // Unsupported disappearance of a residual deficit removed.
    const rerating=components.harmonisation;
    const invest=!isStatusQuo && t<=10 ? p.investment : 0;
    const payIncrease=components.grossPayIncrease, welfareIncrease=components.grossWelfareIncrease;
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
      // Optional externally financed capital passes through the same completion and depreciation channel.
      if(extension?.capitalFunding && completionYear>=1) completedCapital+=extension.capitalFunding(completionYear)*e.investmentEfficiency/100;
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
    let actualOutput=isStatusQuo ? baselineOutput : clamp(uncappedOutput,0,ceiling);
    const marginalRevenue=s.growthRevenue===true ? (s.taxShare??35)/100 : 0;
    const baselineGain=marginalRevenue*(policyOutput-baselineOutput);
    const privateOutput=actualOutput-policyOutput;
    const privateRevenue=marginalRevenue*privateOutput;
    let gain=baselineGain+privateRevenue;
    // Optional benefits adapter receives unrounded accounts. It cannot alter a default run.
    const extra=extension?.annual?.({t,baselineOutput,actualOutput,components,invest,rerating,serviceCost,gain}) ?? {};
    actualOutput+=extra.outputDelta??0;
    gain+=extra.revenueDelta??0;
    // Transfer the same frozen pension envelope, so the endpoints reconcile.
    // This is a linear funding scenario, not a cohort-based actuarial forecast.
    const pension=p.pensionsUK ? components.pensionCost : 0;
    // Includes inherited debt interest. This is not a textbook primary balance.
    const preFinancingCost=coreAged+rerating+invest+p.duplication+serviceCost-gain+(extra.costDelta??0);
    const regionalDeficit=baselineSpending-baselineRevenue+(s.ageSensitiveSpending??0)*(ageF-1)+serviceCost+invest+rerating-gain+(extra.regionalCostDelta??0);
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
      ...(extra.fields??{}),
      ...(extension?.precision?{unroundedCost:cost,unroundedDebt:debt,unroundedActualOutput:actualOutput,unroundedGain:gain,unroundedServiceCost:serviceCost}:{}),
      year:t, publicPay:round2(components.pay),nonPensionBenefits:round2(components.benefits),otherPurchases:round2(components.purchases),pensionEnvelope:round2(components.pensionEnvelope),revenueAdjustment:round2(components.revenueAdjustment),allocatedInterest:round2(p.debtUK?0:components.allocatedInterest),
      niPopulation:Math.round(components.niPopulation),roiPopulation:Math.round(components.roiPopulation),populationHeld:components.populationHeld,
      // Matched GDP concepts, common 2024 nowcast from frozen 2023 source anchors. Not household income.
      gdpPerPersonRatio:round2(100*(actualOutput*(1+e.baselineGrowth/100)/components.niPopulation)/(509.952*Math.pow(1+gs,t+1)/components.roiPopulation)),
      relativePerPersonIndex:round2(100*(actualOutput/NORTH_GNI)/Math.pow(1+gs,t)*(populationAt(2024,s.populationVariant).ni/components.niPopulation)/(populationAt(2024,s.populationVariant).roi/components.roiPopulation)),
      baselineRevenue:round2(baselineRevenue), baselineSpending:round2(baselineSpending), pensionTransfer:round2(pension), pensionCost:round2(components.pensionCost), harmonisation:round2(rerating), grossPayIncrease:round2(payIncrease), grossWelfareIncrease:round2(welfareIncrease), capacityOutput:round2(capacityOutput), annualNonPositive:cost<=0 ? 1 : 0, cumulativeNonPositive:cumulative<=0 ? 1 : 0, primaryCost:round1(primary), interest:round2(interest), debt:round1(debt), presentValue:round1(presentValue),
      regionalDeficit:round2(regionalDeficit), cost:round1(cost), pctGNI:round2(cost/denom*100), cumulative:round1(cumulative),
      privateOutput:round2(privateOutput), privateRevenue:round2(privateRevenue), fundBalance:round2(fundBalance),
      fundReturn:round2(fundReturn), fundContribution:round2(contribution), fundDraw:round2(fundDraw),
      totalDraws:round2(totalDraws), totalFundReturns:round2(totalFundReturns), financingNeed:round2(financingNeed),
      borrowing:round2(borrowing), netLiabilities:round2(netLiabilities), cashSavings:round2(cashSavings), wealthCost:round2(wealthCost),
      gross:round1(coreAged+rerating+invest+p.duplication+serviceCost), gain:round1(-gain),
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


export { FORMS, ECONOMIC_PARAMETERS, DEFAULT_STRUCTURAL, MODEL_CONSTANTS, simulate, inheritedDeficit, breakEven, payback, policyForForm, validateInputs, MANAGED_CASES, managedCase, UNITY_CASES, unityCase, fiscalComponents, populationAt, POPULATION_PROJECTIONS };
