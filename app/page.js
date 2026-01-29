'use client'
import { useState } from 'react'
import AssignmentForm from '@/components/AssignmentForm'
import AssignmentList from '@/components/AssignmentList'
import TeacherChat from '@/components/TeacherChat'
import TestTutor from '@/components/TestTutor'

export default function Dashboard() {
  const [activeView, setActiveView] = useState('create')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [testCode, setTestCode] = useState('')

  const switchView = (view) => {
    setActiveView(view)
    setMobileMenuOpen(false)
  }

  const testAssignment = (code) => {
    setTestCode(code)
    setActiveView('student')
  }

  return (
    <div className="app">
      <header className="header">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'var(--text)',
            cursor: 'pointer',
          }}
          className="mobile-menu-btn"
        >
          ☰ Menu
        </button>
        <div>
          <h1 className="header-title">Vada Dashboard</h1>
        </div>
        <div className="header-badge">Teacher Tools</div>
      </header>

      <div className="layout">
        <nav className={`nav ${mobileMenuOpen ? 'nav-mobile-open' : ''}`}>
          <div className="nav-title">Menu</div>
          <button
            className={`nav-item ${activeView === 'create' ? 'active' : ''}`}
            onClick={() => switchView('create')}
          >
            Create Assignment
          </button>
          <button
            className={`nav-item ${activeView === 'manage' ? 'active' : ''}`}
            onClick={() => switchView('manage')}
          >
            Manage Assignments
          </button>
          <button
            className={`nav-item ${activeView === 'student' ? 'active' : ''}`}
            onClick={() => switchView('student')}
          >
            Student View
          </button>
          <button
            className={`nav-item ${activeView === 'help' ? 'active' : ''}`}
            onClick={() => switchView('help')}
          >
            AI Assistant
          </button>
        </nav>

        <main className="content">
          {activeView === 'create' && (
            <AssignmentForm 
              onSave={(assignment) => {
                setRefreshTrigger(prev => prev + 1)
                setActiveView('manage')
              }}
            />
          )}
          
          {activeView === 'manage' && (
            <AssignmentList 
              refreshTrigger={refreshTrigger}
              onCreateNew={() => setActiveView('create')}
              onTest={testAssignment}
            />
          )}

          {activeView === 'student' && (
            <TestTutor 
              initialCode={testCode}
              onBack={() => setActiveView('manage')}
            />
          )}
          
          {activeView === 'help' && (
            <TeacherChat />
          )}
        </main>
      </div>
    </div>
  )
}
