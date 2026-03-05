import { Resend } from 'resend';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { firstName, email } = await req.json();

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'CFO-X <hello@cfox.miami>',
    to: email,
    subject: "You're on the CFO-X waitlist 🟢",
    html: `
      <div style="background:#161616;padding:48px;font-family:sans-serif;">
        <h1 style="color:#C8FF00;font-size:48px;margin:0 0 8px;">
          You're In, ${firstName}.
        </h1>
        <p style="color:#aaa;font-size:18px;margin:0 0 32px;">
          Welcome to the CFO-X early access list.
        </p>
        <p style="color:#ccc;font-size:16px;line-height:1.7;max-width:500px;">
          We're building the AI CFO every small business deserves —
          and you'll be first to know when we're ready. Expect updates
          on beta access, founding member pricing, and launch news.
        </p>
        <a href="https://cfox.miami"
           style="display:inline-block;margin-top:32px;background:#C8FF00;
           color:#000;padding:16px 40px;font-weight:900;font-size:16px;
           letter-spacing:2px;text-decoration:none;text-transform:uppercase;">
          → VISIT CFOX.MIAMI
        </a>
        <p style="color:#555;font-size:13px;margin-top:48px;border-top:1px solid #2e2e2e;padding-top:24px;">
          — The CFO-X Team · cfox.miami · Miami, Florida
        </p>
      </div>
    `
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
