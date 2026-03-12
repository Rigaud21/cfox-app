import { useState } from 'react'
import { AlertTriangle, AlertCircle, Info, CheckCircle, ChevronRight, Clock } from 'lucide-react'

const ALERTS = [
  {
    id: 1,
    severity: 'critical',
    title: 'Burn rate increased 18% this month',
    desc: 'Your monthly burn rate jumped from $32,100 to $37,800 — driven by a 81% spike in marketing spend (Meta Ads, Feb 10). If this trend continues, runway shortens from 14 to 11 months.',
    time: '2 hours ago',
    action: 'Review Expenses',
  },
  {
    id: 2,
    severity: 'warning',
    title: 'Cash reserves approaching 3-month threshold',
    desc: 'At your current burn rate, cash reserves will hit the 3-month safety threshold in approximately 11 months. Maintaining a minimum 3-month buffer is critical for operational stability.',
    time: '1 day ago',
    action: 'View Projections',
  },
  {
    id: 3,
    severity: 'warning',
    title: '3 unusual transactions detected',
    desc: 'Flagged: Meta Business Ads $3,800 (81% above avg) on Feb 10, Salesforce $450 new subscription on Jan 31. These 2 transactions account for $2,250 in unplanned spend.',
    time: '3 days ago',
    action: 'View Transactions',
  },
  {
    id: 4,
    severity: 'info',
    title: 'Revenue trending 12% above last month',
    desc: 'March revenue is tracking at $61,000 vs $54,400 last month. If this continues you\'ll hit your revenue goal 2 months ahead of schedule. Consider increasing your marketing budget allocation.',
    time: '5 days ago',
    action: 'View Cash Flow',
  },
  {
    id: 5,
    severity: 'info',
    title: 'Payroll due in 5 days — $14,364',
    desc: 'ADP Payroll Services will debit your account on March 15 for $14,364. Current balance comfortably covers this payment with no action needed.',
    time: '1 week ago',
    action: 'View Schedule',
  },
]

const HISTORY = [
  { date: 'Mar 1,  2026', title: 'Monthly financial report generated',   severity: 'info'     },
  { date: 'Feb 28, 2026', title: 'Payroll processed — $14,364',           severity: 'info'     },
  { date: 'Feb 20, 2026', title: 'Software spend exceeded monthly budget', severity: 'warning'  },
  { date: 'Feb 15, 2026', title: 'Payroll processed — $14,364',           severity: 'info'     },
  { date: 'Feb 10, 2026', title: 'Unusual transaction flagged — Meta Ads', severity: 'critical' },
  { date: 'Feb 1,  2026', title: 'Monthly financial report generated',     severity: 'info'     },
  { date: 'Jan 31, 2026', title: 'New Salesforce subscription detected',   severity: 'warning'  },
]

const SEV = {
  critical: { icon: AlertCircle,  color: '#ff4d4d', bg: 'bg-red-500/10',    border: 'border-red-500/30',   label: 'Critical' },
  warning:  { icon: AlertTriangle, color: '#f59f00', bg: 'bg-amber-500/10',  border: 'border-amber-500/30', label: 'Warning'  },
  info:     { icon: Info,           color: '#4dabf7', bg: 'bg-blue-500/10',   border: 'border-blue-500/30',  label: 'Info'     },
}

function AlertCard({ alert, onAction }) {
  const { icon: Icon, color, bg, border } = SEV[alert.severity]
  return (
    <div className={`border ${border} ${bg} p-4`}>
      <div className="flex items-start gap-4">
        <Icon size={18} style={{ color }} className="flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h4 className="font-barlow-condensed font-black uppercase text-sm text-white">{alert.title}</h4>
            <span
              className="font-barlow-condensed font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 flex-shrink-0"
              style={{ color, backgroundColor: `${color}20` }}
            >
              {SEV[alert.severity].label}
            </span>
          </div>
          <p className="font-barlow text-xs text-white/50 leading-relaxed mb-3">{alert.desc}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-white/30">
              <Clock size={11} />
              <span className="font-barlow text-[10px]">{alert.time}</span>
            </div>
            <button
              onClick={() => onAction(alert)}
              className="flex items-center gap-1 font-barlow-condensed font-bold uppercase text-[10px] tracking-wider hover:text-white transition-colors"
              style={{ color }}
            >
              {alert.action}
              <ChevronRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AlertsTab({ onTabChange }) {
  const [filter, setFilter] = useState('all')

  const filtered = ALERTS.filter(a => filter === 'all' || a.severity === filter)

  const counts = {
    all:      ALERTS.length,
    critical: ALERTS.filter(a => a.severity === 'critical').length,
    warning:  ALERTS.filter(a => a.severity === 'warning').length,
    info:     ALERTS.filter(a => a.severity === 'info').length,
  }

  const handleAction = (alert) => {
    // Navigate to relevant tab based on alert type
    if (onTabChange) {
      if (alert.action === 'Review Expenses' || alert.action === 'View Transactions') onTabChange('Expenses')
      if (alert.action === 'View Projections' || alert.action === 'View Cash Flow')   onTabChange('Cash Flow')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-barlow-condensed font-black uppercase text-2xl text-white">Alerts</h2>
        <p className="font-barlow text-xs text-white/30 mt-0.5">Your financial early warning system</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-px bg-[#2e2e2e]">
        {[
          { label: 'Critical',  count: counts.critical, color: '#ff4d4d' },
          { label: 'Warnings',  count: counts.warning,  color: '#f59f00' },
          { label: 'Info',      count: counts.info,     color: '#4dabf7' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-[#1e1e1e] p-4 text-center">
            <p className="font-barlow-condensed font-black text-3xl" style={{ color }}>{count}</p>
            <p className="font-barlow-condensed font-bold uppercase text-[10px] tracking-widest text-white/30">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-[#2e2e2e] gap-1">
        {[
          ['all',      'All',      counts.all],
          ['critical', 'Critical', counts.critical],
          ['warning',  'Warnings', counts.warning],
          ['info',     'Info',     counts.info],
        ].map(([val, lbl, count]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2.5 font-barlow-condensed font-bold uppercase text-[10px] tracking-wider border-b-2 -mb-px transition-colors ${
              filter === val
                ? 'border-[#C8FF00] text-[#C8FF00]'
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            {lbl} ({count})
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {filtered.map(alert => (
          <AlertCard key={alert.id} alert={alert} onAction={handleAction} />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <CheckCircle size={32} className="text-[#C8FF00]" />
            <p className="font-barlow text-sm text-white/40">No {filter} alerts at this time.</p>
          </div>
        )}
      </div>

      {/* Alert history */}
      <div className="bg-[#1e1e1e] border border-[#2e2e2e]">
        <div className="px-5 py-4 border-b border-[#2e2e2e]">
          <h3 className="font-barlow-condensed font-black uppercase text-base text-white">Alert History</h3>
        </div>
        <div>
          {HISTORY.map((h, i) => {
            const { icon: Icon, color } = SEV[h.severity]
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-[#2e2e2e] last:border-0 hover:bg-[#242424] transition-colors">
                <Icon size={13} style={{ color }} className="flex-shrink-0" />
                <span className="font-barlow text-sm text-white/60 flex-1">{h.title}</span>
                <span className="font-barlow text-[10px] text-white/20 flex-shrink-0">{h.date}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
