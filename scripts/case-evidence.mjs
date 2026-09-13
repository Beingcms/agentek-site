import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const expectedIds=['drafting','extraction','grounded-answers','routing','summarisation'];

// Publication must be based on completed observations, including failed answers.
export function validateCase(c) {
  assert.equal(c.status,'completed');
  assert.equal(c.synthetic,true);
  assert.ok(expectedIds.includes(c.id));
  assert.equal(c.tests.length,12);
  assert.equal(new Set(c.tests.map(r=>r.id)).size,12);
  assert.equal(c.tests.filter(r=>r.critical).length,3);
  for(const key of ['saved_model_reloaded','local_artifacts_verified','hosted_result_verified','package_verified','new_input_tested']) assert.equal(c.engineering[key],true,`Missing observed check: ${key}`);
  assert.ok(c.tests.every(r=>typeof r.baseline_pass==='boolean'&&typeof r.candidate_pass==='boolean'&&typeof r.critical==='boolean'&&r.review_note));
  assert.equal(c.baseline_passed,c.tests.filter(r=>r.baseline_pass).length);
  assert.equal(c.candidate_passed,c.tests.filter(r=>r.candidate_pass).length);
  assert.equal(c.critical_failures,c.tests.filter(r=>r.critical&&!r.candidate_pass).length);
  assert.equal(c.benchmark_passed,c.candidate_passed>=10&&c.candidate_passed>=c.baseline_passed&&c.critical_failures===0);
  assert.equal(digest(c.dataset),c.dataset_sha256,'Recorded dataset fingerprint changed');
  assert.equal(digest(stable(c.benchmark)),c.benchmark_sha256,'Recorded benchmark fingerprint changed');
  assert.deepEqual(c.tests.map(r=>r.id).sort(),c.benchmark.tests.map(r=>r.id).sort());
  for(const row of c.tests) {
    const frozen=c.benchmark.tests.find(r=>r.id===row.id);
    assert.equal(row.expected,frozen.answer);
    assert.equal(row.critical,frozen.critical);
    assert.equal(frozen.prompt,`Task: ${c.benchmark.contract.goal}\n\nInput:\n${row.input}`);
    if(c.metric==='exact_match') {
      assert.equal(row.baseline_pass,row.original.trim()===row.expected.trim());
      assert.equal(row.candidate_pass,row.trained.trim()===row.expected.trim());
    }
  }
  assert.equal(c.training.steps,216);
  assert.equal(c.training.unique_examples_seen,24);
  assert.equal(c.training.completed_epochs,9);
  assert.deepEqual(c.recipe,{method:'lora',max_steps:216,learning_rate:0.0002,lora_rank:8,max_length:512,seed:42});
  assert.equal(c.generation.evaluation_configuration.max_new_tokens,64);
  assert.equal(c.generation.prompt_format,'chat');
  assert.equal(c.runtime.device,'cpu');
  assert.equal(c.runtime.cpu_threads,2);
  assert.ok(Number.isFinite(c.training_duration_seconds)&&c.training_duration_seconds>0);
  assert.ok(c.new_input&&c.new_input.input&&c.new_input.expected&&typeof c.new_input.actual==='string'&&typeof c.new_input.passed==='boolean');
  assert.ok(c.business_question&&c.conclusion&&c.rubric&&c.review_disclosure);
}

export function validateEvidence(data) {
  assert.equal(data.synthetic,true);
  assert.equal(data.cases.length,5);
  assert.deepEqual(data.cases.map(c=>c.id).sort(),expectedIds);
  for(const c of data.cases) {
    validateCase(c);
    assert.deepEqual(c.model,data.model);
  }
}
