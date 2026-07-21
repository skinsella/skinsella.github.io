import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { scenarioResults, uncertaintySimulation, validationScorecard } from '../validation_model.mjs';

const csv = (rows) => { const keys=Object.keys(rows[0]); const q=v=>`"${String(v??'').replaceAll('"','""')}"`; return [keys.map(q).join(','),...rows.map(r=>keys.map(k=>q(r[k])).join(','))].join('\n')+'\n' };
const scenarios=scenarioResults();
const uncertainty=uncertaintySimulation({draws:2000,seed:20260721});
writeFileSync('scenario_results.csv',csv(scenarios));
writeFileSync('uncertainty_draws.csv',csv(uncertainty.results));
const uncertaintySummary={seed:uncertainty.seed,draws:uncertainty.draws,horizon:uncertainty.horizon,warning:uncertainty.warning,metrics:uncertainty.metrics,breakEvenShares:uncertainty.breakEvenShares};
writeFileSync('uncertainty_summary.json',JSON.stringify(uncertaintySummary,null,2)+'\n');
const files=['advanced_model.mjs','validation_model.mjs','model_parameters.csv','model_governance.csv'];
const hashes=Object.fromEntries(files.map(f=>[f,createHash('sha256').update(readFileSync(f)).digest('hex')]));
writeFileSync('audit.json',JSON.stringify({model:'The Price of Unity',version:'2.0.0',generated:'2026-07-21',seed:20260721,draws:2000,warning:'Structured uncertainty draws are not estimated probabilities.',hashes,scenarios,validation:validationScorecard(),uncertainty:uncertaintySummary},null,2)+'\n');
