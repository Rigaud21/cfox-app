import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const stats = [
  { value: '500+', label: 'Businesses on waitlist' },
  { value: '10 hrs', label: 'Saved per week' },
  { value: '99.9%', label: 'Data accuracy' },
  { value: '90 days', label: 'Cash flow forecast' },
]

export default function Hero() {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(#C8FF00 1px, transparent 1px),
            linear-gradient(90deg, #C8FF00 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Lime glow blob */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#C8FF00] opacity-[0.03] blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[#C8FF00]/30 bg-[#C8FF00]/5 px-3 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
          <span className="font-barlow-condensed font-bold text-xs uppercase tracking-[0.2em] text-[#C8FF00]">
            Now Accepting Early Access
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-barlow-condensed font-black uppercase leading-none text-white mb-6">
          <span className="block text-[clamp(52px,10vw,130px)] tracking-tight">
            Your AI CFO,
          </span>
          <span className="block text-[clamp(52px,10vw,130px)] tracking-tight text-[#C8FF00]">
            Always On.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="font-barlow text-lg sm:text-xl text-white/50 max-w-2xl leading-relaxed mb-10">
          Real-time financial intelligence for small businesses that move fast.
          Know your runway, predict your cash flow, and make boardroom-quality
          decisions — powered by AI.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button onClick={scrollToWaitlist} className="btn-primary text-base px-8 py-4">
            Get Early Access
          </button>
          <Link
            to="/dashboard"
            className="btn-ghost text-base px-8 py-4 flex items-center justify-center gap-2"
          >
            View Live Demo <ArrowRight size={16} />
          </Link>
        </div>

        {/* Stats bar */}
        <div className="border-t border-[#2e2e2e] pt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-barlow-condensed font-black text-3xl sm:text-4xl text-[#C8FF00] leading-none mb-1">
                {s.value}
              </div>
              <div className="font-barlow text-xs text-white/40 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom marquee strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#2e2e2e] bg-[#1e1e1e] py-3 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-[scroll_20s_linear_infinite]">
          {Array(6).fill(['CASH FLOW', 'RUNWAY', 'BURN RATE', 'PROFIT MARGIN', 'AI FORECASTING', 'EXPENSE INTEL']).flat().map((item, i) => (
            <span key={i} className="font-barlow-condensed font-black text-xs uppercase tracking-[0.2em] text-white/20">
              {item} <span className="text-[#C8FF00] mx-4">◆</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
