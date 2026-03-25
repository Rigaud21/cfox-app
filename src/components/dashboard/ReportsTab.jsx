import { useState, useEffect } from 'react'
import {
  FileText, TrendingUp, Scale, ClipboardList, BarChart2,
  Calendar, Receipt, Clock, Target, Rocket, Sparkles,
  Download, Package, ChevronDown, CheckCircle,
} from 'lucide-react'
import {
  generatePLPDF, generatePLCSV, generatePLExcel,
  generateCashFlowPDF, generateCashFlowCSV, generateCashFlowExcel,
  generateBalanceSheetPDF, generateBalanceSheetCSV, generateBalanceSheetExcel,
  generateExecutiveSummaryPDF,
  generateProjectionsPDF, generateProjectionsExcel,
  generateDebtSchedulePDF, generateDebtScheduleExcel,
  generateExpenseBudgetPDF, generateExpenseBudgetExcel,
  generateARAgingPDF, generateARAgingExcel,
  generateBreakEvenPDF,
  generateInvestorOnePagerPDF,
  generate3YearModelExcel,
  downloadCompletePackage,
} from './reports/reportGenerators'

// ── Constants ─────────────────────────────────────────────────
const PERIODS = ['30 Days', '90 Days', '6 Months', '12 Months', 'YTD']
const FORMATS  = { pdf: 'PDF', csv: 'CSV', excel: 'Excel' }

const BADGE_COLORS = {
  'SBA Loans':              'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Bank Loans':             'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Investors':              'bg-[#C8FF00]/20 text-[#C8FF00] border-[#C8FF00]/30',
  'Lines of Credit':        'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Invoice Factoring':      'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Revenue-Based Financing':'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Growth Lenders':         'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'Bank Meetings':          'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'New Locations':          'bg-red-500/20 text-red-300 border-red-500/30',
}

// ── Helpers ───────────────────────────────────────────────────
function Badge({ label }) {
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide border rounded-sm ${BADGE_COLORS[label] || 'bg-white/10 text-white/50 border-white/20'}`}>
      ✓ {label}
    </span>
  )
}

function Select({ options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none bg-[#2a2a2a] border border-[#3a3a3a] text-white/70 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 pr-6 focus:outline-none focus:border-[#C8FF00] transition-colors cursor-pointer"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
    </div>
  )
}

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#1e1e1e] border border-[#C8FF00]/40 px-4 py-3 shadow-2xl animate-slide-up">
      <CheckCircle size={15} className="text-[#C8FF00] flex-shrink-0" />
      <span className="font-barlow-condensed font-bold uppercase text-xs tracking-wider text-white">{message}</span>
    </div>
  )
}

// ── Section header ────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div className="border-l-2 border-[#C8FF00] pl-3 mb-4">
      <h2 className="font-barlow-condensed font-black uppercase text-base text-white tracking-wider">{title}</h2>
      <p className="font-barlow text-[10px] text-white/30 mt-0.5">{subtitle}</p>
    </div>
  )
}

// ── Document Card ─────────────────────────────────────────────
function DocCard({ icon: Icon, title, description, badges, formats, periods, onDownload }) {
  const hasPeriod  = !!periods
  const hasFormat  = !!formats
  const [period,   setPeriod]   = useState(periods?.[0] || '30 Days')
  const [format,   setFormat]   = useState(formats?.[0] || 'pdf')
  const [loading,  setLoading]  = useState(false)

  async function handleDownload() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    try { onDownload(period, format) } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] hover:border-[#C8FF00]/20 transition-colors p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-[#C8FF00]/10 flex items-center justify-center flex-shrink-0">
          <Icon size={17} className="text-[#C8FF00]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-barlow-condensed font-black uppercase text-sm text-white leading-tight">{title}</h3>
          <p className="font-barlow text-[10px] text-white/40 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1">
        {badges.map(b => <Badge key={b} label={b} />)}
      </div>

      {/* Selectors */}
      {(hasPeriod || hasFormat) && (
        <div className="flex flex-wrap items-center gap-2">
          {hasPeriod && (
            <div className="flex items-center gap-1.5">
              <span className="font-barlow-condensed font-bold uppercase text-[9px] tracking-wider text-white/30">Period</span>
              <Select options={periods} value={period} onChange={setPeriod} />
            </div>
          )}
          {hasFormat && (
            <div className="flex items-center gap-1.5">
              <span className="font-barlow-condensed font-bold uppercase text-[9px] tracking-wider text-white/30">Format</span>
              <Select options={formats} value={format} onChange={setFormat} />
            </div>
          )}
        </div>
      )}

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className="mt-auto w-full bg-[#C8FF00] hover:bg-white transition-colors text-[#161616] font-barlow-condensed font-black uppercase text-xs tracking-wider py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-[#161616] border-t-transparent rounded-full animate-spin" />
        ) : (
          <Download size={13} />
        )}
        {loading ? 'Generating...' : `Download →`}
      </button>
    </div>
  )
}

// ── Recent Downloads Table ────────────────────────────────────
const LS_KEY = 'cfox_recent_downloads'

function useRecentDownloads() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
  })

  function addDownload(doc, period, format) {
    const entry = { doc, period, format, date: new Date().toLocaleDateString(), ts: Date.now() }
    setItems(prev => {
      const next = [entry, ...prev].slice(0, 5)
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }

  return { items, addDownload }
}

// ── Main Component ────────────────────────────────────────────
export default function ReportsTab({ profile }) {
  const businessName = profile?.business_name || 'Your Business'
  const [toast,      setToast]   = useState(null)
  const [pkgLoading, setPkgLoading] = useState(false)
  const { items: recentDownloads, addDownload } = useRecentDownloads()

  function notify(msg) { setToast(msg) }

  async function wrap(name, period, format, fn) {
    await fn()
    addDownload(name, period, format)
    notify(`${name} downloaded successfully`)
  }

  async function handlePackage() {
    setPkgLoading(true)
    await downloadCompletePackage(businessName, profile)
    addDownload('Complete Funding Package', 'All Periods', 'Mixed')
    notify('Complete package downloaded — 11 documents')
    setPkgLoading(false)
  }

  // ── Card definitions ────────────────────────────────────────
  const cards = [
    // Section 1
    {
      section: 'CORE FINANCIAL STATEMENTS',
      subtitle: 'Required for every loan and investor application',
      items: [
        {
          icon: BarChart2, title: 'Profit & Loss Statement (P&L)',
          description: 'Shows revenue, expenses, and net profit. Required by every bank, lender, and investor.',
          badges: ['SBA Loans', 'Bank Loans', 'Investors', 'Lines of Credit'],
          periods: PERIODS, formats: ['PDF', 'CSV', 'Excel'],
          onDownload: (p, f) => wrap('P&L Statement', p, f, () => {
            if (f === 'PDF') return generatePLPDF(businessName, p)
            if (f === 'CSV') return generatePLCSV(p)
            return generatePLExcel(p)
          }),
        },
        {
          icon: TrendingUp, title: 'Cash Flow Statement',
          description: 'Tracks every dollar in and out. Banks use this to determine if you can repay a loan.',
          badges: ['SBA Loans', 'Bank Loans', 'Lines of Credit'],
          periods: PERIODS, formats: ['PDF', 'CSV', 'Excel'],
          onDownload: (p, f) => wrap('Cash Flow Statement', p, f, () => {
            if (f === 'PDF') return generateCashFlowPDF(businessName, p)
            if (f === 'CSV') return generateCashFlowCSV(p)
            return generateCashFlowExcel(p)
          }),
        },
        {
          icon: Scale, title: 'Balance Sheet',
          description: 'Snapshot of assets, liabilities, and equity. Required for most business loans over $50K.',
          badges: ['SBA Loans', 'Bank Loans', 'Investors'],
          periods: PERIODS, formats: ['PDF', 'CSV', 'Excel'],
          onDownload: (p, f) => wrap('Balance Sheet', p, f, () => {
            if (f === 'PDF') return generateBalanceSheetPDF(businessName, p)
            if (f === 'CSV') return generateBalanceSheetCSV(p)
            return generateBalanceSheetExcel(p)
          }),
        },
      ],
    },
    // Section 2
    {
      section: 'FUNDING APPLICATION DOCUMENTS',
      subtitle: 'Specialized documents for specific funding types',
      items: [
        {
          icon: ClipboardList, title: 'Executive Summary',
          description: 'One-page business overview for investors and lenders. Includes KPIs, growth trajectory, and funding use.',
          badges: ['Investors', 'SBA Loans', 'Bank Meetings'],
          periods: null, formats: ['PDF'],
          onDownload: (p, f) => wrap('Executive Summary', 'Current', 'PDF', () => generateExecutiveSummaryPDF(businessName, profile)),
        },
        {
          icon: BarChart2, title: 'Revenue Projections (12 Month)',
          description: 'Forward-looking revenue model showing growth trajectory. Based on current +8.7% MoM growth rate.',
          badges: ['Investors', 'Revenue-Based Financing', 'Growth Lenders'],
          periods: null, formats: ['PDF', 'Excel'],
          onDownload: (p, f) => wrap('Revenue Projections', '12 Months', f, () => {
            if (f === 'PDF') return generateProjectionsPDF(businessName)
            return generateProjectionsExcel()
          }),
        },
        {
          icon: Calendar, title: 'Debt Schedule',
          description: 'Complete list of all current business debts, payment schedules, and remaining balances.',
          badges: ['SBA Loans', 'Bank Loans', 'Lines of Credit'],
          periods: null, formats: ['PDF', 'Excel'],
          onDownload: (p, f) => wrap('Debt Schedule', 'Current', f, () => {
            if (f === 'PDF') return generateDebtSchedulePDF(businessName)
            return generateDebtScheduleExcel()
          }),
        },
      ],
    },
    // Section 3
    {
      section: 'OPERATIONAL DOCUMENTS',
      subtitle: 'Supporting documents that strengthen any application',
      items: [
        {
          icon: Receipt, title: 'Expense Budget',
          description: 'Detailed categorized budget showing planned vs actual spending. Shows lenders you manage money well.',
          badges: ['SBA Loans', 'Bank Loans', 'Investors'],
          periods: null, formats: ['PDF', 'Excel'],
          onDownload: (p, f) => wrap('Expense Budget', 'Current Month', f, () => {
            if (f === 'PDF') return generateExpenseBudgetPDF(businessName)
            return generateExpenseBudgetExcel()
          }),
        },
        {
          icon: Clock, title: 'Accounts Receivable Aging',
          description: 'Shows outstanding invoices by age — critical for invoice factoring and lines of credit applications.',
          badges: ['Invoice Factoring', 'Lines of Credit', 'Bank Loans'],
          periods: null, formats: ['PDF', 'Excel'],
          onDownload: (p, f) => wrap('AR Aging Report', 'Current', f, () => {
            if (f === 'PDF') return generateARAgingPDF(businessName)
            return generateARAgingExcel()
          }),
        },
        {
          icon: Target, title: 'Break-Even Analysis',
          description: 'Shows exactly when your business covers all costs. Investors and lenders use this to assess risk.',
          badges: ['Investors', 'SBA Loans', 'New Locations'],
          periods: null, formats: ['PDF'],
          onDownload: (p, f) => wrap('Break-Even Analysis', 'Current', 'PDF', () => generateBreakEvenPDF(businessName)),
        },
      ],
    },
    // Section 4
    {
      section: 'INVESTOR SPECIFIC',
      subtitle: 'Documents designed for equity fundraising',
      items: [
        {
          icon: Rocket, title: 'Investor One-Pager',
          description: 'Concise investment overview — business model, market size, traction, team, and the ask. Designed to get a second meeting.',
          badges: ['Investors'],
          periods: null, formats: ['PDF'],
          onDownload: (p, f) => wrap('Investor One-Pager', 'Current', 'PDF', () => generateInvestorOnePagerPDF(businessName, profile)),
        },
        {
          icon: Sparkles, title: 'Financial Model (3 Year)',
          description: '3-year financial projection with assumptions, scenarios, and unit economics. Serious investors always ask for this.',
          badges: ['Investors'],
          periods: null, formats: ['Excel'],
          onDownload: (p, f) => wrap('3-Year Financial Model', '3 Years', 'Excel', () => generate3YearModelExcel(businessName)),
        },
      ],
    },
  ]

  const FUNDING_GUIDE = [
    {
      title: 'SBA LOAN',
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
      items: [
        'P&L (2 years)', 'Balance Sheet', 'Cash Flow Statement',
        'Debt Schedule', 'Business Tax Returns',
        'Personal Financial Statement', 'Executive Summary',
      ],
    },
    {
      title: 'BUSINESS LINE OF CREDIT',
      color: 'text-orange-400',
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/5',
      items: [
        'P&L (12 months)', 'Cash Flow Statement',
        'Accounts Receivable Aging', 'Bank Statements (3 months)',
        'Debt Schedule',
      ],
    },
    {
      title: 'INVESTOR / VC FUNDING',
      color: 'text-[#C8FF00]',
      border: 'border-[#C8FF00]/30',
      bg: 'bg-[#C8FF00]/5',
      items: [
        'Executive Summary', 'Investor One-Pager',
        '3-Year Financial Model', 'Revenue Projections',
        'Cap Table', 'P&L Statement',
      ],
    },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* ── Page header ────────────────────────────────────── */}
      <div>
        <h1 className="font-barlow-condensed font-black uppercase text-3xl text-white tracking-tight leading-none">
          Reports &amp; Documents
        </h1>
        <p className="font-barlow text-xs text-white/40 mt-1.5 max-w-2xl">
          Every financial document your business needs — for funding applications, investor meetings, and tax prep. Generated instantly from your data.
        </p>
      </div>

      {/* ── Funding Ready Banner ────────────────────────────── */}
      <div className="bg-[#1a1a1a] border border-[#C8FF00]/30 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Package size={16} className="text-[#C8FF00]" />
            <span className="font-barlow-condensed font-black uppercase text-sm tracking-wider text-[#C8FF00]">
              Funding Ready Package
            </span>
          </div>
          <p className="font-barlow text-xs text-white/50 max-w-xl">
            Download your complete funding application package in one click — everything banks and investors ask for, professionally formatted and ready to submit.
          </p>
        </div>
        <button
          onClick={handlePackage}
          disabled={pkgLoading}
          className="flex-shrink-0 bg-[#C8FF00] hover:bg-white transition-colors text-[#161616] font-barlow-condensed font-black uppercase text-xs tracking-wider px-6 py-3 flex items-center gap-2 disabled:opacity-60"
        >
          {pkgLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-[#161616] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download size={14} />
          )}
          {pkgLoading ? 'Generating Package...' : 'Download Complete Package (ZIP) →'}
        </button>
      </div>

      {/* ── Document sections ───────────────────────────────── */}
      {cards.map(({ section, subtitle, items }) => (
        <section key={section}>
          <SectionHeader title={section} subtitle={subtitle} />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map(card => (
              <DocCard key={card.title} {...card} />
            ))}
          </div>
        </section>
      ))}

      {/* ── Funding Guide ───────────────────────────────────── */}
      <section>
        <SectionHeader title="Which Documents Do I Need?" subtitle="Quick reference guide by funding type" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FUNDING_GUIDE.map(({ title, color, border, bg, items }) => (
            <div key={title} className={`${bg} border ${border} p-4`}>
              <h3 className={`font-barlow-condensed font-black uppercase text-sm ${color} mb-3`}>{title}</h3>
              <ul className="space-y-1.5">
                {items.map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className={`font-bold text-xs ${color} flex-shrink-0 mt-0.5`}>✓</span>
                    <span className="font-barlow text-xs text-white/60">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent Downloads ────────────────────────────────── */}
      {recentDownloads.length > 0 && (
        <section>
          <SectionHeader title="Recent Downloads" subtitle="Your last 5 generated documents" />
          <div className="bg-[#1e1e1e] border border-[#2e2e2e] overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#2e2e2e]">
                  {['Document', 'Period', 'Format', 'Date'].map(col => (
                    <th key={col} className="px-4 py-3 font-barlow-condensed font-bold uppercase text-[9px] tracking-wider text-white/30">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentDownloads.map((row, i) => (
                  <tr key={row.ts || i} className="border-b border-[#2e2e2e] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-barlow-condensed font-bold text-xs text-white">{row.doc}</td>
                    <td className="px-4 py-3 font-barlow text-xs text-white/40">{row.period}</td>
                    <td className="px-4 py-3">
                      <span className="font-barlow-condensed font-bold uppercase text-[9px] tracking-wider px-1.5 py-0.5 bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20">
                        {row.format}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-barlow text-xs text-white/30">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Toast ───────────────────────────────────────────── */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
