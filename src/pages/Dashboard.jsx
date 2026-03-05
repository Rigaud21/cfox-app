import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, PieChart as PieIcon,
  Bot, Settings, LogOut, Menu, X,
  DollarSign, TrendingDown, ArrowUpRight, Clock, Zap, Percent,
  Landmark, Loader,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { useLinkToken, usePlaidConnect, usePlaidTransactions } from '../hooks/usePlaid'

/* ─── Demo Data ──────────────────────────────────────────────── */
const cashFlowData = [
  { month: 'Jul', income: 45000, expenses: 32000, net: 13000 },
  { month: 'Aug', income: 50000, expenses: 35000, net: 15000 },
  { month: 'Sep', income: 47000, expenses: 33000, net: 14000 },
  { month: 'Oct', income: 55000, expenses: 38000, net: 17000 },
  { month: 'Nov', income: 57000, expenses: 36000, net: 21000 },
  { month: 'Dec', income: 63000, expenses: 43000, net: 20000 },
  { month: 'Jan', income: 54000, expenses: 40000, net: 14000 },
  { month: 'Feb', income: 58000, expenses: 41000, net: 17000 },
  { month: 'Mar', income: 61000, expenses: 42000, net: 19000 },
]

const expenseData = [
  { name: 'Payroll',    pct: 38, amount: 14364, color: '#C8FF00', change: 2.1  },
  { name: 'Software',   pct: 22, amount: 8316,  color: '#4dabf7', change: 11.3 },
  { name: 'Marketing',  pct: 18, amount: 6804,  color: '#ff4d4d', change: -4.2 },
  { name: 'Operations', pct: 14, amount: 5292,  color: '#f59f00', change: -1.8 },
  { name: 'Other',      pct: 8,  amount: 3024,  color: '#555555', change: 0.4  },
]

const kpis = [
  { label: 'Monthly Revenue', value: '$55,200',   change: '+12.4%',  good: true,  icon: DollarSign   },
  { label: 'Total Expenses',  value: '$37,800',   change: '+3.1%',   good: false, icon: TrendingDown  },
  { label: 'Net Cash Flow',   value: '$17,400',   change: '+8.7%',   good: true,  icon: ArrowUpRight  },
  { label: 'Runway',          value: '14 months', change: 'Healthy', good: true,  icon: Clock         },
  { label: 'Burn Rate',       value: '$2,700/wk', change: '+5.2%',   good: false, icon: Zap           },
  { label: 'Profit Margin',   value: '31.5%',     change: '+2.1pts', good: true,  icon: Percent       },
]

const navItems = [
  { icon: LayoutDashboard, label: 'Overview'  },
  { icon: TrendingUp,      label: 'Cash Flow' },
  { icon: PieIcon,         label: 'Expenses'  },
  { icon: Bot,             label: 'AI CFO'    },
  { icon: Settings,        label: 'Settings'  },
]

/* ─── Chart Tooltip ──────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1e1e1e] border border-[#C8FF00]/20 p-3 min-w-[160px]">
      <p className="font-barlow-condensed font-bold text-xs uppercase tracking-widest text-[#C8FF00] mb-2">
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="font-barlow text-xs text-white/50 capitalize">{p.dataKey}</span>
          </div>
          <span className="font-barlow-condensed font-bold text-sm text-white">
            ${(p.value / 1000).toFixed(0)}K
          </span>
        </div>
      ))}
    </div>
  )
}

/* ─── Connect Bank Button ────────────────────────────────────── */
function ConnectBankButton({ onConnected }) {
  const { linkToken, fetchLinkToken, loading: tokenLoading } = useLinkToken()
  const [step, setStep] = useState('idle') // idle | fetching | ready

  const { open, ready, connecting } = usePlaidConnect({
    linkToken,
    onSuccess: () => {
      onConnected?.()
      setStep('idle')
    },
  })

  const handleClick = async () => {
    if (!linkToken) {
      setStep('fetching')
      await fetchLinkToken()
      setStep('ready')
    } else {
      open()
    }
  }

  useEffect(() => {
    if (step === 'ready' && ready) {
      open()
      setStep('idle')
    }
  }, [step, ready, open])

  return (
    <button
      onClick={handleClick}
      disabled={tokenLoading || connecting}
      className="flex items-center gap-2 border border-[#C8FF00]/30 bg-[#C8FF00]/5 hover:bg-[#C8FF00]/10 text-[#C8FF00] font-barlow-condensed font-bold uppercase text-[10px] tracking-wider px-3 py-1.5 transition-colors disabled:opacity-50"
    >
      {tokenLoading || connecting
        ? <Loader size={12} className="animate-spin" />
        : <Landmark size={12} />
      }
      <span className="hidden sm:inline">Connect Bank</span>
    </button>
  )
}

/* ─── Sidebar ────────────────────────────────────────────────── */
function Sidebar({ active, setActive, open, setOpen, user, onSignOut, businessName }) {
  const email = user?.email ?? ''
  const firstName = user?.user_metadata?.first_name ?? email.split('@')[0] ?? ''

  const content = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#2e2e2e] flex items-center justify-between">
        <Link to="/" className="font-barlow-condensed font-black text-xl">
          <span className="text-[#C8FF00]">CFO</span>
          <span className="text-white">-X</span>
        </Link>
        <button
          className="lg:hidden text-white/40 hover:text-white transition-colors"
          onClick={() => setOpen(false)}
        >
          <X size={18} />
        </button>
      </div>

      {businessName && (
        <div className="px-5 py-3 border-b border-[#2e2e2e]">
          <p className="font-barlow-condensed font-black uppercase text-xs text-white/70 truncate">
            {businessName}
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {navItems.map(({ icon: Icon, label }) => {
          const isActive = active === label
          return (
            <button
              key={label}
              onClick={() => { setActive(label); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                isActive
                  ? 'bg-[#C8FF00]/10 text-[#C8FF00]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="font-barlow-condensed font-bold uppercase text-xs tracking-wider">
                {label}
              </span>
              {isActive && <span className="ml-auto w-1 h-4 bg-[#C8FF00]" />}
            </button>
          )
        })}
      </nav>

      {/* User + Sign Out */}
      <div className="px-3 pb-4 border-t border-[#2e2e2e] pt-4 space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-7 h-7 bg-[#C8FF00] flex items-center justify-center flex-shrink-0">
            <span className="font-barlow-condensed font-black text-xs text-[#161616]">
              {firstName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-barlow-condensed font-bold text-xs text-white uppercase truncate">
              {firstName}
            </p>
            <p className="font-barlow text-[10px] text-white/30 truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-white/30 hover:text-red-400 transition-colors"
        >
          <LogOut size={14} />
          <span className="font-barlow-condensed font-bold uppercase text-xs tracking-wider">
            Sign Out
          </span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-52 flex-shrink-0 h-screen sticky top-0 border-r border-[#2e2e2e] bg-[#1e1e1e]">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-56 h-full bg-[#1e1e1e] border-r border-[#2e2e2e] flex flex-col">
            {content}
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}

/* ─── KPI Cards ──────────────────────────────────────────────── */
function KPIGrid({ bankConnected }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-barlow-condensed font-black uppercase text-xl text-white">Overview</h2>
        {!bankConnected && (
          <span className="font-barlow text-[10px] text-white/30 italic">Demo data — connect your bank for live metrics</span>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-[#2e2e2e]">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="bg-[#1e1e1e] p-5 hover:bg-[#242424] transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-barlow-condensed font-bold uppercase text-[10px] tracking-widest text-white/30">
                  {kpi.label}
                </span>
                <Icon size={13} className="text-[#C8FF00]" />
              </div>
              <div className="font-barlow-condensed font-black text-2xl text-white leading-none mb-3">
                {kpi.value}
              </div>
              <span
                className={`inline-block font-barlow-condensed font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                  kpi.good
                    ? 'bg-[#C8FF00]/10 text-[#C8FF00]'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {kpi.change}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Cash Flow Chart ────────────────────────────────────────── */
function CashFlowSection() {
  const fmt = (v) => `$${(v / 1000).toFixed(0)}K`
  const avgIncome   = Math.round(cashFlowData.reduce((s, d) => s + d.income, 0) / cashFlowData.length)
  const avgExpenses = Math.round(cashFlowData.reduce((s, d) => s + d.expenses, 0) / cashFlowData.length)
  const avgNet      = Math.round(cashFlowData.reduce((s, d) => s + d.net, 0) / cashFlowData.length)

  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5 sm:p-6">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-barlow-condensed font-black uppercase text-xl text-white">
            Cash Flow Projection
          </h3>
          <p className="font-barlow text-xs text-white/30 mt-0.5">
            Jul 2025 – Mar 2026 · Forecast from Dec
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          {[
            { label: 'Income',   color: '#C8FF00' },
            { label: 'Expenses', color: '#ff4d4d' },
            { label: 'Net',      color: '#4dabf7' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-3 h-0.5" style={{ backgroundColor: l.color }} />
              <span className="font-barlow-condensed font-bold text-[10px] uppercase tracking-wider text-white/40">
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={cashFlowData} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#C8FF00" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#C8FF00" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="gExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ff4d4d" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0}   />
            </linearGradient>
            <linearGradient id="gNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#4dabf7" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#4dabf7" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#555', fontSize: 11, fontFamily: '"Barlow Condensed"', fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            width={42}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#2e2e2e', strokeWidth: 1 }} />
          <ReferenceLine
            x="Dec"
            stroke="#3e3e3e"
            strokeDasharray="4 4"
            label={{ value: 'Forecast ›', fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"' }}
          />
          <Area type="monotone" dataKey="income"   stroke="#C8FF00" strokeWidth={2} fill="url(#gIncome)"   dot={false} activeDot={{ r: 4, fill: '#C8FF00', strokeWidth: 0 }} />
          <Area type="monotone" dataKey="expenses" stroke="#ff4d4d" strokeWidth={2} fill="url(#gExpenses)" dot={false} activeDot={{ r: 4, fill: '#ff4d4d', strokeWidth: 0 }} />
          <Area type="monotone" dataKey="net"      stroke="#4dabf7" strokeWidth={2} fill="url(#gNet)"      dot={false} activeDot={{ r: 4, fill: '#4dabf7', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-px bg-[#2e2e2e] mt-4">
        {[
          { label: 'Avg Income',   value: `$${(avgIncome / 1000).toFixed(1)}K`,   color: '#C8FF00' },
          { label: 'Avg Expenses', value: `$${(avgExpenses / 1000).toFixed(1)}K`, color: '#ff4d4d' },
          { label: 'Net Flow',     value: `$${(avgNet / 1000).toFixed(1)}K`,       color: '#4dabf7' },
        ].map((s) => (
          <div key={s.label} className="bg-[#161616] px-4 py-3 text-center">
            <p className="font-barlow-condensed font-black text-lg" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="font-barlow text-[10px] text-white/30 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Expense Breakdown ──────────────────────────────────────── */
function ExpenseSection() {
  const total = expenseData.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5 sm:p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-barlow-condensed font-black uppercase text-xl text-white">
            Expense Breakdown
          </h3>
          <p className="font-barlow text-xs text-white/30 mt-0.5">
            Current month · Total ${(total / 1000).toFixed(1)}K
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <PieChart width={200} height={200}>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={90}
              paddingAngle={2}
              dataKey="pct"
              stroke="none"
            >
              {expenseData.map((e) => (
                <Cell key={e.name} fill={e.color} />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-barlow-condensed font-black text-lg text-white leading-none">
              ${(total / 1000).toFixed(1)}K
            </span>
            <span className="font-barlow text-[10px] text-white/30 uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Rows */}
        <div className="flex-1 w-full space-y-4">
          {expenseData.map((e) => {
            const isIncrease = e.change > 0
            return (
              <div key={e.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                    <span className="font-barlow-condensed font-bold uppercase text-xs tracking-wider text-white/60">
                      {e.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-barlow-condensed font-black text-sm" style={{ color: e.color }}>
                      ${e.amount.toLocaleString()}
                    </span>
                    <span
                      className={`font-barlow-condensed font-bold text-[10px] uppercase px-1.5 py-0.5 ${
                        isIncrease ? 'bg-red-500/10 text-red-400' : 'bg-[#C8FF00]/10 text-[#C8FF00]'
                      }`}
                    >
                      {e.change > 0 ? '+' : ''}{e.change}%
                    </span>
                  </div>
                </div>
                <div className="h-1 bg-[#2e2e2e] w-full">
                  <div
                    className="h-full transition-all duration-700"
                    style={{ width: `${e.pct}%`, backgroundColor: e.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─── AI CFO Placeholder ─────────────────────────────────────── */
function AICFOSection() {
  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-6 flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-12 h-12 bg-[#C8FF00]/10 border border-[#C8FF00]/20 flex items-center justify-center mb-4">
        <Bot size={22} className="text-[#C8FF00]" />
      </div>
      <h3 className="font-barlow-condensed font-black uppercase text-xl text-white mb-2">AI CFO Assistant</h3>
      <p className="font-barlow text-sm text-white/40 text-center max-w-sm">
        Your AI CFO is being trained on your financial data. This feature will be available once you connect your bank account.
      </p>
    </div>
  )
}

/* ─── Settings Placeholder ───────────────────────────────────── */
function SettingsSection({ user }) {
  const firstName = user?.user_metadata?.first_name ?? ''
  const lastName = user?.user_metadata?.last_name ?? ''
  const email = user?.email ?? ''

  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-6">
      <h3 className="font-barlow-condensed font-black uppercase text-xl text-white mb-6">Account Settings</h3>
      <div className="space-y-4 max-w-sm">
        <div>
          <label className="form-label">First Name</label>
          <input className="form-input" defaultValue={firstName} readOnly />
        </div>
        <div>
          <label className="form-label">Last Name</label>
          <input className="form-input" defaultValue={lastName} readOnly />
        </div>
        <div>
          <label className="form-label">Email</label>
          <input className="form-input" defaultValue={email} readOnly />
        </div>
        <p className="font-barlow text-xs text-white/30">
          Profile editing coming soon.
        </p>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [bankConnected, setBankConnected] = useState(false)
  const [checkingProfile, setCheckingProfile] = useState(true)

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'there'

  // Check business profile and bank connection
  useEffect(() => {
    if (!user) return

    async function checkProfile() {
      const { data: profile } = await supabase
        .from('business_profiles')
        .select('business_name, onboarding_complete')
        .eq('user_id', user.id)
        .single()

      if (!profile || !profile.onboarding_complete) {
        navigate('/onboarding')
        return
      }

      setBusinessName(profile.business_name || '')

      const { data: conn } = await supabase
        .from('plaid_connections')
        .select('item_id')
        .eq('user_id', user.id)
        .single()

      setBankConnected(!!conn)
      setCheckingProfile(false)
    }

    checkProfile()
  }, [user, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (checkingProfile) {
    return (
      <div className="h-screen bg-[#161616] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C8FF00] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#161616]">
      <Sidebar
        active={active}
        setActive={setActive}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        user={user}
        onSignOut={handleSignOut}
        businessName={businessName}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-14 border-b border-[#2e2e2e] bg-[#161616] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-white/40 hover:text-white transition-colors mr-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="font-barlow-condensed font-black uppercase text-sm text-white leading-none">
                {greeting}, {firstName}.
              </p>
              <p className="font-barlow text-[10px] text-white/20 mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!bankConnected && (
              <ConnectBankButton onConnected={() => setBankConnected(true)} />
            )}
            {bankConnected && (
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
                <span className="font-barlow-condensed font-bold uppercase text-[10px] tracking-wider text-[#C8FF00] hidden sm:inline">
                  Bank Connected
                </span>
              </div>
            )}
            <div className="w-7 h-7 bg-[#C8FF00] flex items-center justify-center">
              <span className="font-barlow-condensed font-black text-xs text-[#161616]">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
            {active === 'Overview' && (
              <>
                <KPIGrid bankConnected={bankConnected} />
                <CashFlowSection />
                <ExpenseSection />
              </>
            )}
            {active === 'Cash Flow' && <CashFlowSection />}
            {active === 'Expenses' && <ExpenseSection />}
            {active === 'AI CFO' && <AICFOSection />}
            {active === 'Settings' && <SettingsSection user={user} />}
          </div>
        </main>
      </div>
    </div>
  )
}
