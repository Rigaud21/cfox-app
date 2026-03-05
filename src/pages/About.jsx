import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'

/* ─── Scroll Reveal ──────────────────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect() } },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, vis]
}

const fade = (vis, delay = 0) => ({
  opacity: vis ? 1 : 0,
  transform: vis ? 'none' : 'translateY(28px)',
  transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
})

/* ─── Data ───────────────────────────────────────────────────── */
const timeline = [
  {
    label: 'The Wake-Up Call',
    text: 'Waking up to $30,000 dropping to under $5,000 overnight — no warning, no forecast, no system. Just a number that changed everything.',
  },
  {
    label: 'The Restaurant',
    text: 'My father, a first-generation immigrant, built a restaurant from nothing. One bank account handled everything — payroll, inventory, rent — all tangled together with no separation.',
  },
  {
    label: 'The Shadow CFO',
    text: 'From a young age, I was making major financial decisions with zero visibility into the numbers. The uncertainty was crushing on the whole family.',
  },
  {
    label: 'The Self-Education',
    text: 'I started learning on my own. Credit unions, HYSA for business, separating accounts for operations, expenses, income, and savings. Messy — but it made day-to-day survival better.',
  },
  {
    label: 'The Question',
    isQuote: true,
    text: 'What if we could gather all the financial data, funnel it into one place, and break it down to eliminate the blindspots — before they break the business?',
  },
]

const stats = [
  {
    value: '80%',
    label: 'of small businesses fail within 5 years',
    note: 'Not bad products — financial blindspots.',
  },
  {
    value: '34M',
    label: 'small businesses in America',
    note: 'Operating without a dedicated financial person.',
  },
  {
    value: '$0',
    label: 'what most SMBs spend on financial intelligence',
    note: "Not because they don't need it — because they can't afford it.",
  },
  {
    value: '1',
    label: 'restaurant, one family, one bank account',
    note: 'Where CFO-X was born.',
  },
]

const founderFacts = [
  'Miami, Florida',
  'Computer Science at Miami Dade College',
  '21 years old — building the tool his family never had',
  'Former "shadow CEO" — learned business inside a family restaurant',
]

const storyParagraphs = [
  "I'm 21 years old, born and raised in Miami. I didn't come from money — I came from a family that bet everything on a dream.",
  "My father is an immigrant who built a restaurant from nothing. I grew up inside that business, making decisions that affected the whole family.",
  "I watched my parents carry stress no one should carry alone. One day $30,000 in the account. Next morning, under $5,000. No warning, no system, no one to call — just survival mode.",
  "That experience didn't break me — it built me. I started learning everything about business finance. Structuring accounts, credit unions, separating income from expenses, thinking ahead. Essentially becoming the CFO the family never had — at 19, with no formal training.",
  "Then it hit me: millions of families are going through exactly this right now — and they don't have anyone to help them either.",
  "That's why I built CFO-X. Not to build another fintech app — but to be the financial partner that every immigrant family, every first-generation entrepreneur, every small business owner grinding every day deserves to have in their corner.",
]

const pillars = [
  { icon: '🔦', title: 'Illuminate', desc: "Surface every blindspot, risk, and opportunity before it's too late." },
  { icon: '🧠', title: 'Intelligize', desc: "Don't just show data — tell you what it means and what to do next." },
  { icon: '🛡️', title: 'Protect', desc: 'Reduce the 80% failure rate, one business, one decision, one family at a time.' },
]

const features = [
  { num: '01', icon: '📊', title: 'Real-Time Dashboard', desc: 'All your financial data in one place: revenue, expenses, cash flow, runway — live, automatic, no manual entry.' },
  { num: '02', icon: '🔮', title: 'Cash Flow Forecasting', desc: 'AI-powered 90-day projections so you never wake up to an empty account again.' },
  { num: '03', icon: '🤖', title: 'AI CFO Chat', desc: "Ask anything: \"Should I hire now? What's my runway? Where is my money going?\" CFO-grade answers from your real numbers." },
  { num: '04', icon: '⚡', title: 'Risk Alerts', desc: 'Proactive warnings before problems become crises. Unusual spending, low cash, anomalies — caught early.' },
  { num: '05', icon: '🎯', title: 'Scenario Planning', desc: 'Model any decision before making it: new hire, price increase, new location. See the financial impact first.' },
  { num: '06', icon: '🔗', title: 'Seamless Integrations', desc: 'Connect your bank accounts, QuickBooks, and Xero in minutes. Automatic. No accountant required.' },
]

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero() {
  const [ref, vis] = useReveal(0)
  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#C8FF00 1px, transparent 1px), linear-gradient(90deg, #C8FF00 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* "21" watermark */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(200px, 32vw, 480px)',
          color: '#C8FF00',
          opacity: 0.04,
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}
      >
        21
      </div>
      {/* Lime glow */}
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] rounded-full bg-[#C8FF00] opacity-[0.025] blur-[130px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
        {/* Tag */}
        <div style={fade(vis, 0)} className="inline-flex items-center gap-2 border border-[#C8FF00]/30 bg-[#C8FF00]/5 px-3 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00]" />
          <span className="font-barlow-condensed font-bold text-xs uppercase tracking-[0.25em] text-[#C8FF00]">Our Story</span>
        </div>

        {/* Headline */}
        <h1
          style={{ fontSize: 'clamp(52px, 9vw, 122px)', letterSpacing: '-0.02em' }}
          className="font-barlow-condensed font-black uppercase leading-none text-white mb-6"
        >
          <span style={fade(vis, 80)} className="block">Built From The</span>
          <span style={fade(vis, 160)} className="block text-[#C8FF00]">Inside Out.</span>
        </h1>

        {/* Subline */}
        <p style={fade(vis, 260)} className="font-barlow text-lg sm:text-xl text-white/50 max-w-2xl leading-relaxed">
          CFO-X wasn't born in a boardroom or a Silicon Valley accelerator. It was born in a Miami
          restaurant kitchen — in the receipts, the stress, and the sleepless nights of a family
          betting everything on a dream.
        </p>
      </div>
    </section>
  )
}

/* ─── Origin Story ───────────────────────────────────────────── */
function OriginStory() {
  const [ref, vis] = useReveal()
  return (
    <section ref={ref} className="py-24 sm:py-32 border-t border-[#2e2e2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: timeline */}
          <div>
            <div style={fade(vis, 0)}>
              <p className="font-barlow-condensed font-bold text-xs uppercase tracking-[0.3em] text-[#C8FF00] mb-3">
                The Origin
              </p>
              <h2
                className="font-barlow-condensed font-black uppercase text-white leading-none mb-12"
                style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
              >
                Where It<br />All Started
              </h2>
            </div>

            <div>
              {timeline.map((item, i) => (
                <div
                  key={item.label}
                  style={fade(vis, 120 + i * 90)}
                  className={`relative pl-8 pb-10 last:pb-0 border-l-2 ${
                    item.isQuote ? 'border-[#C8FF00]' : 'border-[#2e2e2e]'
                  }`}
                >
                  {/* Timeline dot */}
                  <span
                    className={`absolute -left-[5px] top-0 w-2.5 h-2.5 bg-[#C8FF00] flex-shrink-0 ${
                      item.isQuote ? '' : 'rounded-full'
                    }`}
                  />
                  <span className="font-barlow-condensed font-bold text-xs uppercase tracking-[0.2em] text-[#C8FF00] mb-2 block">
                    {item.label}
                  </span>
                  {item.isQuote ? (
                    <p className="font-barlow-condensed font-black text-xl sm:text-2xl text-white leading-snug">
                      "{item.text}"
                    </p>
                  ) : (
                    <p className="font-barlow text-sm text-white/50 leading-relaxed">{item.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: stat cards */}
          <div className="space-y-4 lg:pt-24">
            {stats.map((s, i) => (
              <div
                key={s.value}
                style={fade(vis, 150 + i * 90)}
                className="border-l-4 border-[#C8FF00] bg-[#1e1e1e] px-6 py-5 hover:bg-[#242424] transition-colors"
              >
                <div
                  className="font-barlow-condensed font-black text-[#C8FF00] leading-none mb-1"
                  style={{ fontSize: 'clamp(40px, 5vw, 60px)' }}
                >
                  {s.value}
                </div>
                <p className="font-barlow-condensed font-bold uppercase text-sm text-white tracking-wide mb-1">
                  {s.label}
                </p>
                <p className="font-barlow text-xs text-white/40 leading-relaxed">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Founder ────────────────────────────────────────────────── */
function Founder() {
  const [ref, vis] = useReveal()
  return (
    <section ref={ref} className="py-24 sm:py-32 border-t border-[#2e2e2e] bg-[#1e1e1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: sticky founder card */}
          <div style={fade(vis, 0)} className="lg:sticky lg:top-24">
            <div className="border border-[#2e2e2e] overflow-hidden">
              {/* Lime initials block */}
              <div
                className="flex items-center justify-center bg-[#C8FF00]"
                style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}
              >
                <span
                  className="font-barlow-condensed font-black text-[#161616] select-none"
                  style={{ fontSize: 80, lineHeight: 1 }}
                >
                  RA
                </span>
              </div>
              {/* Info */}
              <div className="bg-[#161616] p-6 sm:p-7">
                <h3 className="font-barlow-condensed font-black uppercase text-2xl text-white mb-0.5">
                  Rigaud Alexandre
                </h3>
                <p className="font-barlow text-sm text-[#C8FF00] mb-6">Founder & CEO, CFO-X</p>
                <div className="space-y-3">
                  {founderFacts.map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] flex-shrink-0 mt-1.5" />
                      <span className="font-barlow text-sm text-white/50 leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: story */}
          <div>
            <div style={fade(vis, 100)}>
              <p className="font-barlow-condensed font-bold text-xs uppercase tracking-[0.3em] text-[#C8FF00] mb-3">
                The Founder
              </p>
              <h2
                className="font-barlow-condensed font-black uppercase text-white leading-none mb-8"
                style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
              >
                Meet The Person<br />Behind CFO-X
              </h2>
            </div>

            {/* Blockquote */}
            <div style={fade(vis, 200)} className="border-l-4 border-[#C8FF00] pl-6 mb-10">
              <p className="font-barlow-condensed font-black text-xl sm:text-2xl text-white leading-snug mb-3">
                "CFO-X is the ace in the sleeve for every small business owner who can't afford a CFO
                but has the character and the will to make their business grow and thrive."
              </p>
              <span className="font-barlow-condensed font-bold text-xs uppercase tracking-widest text-[#C8FF00]">
                — Rigaud Alexandre, Founder
              </span>
            </div>

            {/* Story paragraphs */}
            <div className="space-y-5">
              {storyParagraphs.map((p, i) => (
                <p
                  key={i}
                  style={fade(vis, 280 + i * 60)}
                  className="font-barlow text-white/50 leading-relaxed"
                >
                  {p}
                </p>
              ))}
              {/* Final statement */}
              <p
                style={fade(vis, 280 + storyParagraphs.length * 60)}
                className="font-barlow-condensed font-black uppercase text-2xl sm:text-3xl text-white pt-2"
              >
                This is personal. And that's exactly why it will work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Mission ────────────────────────────────────────────────── */
function Mission() {
  const [ref, vis] = useReveal()
  return (
    <section ref={ref} className="py-24 sm:py-32 border-t border-[#2e2e2e] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div style={fade(vis, 0)}>
          <p className="font-barlow-condensed font-bold text-xs uppercase tracking-[0.3em] text-[#C8FF00] mb-10">
            Our Mission
          </p>
        </div>

        {/* Stacked mission text */}
        <div style={fade(vis, 80)} className="mb-20">
          {[
            { text: 'Kill', color: '#ffffff', outline: false },
            { text: 'Financial', color: '#C8FF00', outline: false },
            { text: 'Blindspots', color: 'transparent', outline: true },
            { text: 'Forever.', color: '#ffffff', outline: false },
          ].map((line) => (
            <div
              key={line.text}
              className="font-barlow-condensed font-black uppercase leading-[0.9]"
              style={{
                fontSize: 'clamp(58px, 11vw, 142px)',
                letterSpacing: '-0.02em',
                color: line.color,
                ...(line.outline
                  ? { WebkitTextStroke: '2px #C8FF00' }
                  : {}),
              }}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2e2e2e]">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              style={fade(vis, 200 + i * 80)}
              className="bg-[#161616] p-8 hover:bg-[#1e1e1e] transition-colors group"
            >
              <span className="text-3xl mb-5 block">{p.icon}</span>
              <h3 className="font-barlow-condensed font-black uppercase text-xl text-white mb-3 tracking-wide">
                {p.title}
              </h3>
              <p className="font-barlow text-sm text-white/40 leading-relaxed">{p.desc}</p>
              <div className="mt-6 h-0.5 w-0 bg-[#C8FF00] group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Features ───────────────────────────────────────────────── */
function Features() {
  const [ref, vis] = useReveal()
  return (
    <section ref={ref} className="py-24 sm:py-32 border-t border-[#2e2e2e] bg-[#1e1e1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div style={fade(vis, 0)} className="mb-12">
          <p className="font-barlow-condensed font-bold text-xs uppercase tracking-[0.3em] text-[#C8FF00] mb-3">
            What CFO-X Does
          </p>
          <h2
            className="font-barlow-condensed font-black uppercase text-white leading-none"
            style={{ fontSize: 'clamp(44px, 7vw, 88px)' }}
          >
            The Ace In<br />Your Sleeve
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#2e2e2e]">
          {features.map((f, i) => (
            <div
              key={f.num}
              style={fade(vis, 100 + i * 60)}
              className="relative bg-[#161616] p-8 overflow-hidden hover:bg-[#1e1e1e] transition-colors group"
            >
              {/* Faded number watermark */}
              <span
                className="absolute top-3 right-5 font-barlow-condensed font-black select-none pointer-events-none leading-none"
                style={{ fontSize: 88, color: 'rgba(255,255,255,0.04)' }}
              >
                {f.num}
              </span>
              <span className="text-2xl mb-4 block">{f.icon}</span>
              <h3 className="font-barlow-condensed font-black uppercase text-xl text-white mb-3 tracking-wide">
                {f.title}
              </h3>
              <p className="font-barlow text-sm text-white/40 leading-relaxed mb-5">{f.desc}</p>
              <ArrowRight
                size={16}
                className="text-[#C8FF00] transition-transform duration-200 group-hover:translate-x-1"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ────────────────────────────────────────────────────── */
function CTA() {
  const [ref, vis] = useReveal()
  return (
    <section ref={ref} className="py-24 sm:py-32" style={{ backgroundColor: '#C8FF00' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2
          style={{
            ...fade(vis, 0),
            fontSize: 'clamp(48px, 8vw, 104px)',
            letterSpacing: '-0.02em',
          }}
          className="font-barlow-condensed font-black uppercase text-[#161616] leading-none mb-6"
        >
          Your Business<br />Deserves This.
        </h2>
        <p
          style={fade(vis, 120)}
          className="font-barlow text-[#161616]/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Join the waitlist and be among the first businesses to get CFO-grade financial intelligence — built for the rest of us.
        </p>
        <div style={fade(vis, 220)}>
          <a
            href="/#waitlist"
            className="inline-flex items-center gap-2 bg-[#161616] text-white font-barlow-condensed font-black uppercase tracking-wider px-8 py-4 text-sm hover:bg-black transition-colors active:scale-95"
          >
            Join the Waitlist <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function About() {
  return (
    <div className="bg-[#161616] min-h-screen">
      <Navbar />
      <Hero />
      <OriginStory />
      <Founder />
      <Mission />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}
