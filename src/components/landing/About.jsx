import { TrendingUp, Brain, Search, MessageSquare } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    number: '01',
    title: 'Real-Time Cash Flow',
    description:
      'Live sync with your bank accounts, accounting tools, and payment processors. See every dollar moving through your business, the moment it happens.',
  },
  {
    icon: Brain,
    number: '02',
    title: 'AI Predictions',
    description:
      'Our models learn your business patterns to forecast cash flow 90 days out. Identify risks before they become crises — with confidence intervals you can act on.',
  },
  {
    icon: Search,
    number: '03',
    title: 'Expense Intelligence',
    description:
      'Automatic categorization and anomaly detection. Find subscription creep, duplicate vendors, and budget overruns before they kill your margin.',
  },
  {
    icon: MessageSquare,
    number: '04',
    title: 'Your AI CFO',
    description:
      "Ask anything. \"What's our runway if we hire two engineers next quarter?\" Get boardroom-quality financial answers in seconds — no spreadsheet required.",
  },
]

export default function About() {
  return (
    <section id="features" className="py-24 sm:py-32 border-t border-[#2e2e2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-barlow-condensed font-bold text-xs uppercase tracking-[0.3em] text-[#C8FF00] mb-3">
              What We Do
            </p>
            <h2 className="font-barlow-condensed font-black uppercase text-5xl sm:text-6xl lg:text-7xl text-white leading-none max-w-lg">
              Financial Intelligence,{' '}
              <span className="text-[#C8FF00]">Built Different.</span>
            </h2>
          </div>
          <p className="font-barlow text-white/40 text-sm max-w-xs leading-relaxed md:text-right">
            CFO-X replaces the spreadsheets, guesswork, and expensive consultants with a single AI-powered command center.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2e2e2e]">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.number}
                className="bg-[#161616] p-8 flex flex-col gap-6 group hover:bg-[#1e1e1e] transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 border border-[#2e2e2e] flex items-center justify-center group-hover:border-[#C8FF00] transition-colors duration-200">
                    <Icon size={18} className="text-[#C8FF00]" />
                  </div>
                  <span className="font-barlow-condensed font-black text-4xl text-white/5 group-hover:text-[#C8FF00]/10 transition-colors leading-none">
                    {f.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-barlow-condensed font-black uppercase text-xl text-white mb-3 tracking-wide">
                    {f.title}
                  </h3>
                  <p className="font-barlow text-sm text-white/40 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-px bg-[#2e2e2e]">
          <div className="bg-[#1e1e1e] px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="font-barlow-condensed font-black uppercase text-lg text-white/50">
              Integrated with the tools you already use —{' '}
              <span className="text-white">QuickBooks, Xero, Stripe, Plaid, and more.</span>
            </p>
            <div className="flex items-center gap-4">
              {['QB', 'XR', 'ST', 'PL'].map((abbr) => (
                <span
                  key={abbr}
                  className="w-9 h-9 border border-[#2e2e2e] flex items-center justify-center font-barlow-condensed font-black text-xs text-white/30 hover:border-[#C8FF00] hover:text-[#C8FF00] transition-colors cursor-default"
                >
                  {abbr}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
