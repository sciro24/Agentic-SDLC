"use client";
import { useState } from 'react';

// Icons
const IconUpload = () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>;
const IconCheck = () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('docs');

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/analyze-code', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20">

      {/* Navbar */}
      <nav className="border-b border-[var(--border)] bg-[var(--background)] sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">A</span>
            Agentic SDLC
          </div>
          <a href="https://github.com/google/adk-python" target="_blank" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Powered by Google ADK
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="container py-20 text-center animate-in">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Code Quality. Automated.
        </h1>
        <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10">
          Upload your Python script. Our agents will document, audit, and optimize it instantly using Gemini 2.5 Flash.
        </p>

        {/* Upload Box */}
        <div className="max-w-md mx-auto card p-2 bg-[var(--card)]">
          <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 flex flex-col items-center justify-center gap-4 transition-colors hover:bg-[var(--muted)]/50">
            <input
              type="file"
              accept=".py"
              onChange={handleFileChange}
              id="file-upload"
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-[var(--muted)] rounded-full flex items-center justify-center">
                <IconUpload />
              </div>
              <span className="font-medium">
                {file ? file.name : "Click to Select File (.py)"}
              </span>
            </label>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="btn btn-primary w-full mt-2"
            >
              {loading ? "Processing..." : "Start Analysis"}
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Results */}
      {result && (
        <div className="container animate-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* Sidebar Navigation */}
            <div className="md:col-span-1 space-y-2">
              <NavItem active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} label="Documentation" />
              <NavItem active={activeTab === 'eval'} onClick={() => setActiveTab('eval')} label="Quality Audit" />
              {result.optimization && (
                <NavItem active={activeTab === 'code'} onClick={() => setActiveTab('code')} label="Optimized Code" />
              )}
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-3">
              <div className="card min-h-[500px] p-8">

                {/* Documentation View */}
                {activeTab === 'docs' && (
                  <div className="prose prose-slate max-w-none dark:prose-invert">
                    <h2 className="text-2xl font-bold mb-4 border-b border-[var(--border)] pb-2">Generated Documentation</h2>
                    <div className="whitespace-pre-wrap">{result.documentation}</div>
                  </div>
                )}

                {/* Evaluation View */}
                {activeTab === 'eval' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 border-b border-[var(--border)] pb-2">Quality Scorecard</h2>

                    <div className="grid-cols-3 mb-8">
                      <ScoreCard label="Accuracy" value={result.evaluation?.technical_accuracy} />
                      <ScoreCard label="Completeness" value={result.evaluation?.completeness} />
                      <ScoreCard label="Readability" value={result.evaluation?.readability} />
                    </div>

                    <div className="bg-[var(--muted)] p-6 rounded-lg border border-[var(--border)]">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <span className="text-xl">🤖</span> Agent Feedback
                      </h4>
                      <p className="item-body">{result.evaluation?.feedback}</p>
                    </div>
                  </div>
                )}

                {/* Code View */}
                {activeTab === 'code' && (
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-2">
                      <h2 className="text-2xl font-bold">Optimization Proposal</h2>
                      <span className="badge badge-success flex gap-1 items-center px-3 py-1">
                        <IconCheck /> Auto-Verified
                      </span>
                    </div>
                    <pre className="mono-box bg-[#0d1117] text-[#c9d1d9] p-4 rounded-lg overflow-x-auto">
                      {result.optimization}
                    </pre>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function NavItem({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-md font-medium transition-all ${active
          ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md'
          : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
        }`}
    >
      {label}
    </button>
  );
}

function ScoreCard({ label, value }) {
  const score = parseFloat(value || 0);
  let badgeClass = "badge-error";
  if (score >= 7) badgeClass = "badge-warning";
  if (score >= 9) badgeClass = "badge-success";

  return (
    <div className="flex flex-col items-center justify-center p-6 border border-[var(--border)] rounded-lg bg-[var(--background)]">
      <div className={`text-5xl font-bold mb-2 ${score >= 9 ? 'text-green-600' : score >= 7 ? 'text-yellow-600' : 'text-red-600'}`}>
        {value}
      </div>
      <span className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</span>
    </div>
  );
}
