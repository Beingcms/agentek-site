import test from 'node:test';
import assert from 'node:assert/strict';
import {createBookingHandler} from '../api/book-strategy-call.js';
const REF='86d9f076-62d6-4aef-bcf0-090fdaaf104a',ID='463171b7-f2da-4e10-807b-d392730620d8';
const input={name:'Website test',email:'test@example.com',company:'Example',workflow:'Summarise approved notes.\nKeep dates and decisions.'};
function response(){return {headers:{},statusCode:200,setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(v){this.body=v;return this}};}
async function send(overrides={},fetchImpl=async()=>Response.json({id:ID}),env={RESEND_API_KEY:'fixture-not-a-secret',BOOKING_TO_EMAIL:'owner@example.com'}){
 const r=response();await createBookingHandler({env,fetchImpl,timeoutMs:20})({method:'POST',headers:{'content-type':'application/json','origin':'https://www.agentek.co.uk','idempotency-key':REF},body:input,...overrides},r);return r;
}
test('valid enquiry preserves task and routes only to configured owner, with stable retry key',async()=>{
 const calls=[];const f=async(url,opts)=>{calls.push({url,opts});return Response.json({id:ID})};
 for(let n=0;n<2;n++)assert.equal((await send({},f)).body.reference,REF);
 assert.equal(calls[0].opts.headers['Idempotency-Key'],'modelfit-enquiry/'+REF);
 assert.equal(calls[0].opts.body,calls[1].opts.body);
 const body=JSON.parse(calls[0].opts.body);assert.equal(body.to,'owner@example.com');assert.equal(body.reply_to,input.email);assert.ok(body.text.includes(input.workflow));assert.ok(calls[0].opts.signal instanceof AbortSignal);
});
test('invalid fields never invoke email service',async()=>{
 const noSend=async()=>{throw new Error('must not send')};
 for(const body of [null,[],{...input,name:[]},{...input,name:' '},{...input,email:'bad'},{...input,email:'a@b.com\nBcc:x@y.com'},{...input,phone:{}},{...input,workflow:'x'.repeat(1001)},{...input,website_confirm:'bot value'},{...input,extra:'x'.repeat(9000)}]){
  const r=await send({body},noSend);assert.equal(r.statusCode,400,JSON.stringify(body).slice(0,150));
 }
});
test('method, origin and content-type checks prevent unsupported requests',async()=>{
 assert.equal((await send({method:'GET'})).statusCode,405);
 assert.equal((await send({headers:{'origin':'https://unrelated.example','content-type':'application/json'}})).statusCode,403);
 assert.equal((await send({headers:{'content-type':'text/plain'}})).statusCode,415);
});
test('legacy fields without a retry key remain supported and unknown page paths are normalised',async()=>{
 let payload;const r=await send({headers:{'content-type':'application/json'},body:{name:'Legacy',email:'legacy@example.com',page:'/index.html'}},async(_,o)=>{payload=JSON.parse(o.body);return Response.json({id:ID})});assert.equal(r.statusCode,200);assert.match(r.body.reference,/^[a-f0-9-]{36}$/);assert.match(payload.text,/Website page: \//);
});
test('untrusted HTML is escaped and control characters are rejected',async()=>{
 let payload;const r=await send({body:{...input,name:'<script>alert(1)</script>',workflow:'<b>Do this</b>'}},async(_,o)=>{payload=JSON.parse(o.body);return Response.json({id:ID})});assert.equal(r.statusCode,200);assert.ok(!payload.html.includes('<script>'));assert.ok(payload.html.includes('&lt;b&gt;'));
 assert.equal((await send({body:{...input,workflow:'bad\u0000text'}})).statusCode,400);
});
test('a missing configuration produces a safe failure without a provider call',async()=>{
 let called=false;const r=await send({},async()=>{called=true},{});assert.equal(r.statusCode,503);assert.equal(called,false);assert.ok(!r.body.error.includes('RESEND_API_KEY'));
});
test('provider failures and incomplete acknowledgements are never claimed as success or leaked',async()=>{
 for(const reply of [Response.json({message:'private provider detail'},{status:401}),Response.json({}),Response.json({id:null}),Response.json({id:'not-an-email-id'})]){
  const r=await send({},async()=>reply);assert.equal(r.statusCode,502);assert.equal(r.body.ok,undefined);assert.ok(!r.body.error.includes('private provider'));
 }
 const thrown=await send({},async()=>{throw new Error('private error')});assert.equal(thrown.statusCode,503);assert.ok(!thrown.body.error.includes('private error'));
});
test('provider timeout remains an unconfirmed delivery, safe to retry with the same key',async()=>{
 const hold=setTimeout(()=>{},100);
 try{const r=await send({},async(_,opts)=>new Promise((resolve,reject)=>opts.signal.addEventListener('abort',()=>reject(opts.signal.reason),{once:true})));assert.equal(r.statusCode,503);assert.match(r.body.error,/confirm delivery/);}finally{clearTimeout(hold)}
});
test('browser cannot control recipients or inject an invalid idempotency key',async()=>{
 let payload;await send({body:{...input,to:'intruder@example.com'}},async(_,o)=>{payload=JSON.parse(o.body);return Response.json({id:ID})});assert.equal(payload.to,'owner@example.com');
 assert.equal((await send({headers:{'content-type':'application/json','idempotency-key':'invalid\nvalue'}})).statusCode,400);
});
