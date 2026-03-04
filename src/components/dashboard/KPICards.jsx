import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingDown, TrendingUp, Clock, Flame, Percent } from 'lucide-react'

const kpis = [
  {
    label: 'Total Revenue',
    value: '$284,500',
    raw: 284500,
    change: '+12.4%',
    positive: true,
    note: 'vs last month',
    icon: DollarSign,
    color: '#C8FF00',
  },
  {
    label: 'Total Expenses',
    value: '$156,200',
    raw: 156200,
    change: '+8.1%',
    positive: false,
    note: 'vs last month',
    icon: TrendingDown,
    color: '#ff4d4d',
  },
  {
    label: 'Net Cash Flow',
    value: '$128,300',
    raw: 128300,
    change: '+18.7%',
    positive: true,
    note: 'vs last month',
    icon: TrendingUp,
    color: '#C8FF00',
  },
  {
    label: 'Runway',
    value: '8.4 mo',
    raw: null,
    change: '−0.3 mo',
    positive: false,
    note: 'vs last month',
    icon: Clock,
    color: '#facc15',
  },
  {
    label: 'Burn Rate',
    value: '$18,700/mo',
    raw: 18700,
    change: '+5.2%',
    positive: false,
    note: 'vs last month',
    icon: Flame,
    color: '#ff4d4d',
  },
  {
    label: 'Profit Margin',
    value: '45.1%',
    raw: null,
    change: '+2.3 pp',
    positive: true,
    note: 'vs last month',
    icon: Percent,
    color: '#C8FF00',
  },
]

function MiniBar({ value, max, color }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="w-full h-0.5 bg-[#2e2e2e] mt-3">
      <div
        className="h-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

export default function KPICards() {
  const maxRevenue = 350000

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-barlow-condensed font-black uppercase text-2xl text-white">
            Financial Overview
          </h2>
          <p className="font-barlow text-xs text-white/30 mt-0.5">
            March 2026 · Updated 2 min ago
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
          <span className="font-barlow-condensed font-bold uppercase text-xs tracking-wider text-[#C8FF00]">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-[#2e2e2e]">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const Arrow = kpi.positive ? ArrowUpRight : ArrowDownRight

          return (
            <div
              key={kpi.label}
              className="bg-[#1e1e1e] p-5 hover:bg-[#242424] transition-colors duration-150 group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-barlow-condensed font-bold uppercase text-xs tracking-widest text-white/30">
                  {kpi.label}
                </span>
                <div
                  className="w-7 h-7 flex items-center justify-center border border-[#2e2e2e] group-hover:border-current transition-colors"
                  style={{ color: kpi.color }}
                >
                  <Icon size={13} />
                </div>
              </div>

              <div className="font-barlow-condensed font-black text-2xl sm:text-3xl text-white leading-none mb-3">
                {kpi.value}
              </div>

              <div className="flex items-center gap-1.5">
                <Arrow
                  size={12}
                  className={kpi.positive ? 'text-[#C8FF00]' : 'text-red-400'}
                />
                <span
                  className={`font-barlow-condensed font-bold text-xs ${
                    kpi.positive ? 'text-[#C8FF00]' : 'text-red-400'
                  }`}
                >
                  {kpi.change}
                </span>
                <span className="font-barlow text-xs text-white/20">{kpi.note}</span>
              </div>

              {kpi.raw && (
                <MiniBar value={kpi.raw} max={maxRevenue} color={kpi.color} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
