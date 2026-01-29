'use client'
import { useState } from 'react'

export default function TestTutor({ initialCode, onBack }) {
  const [code, setCode] = useState(initialCode || '')
  const [showVada, setShowVada] = useState(!!initialCode)

  const loadVada = () => {
    if (!code.trim()) {
      alert('Please enter a code')
      return
    }
    setShowVada(true)
  }

  if (!showVada) {
    return (
      <div className="section-card">
        <div className="section-label">Student View</div>
        <h2 className="section-title">Test Assignment</h2>
        <div className="section-body" style={{ marginBottom: '20px' }}>
          Enter an assignment code to see how students will experience it in Vada.
        </div>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && loadVada()}
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
          onClick={loadVada}
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
          Load Student View
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="section-card"​​​​​​​​​​​​​​​​
