import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, ChevronRight, Sparkles } from 'lucide-react'

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'bot',
    text: 'Good morning. Cash position is strong at **$284,500**. Runway at **8.4 months**. Burn rate up 5.2% month-over-month. Want a full briefing?',
    time: '9:01 AM',
  },
  {
    id: 2,
    role: 'user',
    text: 'What\'s driving the expense increase in March?',
    time: '9:03 AM',
  },
  {
    id: 3,
    role: 'bot',
    text: 'March expenses rose **13.0%** vs February. Top drivers:\n\n1. Payroll +$8,200 (2 new hires)\n2. Marketing +$3,100 (Q2 campaign launch)\n\nI also found **3 unused software subscriptions** totaling $1,840/mo. Want me to flag them for review?',
    time: '9:03 AM',
  },
  {
    id: 4,
    role: 'user',
    text: 'Yes — which tools should we cut?',
    time: '9:04 AM',
  },
  {
    id: 5,
    role: 'bot',
    text: 'Recommended for cancellation:\n\n• **Notion Pro** — $800/mo (2 of 12 seats active)\n• **Loom Business** — $640/mo (last used 47 days ago)\n• **Clearbit** — $400/mo (0 API calls in 30 days)\n\nTotal savings: **$22,080/year**. Canceling all three extends runway by **~0.4 months**.',
    time: '9:04 AM',
  },
]

const SUGGESTIONS = [
  'Run a 6-month forecast',
  'What if we cut marketing 20%?',
  'Show payroll breakdown',
  'Analyze Q1 vs Q2',
]

function formatText(text) {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-bold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ))
  })
}

export default function AICFOChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: `Analyzing "${trimmed}"...\n\nBased on your current financials, I recommend reviewing your **Q2 projections** in light of recent expense trends. Your net cash flow of $128,300 is healthy, but I'm tracking **2 potential risk signals** in your burn rate trajectory. Want a detailed breakdown?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((m) => [...m, botMsg])
      setTyping(false)
    }, 1600)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <aside className="hidden xl:flex flex-col w-80 flex-shrink-0 h-screen sticky top-0 border-l border-[#2e2e2e] bg-[#1e1e1e]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#2e2e2e]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#C8FF00] flex items-center justify-center">
            <Sparkles size={13} className="text-[#161616]" />
          </div>
          <div>
            <p className="font-barlow-condensed font-black uppercase text-sm text-white tracking-wide">
              AI CFO
            </p>
            <p className="font-barlow text-[10px] text-[#C8FF00] leading-none">Online</p>
          </div>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center mt-0.5 ${
              msg.role === 'bot' ? 'bg-[#C8FF00]' : 'bg-[#2e2e2e]'
            }`}>
              {msg.role === 'bot'
                ? <Bot size={12} className="text-[#161616]" />
                : <User size={12} className="text-white/60" />
              }
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-3 py-2.5 text-xs font-barlow leading-relaxed ${
                msg.role === 'bot'
                  ? 'bg-[#242424] text-white/70 border border-[#2e2e2e]'
                  : 'bg-[#C8FF00]/10 text-white/80 border border-[#C8FF00]/20'
              }`}>
                {formatText(msg.text)}
              </div>
              <span className="font-barlow text-[10px] text-white/20 px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex gap-2">
            <div className="w-6 h-6 flex-shrink-0 bg-[#C8FF00] flex items-center justify-center">
              <Bot size={12} className="text-[#161616]" />
            </div>
            <div className="bg-[#242424] border border-[#2e2e2e] px-3 py-2.5 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-[#C8FF00]"
                  style={{
                    animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-4 py-2 border-t border-[#2e2e2e]">
        <p className="font-barlow-condensed font-bold text-[10px] uppercase tracking-widest text-white/20 mb-2">
          Quick Actions
        </p>
        <div className="flex flex-col gap-1">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="flex items-center gap-1.5 text-left text-xs font-barlow text-white/40 hover:text-[#C8FF00] transition-colors group py-0.5"
            >
              <ChevronRight size={10} className="text-white/20 group-hover:text-[#C8FF00] transition-colors" />
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-3 py-3 border-t border-[#2e2e2e] flex items-center gap-2"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your CFO anything..."
          className="flex-1 bg-[#161616] border border-[#2e2e2e] text-white text-xs font-barlow px-3 py-2.5 placeholder-white/20 focus:outline-none focus:border-[#C8FF00] transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          className="w-9 h-9 bg-[#C8FF00] flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send size={13} className="text-[#161616]" />
        </button>
      </form>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </aside>
  )
}
