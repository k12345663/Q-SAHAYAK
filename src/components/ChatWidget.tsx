import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { useLang } from '../context/useLang'
import { answerQuestion } from '../lib/chatAssistant'
import type { ChatMessage, ScoredScheme } from '../types'

export function ChatWidget({ ranked }: { ranked: ScoredScheme[] }) {
  const { t, lang } = useLang()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const send = () => {
    const q = input.trim()
    if (!q) return
    const userMsg: ChatMessage = { id: `${Date.now()}-u`, role: 'user', text: q }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      const answer = answerQuestion(q, ranked, lang)
      setMessages((m) => [...m, { id: `${Date.now()}-a`, role: 'assistant', text: answer }])
      setThinking(false)
    }, 500 + Math.random() * 400)
  }

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <Sparkles size={14} />
        </div>
        <h3 className="text-sm font-semibold">{t('askAI')}</h3>
      </div>

      {messages.length > 0 && (
        <div className="max-h-72 space-y-3 overflow-y-auto px-5 py-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-brand text-white' : 'bg-surface-2 text-text'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-xl bg-surface-2 px-3.5 py-2.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-faint"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}

      <div className="flex items-center gap-2 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={t('chatPlaceholder')}
          className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-brand p-2.5 text-white transition-colors hover:bg-brand-strong disabled:opacity-40"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}
