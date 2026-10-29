import {simulateBenefits,assessBenefits} from './benefits_model_runtime.mjs?v=a8a1a57db716';
import {niceAxis,requiredGrowth} from './story_math_runtime.mjs?v=f505ea42ec2a';
import {FORMS,DEFAULT_STRUCTURAL as D,MODEL_CONSTANTS as C,simulate,breakEven,payback,inheritedDeficit} from './scenario_model.mjs?v=f505ea42ec2a';
const $=id=>document.getElementById(id),keys=['unitary','federal','glide','worst'];
const names={unitary:'Unitary',federal:'Federal',glide:'Managed Integration',worst:'Higher Cost'};
const state={pensionsUK:true,debtUK:true,years:15,form:'glide',growth:2,ukTransitionShare:0};
const settings={...D,baselineGrowth:2,southGrowth:2,baselineRevenueGrowth:0,baselineSpendingGrowth:1,defenceSavingShare:100,centralSavingShare:100,taxAdjustmentShare:100,growthRevenue:true};
const thresholdCache=new Map();
const money=v=>`€${Math.abs(v).toFixed(1)}bn${v<0?' surplus':''}`;
function policy(key,years=state.years){return {...FORMS[key].defaults,reratingYears:key==='glide'?years:FORMS[key].defaults.reratingYears,gNI:state.growth,stall:false,pensionsUK:state.pensionsUK,debtUK:state.debtUK,counterfactual:false,shared:false};}
const benefits=()=>({ukTransitionShare:state.ukTransitionShare});
const fiscalRun=(p,h,s)=>simulateBenefits(p,h,s,benefits());
const run=(key,years)=>fiscalRun(policy(key,years),25,settings);
function singleBar(id,value,label,max){
 const w=Math.max(300,Math.min(680,$(id).clientWidth-24)),h=120,left=22,right=22,barw=(w-left-right)*Math.abs(value)/max;
 $(id).innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}, ${money(value)}"><title>${label}, ${money(value)}</title><text x="22" y="23" font-size="15" fill="#52655b">${label}</text><rect x="22" y="41" width="${Math.max(0,barw)}" height="32" rx="3" fill="#177052"/><text x="22" y="100" font-size="13" fill="#52655b">0</text><text x="${w-22}" y="100" text-anchor="end" font-size="13" fill="#52655b">€${max.toFixed(0)}bn</text></svg>`;
}
function lines(id,series,field,label,axisLabel="€bn · 2023 prices"){
 const w=Math.max(300,Math.min(700,$(id).clientWidth-20)),h=w<450?270:310,m={l:48,r:12,t:24,b:40},values=series.flatMap(s=>s.rows.map(r=>r[field]));
 const {lo,hi,step,ticks}=niceAxis(values);
 const x=t=>m.l+(t-1)/24*(w-m.l-m.r),y=v=>m.t+(hi-v)/(hi-lo)*(h-m.t-m.b);
 let svg=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><title>${label}</title>`;
 for(const v of ticks){svg+=`<line x1="${m.l}" x2="${w-m.r}" y1="${y(v)}" y2="${y(v)}" stroke="#e7ece6"/><text x="${m.l-8}" y="${y(v)+4}" text-anchor="end" font-size="12" fill="#52655b">${step<1?Number(v.toFixed(3)):v}</text>`;}
 svg+=`<line x1="${m.l}" x2="${w-m.r}" y1="${y(0)}" y2="${y(0)}" stroke="#8b9690" stroke-dasharray="5 4"/>`;
 for(const s of series){const pts=s.rows.map(r=>`${x(r.year)},${y(r[field])}`).join(' ');svg+=`<polyline points="${pts}" fill="none" stroke="${s.colour}" stroke-width="${s.key===state.form?3.5:2}" opacity="${s.key===state.form?1:.65}"><title>${s.name}</title></polyline>`;for(const r of s.rows)svg+=`<circle cx="${x(r.year)}" cy="${y(r[field])}" r="4" fill="transparent"><title>${s.name}, year ${r.year}, ${field.includes("Proxy")?(Math.abs(r[field])<.05?0:r[field]).toFixed(1):money(r[field])}</title></circle>`;}
 for(const t of [1,5,10,15,20,25])svg+=`<text x="${x(t)}" y="${h-15}" text-anchor="middle" font-size="12" fill="#52655b">${t}</text>`;
 svg+=`<text x="${m.l}" y="12" font-size="11" fill="#52655b">${axisLabel}</text></svg>`;$(id).innerHTML=svg;
}

function renderWorth(selected){
 const twin=simulateBenefits({...policy(state.form),gNI:Math.min(state.growth,1.3)},25,settings,benefits());
 const a=assessBenefits(selected.rows),b=assessBenefits(twin),end=selected.rows.at(-1);
 $('worth-number').textContent=a.passes+' of 5 tests';
 $('worth-unit').textContent=selected.name+' · '+a.status+' · annual burden limit still unset';
 const labels={northernProxy:'Northern resource proxy higher by year 15',islandOutput:'Island output proxy higher by year 15',debt:'Total Republic debt below 80% of GNI* throughout',burden:'Annual cost per resident below agreed limit',falling:'Annual cost falling from year 20'};
 $('worth-tests').innerHTML=Object.entries(labels).map(([k,label])=>'<tr><td>'+label+'</td><td>'+(a.tests[k]===null?'Not assessed':a.tests[k]?'Pass':'Fail')+'</td><td>'+(b.tests[k]===null?'Not assessed':b.tests[k]?'Pass':'Fail')+'</td></tr>').join('');
 const field=state.worthMetric==='island'?'islandOutputProxyGain':'northernProxyGainPerPerson';
 const unit=state.worthMetric==='island'?'Island output proxy gain · €bn':'Northern resource proxy gain · €/person';
 lines('worth-chart',[{...selected,rows:selected.rows},{key:'twin',name:'Lower-growth comparison',colour:'#8b9690',rows:twin}],field,unit,unit);
 $('worth-debt').textContent='Year 25 total Republic debt is '+end.totalDebtPctGNI.toFixed(1)+'% of GNI*, '+(end.debtHeadroomPctGNI>=0?'headroom below the chosen 80% ceiling is '+end.debtHeadroomPctGNI.toFixed(1):'the chosen 80% ceiling is exceeded by '+(-end.debtHeadroomPctGNI).toFixed(1))+' percentage points. The island old-age dependency ratio is '+end.islandOldAgeDependency.toFixed(1)+' per 100 working-age people, compared with '+end.republicOldAgeDependency.toFixed(1)+' in the Republic alone.';
 document.querySelectorAll('[data-worth]').forEach(x=>x.setAttribute('aria-pressed',(state.worthMetric??'income')===x.dataset.worth));
}

function render(){
 const adjusted=inheritedDeficit(true,true,settings);$('bridge-number').textContent=money(C.PUBLISHED);
 const bridge=[['Reported UK fiscal balance',C.PUBLISHED],['After other study adjustments',C.PUBLISHED-C.DEFENCE_NET-C.OTHER_NONID-C.TAX_ADD],['If the UK retains pensions',adjusted+C.DEBT_INT],['Residual under a very favourable deal',adjusted]];
 const bridgeWidth=Math.max(300,Math.min(700,$('bridge-chart').clientWidth-20)),bridgeBar=bridgeWidth-100;
 $('bridge-chart').innerHTML=`<svg viewBox="0 0 ${bridgeWidth} 260" role="img" aria-label="Study-based fiscal bridge from ${C.PUBLISHED.toFixed(1)} to ${adjusted.toFixed(1)} billion euros"><title>Conditional fiscal bridge</title>${bridge.map(([label,v],i)=>`<text x="12" y="${26+i*61}" font-size="13" fill="#52655b">${label}</text><rect x="12" y="${34+i*61}" width="${v/C.PUBLISHED*bridgeBar}" height="18" rx="2" fill="${i===3?'#177052':'#a4b5a7'}"/><text x="${24+v/C.PUBLISHED*bridgeBar}" y="${48+i*61}" font-size="13">€${v.toFixed(1)}bn</text>`).join('')}</svg>`;
 for(const [id,key] of [['pension','pensionsUK'],['debt','debtUK']]){$(id+'-toggle').setAttribute('aria-pressed',state[key]);$(id+'-label').textContent=state[key]?'UK retains this allocation':'Republic takes this allocation';}
 const current=run('glide');$('terms-number').textContent=money(current[0].cost);$('terms-unit').textContent=`Managed Integration · first-year cost · ${state.years}-year alignment · NI growth ${state.growth}%`;
 const maxFirst=Math.max(...[1,15,25].flatMap(years=>[true,false].flatMap(pensionsUK=>[true,false].map(debtUK=>fiscalRun({...policy('glide',years),pensionsUK,debtUK},1,settings)[0].cost))));
 singleBar('terms-chart',current[0].cost,'Managed Integration · first year',Math.ceil(maxFirst/10)*10);
 document.querySelectorAll('[data-years]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.years===state.years));
 document.querySelectorAll('[data-growth]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.growth===state.growth));
 const series=keys.map(key=>({key,name:names[key],colour:FORMS[key].color,rows:run(key)}));
 const rising=series.every(s=>s.rows.at(-1).cost>s.rows[0].cost);
 $('path-heading').textContent=rising?`At ${state.growth}% growth, costs rise over time.`:'Design and growth change the fiscal path.';
 $('path-growth-label').textContent=`Every line uses ${state.growth}% annual Northern Ireland real growth`;
 const selected=series.find(s=>s.key===state.form);$('future-number').textContent=money(selected.rows[24].cost);$('future-unit').textContent=`${selected.name} · annual Republic cost in year 25 · NI growth ${state.growth}%`;
 $('future-buttons').innerHTML=keys.map(key=>`<button data-form="${key}" aria-pressed="${key===state.form}" style="${key===state.form?'background:'+FORMS[key].color+';border-color:'+FORMS[key].color:''}">${names[key]}</button>`).join('');
 $('future-legend').innerHTML=series.map(s=>`<span><span class="dot" style="background:${s.colour}"></span>${s.name}</span>`).join('')+'<span><span class="dot" style="background:#8b9690"></span>UK-funded status quo</span>';
 lines('future-chart',series,'cost','Annual Republic fiscal costs across four futures. Grey zero line is additional Republic cost under UK status quo.');
 $('design-caption').textContent=`Managed Integration uses your ${state.years}-year timetable. Unitary and Higher Cost use immediate harmonisation, Federal uses 20 years. Other programme spending is set out in the model reference.`;
 lines('growth-chart',series,'cumulative','Cumulative Republic costs including transition interest. Below zero indicates costs repaid.');
 $('growth-legend').innerHTML=series.map(s=>`<span><span class="dot" style="background:${s.colour}"></span>${s.name}</span>`).join('');
 renderWorth(selected);
 const paid=series.filter(s=>payback(s.rows)!==null);
 const cacheKey=JSON.stringify([state.pensionsUK,state.debtUK,state.years,state.ukTransitionShare]);
 if(!thresholdCache.has(cacheKey))thresholdCache.set(cacheKey,Object.fromEntries(keys.map(k=>[k,requiredGrowth(policy(k),settings,25,fiscalRun)])));
 const thresholds=thresholdCache.get(cacheKey),managed=thresholds.glide;
 $('growth-number').textContent=managed?`About ${managed.display.toFixed(1)}% a year`:'Above the tested growth range';
 $('threshold-unit').textContent='NI growth needed for Managed Integration to repay cumulative costs within 25 years';
 $('payback-count').textContent=`At your chosen ${state.growth}% growth, ${paid.length} of 4 futures repay within 25 years. Required growth rates below are rounded upwards under the displayed assumptions.`;
 $('federal-assumption').textContent=`Federal assumes ${FORMS.federal.defaults.reratingYears}-year harmonisation and a €${FORMS.federal.defaults.duplication}bn annual administration allowance. These are selected design assumptions, not findings about a federal Ireland.`;
 $('growth-results').innerHTML=series.map(s=>`<tr><td>${s.name}</td><td>${thresholds[s.key]?thresholds[s.key].display.toFixed(1)+'%':'Not reached up to 7%'}</td><td>${payback(s.rows)?'Year '+payback(s.rows):'Not within 25 years'}<small style="display:block;color:#52655b">Annual balance ${breakEven(s.rows)?'in year '+breakEven(s.rows):'not reached'}</small></td><td>${(100*s.rows.at(-1).debt/(C.GNI_STAR*Math.pow(1+settings.southGrowth/100,25))).toFixed(1)}%<small style="display:block;color:#52655b">${money(s.rows.at(-1).debt)}</small></td></tr>`).join('');
 $('population-results').innerHTML=series.map(s=>`<tr><td>${s.name}</td><td>${s.rows.at(-1).gdpPerPersonRatio.toFixed(1)}%</td><td>${s.rows.some(r=>r.gdpPerPersonRatio>100)?'GDP crossover flagged':'No GDP crossover within horizon'}</td></tr>`).join('');
 $('benefits-link').href='benefits.html#'+encodeURIComponent(JSON.stringify({policy:policy(state.form),structural:settings,benefits:benefits()}));
 $('conclusion-text').textContent=paid.length?`Under your selected assumptions, ${paid.map(s=>s.name).join(' and ')} ${paid.length===1?'repays':'repay'} cumulative costs within the horizon. The outcome remains conditional on the negotiated settlement, spending paths and assumed growth.`:'Under your selected assumptions, none of these futures repays cumulative costs within the horizon. That is a fiscal result, not a verdict on wider wellbeing or constitutional choices.';
}
$('pension-toggle').addEventListener('click',()=>{state.pensionsUK=!state.pensionsUK;render();});$('debt-toggle').addEventListener('click',()=>{state.debtUK=!state.debtUK;render();});
$('timing-buttons').addEventListener('click',e=>{const b=e.target.closest('[data-years]');if(b){state.years=+b.dataset.years;render();}});
$('growth-buttons').addEventListener('click',e=>{const b=e.target.closest('[data-growth]');if(b){state.growth=+b.dataset.growth;render();}});
$('future-buttons').addEventListener('click',e=>{const b=e.target.closest('[data-form]');if(b){state.form=b.dataset.form;render();}});
$('uk-payment').addEventListener('input',e=>{const v=Number(e.target.value);if(Number.isFinite(v)&&v>=0&&v<=50){state.ukTransitionShare=v;render();}});
$('worth-buttons').addEventListener('click',e=>{const x=e.target.closest('[data-worth]');if(x){state.worthMetric=x.dataset.worth;render();}});
render();
fetch('model_reference.json').then(r=>r.json()).then(r=>$('fingerprint').textContent='Model version '+r.modelVersion).catch(()=>{});

let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(render,100);});
