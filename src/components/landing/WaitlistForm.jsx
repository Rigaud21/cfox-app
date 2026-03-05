import { useState } from 'react'
import { CheckCircle, ArrowRight, Loader, AlertCircle } from 'lucide-react'
import { supabase } from '../../supabaseClient'

const industries = [
  'Technology', 'Retail & E-commerce', 'Healthcare', 'Professional Services',
  'Manufacturing', 'Food & Beverage', 'Construction', 'Finance & Insurance',
  'Real Estate', 'Education', 'Media & Entertainment', 'Other',
]

const revenueRanges = [
  'Less than $100K', '$100K – $500K', '$500K – $1M',
  '$1M – $5M', '$5M – $10M', '$10M+',
]

const accountingTools = [
  'QuickBooks Online', 'QuickBooks Desktop', 'Xero', 'FreshBooks',
  'Wave', 'Sage', 'NetSuite', 'Spreadsheets (Excel / Google Sheets)',
  'None', 'Other',
]

const initialForm = {
  firstName: '', lastName: '', email: '', phone: '',
  businessName: '', industry: '', revenueRange: '', accountingTool: '',
}

export default function WaitlistForm() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.businessName.trim()) e.businessName = 'Required'
    if (!form.industry) e.industry = 'Required'
    if (!form.revenueRange) e.revenueRange = 'Required'
    if (!form.accountingTool) e.accountingTool = 'Required'
    return e
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: null }))
    if (submitError) setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setSubmitError(null)

    const { error } = await supabase.from('waitlist').insert([{
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      business_name: form.businessName.trim(),
      industry: form.industry,
      revenue_range: form.revenueRange,
      accounting_tool: form.accountingTool,
    }])

    if (!error) {
      await fetch('/api/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          email: form.email.trim().toLowerCase(),
        }),
      })
    }

    setLoading(false)

    if (error) {
      // Postgres unique violation code
      if (error.code === '23505') {
        setSubmitError("You're already on the waitlist with that email. We'll be in touch soon!")
      } else {
        setSubmitError('Something went wrong. Please try again in a moment.')
        console.error('Supabase error:', error)
      }
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="waitlist" className="py-24 sm:py-32 border-t border-[#2e2e2e]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <CheckCircle size={48} className="text-[#C8FF00] mx-auto mb-6" />
          <h2 className="font-barlow-condensed font-black uppercase text-5xl sm:text-6xl text-white mb-4 leading-none">
            You're In,{' '}
            <span className="text-[#C8FF00]">{form.firstName}!</span>
          </h2>
          <p className="font-barlow text-white/50 text-lg leading-relaxed max-w-xl mx-auto">
            Thank you for joining the CFO-X waitlist. We'll keep you updated with everything
            that's coming — early access, launch news, and founding member perks. Stay tuned,
            this is just the beginning.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="waitlist" className="py-24 sm:py-32 border-t border-[#2e2e2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: copy */}
          <div className="lg:sticky lg:top-24">
            <p className="font-barlow-condensed font-bold text-xs uppercase tracking-[0.3em] text-[#C8FF00] mb-3">
              Early Access
            </p>
            <h2 className="font-barlow-condensed font-black uppercase text-5xl sm:text-6xl text-white leading-none mb-6">
              Get in before{' '}
              <span className="text-[#C8FF00]">everyone else.</span>
            </h2>
            <p className="font-barlow text-white/40 leading-relaxed mb-8 max-w-sm">
              CFO-X is invite-only during beta. Join the waitlist and be among the first small businesses to access AI-powered financial intelligence.
            </p>
            <div className="space-y-4">
              {[
                'Free 60-day beta access',
                'Locked-in founder pricing',
                'Priority onboarding + setup',
                'Direct line to the product team',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <ArrowRight size={14} className="text-[#C8FF00] flex-shrink-0" />
                  <span className="font-barlow text-sm text-white/60">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="border border-[#2e2e2e] p-6 sm:p-8 bg-[#1e1e1e]">

              {/* Submit error banner */}
              {submitError && (
                <div className="flex items-start gap-3 border border-red-500/30 bg-red-500/10 px-4 py-3 mb-6">
                  <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="font-barlow text-sm text-red-400 leading-relaxed">{submitError}</p>
                </div>
              )}

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label">First Name</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Alex"
                    className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Rivera"
                    className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="form-label">Work Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alex@yourcompany.com"
                  className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="form-label">Phone <span className="text-white/20 normal-case font-barlow font-normal text-xs tracking-normal">(optional)</span></label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="form-input"
                />
              </div>

              {/* Business name */}
              <div className="mb-4">
                <label className="form-label">Business Name</label>
                <input
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className={`form-input ${errors.businessName ? 'border-red-500' : ''}`}
                />
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
              </div>

              {/* Industry */}
              <div className="mb-4">
                <label className="form-label">Industry</label>
                <select
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className={`form-input appearance-none cursor-pointer ${errors.industry ? 'border-red-500' : ''}`}
                >
                  <option value="" disabled>Select your industry</option>
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
                {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
              </div>

              {/* Revenue range */}
              <div className="mb-4">
                <label className="form-label">Annual Revenue Range</label>
                <select
                  name="revenueRange"
                  value={form.revenueRange}
                  onChange={handleChange}
                  className={`form-input appearance-none cursor-pointer ${errors.revenueRange ? 'border-red-500' : ''}`}
                >
                  <option value="" disabled>Select revenue range</option>
                  {revenueRanges.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.revenueRange && <p className="text-red-500 text-xs mt-1">{errors.revenueRange}</p>}
              </div>

              {/* Current accounting tool */}
              <div className="mb-8">
                <label className="form-label">Current Accounting Tool</label>
                <select
                  name="accountingTool"
                  value={form.accountingTool}
                  onChange={handleChange}
                  className={`form-input appearance-none cursor-pointer ${errors.accountingTool ? 'border-red-500' : ''}`}
                >
                  <option value="" disabled>Select your tool</option>
                  {accountingTools.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.accountingTool && <p className="text-red-500 text-xs mt-1">{errors.accountingTool}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Saving your spot...
                  </>
                ) : (
                  <>
                    Join the Waitlist <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-white/20 font-barlow mt-4">
                No spam. No credit card. Unsubscribe anytime.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
