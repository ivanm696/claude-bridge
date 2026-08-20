'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  role: 'user' | 'assistant'
  content: string
  thinking?: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [expandedThinking, setExpandedThinking] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // errorData.error may itself be an object (Anthropic-style nested error);
        // always coerce to a plain string so we never throw new Error(objectValue).
        const message =
          typeof errorData.error === 'string'
            ? errorData.error
            : errorData.error?.message || 'Failed to get response'
        throw new Error(message)
      }

      const data = await response.json()

      // Extract text and thinking content from the response
      let textContent = ''
      let thinkingContent = ''

      for (const block of data.content) {
        if (block.type === 'text') {
          textContent += block.text
        } else if (block.type === 'thinking') {
          thinkingContent += block.thinking
        }
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: textContent,
        thinking: thinkingContent,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Error:', error)
      let errorMessage = 'Sorry, I encountered an error. Please try again.'
      
      if (error.message?.includes('credit')) {
        errorMessage = 'Insufficient credits on Anthropic API account. Please add credits at https://console.anthropic.com/account/billing/overview'
      } else if (error.message?.includes('API key')) {
        errorMessage = 'Invalid Anthropic API key. Please check your ANTHROPIC_API_KEY environment variable.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Enter without IME composition
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Claude AI Chat</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Extended thinking enabled - see Claude&apos;s reasoning process
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Brain className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Start a conversation with Claude
              </h2>
              <p className="text-muted-foreground max-w-md">
                Ask anything and see Claude&apos;s extended thinking process in action
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-2xl rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card border border-border text-card-foreground rounded-bl-none'
                    }`}
                  >
                    {message.role === 'assistant' && message.thinking && (
                      <div className="mb-3">
                        <button
                          onClick={() =>
                            setExpandedThinking(
                              expandedThinking === idx ? null : idx
                            )
                          }
                          className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent transition-colors"
                        >
                          <Brain className="w-4 h-4" />
                          Thinking Process
                          <span
                            className={`transition-transform ${
                              expandedThinking === idx ? 'rotate-180' : ''
                            }`}
                          >
                            ▼
                          </span>
                        </button>
                        {expandedThinking === idx && (
                          <div className="mt-2 p-3 bg-muted rounded text-sm text-muted-foreground border border-border leading-relaxed whitespace-pre-wrap">
                            {message.thinking}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border text-card-foreground rounded-lg rounded-bl-none px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Claude is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card px-4 sm:px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Claude anything... (Shift+Enter for new line)"
              className="flex-1 resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="icon"
              className="mt-auto"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
