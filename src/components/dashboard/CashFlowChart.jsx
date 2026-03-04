import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const data = [
  { month: 'Jan', income: 180000, expenses: 120000, net: 60000 },
  { month: 'Feb', income: 195000, expenses: 115000, net: 80000 },
  { month: 'Mar', income: 210000, expenses: 130000, net: 80000 },
  { month: 'Apr', income: 225000, expenses: 140000, net: 85000 },
  { month: 'May', income: 240000, expenses: 135000, net: 105000 },
  { month: 'Jun', income: 260000, expenses: 150000, net: 110000 },
  { month: 'Jul', income: 255000, expenses: 145000, net: 110000 },
  { month: 'Aug', income: 275000, expenses: 160000, net: 115000 },
  { month: 'Sep', income: 290000, expenses: 155000, net: 135000 },
  { month: 'Oct', income: 310000, expenses: 165000, net: 145000 },
  { month: 'Nov', income: 295000, expenses: 158000, net: 137000 },
  { month: 'Dec', income: 320000, expenses: 170000, net: 150000 },
]

const fmt = (v) => `$${(v / 1000).toFixed(0)}K`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-3 min-w-[160px]">
      <p className="font-barlow-condensed font-black uppercase text-xs tracking-widest text-white/40 mb-2">
        {label} 2026
      </p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            <span className="font-barlow text-xs text-white/50 capitalize">{p.dataKey}</span>
          </div>
          <span className="font-barlow-condensed font-bold text-sm text-white">
            {fmt(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

const CustomLegend = ({ payload }) => (
  <div className="flex items-center gap-6 justify-end pt-2">
    {payload?.map((p) => (
      <div key={p.value} className="flex items-center gap-1.5">
        <span className="w-4 h-0.5" style={{ backgroundColor: p.color }} />
        <span className="font-barlow-condensed font-bold text-xs uppercase tracking-wider text-white/40 capitalize">
          {p.value}
        </span>
      </div>
    ))}
  </div>
)

export default function CashFlowChart() {
  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-barlow-condensed font-black uppercase text-xl text-white">
            Cash Flow
          </h3>
          <p className="font-barlow text-xs text-white/30 mt-0.5">
            Jan – Dec 2026
          </p>
        </div>
        <div className="flex gap-1">
          {['1M', '3M', '6M', '1Y'].map((p, i) => (
            <button
              key={p}
              className={`font-barlow-condensed font-bold text-xs uppercase px-2 py-1 transition-colors ${
                i === 3
                  ? 'bg-[#C8FF00] text-[#161616]'
                  : 'text-white/30 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2e2e2e"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: '#555', fontSize: 11, fontFamily: '"Barlow Condensed"', fontWeight: 700 }}
            axisLine={{ stroke: '#2e2e2e' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2e2e2e', strokeWidth: 1 }} />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#C8FF00"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#C8FF00', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ff4d4d"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#ff4d4d', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="net"
            stroke="#ffffff"
            strokeWidth={2}
            strokeDasharray="4 2"
            dot={false}
            activeDot={{ r: 4, fill: '#ffffff', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
