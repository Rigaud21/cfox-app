import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const categories = [
  { name: 'Payroll', value: 45, amount: 70200, color: '#C8FF00' },
  { name: 'Software & Tools', value: 18, amount: 28100, color: '#ffffff' },
  { name: 'Marketing', value: 15, amount: 23400, color: '#6b7280' },
  { name: 'Operations', value: 12, amount: 18700, color: '#4b5563' },
  { name: 'Other', value: 10, amount: 15600, color: '#374151' },
]

const total = categories.reduce((s, c) => s + c.amount, 0)

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-[#1e1e1e] border border-[#C8FF00]/30 p-3">
      <p className="font-barlow-condensed font-black uppercase text-xs text-[#C8FF00] mb-1">{d.name}</p>
      <p className="font-barlow-condensed font-bold text-base text-white">${d.amount.toLocaleString()}</p>
      <p className="font-barlow text-xs text-white/40">{d.value}% of total</p>
    </div>
  )
}

function CategoryRow({ cat, delay }) {
  return (
    <div className="group" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: cat.color }}
          />
          <span className="font-barlow-condensed font-bold uppercase text-xs tracking-wider text-white/60 group-hover:text-white transition-colors">
            {cat.name}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-barlow-condensed font-black text-sm text-white">
            ${cat.amount.toLocaleString()}
          </span>
          <span className="font-barlow text-xs text-white/30 w-8 text-right">
            {cat.value}%
          </span>
        </div>
      </div>
      <div className="h-1 bg-[#2e2e2e] w-full">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
        />
      </div>
    </div>
  )
}

export default function ExpenseBreakdown() {
  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-barlow-condensed font-black uppercase text-xl text-white">
            Expense Breakdown
          </h3>
          <p className="font-barlow text-xs text-white/30 mt-0.5">
            March 2026 · Total: ${total.toLocaleString()}
          </p>
        </div>
        <button className="font-barlow-condensed font-bold text-xs uppercase tracking-wider text-white/30 hover:text-[#C8FF00] transition-colors">
          View All →
        </button>
      </div>

      {/* Donut + legend layout */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

        {/* Donut chart */}
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {categories.map((cat) => (
                  <Cell key={cat.name} fill={cat.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-barlow-condensed font-black text-lg text-white leading-none">
              ${(total / 1000).toFixed(0)}K
            </span>
            <span className="font-barlow text-[10px] text-white/30 uppercase tracking-wider">
              Total
            </span>
          </div>
        </div>

        {/* Category rows */}
        <div className="flex-1 w-full space-y-4">
          {categories.map((cat, i) => (
            <CategoryRow key={cat.name} cat={cat} delay={i * 80} />
          ))}
        </div>
      </div>

      {/* Insight callout */}
      <div className="mt-6 border border-[#C8FF00]/20 bg-[#C8FF00]/5 px-4 py-3 flex items-start gap-3">
        <span className="font-barlow-condensed font-black text-[#C8FF00] text-xs flex-shrink-0 mt-0.5">AI</span>
        <p className="font-barlow text-xs text-white/50 leading-relaxed">
          Found 3 unused software subscriptions totaling{' '}
          <span className="text-[#C8FF00] font-bold">$1,840/mo</span>. Canceling them would
          extend runway by <span className="text-white">0.4 months</span>.
        </p>
      </div>
    </div>
  )
}
