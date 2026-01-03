"use client";
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// -- ICONS --
const Icons = {
  Upload: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>,
  Docs: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>,
  Check: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>,
  Code: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></svg>,
};

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('docs');

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    // Simulate slight delay for better UX feel or use real API
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/analyze-code', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      alert("API Error. Ensure backend is running.");
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

        <nav className="flex flex-col gap-2">
          {!result ? (
            <div className="p-4 text-sm text-[var(--text-muted)] text-center">
              Upload a file to start analysis
            </div>
          ) : (
            <>
              <NavItem
                label="Documentation"
                icon={<Icons.Docs />}
                active={activeTab === 'docs'}
                onClick={() => setActiveTab('docs')}
              />
              <NavItem
                label="Quality Audit"
                icon={<Icons.Check />}
                active={activeTab === 'eval'}
                onClick={() => setActiveTab('eval')}
              />
              {result.optimization && (
                <NavItem
                  label="Optimization"
                  icon={<Icons.Code />}
                  active={activeTab === 'code'}
                  onClick={() => setActiveTab('code')}
                />
              )}
            </>
          )}
        </nav>

        <div className="mt-auto pt-8 text-xs text-[var(--text-muted)]">
          Powered by Gemini 2.5 Flash
          <br />Google ADK Framework
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {!result ? (
          // EMPTY STATE / UPLOAD
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold mb-4">Analyze your Codebase</h1>
            <p className="text-[var(--text-secondary)] mb-8 text-lg">
              Get instant documentation, feedback, and performance patches.
            </p>

            <div className="upload-area w-full max-w-lg">
              <input
                type="file"
                id="file"
                className="hidden"
                accept=".py"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="file" className="flex flex-col items-center gap-4 cursor-pointer">
                <div className="w-16 h-16 bg-[var(--bg-surface)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors">
                  <Icons.Upload />
                </div>
                <div className="text-lg font-medium">
                  {file ? file.name : "Drop Python file here or Click"}
                </div>
              </label>

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`mt-6 px-8 py-3 rounded-lg font-bold text-white transition-all w-full
                  ${!file ? 'bg-[var(--border-subtle)] cursor-not-allowed text-[var(--text-muted)]'
                    : 'bg-white text-black hover:opacity-90'}`}
              >
                {loading ? "Initializing Agents..." : "Start Workflow"}
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 text-center text-sm text-[var(--text-muted)]">
              <div>
                <strong className="block text-white mb-1">Technical Writer</strong>
                Generates Markdown docs
              </div>
              <div>
                <strong className="block text-white mb-1">QA Auditor</strong>
                Scores code quality
              </div>
              <div>
                <strong className="block text-white mb-1">Performance Engineer</strong>
                Auto-patches bottlenecks
              </div>
            </div>
          </div>
        ) : (
          // RESULTS VIEW
          <div className="animate-fade-in">
            {activeTab === 'docs' && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-baseline justify-between">
                  <h1 className="text-3xl font-bold">Documentation</h1>
                  <span className="text-sm text-[var(--text-secondary)]">Generated by Writer Agent</span>
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
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Quality Audit Report</h1>

                <div className="stat-grid">
                  <StatCard label="Accuracy" value={result.evaluation?.technical_accuracy} />
                  <StatCard label="Completeness" value={result.evaluation?.completeness} />
                  <StatCard label="Readability" value={result.evaluation?.readability} />
                </div>

                <div className="bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Agent Feedback</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                    {result.evaluation?.feedback}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="max-w-5xl mx-auto h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold">Optimized Code</h1>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.optimization)}
                    className="text-sm border border-[var(--border-subtle)] px-3 py-1.5 rounded-md hover:bg-[var(--bg-surface)]"
                  >
                    Copy Code
                  </button>
                </div>
                <div className="flex-1 overflow-auto rounded-xl border border-[var(--border-subtle)] bg-[#0d1117]">
                  <div className="p-4">
                    <pre className="font-mono text-sm text-[#e6edf3]">
                      <code>{result.optimization}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ label, icon, active, onClick }) {
  return (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />}
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
