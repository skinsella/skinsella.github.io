import {simulateBenefits,assessBenefits,BENEFIT_INPUTS,BENEFIT_DEFAULTS,SUCCESS_RULES,publicationIssues,validateSharedSettings} from './benefits_model_runtime.mjs?v=ca6f8ebbce26';
import {DEFAULT_STRUCTURAL as D,FORMS,HARMONISATION_CASES,harmonisationSettings} from './scenario_model.mjs?v=ca6f8ebbce26';
const $=id=>document.getElementById(id);
let initialError='',loaded;
try{loaded=validateSharedSettings(JSON.parse(decodeURIComponent(location.hash.slice(1))||'{}'));}
catch(e){initialError=e.message;loaded=validateSharedSettings({});}
const {policy:p,structural:s,benefits:b,horizon}=loaded;
const labels={debt:'Total State debt below 80% of GNI* plus NI output throughout',burden:'Annual Republic cost no more than 2% of GNI*',falling:'Annual cost falling from year 20'};
$('harmonisation-select').innerHTML=Object.entries(HARMONISATION_CASES).map(([key,x])=>'<option value="'+key+'">'+x.label+'</option>').join('')+'<option value="custom">Custom sensitivity</option>';
$('harmonisation-select').value=s.harmonisationCase;
$('harmonisation-select').addEventListener('change',e=>{Object.assign(s,harmonisationSettings(e.target.value));render();});
$('context').textContent=`Loaded ${p.gNI}% NI growth from other causes, ${p.reratingYears}-year alignment, UK pension retention ${p.pensionsUK?'on':'off'}, and UK debt-interest retention ${p.debtUK?'on':'off'}. Changes here affect this extension comparison only.`;
$('inputs').innerHTML=BENEFIT_INPUTS.map(x=>`<tr><td><label for="b-${x.key}">${x.key}</label></td><td><input id="b-${x.key}" type="number" min="${x.min}" max="${x.max}" step="${x.unit==='years'||x.unit==='year'?1:'any'}" placeholder="Not calibrated" ${x.status==='source needed'?'disabled':''}></td><td>${x.unit}</td><td>${x.min} to ${x.max}</td><td>${x.status}<br>${x.description}</td></tr>`).join('');
for(const x of BENEFIT_INPUTS){const el=$('b-'+x.key);el.value=b[x.key]??'';el.addEventListener('input',e=>{b[x.key]=e.target.value===''?null:Number(e.target.value);render();});}
function render(){
 try{
  if(initialError)throw Error('Invalid shared settings. '+initialError);
  const issues=publicationIssues(b);if(issues.length)throw Error('Unverified channels stay disabled in this public comparison. '+issues.join('. '));
  const rows=simulateBenefits(p,horizon,s,b),twin=simulateBenefits({...p,gNI:Math.min(p.gNI,1.3)},horizon,s,b),a=assessBenefits(rows),ta=assessBenefits(twin),end=rows.at(-1);
  $('harmonisation-comparison').innerHTML=Object.entries(HARMONISATION_CASES).map(([key,x])=>{const r=simulateBenefits(p,horizon,{...s,...harmonisationSettings(key)},b),a=assessBenefits(r),end=r.at(-1);return '<tr><td>'+x.label+'</td><td>'+r[0].cost.toFixed(1)+'</td><td>'+end.cost.toFixed(1)+'</td><td>'+end.debt.toFixed(1)+'</td><td>'+end.totalDebtPctGNI.toFixed(1)+'%</td><td>'+a.fiscalPasses+' of 3</td></tr>';}).join('');
  $('error').textContent='';$('status').textContent=a.status;
  $('sensitivities').textContent=''+a.burdenSensitivities.map((x,i)=>'At the '+x.limit+'% annual burden limit, there are '+x.fiscalPasses+' of 3 fiscal passes for the selected path and '+ta.burdenSensitivities[i].fiscalPasses+' for the comparison').join('. ')+'.';
  $('tests').innerHTML=Object.entries(labels).map(([k,label])=>`<tr><td>${label}</td><td>${a.tests[k]===null?'Not assessed':a.tests[k]?'Pass':'Fail'}</td><td>${ta.tests[k]===null?'Not assessed':ta.tests[k]?'Pass':'Fail'}</td></tr>`).join('');
  $('outcomes').innerHTML=rows.filter(r=>[1,10,15,horizon].includes(r.year)).map(r=>`<tr><td>${r.year}</td><td>€${r.netCostPerRepublicResident.toFixed(0)}<br><small>${r.netCostPctGNI.toFixed(2)}% of GNI*</small></td><td>${r.totalDebtPctGNI.toFixed(1)}%<br><small>${r.debtHeadroomPctGNI.toFixed(1)} points of headroom</small></td><td>€${r.interest.toFixed(1)}bn</td><td>${r.islandOldAgeDependency.toFixed(1)} / ${r.republicOldAgeDependency.toFixed(1)}</td></tr>`).join('');
  $('repayment').textContent=`Repayment is reported separately. Selected path ${a.payback?'year '+a.payback:'does not repay within ${horizon} years'}, lower-growth comparison ${ta.payback?'year '+ta.payback:'does not repay within ${horizon} years'}.`;
 }catch(e){$('error').textContent=e.message;$('status').textContent='Input error';$('tests').innerHTML='';$('outcomes').innerHTML='';}
}
render();
