'use client'
import { useState } from 'react'

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm here to help you craft effective assignment instructions for Vada. What subject or topic are you teaching?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const data = await response.json()
      setMessages([...messages, userMessage, { role: 'assistant', content: data.message }])
    } catch (error) {
      console.error('Chat failed:', error)
      setMessages([
        ...messages,
        userMessage,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent), var(--accent-soft))',
            border: 'none',
            color: '#020617',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 168, 150, 0.4)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '400px',
            maxWidth: 'calc(100vw - 40px)',
            height: '500px',
            maxHeight: 'calc(100vh - 40px)',
            background: 'rgba(5, 5, 5, 0.98)',
            borderRadius: '20px',
            border: '1px solid rgba(15, 23, 42, 0.9)',
            boxShadow: '0 18px 45px rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(31, 41, 55, 0.9)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(to right, #020617, #050505)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text)' }}>
                AI Assistant
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Help with assignments
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              fontSize: '0.86rem',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '10px',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    background: msg.role === 'user' ? 'var(--accent-soft)' : '#020617',
                    color: msg.role === 'user' ? '#e0fffa' : 'var(--text)',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    maxWidth: '85%',
                    border: msg.role === 'assistant' ? '1px solid rgba(30, 64, 175, 0.7)' : 'none',
                    lineHeight: '1.4',
                  }}
                >
                  {msg.content}
                </span>
              </div>
            ))}
            {loading && (
              <div style={{ marginBottom: '10px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: '#020617',
                    border: '1px solid rgba(30, 64, 175, 0.7)',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    color: 'var(--text-dim)',
                  }}
                >
                  Thinking...
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: '10px',
              borderTop: '1px solid rgba(31, 41, 55, 0.9)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask for help..."
              disabled={loading}
              style={{
                flex: 1,
                background: '#020617',
                borderRadius: '999px',
                border: '1px solid rgba(51, 65, 85, 0.9)',
                padding: '8px 14px',
                color: 'var(--text)',
                fontSize: '0.85rem',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                borderRadius: '999px',
                border: 'none',
                background: 'var(--accent)',
                color: '#020617',
                padding: '8px 16px',
                fontSize: '0.85rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}

