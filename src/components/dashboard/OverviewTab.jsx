import { useMemo } from 'react'
import { DollarSign, TrendingDown, ArrowUpRight, Clock, Zap, Percent, Landmark } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell,
} from 'recharts'

const CASH_FLOW_DATA = [
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

const EXPENSE_CATS = [
  { name: 'Payroll',    pct: 38, amount: 14364, color: '#C8FF00', change:  2.1 },
  { name: 'Software',   pct: 22, amount:  8316, color: '#4dabf7', change: 11.3 },
  { name: 'Marketing',  pct: 18, amount:  6804, color: '#ff4d4d', change: -4.2 },
  { name: 'Operations', pct: 14, amount:  5292, color: '#f59f00', change: -1.8 },
  { name: 'Other',      pct:  8, amount:  3024, color: '#555555', change:  0.4 },
]

function computeFromTransactions(txns) {
  if (!txns?.length) return null
  const now = new Date()
  const cM = now.getMonth(), cY = now.getFullYear()
  const pM = cM === 0 ? 11 : cM - 1
  const pY = cM === 0 ? cY - 1 : cY

  function stats(m, y) {
    const t = txns.filter(t => { const d = new Date(t.date); return d.getMonth() === m && d.getFullYear() === y })
    const income   = t.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
    const expenses = t.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
    return { income, expenses, net: income - expenses }
  }

  const c = stats(cM, cY), p = stats(pM, pY)
  const pct = (a, b) => !b ? '—' : `${((a - b) / b * 100) >= 0 ? '+' : ''}${((a - b) / b * 100).toFixed(1)}%`

  return {
    revenue: c.income, expenses: c.expenses, net: c.net,
    revChange: pct(c.income, p.income),
    expChange: pct(c.expenses, p.expenses),
    netChange:  pct(c.net, p.net),
    runway:      c.expenses > 0 ? Math.round((c.expenses * 14) / c.expenses) : 14,
    burnRate:    c.expenses > 0 ? Math.round(c.expenses / 4) : 2700,
    profitMargin: c.income  > 0 ? ((c.net / c.income) * 100).toFixed(1) : 31.5,
  }
}

function fmt$(n) {
  if (!n && n !== 0) return '$0'
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000)    return `$${(n / 1000).toFixed(1)}K`
  return `$${Number(n).toFixed(0)}`
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] border border-[#C8FF00]/20 p-3 min-w-[160px]">
      <p className="font-barlow-condensed font-bold text-xs uppercase tracking-widest text-[#C8FF00] mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="font-barlow text-xs text-white/50 capitalize">{p.dataKey}</span>
          </div>
          <span className="font-barlow-condensed font-bold text-sm text-white">${(p.value / 1000).toFixed(0)}K</span>
        </div>
      ))}
    </div>
  )
}

export default function OverviewTab({ bankConnected, transactions, onConnectBank }) {
  const kpis = useMemo(() => {
    const live = bankConnected ? computeFromTransactions(transactions) : null
    return live || {
      revenue: 55200, expenses: 37800, net: 17400,
      revChange: '+12.4%', expChange: '+3.1%', netChange: '+8.7%',
      runway: 14, burnRate: 2700, profitMargin: 31.5,
    }
  }, [bankConnected, transactions])

  const cards = [
    { label: 'Monthly Revenue', value: fmt$(kpis.revenue), change: kpis.revChange, good: !String(kpis.revChange).startsWith('-'), icon: DollarSign },
    { label: 'Total Expenses',  value: fmt$(kpis.expenses), change: kpis.expChange, good: String(kpis.expChange).startsWith('-'), icon: TrendingDown },
    { label: 'Net Cash Flow',   value: fmt$(kpis.net),      change: kpis.netChange,  good: !String(kpis.netChange).startsWith('-'),  icon: ArrowUpRight },
    { label: 'Runway',          value: `${kpis.runway} months`, change: 'Healthy', good: true, icon: Clock },
    { label: 'Burn Rate',       value: `$${Number(kpis.burnRate).toLocaleString()}/wk`, change: '+5.2%', good: false, icon: Zap },
    { label: 'Profit Margin',   value: `${kpis.profitMargin}%`, change: '+2.1pts', good: true, icon: Percent },
  ]

  const avgIncome   = Math.round(CASH_FLOW_DATA.reduce((s, d) => s + d.income,   0) / CASH_FLOW_DATA.length)
  const avgExpenses = Math.round(CASH_FLOW_DATA.reduce((s, d) => s + d.expenses, 0) / CASH_FLOW_DATA.length)
  const avgNet      = Math.round(CASH_FLOW_DATA.reduce((s, d) => s + d.net,      0) / CASH_FLOW_DATA.length)
  const totalExp    = EXPENSE_CATS.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-6">
      {/* Demo banner */}
      {!bankConnected && (
        <div className="flex items-center justify-between border border-[#C8FF00]/20 bg-[#C8FF00]/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C8FF00] flex-shrink-0" />
            <span className="font-barlow text-sm text-white/60">
              Viewing <span className="text-white font-semibold">demo data</span>. Connect your bank for real-time financial intelligence.
            </span>
          </div>
          <button
            onClick={onConnectBank}
            className="flex items-center gap-2 font-barlow-condensed font-bold uppercase text-xs tracking-wider text-[#C8FF00] hover:text-white transition-colors flex-shrink-0 ml-4"
          >
            <Landmark size={12} />
            Connect Your Bank →
          </button>
        </div>
      )}

      {/* KPI Grid */}
      <div>
        <h2 className="font-barlow-condensed font-black uppercase text-xl text-white mb-3">
          Overview
          {bankConnected && (
            <span className="ml-3 inline-flex items-center gap-1.5 font-barlow-condensed font-bold text-[10px] uppercase tracking-wider text-[#C8FF00] bg-[#C8FF00]/10 px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
              Live Data
            </span>
          )}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-[#2e2e2e]">
          {cards.map(({ label, value, change, good, icon: Icon }) => (
            <div key={label} className="bg-[#1e1e1e] p-5 hover:bg-[#242424] transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <span className="font-barlow-condensed font-bold uppercase text-[10px] tracking-widest text-white/30">{label}</span>
                <Icon size={13} className="text-[#C8FF00]" />
              </div>
              <div className="font-barlow-condensed font-black text-2xl text-white leading-none mb-3">{value}</div>
              <span className={`inline-block font-barlow-condensed font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 ${good ? 'bg-[#C8FF00]/10 text-[#C8FF00]' : 'bg-red-500/10 text-red-400'}`}>
                {change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-barlow-condensed font-black uppercase text-xl text-white">Cash Flow</h3>
            <p className="font-barlow text-xs text-white/30 mt-0.5">Jul 2025 – Mar 2026 · Forecast from Dec</p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            {[['Income', '#C8FF00'], ['Expenses', '#ff4d4d'], ['Net', '#4dabf7']].map(([lbl, color]) => (
              <div key={lbl} className="flex items-center gap-1.5">
                <span className="w-3 h-0.5" style={{ backgroundColor: color }} />
                <span className="font-barlow-condensed font-bold text-[10px] uppercase tracking-wider text-white/40">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={CASH_FLOW_DATA} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
            <defs>
              {[['ov-inc', '#C8FF00', 0.25], ['ov-exp', '#ff4d4d', 0.2], ['ov-net', '#4dabf7', 0.2]].map(([id, color, op]) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={op} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 11, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} width={42} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#2e2e2e', strokeWidth: 1 }} />
            <ReferenceLine x="Dec" stroke="#3e3e3e" strokeDasharray="4 4" label={{ value: 'Forecast ›', fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"' }} />
            <Area type="monotone" dataKey="income"   stroke="#C8FF00" strokeWidth={2} fill="url(#ov-inc)" dot={false} activeDot={{ r: 4, fill: '#C8FF00', strokeWidth: 0 }} />
            <Area type="monotone" dataKey="expenses" stroke="#ff4d4d" strokeWidth={2} fill="url(#ov-exp)" dot={false} activeDot={{ r: 4, fill: '#ff4d4d', strokeWidth: 0 }} />
            <Area type="monotone" dataKey="net"      stroke="#4dabf7" strokeWidth={2} fill="url(#ov-net)" dot={false} activeDot={{ r: 4, fill: '#4dabf7', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-px bg-[#2e2e2e] mt-4">
          {[['Avg Income', `$${(avgIncome / 1000).toFixed(1)}K`, '#C8FF00'], ['Avg Expenses', `$${(avgExpenses / 1000).toFixed(1)}K`, '#ff4d4d'], ['Net Flow', `$${(avgNet / 1000).toFixed(1)}K`, '#4dabf7']].map(([lbl, val, color]) => (
            <div key={lbl} className="bg-[#161616] px-4 py-3 text-center">
              <p className="font-barlow-condensed font-black text-lg" style={{ color }}>{val}</p>
              <p className="font-barlow text-[10px] text-white/30 uppercase tracking-wider">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5 sm:p-6">
        <div className="mb-6">
          <h3 className="font-barlow-condensed font-black uppercase text-xl text-white">Expense Breakdown</h3>
          <p className="font-barlow text-xs text-white/30 mt-0.5">Current month · Total ${(totalExp / 1000).toFixed(1)}K</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          <div className="relative flex-shrink-0">
            <PieChart width={200} height={200}>
              <Pie data={EXPENSE_CATS} cx="50%" cy="50%" innerRadius={58} outerRadius={90} paddingAngle={2} dataKey="pct" stroke="none">
                {EXPENSE_CATS.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-barlow-condensed font-black text-lg text-white leading-none">${(totalExp / 1000).toFixed(1)}K</span>
              <span className="font-barlow text-[10px] text-white/30 uppercase tracking-wider">Total</span>
            </div>
          </div>
          <div className="flex-1 w-full space-y-4">
            {EXPENSE_CATS.map(e => (
              <div key={e.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                    <span className="font-barlow-condensed font-bold uppercase text-xs tracking-wider text-white/60">{e.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-barlow-condensed font-black text-sm" style={{ color: e.color }}>${e.amount.toLocaleString()}</span>
                    <span className={`font-barlow-condensed font-bold text-[10px] uppercase px-1.5 py-0.5 ${e.change > 0 ? 'bg-red-500/10 text-red-400' : 'bg-[#C8FF00]/10 text-[#C8FF00]'}`}>
                      {e.change > 0 ? '+' : ''}{e.change}%
                    </span>
                  </div>
                </div>
                <div className="h-1 bg-[#2e2e2e] w-full">
                  <div className="h-full transition-all duration-700" style={{ width: `${e.pct}%`, backgroundColor: e.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
