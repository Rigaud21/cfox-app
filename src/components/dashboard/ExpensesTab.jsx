import { useState, useMemo } from 'react'
import { Search, Download, AlertTriangle, Filter } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

const DEMO_TRANSACTIONS = [
  { id: '1',  date: '2026-03-10', merchant: 'ADP Payroll Services',  category: 'Payroll',    amount: 14364.00, status: 'cleared',  unusual: false },
  { id: '2',  date: '2026-03-08', merchant: 'Amazon Web Services',   category: 'Software',   amount:  1250.00, status: 'cleared',  unusual: false },
  { id: '3',  date: '2026-03-07', merchant: 'Meta Business Ads',     category: 'Marketing',  amount:  2100.00, status: 'cleared',  unusual: false },
  { id: '4',  date: '2026-03-05', merchant: 'WeWork',                category: 'Operations', amount:  2800.00, status: 'cleared',  unusual: false },
  { id: '5',  date: '2026-03-04', merchant: 'Slack Technologies',    category: 'Software',   amount:    87.25, status: 'cleared',  unusual: false },
  { id: '6',  date: '2026-03-03', merchant: 'Google Workspace',      category: 'Software',   amount:   180.00, status: 'cleared',  unusual: false },
  { id: '7',  date: '2026-03-01', merchant: 'QuickBooks',            category: 'Software',   amount:    35.00, status: 'cleared',  unusual: false },
  { id: '8',  date: '2026-02-28', merchant: 'Contractor – J. Chen',  category: 'Payroll',    amount:  3200.00, status: 'cleared',  unusual: false },
  { id: '9',  date: '2026-02-25', merchant: 'Comcast Business',      category: 'Operations', amount:   289.99, status: 'cleared',  unusual: false },
  { id: '10', date: '2026-02-22', merchant: 'LinkedIn Premium',      category: 'Marketing',  amount:    79.99, status: 'cleared',  unusual: false },
  { id: '11', date: '2026-02-20', merchant: 'Zoom Video',            category: 'Software',   amount:   149.90, status: 'cleared',  unusual: false },
  { id: '12', date: '2026-02-18', merchant: 'FedEx Business',        category: 'Operations', amount:   127.40, status: 'cleared',  unusual: false },
  { id: '13', date: '2026-02-15', merchant: 'ADP Payroll Services',  category: 'Payroll',    amount: 14364.00, status: 'cleared',  unusual: false },
  { id: '14', date: '2026-02-12', merchant: 'Shopify',               category: 'Software',   amount:   299.00, status: 'cleared',  unusual: false },
  { id: '15', date: '2026-02-10', merchant: 'Meta Business Ads',     category: 'Marketing',  amount:  3800.00, status: 'unusual',  unusual: true,  note: '81% above 3-mo avg' },
  { id: '16', date: '2026-02-08', merchant: 'Notion',                category: 'Software',   amount:    32.00, status: 'cleared',  unusual: false },
  { id: '17', date: '2026-02-05', merchant: 'Stripe Fees',           category: 'Operations', amount:   892.15, status: 'cleared',  unusual: false },
  { id: '18', date: '2026-02-03', merchant: 'Google Ads',            category: 'Marketing',  amount:   900.00, status: 'cleared',  unusual: false },
  { id: '19', date: '2026-01-31', merchant: 'Salesforce',            category: 'Software',   amount:   450.00, status: 'unusual',  unusual: true,  note: 'New subscription' },
  { id: '20', date: '2026-01-28', merchant: 'ADP Payroll Services',  category: 'Payroll',    amount: 14364.00, status: 'cleared',  unusual: false },
]

const CATEGORIES = ['All', 'Payroll', 'Software', 'Marketing', 'Operations', 'Other']
const CAT_COLORS  = { Payroll: '#C8FF00', Software: '#4dabf7', Marketing: '#ff4d4d', Operations: '#f59f00', Other: '#555555' }

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] border border-[#2e2e2e] p-2.5">
      <p className="font-barlow-condensed font-bold text-xs text-white mb-1">{label}</p>
      <p className="font-barlow-condensed font-black text-sm text-[#C8FF00]">${Number(payload[0].value).toLocaleString()}</p>
    </div>
  )
}

export default function ExpensesTab({ bankConnected, transactions }) {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')

  const txns = useMemo(() => {
    if (bankConnected && transactions?.length) {
      return transactions
        .filter(t => t.amount > 0)
        .map(t => ({
          id:       t.transaction_id,
          date:     t.date,
          merchant: t.merchant_name || t.name,
          category: t.personal_finance_category?.primary || t.category?.[0] || 'Other',
          amount:   t.amount,
          status:   t.pending ? 'pending' : 'cleared',
          unusual:  false,
        }))
    }
    return DEMO_TRANSACTIONS
  }, [bankConnected, transactions])

  const filtered = useMemo(() => {
    return txns.filter(t => {
      const matchSearch = !search || t.merchant.toLowerCase().includes(search.toLowerCase())
      const matchCat    = category === 'All' || t.category === category
      return matchSearch && matchCat
    })
  }, [txns, search, category])

  const topMerchants = useMemo(() => {
    const byMerchant = {}
    filtered.forEach(t => { byMerchant[t.merchant] = (byMerchant[t.merchant] || 0) + t.amount })
    return Object.entries(byMerchant)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, amount]) => ({ name: name.split(' ').slice(0, 2).join(' '), amount: Math.round(amount) }))
  }, [filtered])

  const catBreakdown = useMemo(() => {
    const byCat = {}
    filtered.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount })
    return Object.entries(byCat).map(([name, value]) => ({ name, value: Math.round(value) }))
  }, [filtered])

  const totalSpend   = filtered.reduce((s, t) => s + t.amount, 0)
  const unusualCount = filtered.filter(t => t.unusual).length

  const exportCSV = () => {
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Status']
    const rows    = filtered.map(t => [t.date, `"${t.merchant}"`, t.category, t.amount.toFixed(2), t.status])
    const csv     = [headers, ...rows].map(r => r.join(',')).join('\n')
    const url     = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a       = document.createElement('a')
    a.href        = url
    a.download    = 'cfox-expenses.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-barlow-condensed font-black uppercase text-2xl text-white">Expenses</h2>
          <p className="font-barlow text-xs text-white/30 mt-0.5">
            {filtered.length} transactions · ${totalSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })} total
            {unusualCount > 0 && (
              <span className="ml-2 text-red-400">· {unusualCount} unusual</span>
            )}
          </p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 border border-[#2e2e2e] px-3 py-2 font-barlow-condensed font-bold uppercase text-xs tracking-wider text-white/50 hover:text-[#C8FF00] hover:border-[#C8FF00]/30 transition-colors">
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search merchants..."
            className="form-input pl-9 py-2.5 text-sm"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 font-barlow-condensed font-bold uppercase text-[10px] tracking-wider border transition-colors ${
                category === cat
                  ? 'border-[#C8FF00] bg-[#C8FF00]/10 text-[#C8FF00]'
                  : 'border-[#2e2e2e] text-white/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Unusual alerts */}
      {filtered.filter(t => t.unusual).map(t => (
        <div key={t.id} className="flex items-center gap-3 border border-red-500/30 bg-red-500/5 px-4 py-3">
          <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
          <span className="font-barlow text-sm text-red-300">
            <span className="font-bold">{t.merchant}</span> — ${t.amount.toLocaleString()} on {t.date}
            {t.note && <span className="text-red-400/70 ml-2">({t.note})</span>}
          </span>
        </div>
      ))}

      {/* Transaction table */}
      <div className="bg-[#1e1e1e] border border-[#2e2e2e]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2e2e2e]">
                {['Date', 'Merchant', 'Category', 'Amount', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-barlow-condensed font-bold uppercase text-[10px] tracking-widest text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className={`border-b border-[#2e2e2e] last:border-0 transition-colors ${t.unusual ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-[#242424]'}`}>
                  <td className="px-5 py-3 font-barlow text-xs text-white/50">{t.date}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {t.unusual && <AlertTriangle size={11} className="text-red-400 flex-shrink-0" />}
                      <span className="font-barlow text-sm text-white">{t.merchant}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="font-barlow-condensed font-bold text-[10px] uppercase tracking-wider px-2 py-0.5"
                      style={{ color: CAT_COLORS[t.category] || '#555', backgroundColor: `${CAT_COLORS[t.category] || '#555'}15` }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-barlow-condensed font-black text-sm text-white">${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-5 py-3">
                    <span className={`font-barlow-condensed font-bold text-[10px] uppercase tracking-wider ${
                      t.status === 'cleared'  ? 'text-[#C8FF00]' :
                      t.status === 'unusual'  ? 'text-red-400'   :
                      'text-[#f59f00]'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center font-barlow text-sm text-white/30">No transactions match your filters.</div>
          )}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top merchants */}
        <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5">
          <h3 className="font-barlow-condensed font-black uppercase text-lg text-white mb-4">Top Merchants by Spend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topMerchants} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" horizontal={false} />
              <XAxis type="number" tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#888', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: '#ffffff08' }} />
              <Bar dataKey="amount" fill="#C8FF00" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5">
          <h3 className="font-barlow-condensed font-black uppercase text-lg text-white mb-4">By Category</h3>
          <div className="flex items-center gap-6">
            <PieChart width={160} height={160}>
              <Pie data={catBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                {catBreakdown.map(e => <Cell key={e.name} fill={CAT_COLORS[e.name] || '#555'} />)}
              </Pie>
            </PieChart>
            <div className="flex-1 space-y-2">
              {catBreakdown.sort((a, b) => b.value - a.value).map(cat => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CAT_COLORS[cat.name] || '#555' }} />
                    <span className="font-barlow-condensed font-bold uppercase text-[10px] tracking-wider text-white/60">{cat.name}</span>
                  </div>
                  <span className="font-barlow-condensed font-black text-xs text-white">${cat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
