"use client";
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReactDiffViewer from 'react-diff-viewer-continued';

// -- ICONS --
const Icons = {
  Upload: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>,
  Home: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Docs: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>,
  Check: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>,
  Code: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></svg>,
  Sun: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
  Moon: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
  Spinner: () => (
    <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ color: 'var(--text-primary)' }}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  AgentWriter: () => <span title="Technical Writer Agent">✍️</span>,
  AgentAudit: () => <span title="Quality Auditor Agent">🔍</span>,
  AgentOpt: () => <span title="Performance Agent">⚡️</span>
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
  const [theme, setTheme] = useState('dark');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [clientApiKey, setClientApiKey] = useState(null); // Session-only key

  // Check Config on Mount
  useEffect(() => {
    checkConfig();
  }, []);

  const checkConfig = async () => {
    try {
      const res = await fetch('http://localhost:8000/config/status');
      const data = await res.json();
      // If NOT configured on server, prompts for session key
      if (!data.is_configured) {
        setShowConfigModal(true);
      }
    } catch (e) {
      console.log("Backend check failed", e);
    }
  };

  const handleSetSessionKey = (key) => {
    if (!key) return;
    setClientApiKey(key);
    setShowConfigModal(false);
  };

  // Toggle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Styles for DiffViewer based on Theme
  const diffStyles = {
    variables: {
      light: {
        diffViewerBackground: '#f9fafb',
        diffViewerColor: '#24292e',
        addedBackground: '#e6ffed',
        addedColor: '#24292e',
        removedBackground: '#ffeef0',
        removedColor: '#24292e',
        wordAddedBackground: '#acf2bd',
        wordRemovedBackground: '#fdb8c0',
        addedGutterBackground: '#e6ffed',
        removedGutterBackground: '#ffeef0',
        gutterBackground: '#f7f7f7',
        gutterColor: '#767676',
        codeFoldGutterBackground: '#f9fafb',
        codeFoldBackground: '#f1f8ff',
      },
      dark: {
        diffViewerBackground: '#111111',
        diffViewerColor: '#FFF',
        addedBackground: '#044B53',
        addedColor: 'white',
        removedBackground: '#632F34',
        removedColor: 'white',
        wordAddedBackground: '#055d67',
        wordRemovedBackground: '#7d383f',
        addedGutterBackground: '#034148',
        removedGutterBackground: '#632b30',
        gutterBackground: '#111111',
        gutterColor: '#4f5662',
      }
    },
    line: {
      padding: '10px 2px',
      '&:hover': { background: 'transparent' },
    }
  };

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

    // Headers: Add Session Key if exists
    const headers = {};
    if (clientApiKey) {
      headers['x-goog-api-key'] = clientApiKey;
    }

    try {
      const res = await fetch('http://localhost:8000/analyze-code', {
        method: 'POST',
        body: formData,
        headers: headers // Browser handles multipart boundary correctly if body is FormData, but we can add custom headers
      });

      if (res.status === 401) {
        setShowConfigModal(true);
        throw new Error("API Key Required or Invalid");
      }
      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      setResult(data);
    } catch (e) {
      alert("Analysis Failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setActiveTab('docs');
    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* CONFIG MODAL */}
      {showConfigModal && <ApiKeyModal onSave={handleSetSessionKey} />}

      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">A</div>
          <span>Agentic SDLC</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavItem
            label="Home"
            icon={<Icons.Home />}
            active={!result && !loading}
            onClick={handleReset}
            disabled={loading}
          />
          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

          {!result && !loading ? (
            <div style={{ padding: '8px 12px', color: 'var(--text-muted)', fontSize: '13px' }}>
              Upload to begin analysis
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

        {/* THEME TOGGLE */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          {/* Update Key Button - Optional usage if needed */}
          <div
            onClick={() => setShowConfigModal(true)}
            style={{ cursor: 'pointer', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Change Session API Key"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>
            <span>Update Session Key</span>
          </div>

          <div
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px', cursor: 'pointer', borderRadius: '6px',
              color: 'var(--text-secondary)', fontSize: '14px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <div style={{ marginTop: '8px', paddingLeft: '10px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
            Author: Diego Scirocco
          </div>
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
                      fontSize: '18px', fontWeight: 'bold',
                      color: 'white'
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
                  backgroundColor: !file ? 'var(--border-subtle)' : 'var(--text-primary)',
                  color: !file ? 'var(--text-muted)' : 'var(--bg-app)',
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
                  backgroundColor: 'var(--bg-panel)',
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
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(result.optimization);
                        alert("Code copied to clipboard!");
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-panel)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Copy Code
                    </button>
                    <Icons.AgentOpt />
                  </div>
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
                    background: 'var(--bg-surface)'
                  }}>
                    <span style={{ fontSize: '40px', marginBottom: '16px' }}>✅</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-green)' }}>Code is already optimal!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>No performance patches required.</p>
                  </div>
                ) : (
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <ReactDiffViewer
                      oldValue={result.original_code}
                      newValue={result.optimization}
                      splitView={true}
                      useDarkTheme={theme === 'dark'}
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
      {active && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-primary)' }} />}
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

function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState('');
  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '32px',
        width: '100%', maxWidth: '480px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Setup Google API Key</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
          This project utilizes Google Gemini 2.5 Flash. <br />
          Please enter your API Key to initialize the Agent Swarm.
        </p>

        <input
          type="password"
          placeholder="Enter GOOGLE_API_KEY"
          autoFocus
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            padding: '14px',
            borderRadius: '8px',
            marginBottom: '16px',
            color: 'var(--text-primary)',
            fontSize: '16px',
            outline: 'none'
          }}
          value={key}
          onChange={e => setKey(e.target.value)}
        />

        <button
          onClick={() => onSave(key)}
          disabled={!key.trim()}
          style={{
            width: '100%',
            backgroundColor: !key.trim() ? 'var(--border-subtle)' : 'var(--text-primary)',
            color: !key.trim() ? 'var(--text-muted)' : 'var(--bg-app)',
            fontWeight: 'bold',
            padding: '14px',
            borderRadius: '8px',
            cursor: !key.trim() ? 'not-allowed' : 'pointer',
            border: 'none',
            fontSize: '16px',
            transition: 'opacity 0.2s'
          }}
        >
          Use Session Key (No Save)
        </button>

        <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
          This key will be used for the current session only.
        </p>
      </div>
    </div>
  );
}
