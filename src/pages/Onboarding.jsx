import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight, Building2, DollarSign, Landmark, Sparkles, Loader } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useLinkToken, usePlaidConnect } from '../hooks/usePlaid'

const STEPS = ['Welcome', 'Business Profile', 'Financial Setup', 'Connect Bank', "You're Ready"]

const INDUSTRIES = [
  'Restaurant & Food Service',
  'Retail',
  'Professional Services',
  'Healthcare',
  'Construction & Trades',
  'Technology',
  'Real Estate',
  'E-commerce',
  'Hospitality',
  'Other',
]

const REVENUE_RANGES = [
  'Under $100K',
  '$100K – $500K',
  '$500K – $1M',
  '$1M – $5M',
  '$5M+',
]

const ACCOUNTING_TOOLS = [
  'QuickBooks Online',
  'QuickBooks Desktop',
  'Xero',
  'FreshBooks',
  'Wave',
  'Spreadsheets',
  'None / Manual',
]

// ── Step components ──────────────────────────────────────────────────────────

function StepWelcome({ user, onNext }) {
  const name = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'there'
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-[#C8FF00] flex items-center justify-center mx-auto mb-8">
        <Sparkles size={28} className="text-black" />
      </div>
      <h1 className="font-barlow-condensed font-black uppercase text-4xl text-white mb-3">
        Welcome, {name}.
      </h1>
      <p className="font-barlow text-white/50 text-base mb-10 max-w-sm mx-auto">
        Let's set up your CFO-X dashboard. It only takes 2 minutes and we'll personalize everything for your business.
      </p>
      <button onClick={onNext} className="btn-primary px-10 py-4 text-sm flex items-center gap-2 mx-auto">
        Let's Go <ArrowRight size={16} />
      </button>
    </div>
  )
}

function StepBusinessProfile({ data, onChange, onNext, onBack }) {
  const valid = data.businessName.trim() && data.industry
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-[#C8FF00]/10 border border-[#C8FF00]/30 flex items-center justify-center">
          <Building2 size={18} className="text-[#C8FF00]" />
        </div>
        <div>
          <h2 className="font-barlow-condensed font-black uppercase text-2xl text-white">Business Profile</h2>
          <p className="font-barlow text-xs text-white/40">Tell us about your company</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="form-label">Business Name</label>
          <input
            className="form-input"
            placeholder="Acme Corp"
            value={data.businessName}
            onChange={e => onChange('businessName', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Industry</label>
          <select
            className="form-input"
            value={data.industry}
            onChange={e => onChange('industry', e.target.value)}
          >
            <option value="">Select industry...</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Number of Employees</label>
          <select
            className="form-input"
            value={data.employeeCount}
            onChange={e => onChange('employeeCount', e.target.value)}
          >
            <option value="">Select range...</option>
            <option value="1">Just me</option>
            <option value="2-5">2–5</option>
            <option value="6-20">6–20</option>
            <option value="21-50">21–50</option>
            <option value="50+">50+</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="btn-ghost flex-1 py-3 text-sm">Back</button>
        <button onClick={onNext} disabled={!valid} className="btn-primary flex-1 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          Continue <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

function StepFinancialSetup({ data, onChange, onNext, onBack }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-[#C8FF00]/10 border border-[#C8FF00]/30 flex items-center justify-center">
          <DollarSign size={18} className="text-[#C8FF00]" />
        </div>
        <div>
          <h2 className="font-barlow-condensed font-black uppercase text-2xl text-white">Financial Setup</h2>
          <p className="font-barlow text-xs text-white/40">Help us calibrate your dashboard</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="form-label">Annual Revenue Range</label>
          <select
            className="form-input"
            value={data.revenueRange}
            onChange={e => onChange('revenueRange', e.target.value)}
          >
            <option value="">Select range...</option>
            {REVENUE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Current Accounting Tool</label>
          <select
            className="form-input"
            value={data.accountingTool}
            onChange={e => onChange('accountingTool', e.target.value)}
          >
            <option value="">Select tool...</option>
            {ACCOUNTING_TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Primary Financial Goal</label>
          <select
            className="form-input"
            value={data.goal}
            onChange={e => onChange('goal', e.target.value)}
          >
            <option value="">Select goal...</option>
            <option value="cash_flow">Improve Cash Flow</option>
            <option value="reduce_expenses">Reduce Expenses</option>
            <option value="grow_revenue">Grow Revenue</option>
            <option value="raise_capital">Raise Capital</option>
            <option value="profitability">Reach Profitability</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="btn-ghost flex-1 py-3 text-sm">Back</button>
        <button onClick={onNext} className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2">
          Continue <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

function StepConnectBank({ onNext, onBack, onSkip }) {
  const { linkToken, fetchLinkToken, loading: tokenLoading } = useLinkToken()
  const [bankConnected, setBankConnected] = useState(false)
  const [error, setError] = useState(null)

  const handleSuccess = () => {
    setBankConnected(true)
  }

  const { open, ready, connecting } = usePlaidConnect({
    linkToken,
    onSuccess: handleSuccess,
  })

  const handleConnect = async () => {
    if (!linkToken) {
      await fetchLinkToken()
    }
  }

  // Open Plaid once we have a token
  const handleOpenPlaid = () => {
    if (ready) open()
  }

  if (bankConnected) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#C8FF00] flex items-center justify-center">
            <CheckCircle size={18} className="text-black" />
          </div>
          <div>
            <h2 className="font-barlow-condensed font-black uppercase text-2xl text-white">Bank Connected!</h2>
            <p className="font-barlow text-xs text-white/40">Your account is linked securely</p>
          </div>
        </div>
        <p className="font-barlow text-sm text-white/50 mb-8">
          CFO-X will now sync your transactions and provide real-time financial intelligence.
        </p>
        <button onClick={onNext} className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2">
          Continue <ArrowRight size={15} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-[#C8FF00]/10 border border-[#C8FF00]/30 flex items-center justify-center">
          <Landmark size={18} className="text-[#C8FF00]" />
        </div>
        <div>
          <h2 className="font-barlow-condensed font-black uppercase text-2xl text-white">Connect Your Bank</h2>
          <p className="font-barlow text-xs text-white/40">Powered by Plaid — bank-level encryption</p>
        </div>
      </div>

      <div className="border border-[#2e2e2e] bg-[#242424] p-5 mb-6">
        <p className="font-barlow text-sm text-white/60 mb-3">
          Connecting your bank account lets CFO-X automatically:
        </p>
        <ul className="space-y-2">
          {['Track real-time cash flow', 'Categorize expenses automatically', 'Detect anomalies & overspending', 'Forecast your runway'].map(item => (
            <li key={item} className="flex items-center gap-2 font-barlow text-sm text-white/80">
              <div className="w-1.5 h-1.5 bg-[#C8FF00] rounded-full flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p className="font-barlow text-xs text-red-400 mb-4">{error}</p>
      )}

      <div className="space-y-3">
        {!linkToken ? (
          <button
            onClick={handleConnect}
            disabled={tokenLoading}
            className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {tokenLoading ? <><Loader size={15} className="animate-spin" /> Preparing...</> : <><Landmark size={15} /> Connect Bank Account</>}
          </button>
        ) : (
          <button
            onClick={handleOpenPlaid}
            disabled={!ready || connecting}
            className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {connecting ? <><Loader size={15} className="animate-spin" /> Connecting...</> : <><Landmark size={15} /> Open Bank Selector</>}
          </button>
        )}
        <button onClick={onSkip} className="w-full py-3 text-xs font-barlow text-white/30 hover:text-white/60 transition-colors">
          Skip for now — I'll connect later
        </button>
      </div>

      <button onClick={onBack} className="mt-4 text-xs font-barlow text-white/30 hover:text-white/60 transition-colors">
        ← Back
      </button>
    </div>
  )
}

function StepReady({ onFinish }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-[#C8FF00] flex items-center justify-center mx-auto mb-8">
        <CheckCircle size={36} className="text-black" />
      </div>
      <h1 className="font-barlow-condensed font-black uppercase text-4xl text-white mb-3">
        You're All Set.
      </h1>
      <p className="font-barlow text-white/50 text-base mb-10 max-w-sm mx-auto">
        Your CFO-X dashboard is ready. Start with your financial overview or explore the AI assistant.
      </p>
      <button onClick={onFinish} className="btn-primary px-10 py-4 text-sm mx-auto flex items-center gap-2">
        Go to Dashboard <ArrowRight size={16} />
      </button>
    </div>
  )
}

// ── Main Onboarding component ─────────────────────────────────────────────────

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    employeeCount: '',
    revenueRange: '',
    accountingTool: '',
    goal: '',
  })

  const updateField = (key, val) => setFormData(f => ({ ...f, [key]: val }))

  const saveProfile = async () => {
    setSaving(true)
    setSaveError(null)

    const payload = {
      user_id:               user.id,
      business_name:         formData.businessName,
      industry:              formData.industry,
      employees:             formData.employeeCount,
      revenue_range:         formData.revenueRange,
      accounting_tool:       formData.accountingTool,
      financial_challenges:  formData.goal,
    }

    // Check first — avoids needing a DB-level UNIQUE constraint for upsert
    const { data: existing } = await supabase
      .from('business_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    const { error } = existing
      ? await supabase.from('business_profiles').update(payload).eq('user_id', user.id)
      : await supabase.from('business_profiles').insert(payload)

    setSaving(false)

    if (error) {
      setSaveError(`Could not save your profile: ${error.message}. Please try again.`)
      return
    }

    setStep(s => s + 1)
  }

  const handleNext = () => {
    if (step === 2) {
      saveProfile()
    } else {
      setStep(s => s + 1)
    }
  }

  const handleBack = () => setStep(s => s - 1)

  // Profile was already saved at step 2 — just advance
  const handleSkipBank = () => setStep(4)

  return (
    <div className="min-h-screen bg-[#161616] flex flex-col items-center justify-center px-4 py-12">
      {/* Grid bg */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#C8FF00 1px, transparent 1px), linear-gradient(90deg, #C8FF00 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <span className="font-barlow-condensed font-black text-2xl">
            <span className="text-[#C8FF00]">CFO</span>
            <span className="text-white">-X</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-0.5 transition-all duration-300 ${i <= step ? 'bg-[#C8FF00]' : 'bg-[#2e2e2e]'}`}
              />
              <span className={`text-[10px] font-barlow-condensed font-bold uppercase tracking-wider transition-colors ${i === step ? 'text-[#C8FF00]' : i < step ? 'text-white/40' : 'text-white/20'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Step card */}
        <div className="border border-[#2e2e2e] bg-[#1e1e1e] p-8">
          {saveError && (
            <div className="flex items-start gap-3 border border-red-500/30 bg-red-500/10 px-4 py-3 mb-6">
              <span className="text-red-400 text-xs font-barlow leading-relaxed">{saveError}</span>
            </div>
          )}
          {step === 0 && <StepWelcome user={user} onNext={handleNext} />}
          {step === 1 && (
            <StepBusinessProfile
              data={formData}
              onChange={updateField}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 2 && (
            <StepFinancialSetup
              data={formData}
              onChange={updateField}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && (
            <StepConnectBank
              onNext={() => setStep(4)}
              onBack={handleBack}
              onSkip={handleSkipBank}
            />
          )}
          {step === 4 && <StepReady onFinish={() => navigate('/dashboard')} />}
        </div>
      </div>
    </div>
  )
}
