import {simulateBenefits,assessBenefits,BENEFIT_INPUTS,BENEFIT_DEFAULTS,SUCCESS_RULES,publicationIssues} from './benefits_model.mjs';
import {DEFAULT_STRUCTURAL as D,FORMS} from './scenario_model.mjs';
const $=id=>document.getElementById(id);
let loaded={};try{loaded=JSON.parse(decodeURIComponent(location.hash.slice(1))||'{}');}catch{}
const p={...FORMS.glide.defaults,gNI:2,pensionsUK:true,debtUK:true,...loaded.policy};
const s={...D,defenceSavingShare:100,centralSavingShare:100,taxAdjustmentShare:100,...loaded.structural};
const b={...BENEFIT_DEFAULTS,...loaded.benefits};
const labels={northernProxy:'Northern resource proxy higher by year 15',islandOutput:'Island output proxy higher by year 15',debt:'Total debt below 80% of GNI* throughout',burden:'Annual cost per Republic resident below agreed limit',falling:'Annual cost falling from year 20'};
$('context').textContent=`Loaded ${p.gNI}% NI growth from other causes, ${p.reratingYears}-year alignment, UK pension retention ${p.pensionsUK?'on':'off'}, and UK debt-interest retention ${p.debtUK?'on':'off'}. Changes here affect this extension comparison only.`;
$('inputs').innerHTML=BENEFIT_INPUTS.map(x=>`<tr><td><label for="b-${x.key}">${x.key}</label></td><td><input id="b-${x.key}" type="number" min="${x.min}" max="${x.max}" step="${x.unit==='years'||x.unit==='year'?1:'any'}" value="${b[x.key]??''}" placeholder="Not calibrated" ${x.status==='source needed'?'disabled':''}></td><td>${x.unit}</td><td>${x.min} to ${x.max}</td><td>${x.status}<br>${x.description}</td></tr>`).join('');
for(const x of BENEFIT_INPUTS)$('b-'+x.key).addEventListener('input',e=>{b[x.key]=e.target.value===''?null:Number(e.target.value);render();});
function render(){
 try{
  const issues=publicationIssues(b);if(issues.length)throw Error('Unverified channels stay disabled in this public comparison. '+issues.join('. '));
  const rows=simulateBenefits(p,25,s,b),twin=simulateBenefits({...p,gNI:Math.min(p.gNI,1.3)},25,s,b),a=assessBenefits(rows),ta=assessBenefits(twin),end=rows.at(-1);
  $('error').textContent='';$('status').textContent=a.status;
  $('tests').innerHTML=Object.entries(labels).map(([k,label])=>`<tr><td>${label}</td><td>${a.tests[k]===null?'Not assessed':a.tests[k]?'Pass':'Fail'}</td><td>${ta.tests[k]===null?'Not assessed':ta.tests[k]?'Pass':'Fail'}</td></tr>`).join('');
  $('outcomes').innerHTML=rows.filter(r=>[1,10,15,25].includes(r.year)).map(r=>`<tr><td>${r.year}</td><td>€${r.netCostPerRepublicResident.toFixed(0)}</td><td>${r.totalDebtPctGNI.toFixed(1)}%<br><small>${r.debtHeadroomPctGNI.toFixed(1)} points of headroom</small></td><td>€${r.northernProxyGainPerPerson.toFixed(0)}</td><td>€${r.islandOutputProxyGain.toFixed(1)}bn</td><td>${r.islandOldAgeDependency.toFixed(1)} / ${r.republicOldAgeDependency.toFixed(1)}</td></tr>`).join('');
  $('repayment').textContent=`Repayment is reported separately. Selected path ${a.payback?'year '+a.payback:'does not repay within 25 years'}, lower-growth comparison ${ta.payback?'year '+ta.payback:'does not repay within 25 years'}.`;
 }catch(e){$('error').textContent=e.message;$('status').textContent='Input error';$('tests').innerHTML='';$('outcomes').innerHTML='';}
}
render();
