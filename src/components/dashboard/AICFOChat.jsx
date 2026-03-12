import { useState, useEffect, useRef } from 'react'
import { Send, Bot, Loader, Sparkles } from 'lucide-react'
import { supabase } from '../../supabaseClient'

const SUGGESTED_PROMPTS = [
  "What's my cash flow looking like?",
  'Should I hire someone right now?',
  "Where is most of my money going?",
  "What's my runway if expenses stay flat?",
  "Am I on track to hit my revenue goal?",
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-7 h-7 bg-[#C8FF00] flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-black" />
      </div>
      <div className="bg-[#242424] border border-[#2e2e2e] px-4 py-3 flex items-center gap-1.5">
        {[0, 150, 300].map(delay => (
          <span
            key={delay}
            className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

function UserBubble({ content }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] bg-[#C8FF00] px-4 py-3">
        <p className="font-barlow text-sm text-black leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

function AIBubble({ content }) {
  return (
    <div className="flex items-end gap-3">
      <div className="w-7 h-7 bg-[#C8FF00] flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-black" />
      </div>
      <div className="max-w-[80%] bg-[#242424] border border-[#2e2e2e] px-4 py-3">
        <p className="font-barlow text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}

export default function AICFOChat({ user, profile }) {
  const [messages, setMessages] = useState([])
  const [input,    setInput]    = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [loading,  setLoading]  = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)

  // Load chat history from Supabase
  useEffect(() => {
    if (!user) return
    supabase
      .from('ai_chat_history')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50)
      .then(({ data }) => {
        if (data?.length) setMessages(data.map(m => ({ role: m.role, content: m.content })))
        setLoading(false)
      })
  }, [user])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    const msg = (text || input).trim()
    if (!msg || isTyping) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setIsTyping(true)

    try {
      // Send last 10 messages as history context (excluding the one we just added)
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }))

      const res  = await fetch('/api/ai-cfo-chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          message: msg,
          businessContext: profile || {},
          history,
        }),
      })
      const data = await res.json()
      const aiContent = data.error ? `⚠️ ${data.error}` : data.response

      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }])

      // Persist both messages to Supabase from the frontend
      if (!data.error && user) {
        await supabase.from('ai_chat_history').insert([
          { user_id: user.id, role: 'user',      content: msg       },
          { user_id: user.id, role: 'assistant', content: aiContent },
        ])
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role:    'assistant',
        content: `Unable to reach AI service. Check that ANTHROPIC_API_KEY is configured in Vercel.\n\n${err.message}`,
      }])
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 210px)', minHeight: 500 }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#C8FF00] flex items-center justify-center">
          <Bot size={20} className="text-black" />
        </div>
        <div>
          <h2 className="font-barlow-condensed font-black uppercase text-xl text-white">AI CFO</h2>
          <p className="font-barlow text-xs text-white/30">
            {profile?.business_name || 'Your business'} · Powered by Claude Sonnet
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
          <span className="font-barlow-condensed font-bold uppercase text-[10px] tracking-wider text-[#C8FF00]">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-[#1e1e1e] border border-[#2e2e2e] overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader size={20} className="animate-spin text-[#C8FF00]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-4">
            <div className="w-16 h-16 bg-[#C8FF00]/10 border border-[#C8FF00]/20 flex items-center justify-center">
              <Sparkles size={28} className="text-[#C8FF00]" />
            </div>
            <div>
              <h3 className="font-barlow-condensed font-black uppercase text-xl text-white mb-1">Your AI CFO is ready.</h3>
              <p className="font-barlow text-sm text-white/40 max-w-sm">Ask anything about your business finances. Get CFO-grade analysis, not generic advice.</p>
            </div>
            <div className="w-full max-w-md space-y-2 mt-2">
              {SUGGESTED_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left border border-[#2e2e2e] bg-[#242424] px-4 py-2.5 font-barlow text-sm text-white/60 hover:text-white hover:border-[#C8FF00]/30 hover:bg-[#C8FF00]/5 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              msg.role === 'user'
                ? <UserBubble key={i} content={msg.content} />
                : <AIBubble   key={i} content={msg.content} />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-3">
        {messages.length > 0 && !isTyping && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {SUGGESTED_PROMPTS.slice(0, 3).map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-[10px] font-barlow-condensed font-bold uppercase tracking-wider border border-[#2e2e2e] px-2.5 py-1 text-white/30 hover:text-[#C8FF00] hover:border-[#C8FF00]/30 transition-colors"
              >
                {p.length > 28 ? p.slice(0, 28) + '…' : p}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Ask your AI CFO anything about your finances..."
            rows={1}
            disabled={isTyping}
            className="flex-1 form-input resize-none py-3 text-sm disabled:opacity-50"
            style={{ minHeight: 48, maxHeight: 120 }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-12 bg-[#C8FF00] flex items-center justify-center text-black hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isTyping ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <p className="font-barlow text-[10px] text-white/20 mt-1.5 text-center">
          Powered by Claude Sonnet · AI-generated guidance, not professional financial advice.
        </p>
      </div>
    </div>
  )
}
