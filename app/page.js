'use client'
import { useState } from 'react'
import AssignmentForm from '@/components/AssignmentForm'
import AssignmentList from '@/components/AssignmentList'
import TeacherChat from '@/components/TeacherChat'

export default function Dashboard() {
  const [activeView, setActiveView] = useState('create')
  const [assignments, setAssignments] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="header-title">Vada Dashboard</h1>
        </div>
        <div className="header-badge">Teacher Tools</div>
      </header>

      <div className="layout">
        <nav className="nav">
          <div className="nav-title">Menu</div>
          <button
            className={`nav-item ${activeView === 'create' ? 'active' : ''}`}
            onClick={() => setActiveView('create')}
          >
            Create Assignment
          </button>
          <button
            className={`nav-item ${activeView === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveView('manage')}
          >
            Manage Assignments
          </button>
          <button
            className={`nav-item ${activeView === 'help' ? 'active' : ''}`}
            onClick={() => setActiveView('help')}
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
