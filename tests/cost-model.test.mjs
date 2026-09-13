import test from 'node:test';
import assert from 'node:assert/strict';
import {estimateCosts} from '../public/cost-model.mjs';
const defaults={volume:100000,input:1000,output:200,hours:730,replicas:1};
test('independently calculated 100k document scenario',()=>assert.deepEqual(estimateCosts(defaults),{sol:800,astra:2000,luna:44,open:584}));
test('API usage scales with volume; dedicated rental does not',()=>{
 const low=estimateCosts({...defaults,volume:1000});
 assert.deepEqual(low,{sol:8,astra:20,luna:0.44,open:584});
 const high=estimateCosts({...defaults,volume:1000000}); assert.equal(high.sol,8000);assert.equal(high.open,584);
});
test('scheduled and replicated rental is explicit',()=>{assert.equal(estimateCosts({...defaults,hours:160,replicas:2}).open,256);});
test('input and billed output independently affect usage',()=>{assert.equal(estimateCosts({...defaults,input:2000,output:400}).astra,4000);});
test('missing, negative, fractional and out-of-bound assumptions are rejected',()=>{
 for(const patch of [{volume:NaN},{input:0},{output:-1},{hours:Infinity},{hours:745},{replicas:1.5},{replicas:17},{volume:1000001}]) assert.throws(()=>estimateCosts({...defaults,...patch}),RangeError);
});
