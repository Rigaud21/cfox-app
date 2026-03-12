import { createClient } from '@supabase/supabase-js'

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
    const { message, userId } = await req.json()

    if (!message || !userId) {
      return json({ error: 'Missing message or userId' }, 400)
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )

    const [{ data: profile }, { data: history }] = await Promise.all([
      supabase
        .from('business_profiles')
        .select('business_name, industry, revenue_range, financial_challenges, employees')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('ai_chat_history')
        .select('role, content')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10),
    ])

    const priorMessages = (history || []).reverse().map(h => ({ role: h.role, content: h.content }))
    const allMessages = [...priorMessages, { role: 'user', content: message }]

    const systemPrompt = `You are CFO-X, an elite AI Chief Financial Officer for small businesses. You have full context of this business's finances and give direct, confident, CFO-grade advice.

Business Profile:
- Company: ${profile?.business_name || 'the user\'s business'}
- Industry: ${profile?.industry || 'Not specified'}
- Annual Revenue Range: ${profile?.revenue_range || 'Not specified'}
- Employees: ${profile?.employees || 'Not specified'}
- Financial Challenges: ${Array.isArray(profile?.financial_challenges) ? profile.financial_challenges.join(', ') : (profile?.financial_challenges || 'Not specified')}

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
    const aiContent = data.content?.[0]?.text || 'Unable to generate a response.'

    // Save both messages
    await supabase.from('ai_chat_history').insert([
      { user_id: userId, role: 'user',      content: message   },
      { user_id: userId, role: 'assistant', content: aiContent },
    ])

    return json({ response: aiContent })
  } catch (err) {
    console.error('AI CFO handler error:', err)
    return json({ error: `Internal server error: ${err.message}` }, 500)
  }
}
