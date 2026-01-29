'use client'
import { useState } from 'react'

export default function AssignmentForm({ onSave }) {
  const [inputMode, setInputMode] = useState('text') // 'text' or 'pdf'
  const [assignmentText, setAssignmentText] = useState('')
  const [code, setCode] = useState('')
  const [uploading, setUploading] = useState(false)

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCode(result)
  }

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('pdf', file)

    try {
      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setAssignmentText(data.text)
    } catch (error) {
      console.error('PDF extraction failed:', error)
      alert('Failed to extract text from PDF')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!assignmentText.trim()) {
      alert('Please enter assignment instructions')
      return
    }
    if (!code.trim()) {
      alert('Please generate or enter a code')
      return
    }

    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          instructions: assignmentText,
        }),
      })

      if (response.ok) {
        const assignment = await response.json()
        onSave(assignment)
        setAssignmentText('')
        setCode('')
      } else {
        alert('Failed to save assignment')
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save assignment')
    }
  }

  return (
    <div className="section-card">
      <div className="section-label">New Assignment</div>
      <h2 className="section-title">Create Assignment Instructions for Vada</h2>
      <div className="section-body">
        Provide instructions that Vada will use to guide students through this assignment.
      </div>

      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button
            className={inputMode === 'text' ? 'nav-item active' : 'nav-item'}
            onClick={() => setInputMode('text')}
            style={{ flex: 1 }}
          >
            Type Text
          </button>
          <button
            className={inputMode === 'pdf' ? 'nav-item active' : 'nav-item'}
            onClick={() => setInputMode('pdf')}
            style={{ flex: 1 }}
          >
            Upload PDF
          </button>
        </div>

        {inputMode === 'text' ? (
          <textarea
            value={assignmentText}
            onChange={(e) => setAssignmentText(e.target.value)}
            placeholder="Enter assignment instructions here..."
            style={{
              width: '100%',
              minHeight: '200px',
              background: '#020617',
              border: '1px solid rgba(51, 65, 85, 0.9)',
              borderRadius: '12px',
              padding: '12px',
              color: 'var(--text)',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        ) : (
          <div>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
              disabled={uploading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#020617',
                border: '1px solid rgba(51, 65, 85, 0.9)',
                borderRadius: '12px',
                color: 'var(--text)',
                fontSize: '0.9rem',
              }}
            />
            {uploading && (
              <p style={{ marginTop: '10px', color: 'var(--accent)' }}>
                Extracting text from PDF...
              </p>
            )}
            {assignmentText && (
              <textarea
                value={assignmentText}
                onChange={(e) => setAssignmentText(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  background: '#020617',
                  border: '1px solid rgba(51, 65, 85, 0.9)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: 'var(--text)',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginTop: '12px',
                }}
              />
            )}
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
            Assignment Code (students will use this)
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter or generate code"
              style={{
                flex: 1,
                background: '#020617',
                border: '1px solid rgba(51, 65, 85, 0.9)',
                borderRadius: '999px',
                padding: '10px 16px',
                color: 'var(--text)',
                fontSize: '0.9rem',
              }}
            />
            <button
              onClick={generateCode}
              style={{
                background: 'var(--accent-soft)',
                border: 'none',
                borderRadius: '999px',
                padding: '10px 20px',
                color: '#e0fffa',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Generate
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            marginTop: '20px',
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
          Save Assignment
        </button>
      </div>
    </div>
  )
}
