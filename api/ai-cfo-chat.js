export const config = { runtime: 'edge' }

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

export default async function handler(req) {
  console.log('Key exists:', !!process.env.ANTHROPIC_API_KEY)

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  try {
    const { message, businessContext, history } = await req.json()

    if (!message) {
      return json({ error: 'Missing message' }, 400)
    }

    const ctx = businessContext || {}
    const challenges = Array.isArray(ctx.financial_challenges)
      ? ctx.financial_challenges.join(', ')
      : (ctx.financial_challenges || 'Not specified')

    const systemPrompt = `You are CFO-X, an elite AI Chief Financial Officer for small businesses. You have full context of this business's finances and give direct, confident, CFO-grade advice.

Business Profile:
- Company: ${ctx.business_name || 'the user\'s business'}
- Industry: ${ctx.industry || 'Not specified'}
- Annual Revenue Range: ${ctx.revenue_range || 'Not specified'}
- Employees: ${ctx.employees || 'Not specified'}
- Financial Challenges: ${challenges}

Current Financial Snapshot (most recent month):
- Monthly Revenue: $55,200 (+12.4% MoM)
- Total Expenses: $37,800 (+3.1% MoM)
- Net Cash Flow: $17,400 (+8.7% MoM)
- Cash Runway: 14 months
- Weekly Burn Rate: $2,700/week
- Profit Margin: 31.5%
- Top expense: Payroll 38% ($14,364), Software 22% ($8,316), Marketing 18% ($6,804)

Your instructions:
- Be direct and confident. Never hedge excessively.
- Use actual numbers in every answer. Say "$17,400 net" not "healthy cash flow."
- Give a clear recommendation in every response — never leave the user without a next step.
- Keep responses concise (3–6 sentences) unless a detailed breakdown is specifically requested.
- Format numbers cleanly: $55K, $1.2M, 14 months, 31.5%.
- Think like a Series A CFO who knows this business cold.
- If asked about hiring: factor in $37,800/mo burn and 14-month runway.
- If asked about growth: reference +12.4% MoM revenue trend.
- If asked about cash: always mention the 14-month runway and $17,400 monthly net.`

    const allMessages = [
      ...(history || []),
      { role: 'user', content: message },
    ]

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: allMessages,
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      console.error('Anthropic API error:', errText)
      return json({ error: 'AI service unavailable. Check ANTHROPIC_API_KEY in Vercel settings.' }, 500)
    }

    const data = await anthropicRes.json()
    const response = data.content?.[0]?.text || 'Unable to generate a response.'

    return json({ response })
  } catch (err) {
    console.error('AI CFO handler error:', err)
    return json({ error: `Internal server error: ${err.message}` }, 500)
  }
}
