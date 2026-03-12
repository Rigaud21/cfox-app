import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { message, userId } = await req.json()

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )

  const [{ data: profile }, { data: history }] = await Promise.all([
    supabase
      .from('business_profiles')
      .select('business_name, industry, revenue_range, goal, employee_count')
      .eq('user_id', userId)
      .single(),
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
- Employees: ${profile?.employee_count || 'Not specified'}
- Primary Financial Goal: ${profile?.goal || 'Not specified'}

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

  let aiContent = ''

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: allMessages,
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      console.error('Anthropic API error:', errText)
      return new Response(
        JSON.stringify({ error: 'AI service unavailable. Check ANTHROPIC_API_KEY in Vercel settings.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await anthropicRes.json()
    aiContent = data.content?.[0]?.text || 'Unable to generate a response.'
  } catch (err) {
    console.error('AI CFO error:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to reach AI service.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Save both messages
  await supabase.from('ai_chat_history').insert([
    { user_id: userId, role: 'user',      content: message   },
    { user_id: userId, role: 'assistant', content: aiContent },
  ])

  return new Response(JSON.stringify({ response: aiContent }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
