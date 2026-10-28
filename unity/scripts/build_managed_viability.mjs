import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {MANAGED_CASES,managedCase,DEFAULT_STRUCTURAL as D,MODEL_CONSTANTS as C,simulate,breakEven,payback,policyForForm,FORMS} from '../simulator/scenario_model.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const fingerprint=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'simulator/scenario_model.mjs'))).digest('hex');
const horizon=25;
// Separate recurrence calculation for this restricted, no-fund, no-linked-effects problem.
// It does not call the model's fiscal bridge, tax-gain, debt or cash helpers.
export function independentManaged(policy,s,years=50){
 if(s.linkedMechanisms||s.fundOpening||s.fundContribution||s.ageing||s.businessUplift||s.labourUplift||s.transitionShock||policy.stall)throw Error('Independent check is restricted to the specified simple case');
 let debt=0,cash=0,cumulative=0;const out=[];
 for(let year=1;year<=years;year++){
  const expenditureDrift=C.BASE_SPENDING*((1+s.baselineSpendingGrowth/100)**year-1);
  const receiptsDrift=C.BASE_REVENUE*((1+s.baselineRevenueGrowth/100)**year-1);
  const revenue=s.growthRevenue?s.taxShare/100*C.NORTH_GNI*((1+policy.gNI/100)**year-(1+s.baselineGrowth/100)**year):0;
  const opening=C.PUBLISHED-C.DEFENCE_NET*s.defenceSavingShare/100-C.OTHER_NONID*s.centralSavingShare/100-C.TAX_ADD*s.taxAdjustmentShare/100-(policy.debtUK?C.DEBT_INT:0)-(policy.pensionsUK?C.PENSIONS:0);
  const pension=policy.pensionsUK?C.PENSIONS*Math.min(year/s.pensionTransferYears,1):0;
  const harmonisation=C.RERATE_FULL*policy.reratingScope/100*Math.min(year/policy.reratingYears,1);
  const extra=year<=10?policy.investment:0;
  const primary=opening+expenditureDrift-receiptsDrift+pension+harmonisation+extra+policy.duplication-revenue;
  const cost=primary+debt*s.realInterest/100;cumulative+=cost;
  if(cost>=0){const fromCash=Math.min(cash,cost);cash-=fromCash;debt+=cost-fromCash;}
  else{const repayment=Math.min(debt,-cost);debt-=repayment;cash+=-cost-repayment;}
  out.push({year,cost,cumulative,debt,cash});
 }
 return out;
}
function evaluate(example){
 const rows=simulate(example.policy,50,example.structural),independent=independentManaged(example.policy,example.structural);
 rows.forEach((r,i)=>{assert.ok(Math.abs(r.cost-independent[i].cost)<=.050001);assert.ok(Math.abs(r.cumulative-independent[i].cumulative)<=.050001);assert.ok(Math.abs(r.debt-independent[i].debt)<=.050001);});
 const peak=rows.slice(0,25).reduce((a,b)=>b.debt>a.debt?b:a);
 return {...example,rows,summary:{year1:rows[0].cost,year10:rows[9].cost,year25:rows[24].cost,cumulative25:rows[24].cumulative,presentValue25:rows[24].presentValue,debt25:rows[24].debt,peakDebt:peak.debt,peakDebtYear:peak.year,debt25PctRepublicGNI:rows[24].debt/(C.GNI_STAR*(1+example.structural.southGrowth/100)**25)*100,annualBalanceYear:breakEven(rows),cumulativePaybackYear:payback(rows)}};
}
function minimumGrowth(policy,settings,criterion){
 const field=criterion==='annual'?'annualNonPositive':'cumulativeNonPositive';
 const passes=g=>simulate({...policy,gNI:g},25,settings)[24][field]===1;
 if(passes(0))return {exact:0,roundedUp:0};
 if(!passes(7))return null;
 let low=0,high=7;
 for(let i=0;i<50;i++){const middle=(low+high)/2;if(passes(middle))high=middle;else low=middle;}
 assert.ok(!passes(Math.max(0,high-1e-6)));assert.ok(passes(high+1e-6));
 const roundedUp=Math.ceil(high*100-1e-8)/100;assert.ok(passes(roundedUp));
 return {exact:high,roundedUp};
}
const examples=Object.fromEntries(Object.keys(MANAGED_CASES).map(key=>[key,evaluate(managedCase(key))]));
const seed=managedCase('negotiated_growth');
const thresholds=[];
for(const fiscalGrowth of [0,1,2.5])for(const taxShare of [25,30,35,40]){
 const structural={...seed.structural,baselineRevenueGrowth:fiscalGrowth,baselineSpendingGrowth:fiscalGrowth,taxShare};
 thresholds.push({baselineReceiptsAndSpendingGrowth:fiscalGrowth,taxShare,annualBalanceBy25:minimumGrowth(seed.policy,structural,'annual'),cumulativePaybackBy25:minimumGrowth(seed.policy,structural,'cumulative')});
}
const settlementSensitivity=[];
for(const terms of ['none','pensions_and_interest','all_study_adjustments']){
 const retained=terms!=='none',all=terms==='all_study_adjustments';
 const policy={...seed.policy,pensionsUK:retained,debtUK:retained};
 const structural={...seed.structural,defenceSavingShare:all?100:0,centralSavingShare:all?100:0,taxAdjustmentShare:all?100:0};
 settlementSensitivity.push({terms,annualBalanceBy25:minimumGrowth(policy,structural,'annual'),cumulativePaybackBy25:minimumGrowth(policy,structural,'cumulative')});
}
const spendingSensitivity=[];
for(const key of Object.keys(examples))for(const fiscalGrowth of [0,1,2.5]){
 const example=managedCase(key);example.structural.baselineRevenueGrowth=fiscalGrowth;example.structural.baselineSpendingGrowth=fiscalGrowth;
 const result=evaluate(example);spendingSensitivity.push({example:key,baselineReceiptsAndSpendingGrowth:fiscalGrowth,...result.summary});
}
const interestSensitivity=[];
for(const key of Object.keys(examples))for(const realInterest of [1,2,3,4]){
 const example=managedCase(key);example.structural.realInterest=realInterest;
 const result=evaluate(example);interestSensitivity.push({example:key,realInterest,...result.summary});
}
const data={modelSha256:fingerprint,horizon,units:'Constant 2023 EUR billion unless a rate is labelled',purpose:'Conditional fiscal feasibility tests, not forecasts or proof of welfare gains',definitions:{annualBalance:'First annual financing-inclusive cost at or below zero',cumulativePayback:'First undiscounted financing-inclusive cumulative cost at or below zero after positive costs',threshold:'Required absolute NI real output growth, rounded upward to .01 percentage point for display. No confidence interval or estimated treatment effect is implied.'},examples,thresholds,settlementSensitivity,spendingSensitivity,interestSensitivity,caveats:['All study deductions and UK-retention assumptions are favourable negotiated terms, not settled liabilities.','The marginal revenue share is an assumption, not an estimated NI tax elasticity.','Gross baseline spending and receipts are constant in real terms in the examples. Sensitivity includes alternative common growth paths.','The selected output growth contains all assumed policy effects. No linked capital, consumption, employment or FDI dividends are stacked on it.','The historical output anchor, fiscal vintage and gross/net harmonisation boundary retain the documented evidence limitations.','No additional fund endowment, UK transition grant or EU transfer has been invented.','Annual fiscal balance and cumulative payback do not measure household welfare or all-island benefits.'],sources:[{title:'Executable model and original parameter register',url:'../simulator/scenario_model.mjs'},{title:'Recorded fiscal and harmonisation calibration',url:'simulator_calibration.json'},{title:'Doyle 2025 full text, printed Tables 2–6 and pension discussion',url:'../research/pdf_text/doyle_2025.txt'},{title:'FitzGerald and Morgenroth 2024, Tables 6 and 7',url:'https://www.iiea.com/images/uploads/resources/Northern_Ireland_Subvention_Possible_Unification_Effects.pdf'}]};
fs.writeFileSync(path.join(root,'data/managed_integration_viability.json'),JSON.stringify(data,null,2)+'\n');
for(const [key,example] of Object.entries(examples)){
 const shared={gNI:example.policy.gNI,stall:false,pensionsUK:example.policy.pensionsUK,debtUK:example.policy.debtUK};
 const comparedPolicies=Object.fromEntries(Object.keys(FORMS).map(name=>[name,policyForForm(name,shared)]));
 const compared=Object.fromEntries(Object.entries(comparedPolicies).map(([name,policy])=>[name,simulate(policy,25,example.structural)]));
 const exportRun={modelVersion:'2026-10-28-accounting-repair',modelSha256:fingerprint,caseLabel:example.label,form:'glide',horizon:25,policy:example.policy,structural:example.structural,comparedPolicies,rows:example.rows.slice(0,25),comparison:Array.from({length:25},(_,i)=>Object.fromEntries([['year',i+1],...Object.entries(compared).map(([name,rows])=>[name,rows[i].cost])])),qualification:data.purpose};
 fs.writeFileSync(path.join(root,`data/managed_integration_${key}_run.json`),JSON.stringify(exportRun,null,2)+'\n');
}
const table=(headers,rows)=>'| '+headers.join(' | ')+' |\n| '+headers.map(()=> '---').join(' | ')+' |\n'+rows.map(row=>'| '+row.join(' | ')+' |').join('\n')+'\n';
const fmt=n=>n==null?'Not reached':Number(n).toFixed(1);
const centralThresholds=thresholds.filter(x=>x.taxShare===35);
let note='# Managed Integration over 25 years\n\nThese are conditional fiscal feasibility examples. Their growth, revenue and negotiated-settlement assumptions are selected hypotheses, not estimated causal effects or a guarantee of viability.\n\n## Two different tests\n\nAnnual balance means that the Republic no longer makes a net annual payment including transition interest. Cumulative payback requires later surpluses to repay the preceding financing-inclusive costs and is not the same as annual balance.\n\nA path with annual balance and falling transition debt can be financially manageable within the horizon while retaining an overall transition cost. Whether that cost is justified requires a welfare assessment outside this model.\n\n## The two explicit examples\n\nBoth retain full harmonisation over fifteen years, additional expenditure of €1.5bn annually during the first ten years and a recurring €0.25bn duplication allowance. Neither example counts a linked capital or consumption dividend in addition to its selected output-growth path.\n\nBoth assume UK retention of accrued pension liabilities with funding transferred over forty years, UK retention of the allocated interest flow, and acceptance of all study defence, central-spending and revenue adjustments. These are favourable negotiated conditions, not legal findings.\n\nThe NI reference real output path grows at 2.5%, the assumed marginal revenue share is 35%, and real transition interest is 2%. Baseline gross receipts and spending are constant in real terms, and no fund endowment or external transition grant is added.\n\n'+table(['Example','NI real growth','Year-one annual cost','Year-ten annual cost','Year-25 annual cost','Cumulative cost to year 25','Present value to year 25','First annual balance','Cumulative payback'],Object.values(examples).map(x=>[x.label,x.policy.gNI+'%',fmt(x.summary.year1),fmt(x.summary.year10),fmt(x.summary.year25),fmt(x.summary.cumulative25),fmt(x.summary.presentValue25),'Year '+x.summary.annualBalanceYear,'Year '+x.summary.cumulativePaybackYear]))+'\nAmounts are €bn in constant 2023 prices, with negative costs indicating surpluses and cumulative totals including interest without discounting. Present value discounts those financing-inclusive costs at the selected 2% real rate and is not a social welfare valuation.\n\nThe negotiated-growth illustration still carries €'+fmt(examples.negotiated_growth.summary.debt25)+'bn of transition debt at year 25, approximately '+examples.negotiated_growth.summary.debt25PctRepublicGNI.toFixed(1)+'% of that year’s Republic GNI*. Its debt stock peaks in year '+examples.negotiated_growth.summary.peakDebtYear+' and then falls under the maintained assumptions.\n\n## Required growth, not a forecast\n\nThe thresholds below solve the existing equations backwards while retaining the same favourable settlement and marginal revenue share. Growth rates are rounded upward for display and do not imply empirical precision.\n\n'+table(['Real growth of baseline receipts and spending','NI growth required for annual balance by year 25','NI growth required for cumulative payback by year 25'],centralThresholds.map(x=>[x.baselineReceiptsAndSpendingGrowth+'%',x.annualBalanceBy25?.roundedUp+'%',x.cumulativePaybackBy25?.roundedUp+'%']))+'\nThe receipt and expenditure paths matter materially, so a successful result under a flat real baseline is not sufficient evidence that the scenario is robust. Higher service spending, weaker receipts, less favourable negotiations or a lower marginal revenue response can remove the apparent payback.\n\n## Negotiated terms sensitivity\n\nThese thresholds retain a flat real fiscal baseline and a 35% assumed marginal revenue share. Only the negotiated settlement varies.\n\n'+table(['Settlement','Required NI growth for annual balance','Required NI growth for cumulative payback'],settlementSensitivity.map(x=>[x.terms,x.annualBalanceBy25?.roundedUp+'%',x.cumulativePaybackBy25?.roundedUp+'%']))+'\n## Revenue response sensitivity\n\nNo marginal revenue coefficient has been estimated for Northern Ireland in this project. The following are chosen sensitivity values under the favourable settlement and flat real fiscal baseline.\n\n'+table(['Assumed marginal revenue share','Required NI growth for annual balance','Required NI growth for cumulative payback'],thresholds.filter(x=>x.baselineReceiptsAndSpendingGrowth===0).map(x=>[x.taxShare+'%',x.annualBalanceBy25?.roundedUp+'%',x.cumulativePaybackBy25?.roundedUp+'%']))+'\n## Evidence requirements and reproduction\n\nThe examples establish what would be sufficient inside the equations, not that the conditions will occur. The next empirical work is to validate the fiscal vintage and output anchor, estimate marginal receipts and gross service-spending paths, and justify achievable growth against an explicit UK counterfactual.\n\nThe annual and debt recurrences were checked independently for the restricted case, and the growth thresholds were checked on both sides of each boundary. The complete settings, alternative fiscal paths, interest sensitivities and annual outputs are in [managed_integration_viability.json](../data/managed_integration_viability.json).\n\nThe two exact scenario downloads are [negotiated growth](../data/managed_integration_negotiated_growth_run.json) and [stronger growth](../data/managed_integration_faster_growth_run.json). Each can be reproduced with scripts/reproduce_run.mjs against the matching model fingerprint.\n\n## Sources\n\n- [Executable model](../simulator/scenario_model.mjs), [model reference](../simulator/model_reference.html) and [calibration](../data/simulator_calibration.json)\n- [Doyle 2025 supplied full text](../research/pdf_text/doyle_2025.txt), used for the negotiated-settlement discussion and growth-scenario context, not a direct replication of his projections\n- [FitzGerald and Morgenroth 2024](https://www.iiea.com/images/uploads/resources/Northern_Ireland_Subvention_Possible_Unification_Effects.pdf), source harmonisation benchmark and alternative liabilities\n';
fs.writeFileSync(path.join(root,'book/managed_integration_25_year_tests.md'),note);
console.log('Built Managed Integration examples and inverse growth thresholds with independent recurrence checks');
