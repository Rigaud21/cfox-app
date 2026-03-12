import { useState, useMemo } from 'react'
import { Sparkles } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'

const MONTHLY_DATA = [
  { period: 'Jul', income: 45000, expenses: 32000, net: 13000 },
  { period: 'Aug', income: 50000, expenses: 35000, net: 15000 },
  { period: 'Sep', income: 47000, expenses: 33000, net: 14000 },
  { period: 'Oct', income: 55000, expenses: 38000, net: 17000 },
  { period: 'Nov', income: 57000, expenses: 36000, net: 21000 },
  { period: 'Dec', income: 63000, expenses: 43000, net: 20000 },
  { period: 'Jan', income: 54000, expenses: 40000, net: 14000 },
  { period: 'Feb', income: 58000, expenses: 41000, net: 17000 },
  { period: 'Mar', income: 61000, expenses: 42000, net: 19000 },
]

const WEEKLY_DATA = [
  { period: 'W1 Jan', income: 12400, expenses: 9200, net: 3200 },
  { period: 'W2 Jan', income: 11800, expenses: 8700, net: 3100 },
  { period: 'W3 Jan', income: 13200, expenses: 9800, net: 3400 },
  { period: 'W4 Jan', income: 12900, expenses: 9300, net: 3600 },
  { period: 'W1 Feb', income: 13500, expenses: 9900, net: 3600 },
  { period: 'W2 Feb', income: 14200, expenses: 10100, net: 4100 },
  { period: 'W3 Feb', income: 13800, expenses: 9700, net: 4100 },
  { period: 'W4 Feb', income: 14500, expenses: 10500, net: 4000 },
  { period: 'W1 Mar', income: 14800, expenses: 10200, net: 4600 },
  { period: 'W2 Mar', income: 15200, expenses: 10800, net: 4400 },
  { period: 'W3 Mar', income: 15600, expenses: 11000, net: 4600 },
  { period: 'W4 Mar', income: 16100, expenses: 11200, net: 4900 },
]

const FORECAST_DATA = [
  { period: 'Apr', income: 63500, expenses: 43200, net: 20300, forecast: true },
  { period: 'May', income: 66200, expenses: 44100, net: 22100, forecast: true },
  { period: 'Jun', income: 68400, expenses: 44800, net: 23600, forecast: true },
]

const COMBINED_DATA = [...MONTHLY_DATA, ...FORECAST_DATA]

const TABLE_DATA = MONTHLY_DATA.map((d, i) => ({
  ...d,
  vsLastMonth: i === 0 ? null : ((d.net - MONTHLY_DATA[i - 1].net) / Math.abs(MONTHLY_DATA[i - 1].net) * 100),
}))

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

export default function CashFlowTab({ bankConnected }) {
  const [view, setView]     = useState('monthly')   // monthly | weekly
  const [mode, setMode]     = useState('actual')     // actual | forecast

  const chartData = useMemo(() => {
    if (view === 'weekly') return WEEKLY_DATA
    return mode === 'forecast' ? COMBINED_DATA : MONTHLY_DATA
  }, [view, mode])

  const showForecastLine = view === 'monthly' && mode === 'forecast'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-barlow-condensed font-black uppercase text-2xl text-white">Cash Flow</h2>
          <p className="font-barlow text-xs text-white/30 mt-0.5">Detailed breakdown by period</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex border border-[#2e2e2e]">
            {[['monthly', 'Monthly'], ['weekly', 'Weekly']].map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setView(val)}
                className={`px-3 py-1.5 font-barlow-condensed font-bold uppercase text-[10px] tracking-wider transition-colors ${view === val ? 'bg-[#C8FF00] text-black' : 'text-white/40 hover:text-white'}`}
              >
                {lbl}
              </button>
            ))}
          </div>
          {/* Mode toggle */}
          {view === 'monthly' && (
            <div className="flex border border-[#2e2e2e]">
              {[['actual', 'Actual'], ['forecast', 'Forecast']].map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setMode(val)}
                  className={`px-3 py-1.5 font-barlow-condensed font-bold uppercase text-[10px] tracking-wider transition-colors ${mode === val ? 'bg-[#C8FF00] text-black' : 'text-white/40 hover:text-white'}`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main chart */}
      <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {[['Income', '#C8FF00'], ['Expenses', '#ff4d4d'], ['Net', '#4dabf7']].map(([lbl, color]) => (
              <div key={lbl} className="flex items-center gap-1.5">
                <span className="w-3 h-0.5" style={{ backgroundColor: color }} />
                <span className="font-barlow-condensed font-bold text-[10px] uppercase tracking-wider text-white/40">{lbl}</span>
              </div>
            ))}
          </div>
          {showForecastLine && (
            <span className="flex items-center gap-1.5 font-barlow-condensed font-bold text-[10px] uppercase tracking-wider text-[#C8FF00]/60">
              <Sparkles size={11} />
              AI Forecast
            </span>
          )}
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
            <defs>
              {[['cf-inc', '#C8FF00', 0.25], ['cf-exp', '#ff4d4d', 0.2], ['cf-net', '#4dabf7', 0.2]].map(([id, color, op]) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={op} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" vertical={false} />
            <XAxis dataKey="period" tick={{ fill: '#555', fontSize: 11, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} width={42} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#2e2e2e', strokeWidth: 1 }} />
            {showForecastLine && (
              <ReferenceLine
                x="Apr"
                stroke="#3e3e3e"
                strokeDasharray="4 4"
                label={{ value: '← Actual  |  Forecast →', fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', position: 'insideTop' }}
              />
            )}
            <Area type="monotone" dataKey="income"   stroke="#C8FF00" strokeWidth={2} fill="url(#cf-inc)" dot={false} activeDot={{ r: 4, fill: '#C8FF00', strokeWidth: 0 }} />
            <Area type="monotone" dataKey="expenses" stroke="#ff4d4d" strokeWidth={2} fill="url(#cf-exp)" dot={false} activeDot={{ r: 4, fill: '#ff4d4d', strokeWidth: 0 }} />
            <Area type="monotone" dataKey="net"      stroke="#4dabf7" strokeWidth={2} fill="url(#cf-net)" dot={false} activeDot={{ r: 4, fill: '#4dabf7', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Forecast Cards */}
      {view === 'monthly' && (
        <div className="bg-[#1e1e1e] border border-[#C8FF00]/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-[#C8FF00]" />
            <h3 className="font-barlow-condensed font-black uppercase text-sm tracking-wider text-[#C8FF00]">90-Day AI Forecast</h3>
            <span className="ml-auto font-barlow text-[10px] text-white/30 italic">Generated by CFO-X AI · Updated daily</span>
          </div>
          <div className="grid grid-cols-3 gap-px bg-[#2e2e2e] mb-4">
            {[
              { month: 'April 2026',   income: '$63,500', net: '+$20,300', confidence: 84, trend: '+4.1%' },
              { month: 'May 2026',     income: '$66,200', net: '+$22,100', confidence: 79, trend: '+4.2%' },
              { month: 'June 2026',    income: '$68,400', net: '+$23,600', confidence: 72, trend: '+3.3%' },
            ].map(f => (
              <div key={f.month} className="bg-[#161616] p-4">
                <p className="font-barlow-condensed font-bold uppercase text-[10px] tracking-widest text-white/30 mb-2">{f.month}</p>
                <p className="font-barlow-condensed font-black text-xl text-white mb-1">{f.income}</p>
                <p className="font-barlow-condensed font-bold text-sm text-[#C8FF00] mb-2">{f.net} net</p>
                <div className="flex items-center justify-between">
                  <span className="font-barlow text-[10px] text-white/30">Confidence</span>
                  <span className={`font-barlow-condensed font-bold text-xs ${f.confidence >= 80 ? 'text-[#C8FF00]' : f.confidence >= 70 ? 'text-[#f59f00]' : 'text-red-400'}`}>
                    {f.confidence}%
                  </span>
                </div>
                <div className="h-1 bg-[#2e2e2e] mt-1.5">
                  <div className="h-full bg-[#C8FF00]/50" style={{ width: `${f.confidence}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="font-barlow text-xs text-white/40">
            Based on your 9-month trend showing consistent 8–12% MoM revenue growth. April is your strongest projected month, driven by seasonal patterns in your industry. Confidence decreases over time as market uncertainty compounds.
          </p>
        </div>
      )}

      {/* Monthly breakdown table */}
      {view === 'monthly' && (
        <div className="bg-[#1e1e1e] border border-[#2e2e2e]">
          <div className="px-5 py-4 border-b border-[#2e2e2e]">
            <h3 className="font-barlow-condensed font-black uppercase text-lg text-white">Monthly Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2e2e2e]">
                  {['Month', 'Income', 'Expenses', 'Net Cash Flow', 'vs Last Month'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-barlow-condensed font-bold uppercase text-[10px] tracking-widest text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_DATA.map((row, i) => (
                  <tr key={row.period} className="border-b border-[#2e2e2e] last:border-0 hover:bg-[#242424] transition-colors">
                    <td className="px-5 py-3 font-barlow-condensed font-bold text-sm text-white">{row.period} 2025{i >= 6 ? '/26' : ''}</td>
                    <td className="px-5 py-3 font-barlow-condensed font-black text-sm text-[#C8FF00]">${(row.income / 1000).toFixed(1)}K</td>
                    <td className="px-5 py-3 font-barlow-condensed font-black text-sm text-red-400">${(row.expenses / 1000).toFixed(1)}K</td>
                    <td className="px-5 py-3 font-barlow-condensed font-black text-sm text-[#4dabf7]">${(row.net / 1000).toFixed(1)}K</td>
                    <td className="px-5 py-3">
                      {row.vsLastMonth === null ? (
                        <span className="font-barlow text-xs text-white/20">—</span>
                      ) : (
                        <span className={`font-barlow-condensed font-bold text-[10px] uppercase px-2 py-0.5 ${row.vsLastMonth >= 0 ? 'bg-[#C8FF00]/10 text-[#C8FF00]' : 'bg-red-500/10 text-red-400'}`}>
                          {row.vsLastMonth >= 0 ? '+' : ''}{row.vsLastMonth.toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
