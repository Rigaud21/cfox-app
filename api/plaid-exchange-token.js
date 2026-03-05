import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'
import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { public_token, userId, institutionName } = await req.json()

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
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({ public_token })
    const accessToken = exchangeResponse.data.access_token
    const itemId = exchangeResponse.data.item_id

    // Save to Supabase (server-side client with service role or anon key)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )

    const { error } = await supabase
      .from('plaid_connections')
      .upsert({
        user_id: userId,
        access_token: accessToken,
        item_id: itemId,
        institution_name: institutionName || 'Bank',
        connected_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (error) throw new Error(error.message)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Plaid exchange token error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
