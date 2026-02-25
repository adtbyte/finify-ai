import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import ReactMarkdown from 'react-markdown';
import { 
  Terminal, ShieldAlert, BarChart3, 
  ArrowLeft, Download, Zap, Activity 
} from 'lucide-react';
import toast from 'react-hot-toast';

const PortfolioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrategy = async () => {
      try {
        const res = await api.get(`/portfolio/history`);
        // Find the specific strategy in the history array
        const strategy = res.data.find(item => item.id === parseInt(id));
        if (strategy) {
          setData(strategy);
        } else {
          toast.error("STRATEGY_NOT_FOUND_IN_VAULT");
          navigate('/vault');
        }
      } catch (err) {
        toast.error("VAULT_ACCESS_FAILURE");
      } finally {
        setLoading(false);
      }
    };
    fetchStrategy();
  }, [id, navigate]);

  if (loading) return <div className="loading-shimmer">DECRYPTING_STRATEGY...</div>;
  if (!data) return null;

  return (
    <div className="reveal-node" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* ── Navigation Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', fontWeight: 700 }}
        >
          <ArrowLeft size={14} /> RETURN_TO_VAULT
        </button>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', margin: 0 }}>IDENTIFIER: {id}</p>
          <p style={{ fontSize: '0.55rem', color: 'var(--accent-primary)', fontWeight: 800 }}>TIMESTAMP: {new Date(data.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* ── Main Strategy Header ── */}
      <section style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase' }}>
          {data.goal}
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={badgeStyle}><Activity size={12}/> RISK_SCORE: {data.risk_score}</div>
           <div style={{ ...badgeStyle, color: '#3b82f6', borderColor: '#3b82f6' }}><ShieldAlert size={12}/> AUDIT_STATUS: VERIFIED</div>
        </div>
      </section>

      {/* ── Content Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        
        {/* Thesis Column */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <DetailBlock title="01_INVESTMENT_THESIS">
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{data.summary}</p>
          </DetailBlock>

          <DetailBlock title="02_AGENTIC_RATIONALE">
            <div className="md-content">
              <ReactMarkdown>{data.rationale}</ReactMarkdown>
            </div>
          </DetailBlock>
        </div>

        {/* Sidebar / Metadata Column */}
        <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <DetailBlock title="03_PROPOSED_HOLDINGS" icon={<Zap size={14}/>}>
             <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {JSON.parse(data.holdings).map((ticker, idx) => (
                    <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid var(--surface-border)', color: 'var(--accent-primary)' }}>
                        {ticker}
                    </div>
                ))}
             </div>
          </DetailBlock>

          <button className="cyber-btn" style={{ width: '100%', padding: '1rem', fontSize: '0.7rem' }}>
            <Download size={14} /> REGENERATE_PDF_REPORT
          </button>
        </div>

      </div>
    </div>
  );
};

/* ── UI Components ── */

const DetailBlock = ({ title, children, icon }) => (
  <div style={{ padding: '1.5rem', borderRadius: '18px', background: 'var(--surface-glass)', border: '1px solid var(--surface-border)', backdropFilter: 'blur(12px)' }}>
    <h3 style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icon || <Terminal size={12}/>} {title}
    </h3>
    {children}
  </div>
);

const badgeStyle = {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '4px 12px', borderRadius: '6px',
  border: '1px solid var(--accent-primary)',
  color: 'var(--accent-primary)',
  fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em'
};

export default PortfolioPage;