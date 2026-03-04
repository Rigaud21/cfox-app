import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, PieChart, FileText,
  Settings, ArrowLeft, Menu, X, Bell,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', hash: '' },
  { icon: TrendingUp, label: 'Cash Flow', hash: 'cashflow' },
  { icon: PieChart, label: 'Expenses', hash: 'expenses' },
  { icon: FileText, label: 'Reports', hash: 'reports' },
  { icon: Settings, label: 'Settings', hash: 'settings' },
]

export default function DashboardNav({ activeSection, onSectionChange }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-5 border-b border-[#2e2e2e]`}>
        <span className="font-barlow-condensed font-black text-xl text-[#C8FF00] flex-shrink-0">
          CFO
        </span>
        {!collapsed && <span className="font-barlow-condensed font-black text-xl text-white">-X</span>}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ icon: Icon, label, hash }) => {
          const active = activeSection === hash
          return (
            <button
              key={label}
              onClick={() => { onSectionChange(hash); setMobileOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 group ${
                active
                  ? 'bg-[#C8FF00]/10 text-[#C8FF00]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && (
                <span className="font-barlow-condensed font-bold uppercase text-xs tracking-wider">
                  {label}
                </span>
              )}
              {active && !collapsed && (
                <span className="ml-auto w-1 h-4 bg-[#C8FF00]" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom: back to site */}
      <div className={`px-2 pb-4 space-y-1 border-t border-[#2e2e2e] pt-4`}>
        <Link
          to="/"
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-white/30 hover:text-[#C8FF00] transition-colors ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Back to site' : undefined}
        >
          <ArrowLeft size={16} className="flex-shrink-0" />
          {!collapsed && (
            <span className="font-barlow-condensed font-bold uppercase text-xs tracking-wider">
              Back to Site
            </span>
          )}
        </Link>

        {/* User avatar */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3 mt-2 border border-[#2e2e2e]">
            <div className="w-7 h-7 bg-[#C8FF00] flex items-center justify-center flex-shrink-0">
              <span className="font-barlow-condensed font-black text-xs text-[#161616]">AR</span>
            </div>
            <div className="min-w-0">
              <p className="font-barlow-condensed font-bold text-xs text-white uppercase truncate">Alex Rivera</p>
              <p className="font-barlow text-[10px] text-white/30 truncate">Acme Corp · Pro</p>
            </div>
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 border-r border-[#2e2e2e] bg-[#1e1e1e] transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-52'
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-[#2e2e2e] border border-[#3e3e3e] flex items-center justify-center z-10 hover:border-[#C8FF00] hover:text-[#C8FF00] text-white/40 transition-colors"
        >
          {collapsed ? '›' : '‹'}
        </button>
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1e1e1e] border-b border-[#2e2e2e] flex items-center justify-between px-4 h-14">
        <span className="font-barlow-condensed font-black text-xl">
          <span className="text-[#C8FF00]">CFO</span>
          <span className="text-white">-X</span>
        </span>
        <div className="flex items-center gap-3">
          <Bell size={18} className="text-white/40" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white/60 hover:text-[#C8FF00] transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-56 h-full bg-[#1e1e1e] border-r border-[#2e2e2e] flex flex-col pt-14">
            <NavContent />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  )
}
