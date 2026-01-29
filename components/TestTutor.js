'use client'
import { useState } from 'react'

export default function TestTutor({ initialCode, onBack }) {
  const [code, setCode] = useState(initialCode || '')

  const openVada = () => {
    const vadaCode = code || initialCode
    if (!vadaCode) {
      alert('Please enter a code')
      return
    }
    
    window.open('https://vada-ai-tutor.vercel.app', '_blank')
  }

  return (
    <div className="section-card">
      <div style={{ marginBottom: '20px' }}>
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
            marginBottom: '16px',
          }}
        >
          Back to Assignments
        </button>
      </div>

      <div className="section-label">Student View</div>
      <h2 className="section-title">Test Assignment</h2>
      
      <div className="section-body" style={{ marginBottom: '20px' }}>
        Click below to open Vada in a new tab, then enter this code: <strong style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: '1.1rem' }}>{initialCode || code}</strong>
      </div>

      {!initialCode && (
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
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
      )}

      <button
        onClick={openVada}
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
        Open Vada Student App
      </button>
    </div>
  )
}
