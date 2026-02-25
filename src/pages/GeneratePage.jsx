import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../context/ThemeContext'; 
import { Terminal, Cpu, Download, ShieldCheck, Zap, BarChart3, Activity, AlertTriangle, Hash, X } from 'lucide-react';
import toast from 'react-hot-toast';

const GeneratePage = () => {
  const { isDarkMode } = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [visible, setVisible] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    if (visible && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [visible]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setVisible(false);
    
    try {
      const response = await api.post('/portfolio/generate', { query });
      setResult(response.data.data);
      setTimeout(() => setVisible(true), 100);
      toast.success('STRATEGY_SYNTHESIS_COMPLETE');
    } catch (err) {
      console.error('Synthesis Node Failure:', err);
      toast.error('SYSTEM_FAILURE: AGENTIC_DEBATE_INTERRUPTED');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await api.post('/portfolio/export', result, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Finify_Strategy_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error('PDF_EXPORT_FAILED');
    }
  };

  return (
    <div className="reveal-node" style={containerStyle}>
      {/* ── Header ── */}
      <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)' }}>
        <h1 style={titleStyle}>
          <Cpu size={24} color="var(--accent-primary)" />
          Strategy_Engine_<span style={{ color: 'var(--accent-primary)' }}>v2.5</span>
        </h1>
        <p style={subtitleStyle}>
          Active Node: Agentic_RAG_Cluster // Corpus: NSE_BSE_2026
        </p>
      </div>

      {/* ── Input Section ── */}
      <form onSubmit={handleGenerate} style={{ position: 'relative' }}>
        <input
          placeholder="DESCRIBE_GOAL: e.g., Aggressive growth in Indian EV sector for 3 years..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={loading}
          style={inputStyle} // DEFINED BELOW
        />
        <button type="submit" disabled={loading || !query.trim()} className="cyber-btn" style={buttonStyle}>
          {loading ? 'PROCESSING...' : 'INITIALIZE'}
        </button>
      </form>

      {/* ── Loading ── */}
      {loading && <LoadingNode />}

      {/* ── Dashboard ── */}
      {result && !loading && (
        <div ref={resultRef} style={{ ...dashboardStyle, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}>
          <div style={bannerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <ShieldCheck size={18} color="var(--accent-primary)" />
              <span style={bannerTextStyle}>Identity_Verified_//_Strategy_Audited</span>
            </div>
            <button onClick={handleDownloadPDF} className="action-btn-small">
              <Download size={14} /> Export_Report
            </button>
          </div>

          <div style={metricsGridStyle}>
            <MetricCard title="BACKTEST_VALIDATION" value={`${result.analytics?.backtest_1y || 0}%`} icon={<BarChart3 size={18}/>} color="var(--accent-primary)" />
            <MetricCard title="BLACK_SWAN_DRAWDOWN" value={`${result.analytics?.stress_test?.drawdown || 0}%`} icon={<AlertTriangle size={18}/>} color="var(--status-loss)" subtitle={`Event: ${result.analytics?.stress_test?.event || 'N/A'}`} />
            <MetricCard title="RISK_AUDIT_SCORE" value={`${result.analytics?.risk_score || 0}/100`} icon={<Activity size={18}/>} color="var(--accent-secondary)" />
          </div>

          <div style={contentGridStyle}>
            <ResultBlock title="01_Market_Thesis" style={{ gridColumn: '1 / -1' }}>
              <p style={thesisTextStyle}>{result.summary}</p>
            </ResultBlock>
            <ResultBlock title="02_Asset_Allocations">
              <TickerCloud holdings={result.holdings} />
            </ResultBlock>
            <ResultBlock title="03_Agentic_Rationale" style={{ gridColumn: 'span 2' }}>
              <div className="md-content" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                <ReactMarkdown>{String(result.rationale || "RATIONALE_PENDING")}</ReactMarkdown>
              </div>
            </ResultBlock>
          </div>
        </div>
      )}

      <style>{`
        .reveal-node { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes genSpin  { to { transform: rotate(360deg); } }
        @keyframes genPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .cyber-btn:hover { filter: brightness(1.2); }
        .action-btn-small {
          display: flex; align-items: center; gap: 0.5rem; font-size: 0.65rem; font-weight: 800;
          color: var(--accent-primary); background: transparent; border: 1px solid var(--accent-primary);
          border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; transition: all 0.2s ease;
        }
        .action-btn-small:hover { background: var(--accent-primary); color: #000; }
      `}</style>
    </div>
  );
};

/* ── UI Components ── */
const TickerCloud = ({ holdings }) => {
  const tickers = Array.isArray(holdings) ? holdings : [];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {tickers.map((t, i) => (
        <div key={i} style={tickerTagStyle}><Hash size={12} /> {t}</div>
      ))}
    </div>
  );
};

const LoadingNode = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', gap: '1.5rem' }}>
    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
      <div style={{ width: '60px', height: '60px', border: '3px solid var(--surface-border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'genSpin 1s linear infinite' }} />
      <Zap size={22} color="var(--accent-primary)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'genPulse 1s ease-in-out infinite' }} />
    </div>
    <p style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.5em', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>SYNTHESIZING_STRATEGY</p>
  </div>
);

const MetricCard = ({ title, value, icon, color, subtitle }) => (
  <div style={{ padding: '1.5rem', borderRadius: '20px', background: 'var(--card-bg)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-elevated)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
      {React.cloneElement(icon, { color })}
      <span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.15em', color: 'var(--text-muted)' }}>{title}</span>
    </div>
    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: color }}>{value}</div>
    {subtitle && <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '0.4rem', textTransform: 'uppercase' }}>{subtitle}</div>}
  </div>
);

const ResultBlock = ({ title, children, style = {} }) => (
  <div style={{ padding: '2rem', borderRadius: '24px', background: 'var(--card-bg)', border: '1px solid var(--surface-border)', ...style }}>
    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent-primary)', margin: '0 0 1.5rem' }}>
      <Terminal size={14} /> {title}
    </h3>
    {children}
  </div>
);

/* ── Style Constants ── */
const containerStyle = { flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', background: 'var(--bg-main)', minHeight: '100vh' };
const titleStyle = { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 };
const subtitleStyle = { fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '0.5rem' };

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '1.25rem 10rem 1.25rem 1.25rem',
  border: '1px solid var(--input-border)', background: 'var(--input-bg)',
  color: 'var(--text-primary)', borderRadius: '14px', outline: 'none',
  fontFamily: 'monospace', transition: 'all 0.25s ease'
};

const buttonStyle = { position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', padding: '0.7rem 1.5rem', background: 'var(--accent-primary)', color: '#000', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '0.65rem' };
const dashboardStyle = { display: 'flex', flexDirection: 'column', gap: '2rem', transition: 'all 0.6s ease' };
const bannerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 2rem', borderRadius: '16px', background: 'var(--accent-muted)', border: '1px solid var(--accent-primary)' };
const bannerTextStyle = { fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.2em', color: 'var(--accent-primary)', textTransform: 'uppercase' };
const metricsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' };
const contentGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' };
const thesisTextStyle = { color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, fontStyle: 'italic', margin: 0, paddingLeft: '1.5rem', borderLeft: '3px solid var(--accent-primary)' };
const tickerTagStyle = { padding: '6px 12px', background: 'var(--accent-muted)', border: '1px solid var(--accent-primary)', borderRadius: '8px', color: 'var(--accent-primary)', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' };

export default GeneratePage;