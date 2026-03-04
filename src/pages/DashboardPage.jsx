import { useState } from 'react'
import { Bell, Search, RefreshCw } from 'lucide-react'
import DashboardNav from '../components/dashboard/DashboardNav'
import KPICards from '../components/dashboard/KPICards'
import CashFlowChart from '../components/dashboard/CashFlowChart'
import ExpenseBreakdown from '../components/dashboard/ExpenseBreakdown'
import AICFOChat from '../components/dashboard/AICFOChat'

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('')

  return (
    <div className="flex h-screen overflow-hidden bg-[#161616]">
      {/* Left sidebar */}
      <DashboardNav activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 h-14 border-b border-[#2e2e2e] bg-[#161616] flex items-center justify-between px-4 sm:px-6 gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <Search size={14} className="text-white/20 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search transactions, reports..."
              className="bg-transparent text-xs font-barlow text-white/60 placeholder-white/20 focus:outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 font-barlow-condensed font-bold text-xs uppercase tracking-wider text-white/30 hover:text-[#C8FF00] transition-colors">
              <RefreshCw size={12} />
              <span className="hidden sm:inline">Sync</span>
            </button>
            <div className="relative">
              <Bell size={16} className="text-white/30 hover:text-white transition-colors cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C8FF00] rounded-full flex items-center justify-center">
                <span className="font-barlow-condensed font-black text-[8px] text-[#161616]">3</span>
              </span>
            </div>
            <div className="w-7 h-7 bg-[#C8FF00] flex items-center justify-center">
              <span className="font-barlow-condensed font-black text-xs text-[#161616]">AR</span>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

            {/* KPI Cards */}
            <section id="overview">
              <KPICards />
            </section>

            {/* Charts row */}
            <section id="cashflow-expenses" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div id="cashflow">
                <CashFlowChart />
              </div>
              <div id="expenses">
                <ExpenseBreakdown />
              </div>
            </section>

            {/* AI Insight Banner */}
            <section>
              <div className="border border-[#C8FF00]/20 bg-[#C8FF00]/5 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-10 h-10 bg-[#C8FF00] flex items-center justify-center flex-shrink-0">
                  <span className="font-barlow-condensed font-black text-base text-[#161616]">AI</span>
                </div>
                <div className="flex-1">
                  <p className="font-barlow-condensed font-black uppercase text-sm text-white mb-1">
                    CFO-X Weekly Insight
                  </p>
                  <p className="font-barlow text-xs text-white/50 leading-relaxed">
                    Revenue grew <span className="text-[#C8FF00]">12.4%</span> this month, outpacing expense growth of 8.1%.
                    If this trend holds, your profit margin will reach <span className="text-white">48%</span> by Q3.
                    Consider reinvesting <span className="text-[#C8FF00]">$15,000</span> into acquisition channels while runway remains above 8 months.
                  </p>
                </div>
                <button className="font-barlow-condensed font-bold text-xs uppercase tracking-wider text-[#C8FF00] hover:text-white transition-colors whitespace-nowrap">
                  Full Report →
                </button>
              </div>
            </section>

            {/* Recent Transactions */}
            <section id="reports">
              <div className="bg-[#1e1e1e] border border-[#2e2e2e]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#2e2e2e]">
                  <h3 className="font-barlow-condensed font-black uppercase text-lg text-white">
                    Recent Transactions
                  </h3>
                  <button className="font-barlow-condensed font-bold text-xs uppercase tracking-wider text-white/30 hover:text-[#C8FF00] transition-colors">
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-[#2e2e2e]">
                  {[
                    { name: 'Stripe Payout', category: 'Revenue', amount: '+$42,800', date: 'Mar 3', positive: true },
                    { name: 'AWS — Monthly', category: 'Software', amount: '-$1,240', date: 'Mar 3', positive: false },
                    { name: 'Payroll — Feb', category: 'Payroll', amount: '-$35,200', date: 'Mar 1', positive: false },
                    { name: 'Shopify Revenue', category: 'Revenue', amount: '+$18,600', date: 'Feb 28', positive: true },
                    { name: 'Google Ads', category: 'Marketing', amount: '-$3,100', date: 'Feb 28', positive: false },
                  ].map((tx, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-[#242424] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 flex items-center justify-center text-xs font-barlow-condensed font-black ${
                          tx.positive ? 'bg-[#C8FF00]/10 text-[#C8FF00]' : 'bg-white/5 text-white/30'
                        }`}>
                          {tx.positive ? '↑' : '↓'}
                        </div>
                        <div>
                          <p className="font-barlow-condensed font-bold text-sm text-white group-hover:text-[#C8FF00] transition-colors">
                            {tx.name}
                          </p>
                          <p className="font-barlow text-xs text-white/30">{tx.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-barlow-condensed font-black text-sm ${tx.positive ? 'text-[#C8FF00]' : 'text-white'}`}>
                          {tx.amount}
                        </p>
                        <p className="font-barlow text-xs text-white/20">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Mobile AI CFO chat */}
            <section className="xl:hidden">
              <div className="bg-[#1e1e1e] border border-[#2e2e2e] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-[#C8FF00] flex items-center justify-center">
                    <span className="font-barlow-condensed font-black text-xs text-[#161616]">AI</span>
                  </div>
                  <h3 className="font-barlow-condensed font-black uppercase text-lg text-white">
                    AI CFO Chat
                  </h3>
                  <span className="font-barlow text-[10px] text-[#C8FF00] ml-1">Online</span>
                </div>
                <p className="font-barlow text-xs text-white/40 leading-relaxed mb-4">
                  Your AI CFO is available in the sidebar on larger screens.
                  It can analyze cash flow, forecast runway, identify savings, and answer any financial question in plain English.
                </p>
                <div className="border border-[#C8FF00]/20 bg-[#C8FF00]/5 px-4 py-3">
                  <p className="font-barlow text-xs text-white/60 italic">
                    "Cutting marketing by 20% would save $4,680/mo and extend runway from 8.4 to 9.1 months. However, historical data suggests this could reduce Q2 revenue by ~12%."
                  </p>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>

      {/* Right AI chat panel */}
      <AICFOChat />
    </div>
  )
}
