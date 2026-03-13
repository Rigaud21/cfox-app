import { useState } from 'react'
import {
  AlertTriangle, CheckCircle, ChevronRight, Shield,
  Sparkles, Loader, DollarSign, Zap,
} from 'lucide-react'

// ── Shared helpers ────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }) {
  return (
    <div className="pl-4 border-l-2 border-[#C8FF00]">
      <h2 className="font-barlow-condensed font-black uppercase text-xl text-white">{title}</h2>
      {subtitle && <p className="font-barlow text-xs text-white/40 mt-0.5">{subtitle}</p>}
    </div>
  )
}

function PartnerTag() {
  return (
    <span className="font-barlow text-[9px] text-white/25 italic">
      CFO-X partner · referral fee may apply
    </span>
  )
}

function ProductCard({ badge, name, rate, rateLabel, bullets, cta, ctaUrl, highlight }) {
  return (
    <div className={`border p-5 relative flex flex-col ${highlight ? 'border-[#C8FF00]/40 bg-[#C8FF00]/5' : 'border-[#2e2e2e] bg-[#1e1e1e]'}`}>
      {badge && (
        <span className="absolute top-3 right-3 bg-[#C8FF00] text-black font-barlow-condensed font-black uppercase text-[9px] tracking-wider px-2 py-0.5">
          {badge}
        </span>
      )}
      <div className="mb-3">
        <h4 className="font-barlow-condensed font-black uppercase text-base text-white pr-20">{name}</h4>
        {rate && (
          <p className={`font-barlow-condensed font-black text-2xl mt-1 ${highlight ? 'text-[#C8FF00]' : 'text-white'}`}>
            {rate}{' '}
            <span className="text-sm font-barlow font-normal text-white/40">{rateLabel}</span>
          </p>
        )}
      </div>
      {bullets && (
        <ul className="space-y-1.5 mb-4 flex-1">
          {bullets.map(b => (
            <li key={b} className="flex items-start gap-2 font-barlow text-xs text-white/60">
              <CheckCircle size={11} className={`flex-shrink-0 mt-0.5 ${highlight ? 'text-[#C8FF00]' : 'text-white/30'}`} />
              {b}
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center justify-between mt-auto pt-3">
        <PartnerTag />
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1 font-barlow-condensed font-black uppercase text-xs tracking-wider px-3 py-1.5 transition-colors ${
            highlight
              ? 'bg-[#C8FF00] text-black hover:bg-white'
              : 'border border-[#2e2e2e] text-white/60 hover:text-white hover:border-white/30'
          }`}
        >
          {cta} <ChevronRight size={11} />
        </a>
      </div>
    </div>
  )
}

// ── Section 1: Idle Cash Detector ─────────────────────────────────────────────

function IdleCashSection() {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="💸 Idle Cash Detector"
        subtitle="Cash sitting in checking is losing you money every day"
      />

      {/* Alert */}
      <div className="border border-[#C8FF00]/30 bg-[#C8FF00]/5 p-5 flex items-start gap-3">
        <AlertTriangle size={18} className="text-[#C8FF00] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-barlow-condensed font-black uppercase text-sm text-white">
            ⚠️ You have $47,000 sitting in checking earning 0.01% APY
          </p>
          <p className="font-barlow text-xs text-white/40 mt-1">
            Based on your average checking balance over the past 30 days.
          </p>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5">
        <h3 className="font-barlow-condensed font-black uppercase text-sm text-white mb-4">ROI Calculator</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-[#161616] border border-[#2e2e2e] p-4">
            <p className="font-barlow-condensed font-bold uppercase text-[10px] tracking-wider text-white/30 mb-1">Current (0.01% APY)</p>
            <p className="font-barlow-condensed font-black text-3xl text-white/40">
              $4.70 <span className="text-sm font-barlow font-normal">/year</span>
            </p>
            <p className="font-barlow text-[10px] text-white/20 mt-1">$47,000 × 0.01% APY</p>
          </div>
          <div className="bg-[#C8FF00]/5 border border-[#C8FF00]/30 p-4">
            <p className="font-barlow-condensed font-bold uppercase text-[10px] tracking-wider text-[#C8FF00]/60 mb-1">Mercury HYSA (4.50% APY)</p>
            <p className="font-barlow-condensed font-black text-3xl text-[#C8FF00]">
              $2,115 <span className="text-sm font-barlow font-normal text-[#C8FF00]/50">/year</span>
            </p>
            <p className="font-barlow text-[10px] text-[#C8FF00]/40 mt-1">$47,000 × 4.50% APY</p>
          </div>
        </div>

        {/* Comparison bars */}
        <div className="space-y-3 mb-5">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="font-barlow text-[10px] text-white/40">Current checking (0.01%)</span>
              <span className="font-barlow text-[10px] text-white/40">$4.70/yr</span>
            </div>
            <div className="h-3 bg-[#2e2e2e]">
              <div className="h-full bg-white/20" style={{ width: 2 }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="font-barlow text-[10px] text-[#C8FF00]/70">Mercury HYSA (4.50%)</span>
              <span className="font-barlow text-[10px] text-[#C8FF00]/70">$2,115/yr</span>
            </div>
            <div className="h-3 bg-[#2e2e2e]">
              <div className="h-full bg-[#C8FF00]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <div className="border border-red-500/20 bg-red-500/5 px-4 py-3">
          <p className="font-barlow-condensed font-black uppercase text-sm text-red-400">
            You're losing $2,110.30 every year by not moving this money
          </p>
        </div>
      </div>

      {/* Product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ProductCard
          highlight
          badge="BEST RATE"
          name="Mercury Business Savings"
          rate="4.50%"
          rateLabel="APY"
          bullets={['No minimum balance', 'FDIC insured up to $5M', 'Free wire transfers']}
          cta="Open Account"
          ctaUrl="https://mercury.com"
        />
        <ProductCard
          name="Relay Business Savings"
          rate="3.76%"
          rateLabel="APY"
          bullets={['No fees ever', 'Multiple savings accounts', 'Free ACH transfers']}
          cta="Open Account"
          ctaUrl="https://relayfi.com"
        />
        <ProductCard
          name="Bluevine Business Checking"
          rate="2.0%"
          rateLabel="APY on checking"
          bullets={['No monthly fees', 'Unlimited transactions', 'FDIC insured']}
          cta="Open Account"
          ctaUrl="https://bluevine.com"
        />
      </div>
    </div>
  )
}

// ── Section 2: Smart Card Matcher ─────────────────────────────────────────────

const SPENDING = [
  { label: 'Software & Subscriptions', amount: 8316,  pct: 22 },
  { label: 'Marketing',                amount: 6804,  pct: 18 },
  { label: 'Operations',               amount: 5292,  pct: 14 },
]

function CardMatcherSection() {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="💳 Smart Card Matcher"
        subtitle="Based on your spending patterns, here's your perfect business card match"
      />

      {/* Spending analysis */}
      <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5">
        <h3 className="font-barlow-condensed font-black uppercase text-sm text-white mb-4">Your Spending Analysis</h3>
        <div className="space-y-3">
          {SPENDING.map(({ label, amount, pct }) => (
            <div key={label}>
              <div className="flex justify-between mb-1.5">
                <span className="font-barlow text-xs text-white/70">{label}</span>
                <span className="font-barlow text-xs text-white/40">${amount.toLocaleString()}/mo · {pct}%</span>
              </div>
              <div className="h-2 bg-[#2e2e2e]">
                <div className="h-full bg-[#C8FF00]/60" style={{ width: `${(pct / 22) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top match */}
      <div className="border border-[#C8FF00]/40 bg-[#C8FF00]/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-[#C8FF00] text-black font-barlow-condensed font-black uppercase text-[9px] tracking-wider px-2 py-0.5">
            YOUR TOP MATCH
          </span>
          <span className="font-barlow-condensed font-bold uppercase text-[10px] text-white/30 tracking-wider">
            92% match score
          </span>
        </div>

        <h3 className="font-barlow-condensed font-black uppercase text-2xl text-white mb-1">Brex Business Card</h3>
        <p className="font-barlow text-xs text-white/50 mb-5">
          Your software spending earns 7x points — worth $582/mo in rewards on your current spend
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <ul className="space-y-2">
            {[
              '7x points on software subscriptions',
              '4x points on travel',
              'No personal guarantee required',
              'Built for startups and SMBs',
              '$0 annual fee',
            ].map(b => (
              <li key={b} className="flex items-start gap-2 font-barlow text-xs text-white/70">
                <CheckCircle size={11} className="text-[#C8FF00] flex-shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
          <div className="bg-[#161616] border border-[#C8FF00]/20 p-4 text-center flex flex-col items-center justify-center">
            <p className="font-barlow-condensed font-bold uppercase text-[10px] tracking-wider text-[#C8FF00]/50 mb-1">
              Estimated Annual Rewards
            </p>
            <p className="font-barlow-condensed font-black text-4xl text-[#C8FF00]">$6,984</p>
            <p className="font-barlow text-[10px] text-white/30 mt-1">based on your current spend</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <PartnerTag />
          <div className="flex flex-col items-end gap-1">
            <a
              href="https://brex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#C8FF00] text-black font-barlow-condensed font-black uppercase text-xs tracking-wider px-4 py-2 hover:bg-white transition-colors"
            >
              Apply Now — Check Eligibility <ChevronRight size={12} />
            </a>
            <span className="font-barlow text-[9px] text-white/25">Takes 2 minutes · No hard credit pull</span>
          </div>
        </div>
      </div>

      {/* Other matches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {
            name: 'Ramp Business Card',
            desc: 'Best for: expense automation & controls',
            stat: '$4,200',
            statLabel: 'Annual Savings Estimate',
            url: 'https://ramp.com',
          },
          {
            name: 'Amex Blue Business Cash',
            desc: 'Best for: flat 2% cash back on everything',
            stat: '$3,650',
            statLabel: 'Annual Cashback Estimate',
            url: 'https://americanexpress.com',
          },
        ].map(({ name, desc, stat, statLabel, url }) => (
          <div key={name} className="border border-[#2e2e2e] bg-[#1e1e1e] p-5 flex flex-col">
            <h4 className="font-barlow-condensed font-black uppercase text-base text-white mb-1">{name}</h4>
            <p className="font-barlow text-xs text-white/40 mb-4">{desc}</p>
            <div className="mb-4 flex-1">
              <p className="font-barlow-condensed font-bold uppercase text-[10px] text-white/30 mb-0.5">{statLabel}</p>
              <p className="font-barlow-condensed font-black text-2xl text-white">{stat}</p>
            </div>
            <div className="flex items-center justify-between">
              <PartnerTag />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 border border-[#2e2e2e] text-white/60 hover:text-white hover:border-white/30 font-barlow-condensed font-black uppercase text-xs tracking-wider px-3 py-1.5 transition-colors"
              >
                Learn More <ChevronRight size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Section 3: Financing Matcher ──────────────────────────────────────────────

function FinancingSection() {
  return (
    <div className="space-y-5">
      <SectionHeader
        title="🏦 Financing Matcher"
        subtitle="Replace predatory MCAs with real business financing"
      />

      {/* Warning banner */}
      <div className="border border-red-500/30 bg-red-500/5 p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
        <p className="font-barlow text-sm text-red-400 leading-relaxed">
          <span className="font-barlow-condensed font-black uppercase">⛔ Warning: </span>
          If you're using a Merchant Cash Advance, you're paying 40–150% effective APR. There are better options.
        </p>
      </div>

      {/* Pre-qual engine */}
      <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5">
        <h3 className="font-barlow-condensed font-black uppercase text-sm text-white mb-1">
          Pre-Qualification Engine
        </h3>
        <p className="font-barlow text-xs text-white/30 mb-4">See what you qualify for — no hard credit pull</p>

        <div className="border border-[#C8FF00]/30 bg-[#C8FF00]/5 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="font-barlow-condensed font-bold uppercase text-[10px] tracking-wider text-[#C8FF00]/50 mb-1">
                Estimated Pre-Qualification
              </p>
              <p className="font-barlow-condensed font-black text-5xl text-[#C8FF00]">$85,000</p>
              <p className="font-barlow text-xs text-white/40 mt-2 leading-relaxed">
                Based on: Monthly revenue $55,200 · 14 months runway · Clean cash flow
              </p>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="w-20 h-20 border-4 border-[#C8FF00] flex items-center justify-center mx-auto mb-1">
                <span className="font-barlow-condensed font-black text-2xl text-[#C8FF00]">87%</span>
              </div>
              <p className="font-barlow text-[10px] text-white/30">Confidence Score</p>
              <p className="font-barlow text-[10px] text-white/20">Likely to qualify</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financing cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ProductCard
          highlight
          badge="BEST FOR YOUR PROFILE"
          name="Bluevine Line of Credit"
          rate="From 6.2%"
          rateLabel="APR"
          bullets={['Up to $250,000', 'Draw funds in 24 hours', 'Only pay on what you draw']}
          cta="Check My Rate"
          ctaUrl="https://bluevine.com"
        />
        <ProductCard
          name="Fundbox Revolving Credit"
          rate="From 4.66%"
          rateLabel="per draw"
          bullets={['Up to $150,000', 'Connect accounting software', 'Flexible repayment']}
          cta="Apply in 2 Minutes"
          ctaUrl="https://fundbox.com"
        />
        <ProductCard
          name="SBA 7(a) via Lendio"
          rate="From 5.5%"
          rateLabel="APR"
          bullets={['Up to $500,000', 'Best long-term rates', 'Takes 2–4 weeks']}
          cta="Start Application"
          ctaUrl="https://lendio.com"
        />
      </div>

      {/* Ethics standard */}
      <div className="border border-[#2e2e2e] p-4 flex items-start gap-3">
        <Shield size={15} className="text-[#C8FF00] flex-shrink-0 mt-0.5" />
        <p className="font-barlow text-xs text-white/40 leading-relaxed">
          <span className="font-barlow-condensed font-bold uppercase text-white/50">CFO-X Ethical Lending Standard: </span>
          CFO-X will never recommend Merchant Cash Advances, Revenue-Based Financing above 30% APR, or predatory lenders. We only partner with institutions that meet our ethical lending standards.
        </p>
      </div>
    </div>
  )
}

// ── Section 4: AI Money Coach ─────────────────────────────────────────────────

const AI_PROMPT = `Analyze this business's complete financial picture and provide a Smart Money Report with exactly these 4 sections:

IDLE CASH: How much is sitting uninvested and what moving it to a HYSA would earn annually.

CREDIT OPTIMIZATION: Based on their top spending categories what credit card would maximize their rewards and estimated annual value.

FINANCING READINESS: Are they ready for a business line of credit or loan? What amount would they likely qualify for and what would they use it for strategically.

QUICK WINS: 3 specific money moves they can make in the next 30 days that would immediately improve their financial position. Be specific with dollar amounts.`

const SECTION_HEADINGS = ['IDLE CASH', 'CREDIT OPTIMIZATION', 'FINANCING READINESS', 'QUICK WINS']

function parseSections(text) {
  const results = []
  for (let i = 0; i < SECTION_HEADINGS.length; i++) {
    const heading = SECTION_HEADINGS[i]
    const next    = SECTION_HEADINGS[i + 1]
    const pattern = next
      ? new RegExp(`${heading}:?([\\s\\S]*?)(?=${next}:?)`, 'i')
      : new RegExp(`${heading}:?([\\s\\S]*)`, 'i')
    const match = text.match(pattern)
    if (match?.[1]?.trim()) {
      results.push({ heading, content: match[1].trim() })
    }
  }
  return results
}

function AIMoneyCoach({ user, profile }) {
  const [report,   setReport]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [error,    setError]    = useState(null)

  const runAnalysis = async () => {
    setLoading(true)
    setReport(null)
    setError(null)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress(p => (p < 88 ? p + Math.random() * 10 : p))
    }, 400)

    try {
      const res  = await fetch('/api/ai-cfo-chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          message:         AI_PROMPT,
          businessContext: profile || {},
          history:         [],
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setProgress(100)
        setReport(data.response)
      }
    } catch (err) {
      setError(`Unable to reach AI service: ${err.message}`)
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const sections = report ? parseSections(report) : []

  return (
    <div className="space-y-5">
      <SectionHeader
        title="🤖 AI Money Coach"
        subtitle="AI analyzes your complete financial data and generates a personalized money optimization report"
      />

      {!report && !loading && (
        <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-8 text-center">
          <div className="w-14 h-14 bg-[#C8FF00]/10 border border-[#C8FF00]/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={24} className="text-[#C8FF00]" />
          </div>
          <h3 className="font-barlow-condensed font-black uppercase text-xl text-white mb-2">
            Your personalized Money Report is waiting
          </h3>
          <p className="font-barlow text-sm text-white/40 max-w-sm mx-auto mb-6">
            CFO-X will analyze your cash position, spending patterns, and financial profile to find every dollar you're leaving on the table.
          </p>
          <button
            onClick={runAnalysis}
            className="bg-[#C8FF00] text-black font-barlow-condensed font-black uppercase tracking-wider px-8 py-3 text-sm hover:bg-white transition-colors inline-flex items-center gap-2"
          >
            <Zap size={15} />
            Run AI Money Analysis
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-8">
          <div className="flex items-center gap-3 mb-4">
            <Loader size={18} className="animate-spin text-[#C8FF00]" />
            <p className="font-barlow-condensed font-black uppercase text-sm text-white">
              CFO-X is analyzing your complete financial picture...
            </p>
          </div>
          <div className="h-1.5 bg-[#2e2e2e] overflow-hidden">
            <div
              className="h-full bg-[#C8FF00] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-barlow text-[10px] text-white/25">Analyzing cash, spending, and financing readiness...</span>
            <span className="font-barlow text-[10px] text-white/25">{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {error && (
        <div className="border border-red-500/30 bg-red-500/5 px-4 py-3">
          <p className="font-barlow text-xs text-red-400">{error}</p>
          <button
            onClick={runAnalysis}
            className="font-barlow-condensed font-black uppercase text-xs text-[#C8FF00] mt-2 hover:text-white transition-colors"
          >
            Try Again →
          </button>
        </div>
      )}

      {report && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-barlow-condensed font-bold uppercase text-[10px] tracking-wider text-[#C8FF00]">
              ✓ Analysis Complete
            </span>
            <button
              onClick={runAnalysis}
              className="font-barlow-condensed font-bold uppercase text-[10px] tracking-wider text-white/30 hover:text-white border border-[#2e2e2e] px-2.5 py-1 transition-colors"
            >
              Re-run Analysis
            </button>
          </div>

          {sections.length > 0 ? (
            sections.map(({ heading, content }) => (
              <div key={heading} className="bg-[#1e1e1e] border border-[#2e2e2e] p-5">
                <h3 className="font-barlow-condensed font-black uppercase text-base text-[#C8FF00] mb-3 pl-3 border-l-2 border-[#C8FF00]">
                  {heading}
                </h3>
                <p className="font-barlow text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{content}</p>
              </div>
            ))
          ) : (
            <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5">
              <p className="font-barlow text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{report}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function SmartMoneyTab({ user, profile }) {
  return (
    <div className="space-y-10">
      {/* Top banner */}
      <div className="border border-[#C8FF00]/20 bg-[#C8FF00]/5 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#C8FF00] flex items-center justify-center flex-shrink-0 mt-0.5">
            <DollarSign size={20} className="text-black" />
          </div>
          <div>
            <h1 className="font-barlow-condensed font-black uppercase text-3xl text-white leading-tight mb-1">
              Your money is working against you. Here's how to fix it.
            </h1>
            <p className="font-barlow text-sm text-white/40 max-w-2xl leading-relaxed">
              CFO-X analyzes your financial data to find hidden opportunities — better rates, smarter products, and pre-approved funding. We earn a small referral fee when you apply. Your data is never sold.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2e2e2e]" />
      <IdleCashSection />

      <div className="border-t border-[#2e2e2e]" />
      <CardMatcherSection />

      <div className="border-t border-[#2e2e2e]" />
      <FinancingSection />

      <div className="border-t border-[#2e2e2e]" />
      <AIMoneyCoach user={user} profile={profile} />
    </div>
  )
}
