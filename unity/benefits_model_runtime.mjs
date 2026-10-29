import {simulate,DEFAULT_STRUCTURAL as D,MODEL_CONSTANTS as C,FORMS,fiscalComponents,populationAt,payback} from './scenario_model.mjs?v=94685b7a9fdb';
import SOURCES from './benefits_sources.mjs?v=94685b7a9fdb';

// These are specification bounds for experiments, not empirical confidence intervals.
// A null calibration is deliberately unavailable rather than replaced by an invented estimate.
export const BENEFIT_INPUTS = [
 ['ukTransitionShare',0,0,50,'%','Negotiated share of frozen opening transfer. No entitlement or probability is estimated.','negotiation'],
 ['ukTransitionYears',10,1,20,'years','Linear payment reaches zero in the year after the selected payment period.','design'],
 ['euSupportPeak',0,0,3,'%','Net additional grant as share of NI reference output. Eligibility, co-financing and net EU contribution effects need evidence.','source needed'],
 ['euSupportRamp',3,1,10,'years','Ramp to peak funding.','design'],
 ['euSupportYears',10,1,20,'years','Peak period includes the first peak year, followed by a five-year phase-out.','design'],
 ['euCapitalShare',0,0,100,'%','Share financing existing eligible programme investment, never an additional free capital programme.','source needed'],
 ['borderGainMax',0,0,4,'%','NI long-run output level gain. Requires own gravity-to-output calibration.','source needed'],
 ['borderGainRepublic',0,0,1,'%','Republic long-run GNI* level gain, not GDP. Requires calibration.','source needed'],
 ['borderPhaseYears',10,3,20,'years','Linear implementation path.','design'],
 ['windsorShareRemoved',0,0,100,'%','Discount gains already achieved before unity.','source needed'],
 ['gbFrictionLoss',0,0,10,'%','Matched NI output level loss on GB trade. Bound is an engineering limit, not an estimate.','source needed'],
 ['fdiNorthShare',0,0,50,'%','Target NI foreign-owned employment per resident as share of Republic rate, above current NI intensity only.','source needed'],
 ['fdiRampYears',15,5,25,'years','Linear approach to target intensity.','design'],
 ['fdiOutputPerJob',null,0,1000000,'€/job','Real value added excluding tax-booked profits. No calibration supplied.','source needed'],
 ['fdiTaxPerJob',null,0,1000000,'€/job','Total payroll and corporation receipts per job. General marginal tax is not applied again.','source needed'],
 ['fdiRepublicJobsPerResident',null,0,1,'jobs/resident','Matched foreign-owned employment coverage and source year required.','source needed'],
 ['fdiNIJobsPerResident',null,0,1,'jobs/resident','Matched baseline NI foreign-owned employment intensity required.','source needed'],
 ['fdiDisplacement',50,0,100,'%','NI jobs displaced from Republic rather than genuinely additional to island. Unestimated.','source needed'],
 ['integrationSaving',0,0,1,'€bn/year','Savings additional to the chosen administration allowance. Requires function inventory.','source needed'],
 ['integrationSavingStart',5,1,15,'year','Savings ramp over five years from this year.','design'],
 ['integrationOneOff',0,0,5,'€bn','Total implementation cost. Nonzero required whenever savings are selected.','source needed'],
 ['integrationOneOffYears',5,1,10,'years','Implementation cost spread evenly.','design'],
 ['ukPathGrowth',null,0,3,'%','Null follows the existing NI reference growth assumption.','design'],
 ['ukPathSpendingGrowth',null,-2,3,'%','Null follows residual purchases cost growth. Does not blanket-index pay or pensions.','design'],
 ['ukPathTransferRisk',0,0,30,'%','Frozen transfer withdrawal by year 25, assumed to reduce residual services.','source needed'],
].map(([key,value,min,max,unit,description,status])=>({key,value,min,max,unit,description,status}));
export const BENEFIT_DEFAULTS=Object.fromEntries(BENEFIT_INPUTS.map(x=>[x.key,x.value]));
export const SUCCESS_RULES=Object.freeze({comparisonYear:15,debtCeiling:80,burdenPctGNI:2,burdenSensitivities:[1,3],fallingFrom:20,requiredPasses:4});
const clamp=(v,l,h)=>Math.max(l,Math.min(h,v));
function inputs(values={}) {
 const b={...BENEFIT_DEFAULTS,...values};
 for(const k of Object.keys(values))if(!(k in BENEFIT_DEFAULTS))throw Error('Unknown benefits input '+k);
 for(const x of BENEFIT_INPUTS){const v=b[x.key];if(v===null&&x.value===null)continue;if(typeof v!=='number'||!Number.isFinite(v)||v<x.min||v>x.max)throw Error('Invalid benefits input '+x.key);if(x.unit==='years'||x.unit==='year')if(!Number.isInteger(v))throw Error('Integer years required');}
 if(b.integrationOneOff>0&&b.integrationOneOff<.5)throw Error('Positive integration implementation cost must be at least 0.5bn within the specification bounds');
 if(b.integrationSaving>0&&b.integrationOneOff<=0)throw Error('Integration savings require a matching one-off cost');
 if(b.fdiNorthShare>0)for(const k of ['fdiOutputPerJob','fdiTaxPerJob','fdiRepublicJobsPerResident','fdiNIJobsPerResident'])if(b[k]===null)throw Error('FDI calibration missing '+k);
 return b;
}
export function supportAt(t,s,b) {
 const uk=C.PUBLISHED*b.ukTransitionShare/100*Math.max(0,1-(t-1)/b.ukTransitionYears);
 const end=b.euSupportRamp+b.euSupportYears-1;
 const shape=t<=b.euSupportRamp?t/b.euSupportRamp:t<=end?1:Math.max(0,1-(t-end)/5);
 const eu=C.NORTH_GNI*Math.pow(1+s.baselineGrowth/100,t)*b.euSupportPeak/100*shape;
 return {uk,eu};
}
function ageAt(year,variant) {
 const knots=SOURCES.roi[variant],ys=Object.keys(knots).map(Number).sort((a,b)=>a-b),y=clamp(year,ys[0],ys.at(-1));
 const l=ys.filter(x=>x<=y).at(-1),r=ys.find(x=>x>=y),a=l===r?0:(y-l)/(r-l);
 const ni=SOURCES.ni[clamp(year,2024,2074)];
 const roi=Object.fromEntries(['workingAge','over65'].map(k=>[k,knots[l][k]+a*(knots[r][k]-knots[l][k])]));
 return {republicOldAgeDependency:100*roi.over65/roi.workingAge,islandOldAgeDependency:100*(roi.over65+ni.over65)/(roi.workingAge+ni.workingAge)};
}
export function baselineDebtRatio(t) {return SOURCES.debtRatios[Math.min(2030,2026+t)];}

export function simulateBenefits(p,horizon,s=D,values={}) {
 const b=inputs(values),neutral=p.counterfactual&&!p.shared;
 if(p.shared&&['ukTransitionShare','euSupportPeak','borderGainMax','borderGainRepublic','gbFrictionLoss','fdiNorthShare','integrationSaving','integrationOneOff'].some(k=>b[k]>0))throw Error('Active unity benefit channels are not defined for Shared Island');
 if(s.outputCeiling>0&&['borderGainMax','gbFrictionLoss','fdiNorthShare'].some(k=>b[k]>0))throw Error('Resolve the output ceiling before adding separate output channels');
 if(b.integrationSaving>0&&p.duplication<0)throw Error('Savings overlap an already negative administration allowance');
 if(b.euCapitalShare>0&&!s.linkedMechanisms)throw Error('EU capital allocation requires linked mechanisms');
 const capitalFunding=t=>{
   // Grant finances part of already-costed eligible programme investment. Its capital
   // share cannot also be capitalised through investmentCapitalShare.
   const eligible=t<=10?p.investment:0;
   return Math.min(supportAt(t,s,b).eu*b.euCapitalShare/100,eligible*(1-s.investmentCapitalShare/100));
 };
 const hook={precision:true,capitalFunding,annual:({t,actualOutput,components})=>{
   if(neutral)return {};
   const phase=Math.min(t/b.borderPhaseYears,1),retained=1-b.windsorShareRemoved/100;
   const borderOutput=actualOutput*b.borderGainMax/100*retained*phase;
   const gbOutputLoss=actualOutput*b.gbFrictionLoss/100*phase;
   const roiBase=C.GNI_STAR*Math.pow(1+s.southGrowth/100,t);
   const republicBorderGain=roiBase*b.borderGainRepublic/100*retained*phase;
   const jobs=b.fdiNorthShare===0?0:Math.max(0,b.fdiNorthShare/100*b.fdiRepublicJobsPerResident-b.fdiNIJobsPerResident)*components.niPopulation*Math.min(t/b.fdiRampYears,1);
   const fdiOutput=jobs*(b.fdiOutputPerJob??0)/1e9,fdiReceipts=jobs*(b.fdiTaxPerJob??0)/1e9;
   const displacedOutput=fdiOutput*b.fdiDisplacement/100,displacedReceipts=fdiReceipts*b.fdiDisplacement/100;
   const marginal=s.growthRevenue?s.taxShare/100:0;
   const republicReceipts=marginal*republicBorderGain-displacedReceipts;
   const {uk,eu}=supportAt(t,s,b);
   const oneOff=t<=b.integrationOneOffYears?b.integrationOneOff/b.integrationOneOffYears:0;
   const saving=b.integrationSaving*clamp((t-b.integrationSavingStart+1)/5,0,1);
   return {outputDelta:borderOutput-gbOutputLoss+fdiOutput,revenueDelta:marginal*(borderOutput-gbOutputLoss)+fdiReceipts,
     costDelta:oneOff-saving-uk-eu-republicReceipts,regionalCostDelta:oneOff-saving,
     fields:{ukTransitionPayment:uk,euSupport:eu,euCapitalFunding:capitalFunding(t),borderOutput,gbOutputLoss,fdiAdditionalJobs:jobs,fdiOutput,fdiReceipts,republicBorderGain,republicDisplacedOutput:displacedOutput,republicReceiptsChange:republicReceipts,integrationCost:oneOff,integrationSaving:saving}};
 }};
 const rows=simulate(p,horizon,s,hook);
 const ukSettings={...s,baselineGrowth:b.ukPathGrowth??s.baselineGrowth,baselineSpendingGrowth:b.ukPathSpendingGrowth??s.baselineSpendingGrowth};
 const ukPolicy={...FORMS.statusquo?.defaults,...p,counterfactual:true,shared:false,pensionsUK:false,debtUK:false};
 const ukRows=simulate(ukPolicy,horizon,ukSettings,{precision:true});
 return rows.map((r,i)=>{
   const t=r.year,uk=ukRows[i],ukComponents=fiscalComponents(ukPolicy,ukSettings,t),c=fiscalComponents(p,s,t);
   const withdrawal=C.PUBLISHED*b.ukPathTransferRisk/100*Math.min(t/25,1);
   if(withdrawal>ukComponents.purchases)throw Error('UK withdrawal exceeds available residual services');
   const roiBase=C.GNI_STAR*Math.pow(1+s.southGrowth/100,t);
   const republicOutput=roiBase+(r.republicBorderGain??0)-(r.republicDisplacedOutput??0);
   const niOutput=r.unroundedActualOutput;
   // Domestic-service spending excludes allocated defence, central services, inherited
   // debt interest and transition financing interest. This remains a resource proxy.
   const unityTransfer=c.pay+c.benefits+c.pensionEnvelope+c.purchases+c.harmonisation+(t<=10?p.investment:0)+r.unroundedServiceCost-c.baselineRevenue-c.revenueAdjustment-r.unroundedGain+(r.integrationCost??0)-(r.integrationSaving??0);
   const ukTransfer=ukComponents.pay+ukComponents.benefits+ukComponents.pensionEnvelope+ukComponents.purchases-ukComponents.baselineRevenue-withdrawal;
   const transfer=neutral?ukTransfer:unityTransfer;
   const income=(niOutput+transfer)*1e9/r.niPopulation,ukIncome=((uk.unroundedActualOutput??uk.actualOutput)+ukTransfer)*1e9/uk.niPopulation;
   const gni=neutral?roiBase:republicOutput;
   if(gni<=0)throw Error('Republic GNI* must remain positive');
   const baseDebt=baselineDebtRatio(t)/100*roiBase;
   return {...r,...ageAt(2024+t,s.populationVariant),northernResourceProxyPerPerson:income,ukResourceProxyPerPerson:ukIncome,northernProxyGainPerPerson:income-ukIncome,
     islandOutputProxy:niOutput+gni,ukIslandOutputProxy:uk.unroundedActualOutput+roiBase,islandOutputProxyGain:niOutput+gni-uk.unroundedActualOutput-roiBase,
     ukOutput:uk.unroundedActualOutput,ukDomesticTransfer:ukTransfer,northernDomesticTransfer:transfer,ukTransferWithdrawal:withdrawal,
     republicGNI:gni,baselineRepublicDebt:baseDebt,debtHeadroomPctGNI:SUCCESS_RULES.debtCeiling-100*(baseDebt+r.unroundedDebt)/gni,totalRepublicDebt:baseDebt+r.unroundedDebt,totalDebtPctGNI:100*(baseDebt+r.unroundedDebt)/gni,netCostPctGNI:100*r.unroundedCost/gni,burdenLimitPerRepublicResident:SUCCESS_RULES.burdenPctGNI/100*gni*1e9/r.roiPopulation,netCostPerRepublicResident:r.unroundedCost*1e9/r.roiPopulation};
 });
}

export function assessBenefits(rows,rules=SUCCESS_RULES) {
 const r=rows.find(x=>x.year===rules.comparisonYear),late=rows.filter(x=>x.year>=rules.fallingFrom);
 const tests={northernProxy:r?r.northernProxyGainPerPerson>1e-6:null,islandOutput:r?r.islandOutputProxyGain>1e-9:null,
   debt:rows.length?rows.every(x=>x.totalDebtPctGNI<rules.debtCeiling):null,
   burden:rows.length?rows.every(x=>x.netCostPctGNI<=rules.burdenPctGNI):null,
   falling:late.length<2?null:late.every(x=>{const prev=rows.find(y=>y.year===x.year-1);return prev&&x.unroundedCost<prev.unroundedCost;})};
 const passes=Object.values(tests).filter(x=>x===true).length,pending=Object.values(tests).filter(x=>x===null).length;
 const burdenSensitivities=(rules.burdenSensitivities??[]).map(limit=>{const burdenPass=rows.every(x=>x.netCostPctGNI<=limit),n=passes-(tests.burden===true?1:0)+(burdenPass?1:0);return {limit,burdenPass,passes:n,meetsRule:n>=rules.requiredPasses};});
 return {tests,passes,pending,burdenSensitivities,status:passes>=rules.requiredPasses?'Meets selected proxy tests':passes+pending<rules.requiredPasses?'Does not meet selected tests':'Assessment incomplete',payback:payback(rows)};
}

export function publicationIssues(values={}) {
 const b=inputs(values),issues=[];
 for(const x of BENEFIT_INPUTS)if(x.status==='source needed'&&b[x.key]!==x.value&&b[x.key]!==0)issues.push(x.key+' has no verified calibration');
 for(const k of ['euSupportPeak','borderGainMax','borderGainRepublic','gbFrictionLoss','fdiNorthShare','integrationSaving','integrationOneOff','ukPathTransferRisk'])if(b[k]>0)issues.push(k+' requires an evidence record before publication');
 return [...new Set(issues)];
}
export function exportScenarioPair(pair,provenance) {
 if(!pair?.scenario||!pair?.twin)throw Error('An adverse twin is required');
 for(const k of ['commit','modelSha256','settingsFixedAt','settingsCommit'])if(!provenance?.[k])throw Error('Missing provenance '+k);
 if(!/^[a-f0-9]{40}$/.test(provenance.commit)||!/^[a-f0-9]{40}$/.test(provenance.settingsCommit)||!/^[a-f0-9]{64}$/.test(provenance.modelSha256)||!Number.isFinite(Date.parse(provenance.settingsFixedAt)))throw Error('Invalid provenance');
 const a=inputs(pair.scenario.benefits),b=inputs(pair.twin.benefits);
 for(const k of ['ukPathGrowth','ukPathSpendingGrowth','ukPathTransferRisk'])if(a[k]!==b[k])throw Error('Twins must share the same UK path');
 for(const [input,fallback] of [['ukPathGrowth','baselineGrowth'],['ukPathSpendingGrowth','baselineSpendingGrowth']])if((a[input]??pair.scenario.structural?.[fallback])!==(b[input]??pair.twin.structural?.[fallback]))throw Error('Twins must share the same UK path');
 for(const k of ['ukTransitionShare','euSupportPeak','borderGainMax','borderGainRepublic','fdiNorthShare','integrationSaving'])if(b[k]>a[k])throw Error('Adverse twin cannot increase benefit '+k);
 if(b.gbFrictionLoss<a.gbFrictionLoss)throw Error('Adverse twin cannot reduce GB friction');
 for(const item of [pair.scenario,pair.twin])if(publicationIssues(item.benefits).length)throw Error('Unverified scenario cannot be published');
 return {qualification:'Conditional proxy assessment, not household welfare or a forecast',provenance,...pair};
}
