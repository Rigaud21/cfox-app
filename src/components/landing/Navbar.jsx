import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useTheme()

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#161616]/95 backdrop-blur-sm border-b border-[#2e2e2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="font-barlow-condensed font-black text-2xl text-[#C8FF00] tracking-tight">
            CFO<span className="text-white">-X</span>
          </span>
          <span className="hidden sm:block text-[10px] font-barlow-condensed font-bold uppercase tracking-[0.2em] text-white/30 border-l border-[#2e2e2e] pl-3">
            AI Financial Intelligence
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo('features')}
            className="text-sm font-barlow-condensed font-bold uppercase tracking-wider text-white/60 hover:text-[#C8FF00] transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollTo('pricing')}
            className="text-sm font-barlow-condensed font-bold uppercase tracking-wider text-white/60 hover:text-[#C8FF00] transition-colors"
          >
            Pricing
          </button>
          <Link
            to="/about"
            className="text-sm font-barlow-condensed font-bold uppercase tracking-wider text-white/60 hover:text-[#C8FF00] transition-colors"
          >
            About
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-barlow-condensed font-bold uppercase tracking-wider text-white/60 hover:text-[#C8FF00] transition-colors"
          >
            Demo
          </Link>
          {/* Theme toggle */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm leading-none">{darkMode ? '🌙' : '☀️'}</span>
            <label className="switch">
              <input type="checkbox" checked={!darkMode} onChange={toggleDarkMode} />
              <span className="slider" />
            </label>
          </div>

          <Link to="/signup" className="btn-primary text-xs py-2 px-5">
            Get Early Access
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/70 hover:text-[#C8FF00] transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#2e2e2e] bg-[#161616] px-4 py-6 flex flex-col gap-5">
          <button onClick={() => scrollTo('features')} className="text-left text-sm font-barlow-condensed font-bold uppercase tracking-wider text-white/60 hover:text-[#C8FF00] transition-colors">
            Features
          </button>
          <button onClick={() => scrollTo('pricing')} className="text-left text-sm font-barlow-condensed font-bold uppercase tracking-wider text-white/60 hover:text-[#C8FF00] transition-colors">
            Pricing
          </button>
          <Link to="/about" onClick={() => setOpen(false)} className="text-sm font-barlow-condensed font-bold uppercase tracking-wider text-white/60 hover:text-[#C8FF00] transition-colors">
            About
          </Link>
          <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-barlow-condensed font-bold uppercase tracking-wider text-white/60 hover:text-[#C8FF00] transition-colors">
            Demo
          </Link>
          <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary text-xs w-full text-center">
            Get Early Access
          </Link>
          {/* Theme toggle */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm leading-none">{darkMode ? '🌙' : '☀️'}</span>
            <label className="switch">
              <input type="checkbox" checked={!darkMode} onChange={toggleDarkMode} />
              <span className="slider" />
            </label>
          </div>
        </div>
      )}
    </nav>
  )
}
