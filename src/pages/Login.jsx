import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader, AlertCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return (
    <div className="min-h-screen bg-[#161616] flex items-center justify-center px-4">
      {/* Grid bg */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#C8FF00 1px, transparent 1px), linear-gradient(90deg, #C8FF00 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex justify-center mb-10">
          <span className="font-barlow-condensed font-black text-3xl">
            <span className="text-[#C8FF00]">CFO</span>
            <span className="text-white">-X</span>
          </span>
        </Link>

        <div className="border border-[#2e2e2e] bg-[#1e1e1e] p-8">
          <h1 className="font-barlow-condensed font-black uppercase text-3xl text-white mb-1">
            Welcome Back
          </h1>
          <p className="font-barlow text-sm text-white/40 mb-8">
            Sign in to your CFO-X dashboard.
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 border border-red-500/30 bg-red-500/10 px-4 py-3 mb-6">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="font-barlow text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-[#2e2e2e] bg-[#161616] text-white/60 font-barlow-condensed font-bold uppercase text-xs tracking-wider py-3 hover:border-white/20 hover:text-white transition-colors mb-6"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#2e2e2e]" />
            <span className="font-barlow text-xs text-white/20">or</span>
            <div className="flex-1 h-px bg-[#2e2e2e]" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="form-input"
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input"
              />
            </div>

            <div className="flex justify-end mb-8">
              <button
                type="button"
                className="font-barlow text-xs text-white/30 hover:text-[#C8FF00] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader size={15} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center font-barlow text-sm text-white/30 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#C8FF00] hover:text-white transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
