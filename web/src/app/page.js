"use client";
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReactDiffViewer from 'react-diff-viewer-continued';

// -- ICONS --
const Icons = {
  Upload: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>,
  Docs: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>,
  Check: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>,
  Code: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></svg>,
  Spinner: () => (
    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  AgentWriter: () => <span title="Technical Writer Agent">✍️</span>,
  AgentAudit: () => <span title="Quality Auditor Agent">🔍</span>,
  AgentOpt: () => <span title="Performance Agent">⚡️</span>
};

// -- STYLES FOR DIFF VIEWER --
const diffStyles = {
  variables: {
    dark: {
      diffViewerBackground: '#0d1117',
      diffViewerColor: '#FFF',
      addedBackground: '#053119',
      addedColor: '#white',
      removedBackground: '#3f1112',
      removedColor: '#white',
      wordAddedBackground: '#135c34',
      wordRemovedBackground: '#741f22',
      addedGutterBackground: '#053119',
      removedGutterBackground: '#3f1112',
      gutterBackground: '#0d1117',
      gutterColor: '#4f5662',
    }
  },
  line: {
    padding: '10px 2px',
    '&:hover': {
      background: 'transparent',
    },
  }
};

const AGENT_STEPS = [
  { id: 1, label: "Technical Writer", desc: "Analyzing structure..." },
  { id: 2, label: "Quality Auditor", desc: "Checking standards..." },
  { id: 3, label: "Performance Engineer", desc: "Optimizing logic..." },
];

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('docs');

  // Animation for Agent Steps
  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev < AGENT_STEPS.length - 1 ? prev + 1 : prev));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/analyze-code', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setResult(data);
    } catch (e) {
      alert("API Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">A</div>
          <span>Agentic SDLC</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {!result && !loading ? (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              Upload a file to start analysis
            </div>
          ) : (
            <>
              <NavItem
                label="Documentation"
                icon={<Icons.Docs />}
                active={activeTab === 'docs'}
                onClick={() => setActiveTab('docs')}
                disabled={loading}
              />
              <NavItem
                label="Quality Audit"
                icon={<Icons.Check />}
                active={activeTab === 'eval'}
                onClick={() => setActiveTab('eval')}
                disabled={loading}
              />
              <NavItem
                label="Optimization"
                icon={<Icons.Code />}
                active={activeTab === 'code'}
                onClick={() => setActiveTab('code')}
                disabled={loading}
              />
            </>
          )}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '32px', fontSize: '12px', color: 'var(--text-muted)' }}>
          Powered by Gemini 2.5 Flash
          <br />Google ADK Framework
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {loading && (
          // VISUAL AGENT LOADING
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            gap: '40px'
          }}>
            {/* Visual Steps Pipeline */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              {AGENT_STEPS.map((step, idx) => {
                const isActive = idx === loadingStepIndex;
                const isPast = idx < loadingStepIndex;
                return (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: isActive || isPast ? 1 : 0.3 }}>
                    <div style={{
                      width: '40px', height: '40px',
                      borderRadius: '50%',
                      background: isActive ? 'var(--accent-blue)' : isPast ? 'var(--accent-green)' : 'var(--bg-surface)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', fontWeight: 'bold'
                    }}>
                      {isPast ? '✓' : step.id}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{step.label}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {isActive ? step.desc : isPast ? "Completed" : "Waiting..."}
                      </span>
                    </div>
                    {idx < AGENT_STEPS.length - 1 && (
                      <div style={{ width: '40px', height: '2px', background: 'var(--border-subtle)', marginLeft: '10px' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!loading && !result && (
          // EMPTY STATE / UPLOAD
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Analyze your Codebase</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '18px' }}>
              Get instant documentation, feedback, and performance patches.
            </p>

            <div className="upload-area" style={{ width: '100%', maxWidth: '500px' }}>
              <input
                type="file"
                id="file"
                style={{ display: 'none' }}
                accept=".py"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="file" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                <div style={{
                  width: '64px', height: '64px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  <Icons.Upload />
                </div>
                <div style={{ fontSize: '18px', fontWeight: '500' }}>
                  {file ? file.name : "Drop Python file here or Click"}
                </div>
              </label>

              <button
                onClick={handleUpload}
                disabled={!file}
                style={{
                  marginTop: '24px',
                  width: '100%',
                  padding: '12px 32px',
                  backgroundColor: !file ? 'var(--border-subtle)' : 'white',
                  color: !file ? 'var(--text-muted)' : 'black',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: !file ? 'not-allowed' : 'pointer',
                  border: 'none',
                  fontSize: '14px'
                }}
              >
                Start Workflow
              </button>
            </div>
          </div>
        )}

        {!loading && result && (
          // RESULTS VIEW
          <div className="animate-fade-in">
            {activeTab === 'docs' && (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Documentation</h1>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Generated by Technical Writer Agent</span>
                  </div>
                  <Icons.AgentWriter />
                </div>
                {/* MARKDOWN RENDERER */}
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.documentation}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {activeTab === 'eval' && (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Quality Audit Report</h1>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Generated by Quality Auditor Agent</span>
                  </div>
                  <Icons.AgentAudit />
                </div>

                <div className="stat-grid">
                  <StatCard label="Accuracy" value={result.evaluation?.technical_accuracy} />
                  <StatCard label="Completeness" value={result.evaluation?.completeness} />
                  <StatCard label="Readability" value={result.evaluation?.readability} />
                </div>

                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '32px'
                }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Agent Feedback</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '16px' }}>
                    {result.evaluation?.feedback}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div style={{ maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                  <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Optimization Proposal</h1>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Generated by Performance Engineer Agent</span>
                  </div>
                  <Icons.AgentOpt />
                </div>

                {!result.optimization ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px',
                    border: '1px dashed var(--accent-green)',
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.05)'
                  }}>
                    <span style={{ fontSize: '40px', marginBottom: '16px' }}>✅</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-green)' }}>Code is already optimal!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>The agent found no significant performance bottlenecks to patch.</p>
                  </div>
                ) : (
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <ReactDiffViewer
                      oldValue={result.original_code}
                      newValue={result.optimization}
                      splitView={true}
                      useDarkTheme={true}
                      styles={diffStyles}
                      leftTitle="Original Code"
                      rightTitle="Optimized Agent Patch"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ label, icon, active, onClick, disabled }) {
  if (disabled) return null;
  return (
    <div
      className={`nav-item ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
    >
      {icon}
      <span>{label}</span>
      {active && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }} />}
    </div>
  );
}

function StatCard({ label, value }) {
  const num = parseFloat(value || 0);
  let color = '#ef4444'; // red
  if (num >= 7) color = '#f59e0b'; // orange
  if (num >= 9) color = '#22c55e'; // green

  return (
    <div className="stat-card">
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
