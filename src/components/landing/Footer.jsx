import { Link } from 'react-router-dom'

export default function Footer() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-[#2e2e2e] bg-[#161616]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-barlow-condensed font-black text-3xl mb-3">
              <span className="text-[#C8FF00]">CFO</span>
              <span className="text-white">-X</span>
            </div>
            <p className="font-barlow text-sm text-white/30 leading-relaxed max-w-xs">
              AI-powered financial intelligence for small businesses that can't afford to be wrong about money.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-barlow-condensed font-bold uppercase text-xs tracking-[0.2em] text-white/30 mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Features', id: 'features' },
                { label: 'Pricing', id: 'pricing' },
                { label: 'Early Access', id: 'waitlist' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="font-barlow text-sm text-white/40 hover:text-[#C8FF00] transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  to="/dashboard"
                  className="font-barlow text-sm text-white/40 hover:text-[#C8FF00] transition-colors"
                >
                  Live Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-barlow-condensed font-bold uppercase text-xs tracking-[0.2em] text-white/30 mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-barlow text-sm text-white/40 hover:text-[#C8FF00] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2e2e2e] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-barlow text-xs text-white/20">
            © {new Date().getFullYear()} CFO-X, Inc. All rights reserved.
          </p>
          <p className="font-barlow-condensed font-bold text-xs uppercase tracking-widest text-white/20">
            Built for builders. Powered by AI.
          </p>
        </div>
      </div>
    </footer>
  )
}
