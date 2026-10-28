import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {UNITY_CASES,unityCase,simulate,payback,breakEven,MODEL_CONSTANTS as C} from '../simulator/scenario_model.mjs';
import {independentManaged} from './build_managed_viability.mjs';
const root=new URL('../',import.meta.url);
const hash=crypto.createHash('sha256').update(fs.readFileSync(new URL('simulator/scenario_model.mjs',root))).digest('hex');
function assess(c){
 const rows=simulate(c.policy,25,c.structural),check=independentManaged(c.policy,c.structural,25);
 rows.forEach((r,i)=>{assert.ok(Math.abs(r.cost-check[i].cost)<.051);assert.ok(Math.abs(r.cumulative-check[i].cumulative)<.051);});
 const shares=rows.map(r=>r.debt/(C.GNI_STAR*(1+c.structural.southGrowth/100)**r.year)*100);
 return {payback:payback(rows),annualBalance:breakEven(rows),year1:rows[0].cost,year10:rows[9].cost,year25:rows[24].cost,cumulative25:rows[24].cumulative,debt25:rows[24].debt,debt25Pct:shares.at(-1),peakDebtPct:Math.max(...shares),annualCost25Pct:rows[24].pctGNI,debtFallingAt25:rows[24].debt<rows[23].debt,rows};
}
const cases=Object.fromEntries(Object.keys(UNITY_CASES).map(key=>{const c=unityCase(key);const stress={...c,policy:{...c.policy,gNI:c.policy.gNI-.5},structural:{...c.structural,realInterest:3,baselineSpendingGrowth:c.structural.baselineSpendingGrowth+.5}};return [key,{...c,summary:assess(c),stress:{description:'NI growth 0.5 percentage points lower, spending growth 0.5 points higher and real interest 3%',policy:stress.policy,structural:stress.structural,summary:assess(stress)}}];}));
const data={modelSha256:hash,units:'Constant 2023 euros, billion unless labelled percent',cases,qualification:'Conditional sufficiency tests. Neither growth nor negotiated terms are estimated or assured. Affordability is not certified.'};
fs.writeFileSync(new URL('data/united_ireland_fiscal_cases.json',root),JSON.stringify(data,null,2)+'\n');
const f=n=>n.toFixed(1),yr=n=>n??'Not within 25';
const table=(heads,rs)=>'| '+heads.join(' | ')+' |\n| '+heads.map(()=> '---').join(' | ')+' |\n'+rs.map(r=>'| '+r.join(' | ')+' |').join('\n');
const note=`# United Ireland fiscal cases

These are selected conditional scenarios for fiscal payback and affordability. They do not estimate household welfare or claim that their growth and negotiated terms will occur.

## Common assumptions

All cases use full harmonisation, the selected constitutional bundle's expenditure schedule, and favourable UK retention of accrued pensions and the allocated interest flow. All study defence, central-spending and revenue adjustments are accepted, pension funding transfers over forty years, and additional output produces an assumed 35% marginal revenue response.

The Northern Ireland counterfactual and Republic GNI* each grow at 2.5% annually, and real borrowing interest is 2%. No fund endowment, external grant or separate linked economic dividend is included.

These are model assumptions rather than negotiated commitments or empirical forecasts. The historical fiscal vintage, output anchor and harmonisation costing retain the limitations described in the model reference.

## Fiscal outcomes

Negative annual and cumulative costs indicate surpluses. Cumulative figures include transition interest without discounting.

${table(['Case','NI growth','Receipts/spending growth','Year 1 cost','Year 10 cost','Year 25 cost','Cumulative cost','Annual balance','Payback'],Object.entries(cases).map(([k,c])=>[c.label,c.policy.gNI+'%',c.structural.baselineSpendingGrowth+'%',f(c.summary.year1),f(c.summary.year10),f(c.summary.year25),f(c.summary.cumulative25),yr(c.summary.annualBalance),yr(c.summary.payback)]))}

## Affordability without a payback requirement

There is no externally validated affordability cutoff in this model. We report the annual transfer, peak incremental debt burden, remaining incremental debt and whether debt is falling, so a reader can judge the financing requirement.

Debt ratios below use Republic GNI*, rather than an unverified constructed all-island GNI* denominator. They exclude existing sovereign debt, inherited debt principal, opportunity costs and macroeconomic feedback from financing, so they do not certify united-state debt sustainability.

${table(['Case','Peak transition debt / Republic GNI*','Year 25 debt / Republic GNI*','Year 25 debt €bn','Year 25 annual cost / Republic GNI*','Debt falling at year 25'],Object.values(cases).map(c=>[c.label,f(c.summary.peakDebtPct)+'%',f(c.summary.debt25Pct)+'%',f(c.summary.debt25),f(c.summary.annualCost25Pct)+'%',c.summary.debtFallingAt25?'Yes':c.summary.debt25===0?'Already repaid':'No']))}

## Less favourable variants

Each variant lowers Northern Ireland growth by 0.5 percentage points, raises baseline spending growth by 0.5 points while leaving receipts growth unchanged, and raises real borrowing interest to 3%. These are chosen stress assumptions rather than estimated probabilities.

${table(['Case','Stressed year 25 cost','Stressed cumulative cost','Stressed payback','Stressed year 25 debt / Republic GNI*'],Object.values(cases).map(c=>[c.label,f(c.stress.summary.year25),f(c.stress.summary.cumulative25),yr(c.stress.summary.payback),f(c.stress.summary.debt25Pct)+'%']))}

## Interpretation and sources

A successful case demonstrates sufficiency inside these equations, not empirical likelihood. Several successful cases share the same favourable settlement and should not be counted as independent evidence of viability.

The stronger-growth paths require evidence on sustained productivity and employment improvements against continued UK membership. Equal growth of receipts and spending also enlarges the absolute underlying deficit because the spending base is larger.

The complete settings and annual paths are in [the calculation file](../data/united_ireland_fiscal_cases.json), generated by [the assessment script](../scripts/build_unity_cases.mjs). Annual costs and debt have also been checked using a separate restricted recurrence.

[Executable model](../simulator/scenario_model.mjs)  
[Parameter evidence and limitations](../simulator/model_reference.html)  
[Recorded source calibration](../data/simulator_calibration.json)  
[FitzGerald and Morgenroth harmonisation source](https://www.iiea.com/images/uploads/resources/Northern_Ireland_Subvention_Possible_Unification_Effects.pdf)  
[Doyle supplied full text](../research/pdf_text/doyle_2025.txt)
`;
fs.writeFileSync(new URL('book/united_ireland_fiscal_cases.md',root),note);
console.log('Built united Ireland fiscal cases and independent stress checks');
