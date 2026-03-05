import { useState, useCallback } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { useAuth } from '../context/AuthContext'

export function useLinkToken() {
  const { user } = useAuth()
  const [linkToken, setLinkToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLinkToken = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/plaid-link-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setLinkToken(data.link_token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  return { linkToken, fetchLinkToken, loading, error }
}

export function usePlaidConnect({ linkToken, onSuccess }) {
  const { user } = useAuth()
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)

  const handleSuccess = useCallback(
    async (public_token, metadata) => {
      setConnecting(true)
      setError(null)
      try {
        const res = await fetch('/api/plaid-exchange-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            public_token,
            userId: user.id,
            institutionName: metadata?.institution?.name,
          }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        onSuccess?.()
      } catch (err) {
        setError(err.message)
      } finally {
        setConnecting(false)
      }
    },
    [user, onSuccess]
  )

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handleSuccess,
  })

  return { open, ready, connecting, error }
}

export function usePlaidTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTransactions = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/plaid-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setTransactions(data.transactions || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  return { transactions, fetchTransactions, loading, error }
}
