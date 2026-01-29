'use client'
import { useState, useRef, useEffect } from 'react'

export default function TestTutor({ initialCode, onBack }) {
  const [code, setCode] = useState(initialCode || '')
  const [assignmentInstructions, setAssignmentInstructions] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatBodyRef = useRef(null)

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (initialCode) {
      loadAssignment(initialCode)
    }
  }, [initialCode])

  const loadAssignment = async (assignmentCode) => {
    try {
      const response = await fetch(`/api/get-assignment?code=${assignmentCode.toUpperCase()}`)
      if (response.ok) {
        const data = await response.json()
        setAssignmentInstructions(data.instructions)
        setLoaded(true)
        setMessages([
          {
            role: 'assistant',
            content: "Hi! I'm ready to help you with this assignment. What questions do you have?",
          },
        ])
      } else {
        alert('Code not found')
      }
    } catch (error) {
      console.error('Failed to load assignment:', error)
      alert('Failed to load assignment')
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/student-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mode: 'open',
          assignmentInstructions,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const assistantMessage = data.message || 'Sorry, I got an empty response.'
      
      setMessages([...messages, userMessage, { role: 'assistant', content: assistantMessage }])
    } catch (error) {
      console.error('Chat failed:', error)
      setMessages([
        ...messages,
        userMessage,
        { role: 'assistant', content: `Error: ${error.message}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  const resetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hi! I'm ready to help you with this assignment. What questions do you have?",
      },
    ])
  }

  if (!loaded && !initialCode) {
    return (
      <div className="section-card">
        <div className="section-label">Student View</div>
        <h2 className="section-title">Enter Assignment Code</h2>
        <div className="section-body" style={{ marginBottom: '20px' }}>
          Enter a code to test how Vada will respond to students.
        </div>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && loadAssignment(code)}
          placeholder="Enter code"
          style={{
            width: '100%',
            background: '#020617',
            border: '1px solid rgba(51, 65, 85, 0.9)',
            borderRadius: '999px',
            padding: '12px 16px',
            color: 'var(--text)',
            fontSize: '1rem',
            marginBottom: '12px',
          }}
        />
        <button
          onClick={() => loadAssignment(code)}
          style={{
            width: '100%',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: '999px',
            padding: '12px',
            color: '#020617',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Load Assignment
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div className="section-label">Student View</div>
            <h2 className="section-title">Testing Code: {code}</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={resetChat}
              style={{
                background: 'var(--accent-soft)',
                border: 'none',
                borderRadius: '999px',
                padding: '8px 16px',
                color: '#e0fffa',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Reset Chat
            </button>
            <button
              onClick={onBack}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                padding: '8px 16px',
                color: 'var(--text)',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              ← Back
            </button>
          </div>
        </div>
        <div className="section-body" style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
          <strong>Assignment Instructions:</strong>
          <div style={{ 
            background: '#020617', 
            padding: '12px', 
            borderRadius: '8px', 
            marginTop: '8px',
            maxHeight: '100px',
            overflow: 'auto'
          }}>
            {assignmentInstructions}
          </div>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div>
            <div className="chat-title">Vada (Student View)</div>
            <div className="chat-subtitle">Testing assignment interaction</div>
          </div>
        </div>

        <div className="chat-body" ref={chatBodyRef}>
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
            placeholder="Ask a question..."
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
