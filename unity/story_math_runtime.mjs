import {simulate} from './scenario_model.mjs?v=f505ea42ec2a';
export function niceAxis(values){
 const low=Math.min(0,...values),high=Math.max(0,...values),raw=Math.max(1e-9,high-low)/4;
 if(high===low)return {lo:0,hi:1,step:.25,ticks:[0,.25,.5,.75,1]};
 const magnitude=10**Math.floor(Math.log10(raw));
 const step=[1,2,2.5,5,10].map(x=>x*magnitude).find(x=>x>=raw)??10*magnitude;
 const lo=Math.floor(low/step)*step,hi=Math.max(lo+step,Math.ceil(high/step)*step);
 const ticks=Array.from({length:Math.round((hi-lo)/step)+1},(_,i)=>+(lo+i*step).toPrecision(12));
 return {lo,hi,step,ticks};
}
export function requiredGrowth(policy,settings,horizon=25,runner=simulate){
 const passes=gNI=>runner({...policy,gNI},horizon,settings).at(-1).cumulativeNonPositive===1;
 if(passes(0))return {exact:0,display:0};
 let low=0,high=null;
 for(let g=.25;g<=7;g+=.25){if(passes(g)){high=g;break;}low=g;}
 if(high===null)return null;
 for(let i=0;i<32;i++){const mid=(low+high)/2;if(passes(mid))high=mid;else low=mid;}
 const display=Math.ceil(high*10-1e-8)/10;
 return {exact:high,display};
}
