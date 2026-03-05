import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'
import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { userId } = await req.json()

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )

  // Fetch stored access token
  const { data: conn, error: connErr } = await supabase
    .from('plaid_connections')
    .select('access_token')
    .eq('user_id', userId)
    .single()

  if (connErr || !conn) {
    return new Response(JSON.stringify({ error: 'No bank connected' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const plaidConfig = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  })

  const plaidClient = new PlaidApi(plaidConfig)

  try {
    const now = new Date()
    const start = new Date(now)
    start.setMonth(start.getMonth() - 3)

    const response = await plaidClient.transactionsGet({
      access_token: conn.access_token,
      start_date: start.toISOString().slice(0, 10),
      end_date: now.toISOString().slice(0, 10),
    })

    return new Response(JSON.stringify({ transactions: response.data.transactions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Plaid transactions error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
