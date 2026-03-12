import { useState, useMemo } from 'react'
import { Users, TrendingUp, MapPin, Sparkles } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { supabase } from '../../supabaseClient'

const SCENARIOS = [
  { id: 'hire',     icon: Users,      label: 'Hire Someone',       desc: 'Model the impact of a new hire on runway & cash flow' },
  { id: 'prices',   icon: TrendingUp, label: 'Raise Prices',        desc: 'See the net effect of a price increase after churn' },
  { id: 'location', icon: MapPin,     label: 'New Location',        desc: 'Calculate investment needed and break-even timeline' },
]

const CURRENT_MONTHLY_BURN    = 37800
const CURRENT_MONTHLY_REVENUE = 55200
const CURRENT_RUNWAY_MONTHS   = 14
const CASH_RESERVES           = CURRENT_MONTHLY_BURN * CURRENT_RUNWAY_MONTHS

function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] border border-[#2e2e2e] p-3 min-w-[150px]">
      <p className="font-barlow-condensed font-bold text-xs text-[#C8FF00] uppercase tracking-wider mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="font-barlow text-xs text-white/50">{p.name}</span>
          </div>
          <span className="font-barlow-condensed font-bold text-sm text-white">${p.value}K</span>
        </div>
      ))}
    </div>
  )
}

function HireScenario() {
  const [salary,     setSalary]     = useState(6000)
  const [startMonth, setStartMonth] = useState(3)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)

  const result = useMemo(() => {
    const s = Number(salary)  || 0
    const m = Number(startMonth) || 1
    const newBurn    = CURRENT_MONTHLY_BURN + s
    const newRunway  = CASH_RESERVES / newBurn
    const reduction  = CURRENT_RUNWAY_MONTHS - newRunway

    const chartData = Array.from({ length: 18 }, (_, i) => {
      const month = i + 1
      const cashBase = CASH_RESERVES - CURRENT_MONTHLY_BURN * month + CURRENT_MONTHLY_REVENUE * 0.05 * month
      const addlBurn  = month >= m ? s : 0
      const revenueBoost = month > m + 2 ? s * 0.4 : 0 // hire contributes after ramp
      const cashHire  = CASH_RESERVES - (CURRENT_MONTHLY_BURN + addlBurn) * month + (CURRENT_MONTHLY_REVENUE * 0.05 + revenueBoost) * month
      return {
        month:   `M${month}`,
        'No Hire': Math.max(0, Math.round(cashBase / 1000)),
        'With Hire': Math.max(0, Math.round(cashHire / 1000)),
      }
    })

    const risk = newRunway < 8 ? 'high' : newRunway < 11 ? 'moderate' : 'low'
    const rec = newRunway < 8
      ? `High Risk: This hire reduces your runway from ${CURRENT_RUNWAY_MONTHS} to ${newRunway.toFixed(0)} months — below the 8-month safety threshold. Your current burn rate would hit $${(newBurn / 1000).toFixed(1)}K/mo. Wait until MoM revenue is consistently above $${((CURRENT_MONTHLY_REVENUE * 1.15) / 1000).toFixed(0)}K.`
      : newRunway < 11
      ? `Moderate Risk: Runway drops to ${newRunway.toFixed(0)} months. This is viable if the hire drives measurable revenue within 4–5 months. Consider a 3-month contractor trial first to validate ROI before committing to full-time.`
      : `Manageable: At ${newRunway.toFixed(0)} months runway post-hire, your ${(100 - (s / CURRENT_MONTHLY_REVENUE * 100)).toFixed(0)}% profit margin can absorb this. Proceed if you have a clear 90-day performance plan tied to revenue outcomes.`

    return { newRunway: newRunway.toFixed(1), reduction: reduction.toFixed(1), newBurn, chartData, risk, rec }
  }, [salary, startMonth])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5 space-y-5">
          <h3 className="font-barlow-condensed font-black uppercase text-lg text-white">Parameters</h3>
          <div>
            <label className="form-label">Monthly Salary ($)</label>
            <input
              type="number"
              className="form-input"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              min={1000}
              max={50000}
              step={500}
            />
          </div>
          <div>
            <label className="form-label">Start Month (from now)</label>
            <select className="form-input" value={startMonth} onChange={e => setStartMonth(e.target.value)}>
              {[1,2,3,4,5,6].map(m => <option key={m} value={m}>Month {m}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-px bg-[#2e2e2e]">
            {[
              { label: 'New Runway',    value: `${result.newRunway} mo`, color: Number(result.newRunway) < 8 ? '#ff4d4d' : '#C8FF00' },
              { label: 'Runway Lost',   value: `${result.reduction} mo`,  color: '#f59f00' },
              { label: 'New Monthly Burn', value: `$${(result.newBurn / 1000).toFixed(1)}K`, color: '#4dabf7' },
              { label: 'Risk Level',    value: result.risk.toUpperCase(), color: result.risk === 'high' ? '#ff4d4d' : result.risk === 'moderate' ? '#f59f00' : '#C8FF00' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#161616] p-3">
                <p className="font-barlow-condensed font-bold uppercase text-[10px] tracking-widest text-white/30 mb-1">{label}</p>
                <p className="font-barlow-condensed font-black text-base" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5">
          <h3 className="font-barlow-condensed font-black uppercase text-lg text-white mb-4">Cash Balance Projection</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={result.chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tickFormatter={v => `$${v}K`} tick={{ fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<LineTooltip />} />
              <Line type="monotone" dataKey="No Hire"    stroke="#C8FF00" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="With Hire"  stroke="#ff4d4d" strokeWidth={2} dot={false} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[['No Hire', '#C8FF00', ''], ['With Hire', '#ff4d4d', '5 3']].map(([lbl, color, dash]) => (
              <div key={lbl} className="flex items-center gap-1.5">
                <svg width="16" height="8"><line x1="0" y1="4" x2="16" y2="4" stroke={color} strokeWidth="2" strokeDasharray={dash} /></svg>
                <span className="font-barlow-condensed font-bold text-[10px] uppercase tracking-wider text-white/40">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="border border-[#C8FF00]/20 bg-[#C8FF00]/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-[#C8FF00]" />
          <span className="font-barlow-condensed font-black uppercase text-sm tracking-wider text-[#C8FF00]">CFO-X Recommendation</span>
        </div>
        <p className="font-barlow text-sm text-white/70 leading-relaxed">{result.rec}</p>
      </div>
    </div>
  )
}

function PricesScenario() {
  const [increase, setIncrease] = useState(15)
  const [churn,    setChurn]    = useState(8)

  const result = useMemo(() => {
    const inc   = Number(increase) / 100
    const ch    = Number(churn) / 100
    const newRevenue    = CURRENT_MONTHLY_REVENUE * (1 + inc) * (1 - ch)
    const revDelta      = newRevenue - CURRENT_MONTHLY_REVENUE
    const newNet        = 17400 + revDelta
    const newMargin     = ((newNet / newRevenue) * 100)
    const breakEvenChurn = inc / (1 + inc) * 100

    const chartData = Array.from({ length: 12 }, (_, i) => ({
      month:     `M${i + 1}`,
      Current:   Math.round(CURRENT_MONTHLY_REVENUE / 1000 + i * 0.5),
      'New Price': Math.round(newRevenue / 1000 + i * 0.55 * (1 - ch * 0.3)),
    }))

    const net = revDelta >= 0
      ? `Positive: +$${Math.abs(revDelta).toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo net revenue. Your margin would increase from 31.5% to ${newMargin.toFixed(1)}%. Break-even churn rate is ${breakEvenChurn.toFixed(1)}% — you're estimating ${churn}%, so this move is profitable.`
      : `Negative: The ${churn}% churn estimate exceeds your break-even churn of ${breakEvenChurn.toFixed(1)}%. You'd lose $${Math.abs(revDelta).toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo. Reduce the price increase to ${Math.round(breakEvenChurn * 0.8)}% or improve retention before raising prices.`

    return { newRevenue: newRevenue.toFixed(0), revDelta: revDelta.toFixed(0), newMargin: newMargin.toFixed(1), breakEvenChurn: breakEvenChurn.toFixed(1), chartData, net }
  }, [increase, churn])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5 space-y-5">
          <h3 className="font-barlow-condensed font-black uppercase text-lg text-white">Parameters</h3>
          <div>
            <label className="form-label">Price Increase (%)</label>
            <input type="range" min={1} max={50} value={increase} onChange={e => setIncrease(e.target.value)} className="w-full accent-[#C8FF00] mb-1" />
            <div className="flex justify-between"><span className="font-barlow-condensed font-black text-xl text-[#C8FF00]">{increase}%</span><span className="font-barlow text-xs text-white/30">1% – 50%</span></div>
          </div>
          <div>
            <label className="form-label">Estimated Customer Churn (%)</label>
            <input type="range" min={0} max={40} value={churn} onChange={e => setChurn(e.target.value)} className="w-full accent-[#ff4d4d] mb-1" />
            <div className="flex justify-between"><span className="font-barlow-condensed font-black text-xl text-red-400">{churn}%</span><span className="font-barlow text-xs text-white/30">0% – 40%</span></div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-[#2e2e2e]">
            {[
              { label: 'New Revenue', value: `$${(Number(result.newRevenue) / 1000).toFixed(1)}K/mo`, color: '#C8FF00' },
              { label: 'Rev Delta',   value: `${result.revDelta >= 0 ? '+' : ''}$${Number(result.revDelta).toLocaleString('en-US', { maximumFractionDigits: 0 })}`, color: Number(result.revDelta) >= 0 ? '#C8FF00' : '#ff4d4d' },
              { label: 'New Margin',  value: `${result.newMargin}%`, color: '#4dabf7' },
              { label: 'Break-even Churn', value: `${result.breakEvenChurn}%`, color: '#f59f00' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#161616] p-3">
                <p className="font-barlow-condensed font-bold uppercase text-[10px] tracking-widest text-white/30 mb-1">{label}</p>
                <p className="font-barlow-condensed font-black text-base" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5">
          <h3 className="font-barlow-condensed font-black uppercase text-lg text-white mb-4">Revenue Projection</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={result.chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tickFormatter={v => `$${v}K`} tick={{ fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<LineTooltip />} />
              <Line type="monotone" dataKey="Current"   stroke="#555555" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="New Price" stroke="#C8FF00" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border border-[#C8FF00]/20 bg-[#C8FF00]/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-[#C8FF00]" />
          <span className="font-barlow-condensed font-black uppercase text-sm tracking-wider text-[#C8FF00]">CFO-X Recommendation</span>
        </div>
        <p className="font-barlow text-sm text-white/70 leading-relaxed">{result.net}</p>
      </div>
    </div>
  )
}

function LocationScenario() {
  const [monthlyCost, setMonthlyCost]   = useState(8000)
  const [expectedRev, setExpectedRev]   = useState(15000)
  const [rampMonths,  setRampMonths]    = useState(4)

  const result = useMemo(() => {
    const cost = Number(monthlyCost) || 0
    const rev  = Number(expectedRev) || 0
    const ramp = Number(rampMonths)  || 1

    const upfrontSetup    = cost * 3 // 3x monthly = first/last/deposit
    const monthlyNet      = rev - cost
    const breakEvenMonths = monthlyNet > 0 ? Math.ceil(upfrontSetup / monthlyNet + ramp) : null
    const year1Impact     = -(upfrontSetup) - (cost * ramp) + (rev * Math.max(0, 12 - ramp))
    const cashAtRisk      = upfrontSetup + cost * ramp

    const chartData = Array.from({ length: 24 }, (_, i) => {
      const month = i + 1
      const revenue = month > ramp ? rev : rev * (month / ramp)
      const cumCash = -(upfrontSetup) - cost * month + revenue * Math.max(0, month - 1)
      return {
        month:   `M${month}`,
        'Cash Impact': Math.round(cumCash / 1000),
      }
    })

    const riskRating = cashAtRisk > CASH_RESERVES * 0.3 ? 'HIGH' : cashAtRisk > CASH_RESERVES * 0.15 ? 'MODERATE' : 'LOW'
    const rec = breakEvenMonths === null
      ? 'This location loses money every month — revenue does not cover operating costs. Either reduce monthly costs or increase expected revenue before proceeding.'
      : cashAtRisk > CASH_RESERVES * 0.3
      ? `High Risk: You'd put $${(cashAtRisk / 1000).toFixed(0)}K at risk (${((cashAtRisk / CASH_RESERVES) * 100).toFixed(0)}% of cash reserves). Break-even is month ${breakEvenMonths}. With 14-month runway, this significantly increases existential risk. Do not proceed without secured financing.`
      : `Viable at Month ${breakEvenMonths} break-even. Total cash at risk: $${(cashAtRisk / 1000).toFixed(0)}K. Your 14-month runway can absorb this if core business metrics hold. Ensure you have 3 months of the new location's costs in reserve before signing a lease.`

    return { upfrontSetup, monthlyNet, breakEvenMonths, year1Impact, cashAtRisk, riskRating, chartData, rec }
  }, [monthlyCost, expectedRev, rampMonths])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5 space-y-5">
          <h3 className="font-barlow-condensed font-black uppercase text-lg text-white">Parameters</h3>
          <div>
            <label className="form-label">Monthly Operating Cost ($)</label>
            <input type="number" className="form-input" value={monthlyCost} onChange={e => setMonthlyCost(e.target.value)} step={500} />
          </div>
          <div>
            <label className="form-label">Expected Monthly Revenue ($)</label>
            <input type="number" className="form-input" value={expectedRev} onChange={e => setExpectedRev(e.target.value)} step={500} />
          </div>
          <div>
            <label className="form-label">Ramp-up Time (months to full revenue)</label>
            <select className="form-input" value={rampMonths} onChange={e => setRampMonths(e.target.value)}>
              {[1,2,3,4,5,6,9,12].map(m => <option key={m} value={m}>{m} months</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-px bg-[#2e2e2e]">
            {[
              { label: 'Upfront Cost', value: `$${(result.upfrontSetup / 1000).toFixed(0)}K`, color: '#ff4d4d' },
              { label: 'Monthly Net', value: result.monthlyNet >= 0 ? `+$${(result.monthlyNet / 1000).toFixed(1)}K` : `-$${(Math.abs(result.monthlyNet) / 1000).toFixed(1)}K`, color: result.monthlyNet >= 0 ? '#C8FF00' : '#ff4d4d' },
              { label: 'Break-even', value: result.breakEvenMonths ? `Month ${result.breakEvenMonths}` : 'Never', color: result.breakEvenMonths ? '#4dabf7' : '#ff4d4d' },
              { label: 'Risk', value: result.riskRating, color: result.riskRating === 'HIGH' ? '#ff4d4d' : result.riskRating === 'MODERATE' ? '#f59f00' : '#C8FF00' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#161616] p-3">
                <p className="font-barlow-condensed font-bold uppercase text-[10px] tracking-widest text-white/30 mb-1">{label}</p>
                <p className="font-barlow-condensed font-black text-base" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5">
          <h3 className="font-barlow-condensed font-black uppercase text-lg text-white mb-4">Cumulative Cash Impact (24mo)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={result.chartData} margin={{ top: 5, right: 5, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tickFormatter={v => `$${v}K`} tick={{ fill: '#555', fontSize: 10, fontFamily: '"Barlow Condensed"', fontWeight: 700 }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<LineTooltip />} />
              <Line type="monotone" dataKey="Cash Impact" stroke="#C8FF00" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border border-[#C8FF00]/20 bg-[#C8FF00]/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-[#C8FF00]" />
          <span className="font-barlow-condensed font-black uppercase text-sm tracking-wider text-[#C8FF00]">CFO-X Recommendation</span>
        </div>
        <p className="font-barlow text-sm text-white/70 leading-relaxed">{result.rec}</p>
      </div>
    </div>
  )
}

export default function ScenariosTab() {
  const [active, setActive] = useState('hire')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-barlow-condensed font-black uppercase text-2xl text-white">Scenarios</h2>
        <p className="font-barlow text-xs text-white/30 mt-0.5">Model any decision before you make it</p>
      </div>

      {/* Scenario selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#2e2e2e]">
        {SCENARIOS.map(({ id, icon: Icon, label, desc }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`text-left p-5 transition-colors ${active === id ? 'bg-[#C8FF00]/10 border-b-2 border-[#C8FF00]' : 'bg-[#1e1e1e] hover:bg-[#242424]'}`}
          >
            <Icon size={18} className={active === id ? 'text-[#C8FF00] mb-2' : 'text-white/30 mb-2'} />
            <p className={`font-barlow-condensed font-black uppercase text-sm tracking-wider mb-1 ${active === id ? 'text-[#C8FF00]' : 'text-white'}`}>{label}</p>
            <p className="font-barlow text-xs text-white/40">{desc}</p>
          </button>
        ))}
      </div>

      {/* Active scenario */}
      {active === 'hire'     && <HireScenario />}
      {active === 'prices'   && <PricesScenario />}
      {active === 'location' && <LocationScenario />}
    </div>
  )
}
