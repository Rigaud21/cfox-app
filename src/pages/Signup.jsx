import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.")
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // If email confirmation is required, show success message
      // Otherwise navigate directly to dashboard
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#161616] flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle size={48} className="text-[#C8FF00] mx-auto mb-4" />
          <h2 className="font-barlow-condensed font-black uppercase text-3xl text-white mb-2">
            Account Created!
          </h2>
          <p className="font-barlow text-white/40">Taking you to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#161616] flex items-center justify-center px-4 py-12">
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
            Create Account
          </h1>
          <p className="font-barlow text-sm text-white/40 mb-8">
            Get access to your AI-powered CFO dashboard.
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 border border-red-500/30 bg-red-500/10 px-4 py-3 mb-6">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="font-barlow text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Alex"
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Rivera"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                className="form-input"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="form-input"
              />
            </div>

            <div className="mb-8">
              <label className="form-label">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader size={15} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>

            <p className="font-barlow text-xs text-white/20 text-center mt-4">
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>

        <p className="text-center font-barlow text-sm text-white/30 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#C8FF00] hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
