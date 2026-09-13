import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateEvidence} from './case-evidence.mjs';

const data=JSON.parse(await readFile(new URL('../public/model-evidence/five-use-cases.json',import.meta.url),'utf8'));
validateEvidence(data);
const reject=(label,change)=>{
  const altered=structuredClone(data);
  change(altered);
  assert.throws(()=>validateEvidence(altered),undefined,label);
};
reject('An unfinished run cannot become a case study',x=>x.cases[0].status='running');
reject('A missing browser check cannot count as completed',x=>x.cases[0].engineering.package_verified=false);
reject('A missing experiment cannot be published as five',x=>x.cases.pop());
reject('Duplicate experiments cannot fill the five-case requirement',x=>x.cases[1]=structuredClone(x.cases[0]));
reject('A failed model cannot be labelled released',x=>x.cases.find(c=>!c.benchmark_passed).benchmark_passed=true);
reject('The headline must agree with the scored answers',x=>x.cases[0].candidate_passed++);
reject('A source answer cannot silently change after the run',x=>x.cases[0].dataset[0].answer+=' altered');
reject('A reserved target cannot silently change',x=>x.cases[0].benchmark.tests[0].answer+=' altered');
reject('Published input must agree with the frozen input',x=>x.cases[0].tests[0].input+=' altered');
reject('The actual strict-score prediction must agree with its score',x=>{
  const c=x.cases.find(c=>c.metric==='exact_match');
  c.tests.find(t=>t.candidate_pass).trained='an incorrect answer';
});
reject('Critical failures cannot be removed from the headline',x=>x.cases.find(c=>c.critical_failures).critical_failures=0);
reject('An untested recipe cannot replace the recorded recipe',x=>x.cases[0].recipe.max_steps=999);
reject('A fresh-input result needs an observed answer',x=>delete x.cases[0].new_input.actual);
console.log('Complete evidence accepted; 13 incomplete, altered or misleading evidence variants rejected.');
