const resendApiKey = process.env.RESEND_API_KEY;
const bookingToEmail = process.env.BOOKING_TO_EMAIL || 'chandra@agentek.co.uk';
const bookingFromEmail = process.env.BOOKING_FROM_EMAIL || 'Agentek <onboarding@resend.dev>';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!resendApiKey) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
  }

  const { name, email, phone, company } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const subject = `Strategy Call Request - ${name}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;padding:32px 16px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:14px;overflow:hidden;">
        <div style="padding:24px 28px;border-bottom:1px solid #e5e5e5;">
          <div style="font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#ea580c;font-weight:700;">Agentek</div>
          <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;color:#0a0a0a;">New strategy call request</h1>
        </div>
        <div style="padding:28px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:0 0 14px;font-size:13px;font-weight:700;color:#737373;text-transform:uppercase;">Name</td></tr>
            <tr><td style="padding:0 0 18px;font-size:18px;color:#0a0a0a;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:0 0 14px;font-size:13px;font-weight:700;color:#737373;text-transform:uppercase;">Email</td></tr>
            <tr><td style="padding:0 0 18px;font-size:18px;color:#0a0a0a;">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:0 0 14px;font-size:13px;font-weight:700;color:#737373;text-transform:uppercase;">Phone number</td></tr>
            <tr><td style="padding:0 0 18px;font-size:18px;color:#0a0a0a;">${escapeHtml(phone || 'Not provided')}</td></tr>
            <tr><td style="padding:0 0 14px;font-size:13px;font-weight:700;color:#737373;text-transform:uppercase;">Company</td></tr>
            <tr><td style="padding:0;font-size:18px;color:#0a0a0a;">${escapeHtml(company || 'Not provided')}</td></tr>
          </table>
        </div>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: bookingFromEmail,
        to: bookingToEmail,
        reply_to: email,
        subject,
        html,
        text: [
          'New strategy call request',
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone number: ${phone || 'Not provided'}`,
          `Company: ${company || 'Not provided'}`,
        ].join('\n'),
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(500).json({
        error: result?.message || 'Unable to send strategy call request',
      });
    }

    return res.status(200).json({ ok: true, id: result?.id || null });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Unable to send strategy call request',
    });
  }
}
