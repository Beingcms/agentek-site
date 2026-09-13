import {randomUUID} from 'node:crypto';

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const PAGES = new Set(['/', '/book-a-strategy-call', '/book-a-strategy-call.html', '/company-ai-blueprint', '/company-ai-blueprint.html', '/studio.html']);
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function field(body, name, maximum, required = false, multiline = false) {
  const value = body[name] === undefined ? '' : body[name];
  if (typeof value !== 'string' || value.length > maximum ||
      (multiline ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/).test(value)) throw new Error('invalid');
  const clean = value.trim();
  if (required && !clean) throw new Error('invalid');
  return clean;
}

export function createBookingHandler({env = process.env, fetchImpl = fetch, timeoutMs = 12000} = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({error:'Method not allowed'});
    }
    const origin = req.headers?.origin;
    const allowed = new Set(['https://www.agentek.co.uk','https://agentek.co.uk']);
    if (env.VERCEL_URL) allowed.add('https://' + env.VERCEL_URL);
    if (origin && !allowed.has(origin)) return res.status(403).json({error:'Please use the AgenTek website enquiry form.'});
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers?.['content-type'] || '')) return res.status(415).json({error:'Please use the website enquiry form.'});
    let input, requestId;
    try {
      const b=req.body;
      if (!b || typeof b!=='object' || Array.isArray(b) || Buffer.byteLength(JSON.stringify(b)) > 8192) throw new Error('invalid');
      input={name:field(b,'name',150,true),email:field(b,'email',254,true),phone:field(b,'phone',50),company:field(b,'company',200),workflow:field(b,'workflow',1000,false,true),page:field(b,'page',100)||'/'};
      if (!EMAIL.test(input.email) || field(b,'website_confirm',200)) throw new Error('invalid');
      if (!PAGES.has(input.page)) input.page='/';
      requestId=req.headers?.['idempotency-key'] || randomUUID();
      if (typeof requestId!=='string' || !UUID.test(requestId)) throw new Error('invalid');
    } catch {
      return res.status(400).json({error:'Please check your name, email and message length, then try again.'});
    }
    if (!env.RESEND_API_KEY) return res.status(503).json({error:'The enquiry service is unavailable. Please email AgenTek directly.'});
    const rows=[['Name',input.name],['Email',input.email],['Company',input.company||'Not provided'],['Phone',input.phone||'Not provided'],['Work to discuss',input.workflow||'Not provided'],['Website page',input.page],['Request reference',requestId]];
    const message={from:env.BOOKING_FROM_EMAIL||'Agentek <onboarding@resend.dev>',to:env.BOOKING_TO_EMAIL||'hello@agentek.co.uk',reply_to:input.email,subject:`ModelFit enquiry - ${input.name}`,html:`<div style="font-family:Arial,sans-serif;max-width:640px;color:#221630"><h1>AgenTek ModelFit enquiry</h1>${rows.map(([label,value])=>`<h3>${label}</h3><p style="white-space:pre-wrap">${escapeHtml(value)}</p>`).join('')}</div>`,text:['AgenTek ModelFit enquiry',...rows.map(([label,value])=>`${label}: ${value}`)].join('\n')};
    try {
      const response=await fetchImpl('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':'modelfit-enquiry/'+requestId},body:JSON.stringify(message),signal:AbortSignal.timeout(timeoutMs)});
      const result=await response.json().catch(()=>({}));
      if (!response.ok || typeof result.id!=='string' || !UUID.test(result.id)) return res.status(502).json({error:'We could not confirm delivery. Your details have not been cleared; you can retry or email AgenTek.'});
      // Provider acceptance is not a claim of inbox delivery or a booked meeting.
      return res.status(200).json({ok:true,id:result.id,reference:requestId});
    } catch {
      return res.status(503).json({error:'We could not confirm delivery. Please retry the same request or email AgenTek.'});
    }
  };
}

export default createBookingHandler();
