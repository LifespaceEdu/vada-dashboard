'use client'
import { useState } from 'react'

export default function TeacherChat() {
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
    <div className="section-card">
      <div className="section-label">AI Assistant</div>
      <h2 className="section-title">Get Help Creating Assignment Instructions</h2>
      <div className="section-body">
        Ask for help crafting effective instructions that will guide Vada's interactions with
        students.
      </div>

      <div className="chat-container" style={{ maxWidth: '100%', marginTop: '20px' }}>
        <div className="chat-header">
          <div>
            <div className="chat-title">Teacher Assistant</div>
            <div className="chat-subtitle">Powered by AI</div>
          </div>
        </div>

        <div className="chat-body" style={{ maxHeight: '400px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <span>{msg.content}</span>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <span>Thinking...</span>
            </div>
          )}
        </div>

        <div className="chat-input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask for help..."
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
