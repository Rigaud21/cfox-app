import { Check, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Base',
    price: 99,
    tagline: 'For solo founders getting their financial footing.',
    features: [
      'AI cash flow dashboard',
      '3-month financial history',
      '6 core KPI metrics',
      'Weekly email reports',
      'Bank sync (1 account)',
      '1 user seat',
      'Email support',
    ],
    cta: 'Join Waitlist',
    featured: false,
  },
  {
    name: 'Starter',
    price: 199,
    tagline: 'The sweet spot for growing businesses.',
    features: [
      'Everything in Base',
      '12-month financial history',
      'Advanced expense categorization',
      'AI CFO chat (50 queries/mo)',
      '3-month cash flow forecast',
      'Bank sync (up to 5 accounts)',
      '3 user seats',
      'Anomaly detection alerts',
      'Priority email support',
    ],
    cta: 'Join Waitlist',
    featured: true,
  },
  {
    name: 'Pro',
    price: 399,
    tagline: 'Full AI CFO power for scaling businesses.',
    features: [
      'Everything in Starter',
      'Unlimited financial history',
      'Unlimited AI CFO queries',
      '12-month cash flow forecast',
      'Custom scenario modeling',
      'Unlimited bank accounts',
      '10 user seats',
      'API access',
      'Dedicated onboarding',
      'Slack & phone support',
    ],
    cta: 'Join Waitlist',
    featured: false,
  },
]

export default function Pricing() {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="pricing" className="py-24 sm:py-32 border-t border-[#2e2e2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-barlow-condensed font-bold text-xs uppercase tracking-[0.3em] text-[#C8FF00] mb-3">
            Pricing
          </p>
          <h2 className="font-barlow-condensed font-black uppercase text-5xl sm:text-6xl lg:text-7xl text-white leading-none mb-4">
            Transparent,{' '}
            <span className="text-[#C8FF00]">No B.S.</span>
          </h2>
          <p className="font-barlow text-white/40 text-lg max-w-xl mx-auto">
            No setup fees. No hidden costs. Cancel anytime.
            Beta users lock in these rates forever.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2e2e2e]">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 ${
                plan.featured ? 'bg-[#1e1e1e]' : 'bg-[#161616]'
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C8FF00]" />
              )}
              {plan.featured && (
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={12} className="text-[#C8FF00]" />
                  <span className="font-barlow-condensed font-bold text-xs uppercase tracking-[0.2em] text-[#C8FF00]">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-barlow-condensed font-black uppercase text-2xl text-white mb-1">
                  {plan.name}
                </h3>
                <p className="font-barlow text-xs text-white/40 leading-relaxed">
                  {plan.tagline}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="font-barlow-condensed font-black text-6xl text-white leading-none">
                    ${plan.price}
                  </span>
                  <span className="font-barlow text-white/30 text-sm mb-2">/month</span>
                </div>
                {plan.featured && (
                  <p className="font-barlow text-xs text-[#C8FF00]/60 mt-1">
                    Billed monthly · No contract
                  </p>
                )}
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check
                      size={14}
                      className={`flex-shrink-0 mt-0.5 ${plan.featured ? 'text-[#C8FF00]' : 'text-white/30'}`}
                    />
                    <span className="font-barlow text-sm text-white/60">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToWaitlist}
                className={plan.featured ? 'btn-primary w-full py-4' : 'btn-ghost w-full py-4'}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise row */}
        <div className="mt-px bg-[#2e2e2e]">
          <div className="bg-[#1e1e1e] px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-barlow-condensed font-black uppercase text-xl text-white">
                Enterprise
              </h4>
              <p className="font-barlow text-sm text-white/40">
                Custom pricing for teams 10+. White-labeling, SSO, SLAs, and dedicated support.
              </p>
            </div>
            <button
              onClick={scrollToWaitlist}
              className="font-barlow-condensed font-black uppercase text-sm tracking-wider text-[#C8FF00] hover:text-white transition-colors whitespace-nowrap"
            >
              Contact Us →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
