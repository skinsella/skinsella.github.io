import {simulateBenefits} from './benefits_model_runtime.mjs?v=353e057bf922';

// Solve a negotiated payment, not a probability or entitlement. Keep the frozen
// opening deficit, annual spending and growth fixed during every trial.
export function requiredUKSupport(policy,settings,horizon=25,maxShare=50) {
 if(!Number.isFinite(maxShare)||maxShare<0||maxShare>50)throw new RangeError('Unsupported UK payment search');
 const passes=ukTransitionShare=>simulateBenefits(policy,horizon,settings,{ukTransitionShare}).at(-1).cumulativeNonPositive===1;
 if(passes(0))return {exact:0,display:0};
 if(!passes(maxShare))return null;
 let lo=0,hi=maxShare;
 for(let i=0;i<30;i++){const mid=(lo+hi)/2;if(passes(mid))hi=mid;else lo=mid;}
 return {exact:hi,display:Math.min(maxShare,Math.ceil(hi*10-1e-8)/10)};
}
