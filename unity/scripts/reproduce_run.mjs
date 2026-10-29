import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {simulate} from '../simulator/scenario_model.mjs';
export function reproduce(run){
 const fingerprint=crypto.createHash('sha256').update(fs.readFileSync(new URL('../simulator/scenario_model.mjs',import.meta.url))).digest('hex');
 if(run.modelSha256!==fingerprint)throw Error('This download belongs to a different model build. Use its matching executable.');
 const rows=simulate(run.policy,run.horizon,run.structural);
 assert.deepEqual(rows,run.rows,'Selected annual results do not reproduce');
 const compared=Object.fromEntries(Object.entries(run.comparedPolicies).map(([key,policy])=>[key,simulate(policy,run.horizon,run.structural)]));
 const comparison=Array.from({length:run.horizon},(_,i)=>Object.fromEntries([['year',i+1],...Object.entries(compared).map(([key,values])=>[key,values[i].cost])]));
 assert.deepEqual(comparison,run.comparison,'Comparison lines do not reproduce');
 for(const [key,x] of Object.entries(run.harmonisationCases??{}))assert.deepEqual(simulate(run.policy,run.horizon,x.structural),x.rows,'Harmonisation case does not reproduce '+key);
 return rows;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(!process.argv[2])throw Error('Supply a downloaded scenario JSON path');
 try {
  const run=JSON.parse(fs.readFileSync(process.argv[2]));const rows=reproduce(run);
  console.log(`Reproduced ${rows.length} annual results and all policy comparison lines. Model ${run.modelSha256}`);
 } catch(error) { console.error(error.name==='AssertionError'?'Saved results do not reproduce. Check the model build, inputs and result fields.':error.message);process.exitCode=1; }
}
