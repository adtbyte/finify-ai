import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import ReactMarkdown from 'react-markdown';
import { FileText, ChevronLeft, ShieldCheck, PieChart, Activity } from 'lucide-react';
import toast from 'react-hot-toast';


const PortfolioPage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [data, setData]           = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchStrategy = async () => {
      try {
        const res = await api.get(`/portfolio/${id}`);
        setData({
          ...res.data,
          holdings: typeof res.data.holdings === 'string'
            ? JSON.parse(res.data.holdings)
            : res.data.holdings,
        });
      } catch {
        toast.error('VAULT_ACCESS_DENIED: Invalid Strategy ID');
        navigate('/dashboard');
      }
    };
    fetchStrategy();
  }, [id, navigate]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading('GENERATING_INSTITUTIONAL_REPORT...');
    try {
      const response = await api.post('/portfolio/export', data, { responseType: 'blob' });
      const url  = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', `FINIFY_AUDIT_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.success('REPORT_EXPORTED_SUCCESSFULLY', { id: toastId });
    } catch {
      toast.error('EXPORT_FAILED: Template Engine Offline', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  /* ── Loading ── */
  if (!data) return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: '1rem',
    }}>
      <div style={{ width: '120px', height: '2px', background: 'var(--surface-border)', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: '40%',
          background: 'var(--accent-primary)', borderRadius: '999px',
          animation: 'slideLoader 1.4s ease-in-out infinite',
        }} />
      </div>
      <p style={{ fontSize: '0.6rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.4em', margin: 0 }}>
        decrypting_vault_node...
      </p>
      <style>{`@keyframes slideLoader { 0%{transform:translateX(-100%)} 100%{transform:translateX(350%)} }`}</style>
    </div>
  );

  const riskScore = data.risk_score || 0;

  return (
    <div
      className="reveal-node"
      style={{
        flex: 1, width: '100%', maxWidth: '1080px',
        margin: '0 auto', padding: '2.5rem 1.5rem',
        boxSizing: 'border-box', display: 'flex',
        flexDirection: 'column', gap: '2rem',
      }}
    >
      {/* ── Nav bar ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)',
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: 'var(--text-muted)',
            transition: 'color 0.2s ease', padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ChevronLeft size={14} /> Back_to_Vault
        </button>

        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="cyber-btn"
          style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.6rem' }}
        >
          <FileText size={13} />
          {isExporting ? 'Generating...' : 'Export_Strategy_PDF'}
        </button>
      </div>

      {/* ── Identity Header ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
          <span style={{
            padding: '0.2rem 0.6rem', borderRadius: '6px',
            background: 'var(--accent-muted)', border: '1px solid var(--accent-primary)',
            color: 'var(--accent-primary)', fontSize: '0.55rem',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
          }}>
            Strategy_Audit_Confirmed
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.55rem', fontFamily: 'monospace' }}>
            NODE_HASH: {parseInt(id).toString(16).padStart(8, '0')}
          </span>
        </div>
        <h1 style={{
          fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em',
          textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 0.4rem',
        }}>
          {data.goal}
        </h1>
        <p style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.22em', margin: 0 }}>
          Generated: {new Date(data.created_at).toLocaleString()} {'//'} Status: Immutable_Record
        </p>
      </div>

      {/* ── Content Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>

        {/* Summary — 2/3 */}
        <SectionCard title="01_Agentic_Synthesis_Summary" icon={<Activity size={13} />} style={{ gridColumn: 'span 2' }}>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '0.85rem',
            lineHeight: 1.75, margin: 0,
            paddingLeft: '1rem', borderLeft: '2px solid var(--accent-primary)',
          }}>
            {data.summary}
          </p>
        </SectionCard>

        {/* Risk Score — 1/3 */}
        <SectionCard title="Protocol_Risk_Rating" icon={<ShieldCheck size={13} />} accent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)', lineHeight: 1 }}>
                {riskScore}
              </span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/10</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'var(--surface-border)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${riskScore * 10}%`,
                background: 'var(--accent-primary)',
                boxShadow: '0 0 10px var(--accent-glow)',
                borderRadius: '999px',
                transition: 'width 1s ease',
              }} />
            </div>
            <p style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>
              Risk Profile
            </p>
          </div>
        </SectionCard>

        {/* Rationale — 2/3 */}
        <SectionCard title="02_Strategic_Audit_Rationale" icon={<ShieldCheck size={13} />} style={{ gridColumn: 'span 2' }}>
          <MdContent>{data.rationale}</MdContent>
        </SectionCard>

        {/* Holdings — 1/3 */}
        <SectionCard title="03_Asset_Allocation" icon={<PieChart size={13} />}>
          <MdContent>
            {typeof data.holdings === 'string' ? data.holdings : JSON.stringify(data.holdings)}
          </MdContent>
        </SectionCard>
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon, children, style = {}, accent = false }) => (
  <div style={{
    padding: '1.5rem',
    borderRadius: '18px',
    background: accent ? 'var(--accent-muted)' : 'var(--surface-glass)',
    border: `1px solid ${accent ? 'var(--accent-primary)' : 'var(--surface-border)'}`,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }}>
  <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--accent-primary)', opacity: 0.5, borderRadius: '0 2px 2px 0' }} />
    <h2 style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.2em', color: 'var(--accent-primary)',
      margin: '0 0 1rem',
    }}>
      {icon}{title}
    </h2>
    {children}
  </div>
);

const MdContent = ({ children }) => (
  <>
    <style>{`
      .md-portfolio p      { margin:0 0 0.5rem; color:var(--text-secondary); font-size:0.82rem; line-height:1.7; }
      .md-portfolio ul     { padding-left:1.2rem; margin:0 0 0.5rem; }
      .md-portfolio li     { margin-bottom:0.25rem; color:var(--text-secondary); font-size:0.82rem; }
      .md-portfolio strong { color:var(--accent-primary); font-weight:700; }
      .md-portfolio h1,.md-portfolio h2,.md-portfolio h3 {
        color:var(--text-primary); font-weight:700; font-size:0.88rem; margin:0.6rem 0 0.3rem;
      }
    `}</style>
    <div className="md-portfolio">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  </>
);

export default PortfolioPage;