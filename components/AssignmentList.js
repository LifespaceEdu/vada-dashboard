'use client'
import { useState, useEffect } from 'react'

export default function AssignmentList({ refreshTrigger, onCreateNew }) {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [refreshTrigger])

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/assignments')
      const data = await response.json()
      setAssignments(data)
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    alert(`Code ${code} copied to clipboard!`)
  }

  const deleteAssignment = async (code) => {
    if (!confirm(`Delete assignment with code ${code}?`)) return

    try {
      const response = await fetch(`/api/assignments?code=${code}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setAssignments(assignments.filter((a) => a.code !== code))
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete assignment')
    }
  }

  const deleteAll = async () => {
    if (!confirm(`Delete ALL ${assignments.length} assignments? This cannot be undone.`)) return

    try {
      for (const assignment of assignments) {
        await fetch(`/api/assignments?code=${assignment.code}`, {
          method: 'DELETE',
        })
      }
      setAssignments([])
    } catch (error) {
      console.error('Failed to delete all:', error)
      alert('Failed to delete all assignments')
    }
  }

  if (loading) {
    return (
      <div className="section-card">
        <div className="section-body">Loading assignments...</div>
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="section-card">
        <div className="section-label">Assignments</div>
        <h2 className="section-title">No Assignments Yet</h2>
        <div className="section-body" style={{ marginBottom: '20px' }}>
          Create your first assignment to get started.
        </div>
        <button
          onClick={onCreateNew}
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
          Create New Assignment
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="section-card">
        <div className="section-label">Your Assignments</div>
        <h2 className="section-title">Manage Assignments</h2>
        <div className="section-body" style={{ marginBottom: '16px' }}>
          Share these codes with students to give them access to specific assignments.
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCreateNew}
            style={{
              flex: 1,
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '999px',
              padding: '10px',
              color: '#020617',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Create New
          </button>
          <button
            onClick={deleteAll}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '999px',
              padding: '10px',
              color: '#ef4444',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Delete All ({assignments.length})
          </button>
        </div>
      </div>

      {assignments.map((assignment) => (
        <div key={assignment.code} className="section-card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: 'var(--accent)',
                  fontFamily: 'monospace',
                }}
              >
                {assignment.code}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  marginTop: '4px',
                }}
              >
                Created: {new Date(assignment.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => copyCode(assignment.code)}
                style={{
                  background: 'var(--accent-soft)',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  color: '#e0fffa',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Copy Code
              </button>
              <button
                onClick={() => deleteAssignment(assignment.code)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <div
            style={{
              fontSize: '0.85rem',
              lineHeight: '1.5',
              color: 'var(--text-dim)',
              background: '#020617',
              padding: '12px',
              borderRadius: '8px',
              maxHeight: '120px',
              overflow: 'auto',
            }}
          >
            {assignment.instructions}
          </div>
        </div>
      ))}
    </div>
  )
}
