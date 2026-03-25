export default function WaitlistConfirmed() {
  const teaserCards = [
    {
      emoji: '🤖',
      title: 'AI CFO Chat',
      desc: 'Ask your finances anything. Get CFO-grade answers in seconds.',
    },
    {
      emoji: '⚡',
      title: 'Risk Alerts',
      desc: "We'll warn you before problems become crises.",
    },
    {
      emoji: '💰',
      title: 'Smart Money',
      desc: "We'll find money you're leaving on the table.",
    },
  ]

  const socials = [
    { label: 'Twitter / X', handle: '@cfox_miami', href: 'https://x.com/cfox_miami' },
    { label: 'Instagram', handle: '@cfox.miami', href: 'https://instagram.com/cfox.miami' },
    { label: 'LinkedIn', handle: 'CFO-X', href: 'https://linkedin.com/company/cfox-miami' },
  ]

  return (
    <div className="min-h-screen bg-[#161616] flex flex-col items-center px-4 py-20 sm:py-28">

      {/* Logo */}
      <div className="mb-14">
        <span className="font-barlow-condensed font-black uppercase text-[#C8FF00] text-3xl tracking-widest">
          CFO-X
        </span>
      </div>

      {/* Big headline */}
      <h1 className="font-barlow-condensed font-black uppercase text-6xl sm:text-8xl text-white text-center leading-none mb-5">
        YOU'RE ON THE LIST.
      </h1>

      {/* Subheadline */}
      <p className="font-barlow text-white/40 text-lg sm:text-xl text-center max-w-xl leading-relaxed mb-12">
        We're heads down building something that will change how small businesses manage money forever.
      </p>

      {/* Private development card */}
      <div className="border border-[#C8FF00]/40 bg-[#1a1a1a] px-8 py-6 max-w-lg w-full text-center mb-16">
        <p className="font-barlow text-white/80 text-base leading-relaxed">
          <span className="font-bold text-white">🔒 CFO-X is currently in private development.</span>
          <br />
          We'll be in touch in the next few weeks with early access details, product updates, and what's coming next.
        </p>
      </div>

      {/* Teaser cards */}
      <div className="grid sm:grid-cols-3 gap-5 max-w-4xl w-full mb-20">
        {teaserCards.map(({ emoji, title, desc }) => (
          <div key={title} className="relative border border-[#2e2e2e] bg-[#1e1e1e] p-6 overflow-hidden">
            {/* Blur overlay */}
            <div className="absolute inset-0 backdrop-blur-[2px] bg-[#161616]/40 z-10" />
            {/* COMING SOON badge */}
            <div className="absolute top-3 right-3 z-20 bg-[#C8FF00] px-2 py-0.5">
              <span className="font-barlow-condensed font-bold text-[#161616] text-xs uppercase tracking-widest">
                Coming Soon
              </span>
            </div>
            {/* Content (blurred underneath) */}
            <div className="relative z-0">
              <div className="text-3xl mb-3">{emoji}</div>
              <div className="w-6 h-0.5 bg-[#C8FF00] mb-3" />
              <h3 className="font-barlow-condensed font-black uppercase text-white text-xl mb-2">
                {title}
              </h3>
              <p className="font-barlow text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Social section */}
      <div className="text-center mb-10">
        <p className="font-barlow text-white/50 text-sm uppercase tracking-widest mb-6">
          In the meantime, follow our journey:
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {socials.map(({ label, handle, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#2e2e2e] hover:border-[#C8FF00] px-5 py-3 transition-colors duration-200 group"
            >
              <span className="font-barlow text-xs text-white/30 uppercase tracking-widest block mb-0.5 group-hover:text-white/50 transition-colors">
                {label}
              </span>
              <span className="font-barlow-condensed font-bold text-white text-base uppercase tracking-wide group-hover:text-[#C8FF00] transition-colors">
                {handle}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="font-barlow text-white/25 text-xs text-center max-w-sm leading-relaxed mb-6">
        You'll receive updates at the email you provided. We respect your inbox — we'll only reach out when it matters.
      </p>

      {/* Miami line */}
      <p className="font-barlow-condensed font-bold uppercase text-[#C8FF00] text-sm tracking-widest text-center">
        Built in Miami. For every business that deserves better.
      </p>
    </div>
  )
}
