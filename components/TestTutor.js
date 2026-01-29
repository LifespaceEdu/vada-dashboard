export default function TestTutor({ initialCode, onBack }) {
  const refreshIframe = () => {
    document.getElementById('vada-iframe').src = document.getElementById('vada-iframe').src
  }

  return (
    <div>
      <div className="section-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="section-label">Student View</div>
            <h2 className="section-title">Test Assignment: {initialCode}</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={refreshIframe}
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
              Refresh Vada
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
              Back to Assignments
            </button>
          </div>
        </div>
        <div style={{ 
          marginTop: '12px', 
          padding: '12px', 
          background: 'rgba(0, 168, 150, 0.1)', 
          borderRadius: '12px',
          fontSize: '0.85rem',
          color: 'var(--text-dim)'
        }}>
          Enter code <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{initialCode}</strong> in Vada below to test this assignment
        </div>
      </div>

      <iframe
        id="vada-iframe"
        src="https://vada-ai-tutor.vercel.app"
        style={{
          width: '100%',
          height: 'calc(100vh - 280px)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          background: '#020617',
        }}
        title="Vada Student View"
      />
    </div>
  )
}
