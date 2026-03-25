import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, DollarSign, Bot, Target,
  AlertTriangle, Settings, LogOut, Menu, X, Bell,
  Landmark, Loader, ChevronDown, User, Wallet,
} from 'lucide-react'
import { useAuth }           from '../context/AuthContext'
import { useTheme }          from '../context/ThemeContext'
import { supabase }          from '../supabaseClient'
import { useLinkToken, usePlaidConnect } from '../hooks/usePlaid'
import OverviewTab   from '../components/dashboard/OverviewTab'
import CashFlowTab   from '../components/dashboard/CashFlowTab'
import ExpensesTab   from '../components/dashboard/ExpensesTab'
import AICFOChat     from '../components/dashboard/AICFOChat'
import ScenariosTab   from '../components/dashboard/ScenariosTab'
import SmartMoneyTab  from '../components/dashboard/SmartMoneyTab'
import AlertsTab      from '../components/dashboard/AlertsTab'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview'  },
  { icon: TrendingUp,      label: 'Cash Flow' },
  { icon: DollarSign,      label: 'Expenses'  },
  { icon: Bot,             label: 'AI CFO'    },
  { icon: Target,          label: 'Scenarios'    },
  { icon: Wallet,          label: 'Smart Money'  },
  { icon: AlertTriangle,   label: 'Alerts'       },
  { icon: Settings,        label: 'Settings'  },
]

const DATE_RANGES = [
  { value: '30d',  label: '30 Days'   },
  { value: '90d',  label: '90 Days'   },
  { value: '12mo', label: '12 Months' },
]

const ALERTS_COUNT = 3 // 1 critical + 2 warnings

/* ─── Sidebar ────────────────────────────────────────────────── */
function Sidebar({ active, setActive, open, setOpen, user, profile, onSignOut, bankConnected, onConnectBank }) {
  const email     = user?.email ?? ''
  const firstName = user?.user_metadata?.first_name ?? email.split('@')[0] ?? ''
  const initials  = (firstName.charAt(0) + (user?.user_metadata?.last_name?.charAt(0) || '')).toUpperCase() || firstName.charAt(0).toUpperCase()

  const content = (
    <>
      {/* Logo + close */}
      <div className="px-5 py-4 border-b border-[#2e2e2e] flex items-center justify-between">
        <Link to="/" className="font-barlow-condensed font-black text-xl">
          <span className="text-[#C8FF00]">CFO</span><span className="text-white">-X</span>
        </Link>
        <button className="lg:hidden text-white/40 hover:text-white transition-colors" onClick={() => setOpen(false)}>
          <X size={18} />
        </button>
      </div>

      {/* Business name + connection status */}
      <div className="px-4 py-3 border-b border-[#2e2e2e]">
        {profile?.business_name && (
          <p className="font-barlow-condensed font-black uppercase text-xs text-white/80 truncate mb-1.5">
            {profile.business_name}
          </p>
        )}
        {bankConnected ? (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
            <span className="font-barlow-condensed font-bold uppercase text-[9px] tracking-wider text-[#C8FF00]">Bank Connected · Live Data</span>
          </div>
        ) : (
          <button
            onClick={onConnectBank}
            className="flex items-center gap-1.5 group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="font-barlow-condensed font-bold uppercase text-[9px] tracking-wider text-red-400 group-hover:text-white transition-colors">
              Connect Bank →
            </span>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label }) => {
          const isActive = active === label
          return (
            <button
              key={label}
              onClick={() => { setActive(label); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors relative ${
                isActive ? 'bg-[#C8FF00]/10 text-[#C8FF00]' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="font-barlow-condensed font-bold uppercase text-xs tracking-wider">{label}</span>
              {label === 'Alerts' && ALERTS_COUNT > 0 && (
                <span className="ml-auto w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                  {ALERTS_COUNT}
                </span>
              )}
              {isActive && <span className="absolute right-0 top-1 bottom-1 w-0.5 bg-[#C8FF00]" />}
            </button>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-3 border-t border-[#2e2e2e] space-y-1">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-7 h-7 bg-[#C8FF00] flex items-center justify-center flex-shrink-0">
            <span className="font-barlow-condensed font-black text-xs text-[#161616]">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="font-barlow-condensed font-bold text-xs text-white uppercase truncate">{firstName}</p>
            <p className="font-barlow text-[10px] text-white/30 truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-white/30 hover:text-red-400 transition-colors"
        >
          <LogOut size={14} />
          <span className="font-barlow-condensed font-bold uppercase text-xs tracking-wider">Sign Out</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      <aside className="sidebar-dark hidden lg:flex flex-col w-56 flex-shrink-0 h-screen sticky top-0 border-r border-[#2e2e2e] bg-[#1e1e1e]">
        {content}
      </aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="sidebar-dark w-60 h-full bg-[#1e1e1e] border-r border-[#2e2e2e] flex flex-col">{content}</div>
          <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}

/* ─── Top Bar ────────────────────────────────────────────────── */
function TopBar({ greeting, firstName, profile, dateRange, setDateRange, setActive, onMenuOpen, darkMode, toggleDarkMode }) {
  const [rangeOpen, setRangeOpen] = useState(false)
  const currentRange = DATE_RANGES.find(r => r.value === dateRange)

  return (
    <header className="flex-shrink-0 h-14 border-b border-[#2e2e2e] bg-[#161616] flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-white/40 hover:text-white transition-colors mr-1" onClick={onMenuOpen}>
          <Menu size={20} />
        </button>
        <div>
          <p className="font-barlow-condensed font-black uppercase text-sm text-white leading-none">
            {greeting}, {firstName}.
            {profile?.business_name && (
              <span className="text-white/30 font-normal ml-2 hidden sm:inline">
                {profile.business_name}
              </span>
            )}
          </p>
          <p className="font-barlow text-[10px] text-white/20 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date range selector */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setRangeOpen(v => !v)}
            className="flex items-center gap-1.5 border border-[#2e2e2e] px-3 py-1.5 font-barlow-condensed font-bold uppercase text-[10px] tracking-wider text-white/50 hover:text-white transition-colors"
          >
            {currentRange?.label}
            <ChevronDown size={11} />
          </button>
          {rangeOpen && (
            <div className="absolute right-0 top-full mt-1 border border-[#2e2e2e] bg-[#1e1e1e] z-10 min-w-[120px]">
              {DATE_RANGES.map(r => (
                <button
                  key={r.value}
                  onClick={() => { setDateRange(r.value); setRangeOpen(false) }}
                  className={`w-full text-left px-3 py-2 font-barlow-condensed font-bold uppercase text-[10px] tracking-wider transition-colors ${
                    dateRange === r.value ? 'text-[#C8FF00] bg-[#C8FF00]/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-sm leading-none">{darkMode ? '🌙' : '☀️'}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={!darkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider" />
          </label>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setActive('Alerts')}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <Bell size={18} />
          </button>
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
            {ALERTS_COUNT}
          </span>
        </div>

        {/* Avatar */}
        <div className="w-7 h-7 bg-[#C8FF00] flex items-center justify-center">
          <span className="font-barlow-condensed font-black text-xs text-[#161616]">
            {(firstName?.charAt(0) || 'U').toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}

/* ─── Settings section (inline) ─────────────────────────────── */
function SettingsSection({ user, profile }) {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="font-barlow-condensed font-black uppercase text-2xl text-white">Settings</h2>
        <p className="font-barlow text-xs text-white/30 mt-0.5">Account & preferences</p>
      </div>
      <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-6 space-y-4">
        <h3 className="font-barlow-condensed font-black uppercase text-base text-white mb-4">Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">First Name</label>
            <input className="form-input" defaultValue={user?.user_metadata?.first_name || ''} readOnly />
          </div>
          <div>
            <label className="form-label">Last Name</label>
            <input className="form-input" defaultValue={user?.user_metadata?.last_name || ''} readOnly />
          </div>
        </div>
        <div>
          <label className="form-label">Email</label>
          <input className="form-input" defaultValue={user?.email || ''} readOnly />
        </div>
        <p className="font-barlow text-xs text-white/30 italic">Profile editing coming in the next release.</p>
      </div>
      {profile && (
        <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-6 space-y-4">
          <h3 className="font-barlow-condensed font-black uppercase text-base text-white mb-4">Business</h3>
          <div className="space-y-3">
            {[
              ['Business Name', profile.business_name],
              ['Industry',      profile.industry],
              ['Revenue Range', profile.revenue_range],
              ['Team Size',     profile.employee_count],
              ['Primary Goal',  profile.goal],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-[#2e2e2e] pb-3 last:border-0">
                <span className="font-barlow-condensed font-bold uppercase text-[10px] tracking-wider text-white/30">{label}</span>
                <span className="font-barlow text-sm text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
export default function Dashboard() {
  const { user, signOut }  = useAuth()
  const navigate           = useNavigate()
  const [active,           setActive]           = useState('Overview')
  const [sidebarOpen,      setSidebarOpen]      = useState(false)
  const [profile,          setProfile]          = useState(null)
  const [bankConnected,    setBankConnected]    = useState(false)
  const [transactions,     setTransactions]     = useState(null)
  const [dateRange,        setDateRange]        = useState('30d')
  const [checkingProfile,  setCheckingProfile]  = useState(true)
  const [pendingConnect,   setPendingConnect]   = useState(false)
  const { darkMode, toggleDarkMode } = useTheme()

  // Plaid
  const { linkToken, fetchLinkToken } = useLinkToken()

  const handleBankConnected = useCallback(async () => {
    setBankConnected(true)
    if (!user) return
    try {
      const res  = await fetch('/api/plaid-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const data = await res.json()
      if (!data.error) setTransactions(data.transactions || [])
    } catch {}
  }, [user])

  const { open: openPlaid, ready: plaidReady } = usePlaidConnect({
    linkToken,
    onSuccess: handleBankConnected,
  })

  // When token loads + we have a pending open, fire Plaid
  useEffect(() => {
    if (pendingConnect && plaidReady) {
      openPlaid()
      setPendingConnect(false)
    }
  }, [pendingConnect, plaidReady, openPlaid])

  const handleConnectBank = useCallback(async () => {
    if (plaidReady && linkToken) {
      openPlaid()
    } else {
      setPendingConnect(true)
      await fetchLinkToken()
    }
  }, [plaidReady, linkToken, openPlaid, fetchLinkToken])

  // Init: check profile + Plaid connection
  useEffect(() => {
    if (!user) return
    async function init() {
      const { data: prof } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!prof) {
        navigate('/onboarding')
        return
      }
      setProfile(prof)

      const { data: conn } = await supabase
        .from('plaid_connections')
        .select('item_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (conn) {
        setBankConnected(true)
        fetch('/api/plaid-transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        })
          .then(r => r.json())
          .then(d => { if (!d.error) setTransactions(d.transactions || []) })
          .catch(() => {})
      }

      setCheckingProfile(false)
    }
    init()
  }, [user, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  if (checkingProfile) {
    return (
      <div className="h-screen bg-[#161616] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C8FF00] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'there'
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex h-screen overflow-hidden bg-[#161616]">
      <Sidebar
        active={active}
        setActive={setActive}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        user={user}
        profile={profile}
        onSignOut={handleSignOut}
        bankConnected={bankConnected}
        onConnectBank={handleConnectBank}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          greeting={greeting}
          firstName={firstName}
          profile={profile}
          dateRange={dateRange}
          setDateRange={setDateRange}
          setActive={setActive}
          onMenuOpen={() => setSidebarOpen(true)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {active === 'Overview'  && <OverviewTab  bankConnected={bankConnected} transactions={transactions} profile={profile} dateRange={dateRange} onConnectBank={handleConnectBank} />}
            {active === 'Cash Flow' && <CashFlowTab  bankConnected={bankConnected} transactions={transactions} dateRange={dateRange} />}
            {active === 'Expenses'  && <ExpensesTab  bankConnected={bankConnected} transactions={transactions} />}
            {active === 'AI CFO'    && <AICFOChat    user={user} profile={profile} />}
            {active === 'Scenarios'    && <ScenariosTab   user={user} profile={profile} />}
            {active === 'Smart Money'  && <SmartMoneyTab  user={user} profile={profile} />}
            {active === 'Alerts'       && <AlertsTab      bankConnected={bankConnected} transactions={transactions} onTabChange={setActive} />}
            {active === 'Settings'  && <SettingsSection user={user} profile={profile} />}
          </div>
        </main>
      </div>
    </div>
  )
}
