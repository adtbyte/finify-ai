import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ShieldCheck, BarChart3, ArrowRight, Zap, Globe, Archive } from 'lucide-react';

const FEATURES = [
  {
    icon: <Cpu size={22} />,
    title: 'Agentic_Orchestration',
    desc: 'Strategist and Risk-Critic agents debate every ticker to ensure institutional precision.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Risk_Auditing',
    desc: 'Automated Black Swan stress testing simulates drawdown scenarios for every strategy.',
  },
  {
    icon: <Globe size={22} />,
    title: 'Hybrid_RAG_Grounding',
    desc: 'Merging real-time market signals with our curated NSE_BSE institutional stock corpus.',
  },
];

const STATS = [
  { value: '99.9%', label: 'SYSTEM_UPTIME', accent: true },
  { value: 'RAG_v2.5', label: 'CORE_ENGINE',   accent: false },
  { value: 'SECURE', label: 'VAULT_ENCRYPTION',   accent: false },
  { value: 'LIVE',  label: 'MARKET_INFERENCE',   accent: true  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="reveal-node"
      style={{
        flex: 1, width: '100%', maxWidth: '1100px',
        margin: '0 auto', padding: '4rem 1.5rem 5rem',
        boxSizing: 'border-box', display: 'flex',
        flexDirection: 'column', gap: '5.5rem',
      }}
    >
      {/* ── Hero Section ── */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>

        {/* 🛰️ System Status Pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.5rem 1.25rem', borderRadius: '999px',
          background: 'var(--accent-muted)', border: '1px solid var(--accent-primary)',
        }}>
          <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px' }}>
            <span style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'var(--accent-primary)', opacity: 0.6,
              animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
            }} />
            <span style={{ position: 'relative', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
          </span>
          <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--accent-primary)' }}>
            NODE_3.0_PUNE_CLUSTER // STATUS: OPTIMAL
          </span>
        </div>

        {/* 📟 Headline */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 9vw, 5.5rem)',
          fontWeight: 900, letterSpacing: '-0.04em',
          textTransform: 'uppercase', lineHeight: 0.95,
          color: 'var(--text-primary)', margin: 0,
        }}>
          Synthetic_Asset<br />
          <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 45px var(--accent-glow)' }}>Intelligence</span>
        </h1>

        {/* 📡 Subline */}
        <p style={{
          maxWidth: '560px', fontSize: '0.85rem', lineHeight: 1.8,
          color: 'var(--text-secondary)', textTransform: 'uppercase',
          letterSpacing: '0.08em', margin: 0, fontWeight: 500,
        }}>
          Institutional-grade portfolio synthesis powered by dual-agent reasoning. 
          Backtested. Stress-tested. Grounded in real-market truth.
        </p>

        {/* 🕹️ CTAs */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => navigate('/login')}
            className="cyber-btn"
            style={{ width: 'auto', padding: '1rem 2.5rem', fontSize: '0.7rem', gap: '0.75rem' }}
          >
            INITIALIZE_TERMINAL <ArrowRight size={16} />
          </button>
          
          <button
            onClick={() => navigate('/live')}
            style={{
              padding: '1rem 2.5rem',
              border: '1px solid var(--surface-border)',
              borderRadius: '14px',
              background: 'var(--surface-glass)',
              color: 'var(--text-primary)',
              fontSize: '0.65rem', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.15em',
              cursor: 'pointer', transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.color = 'var(--accent-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--surface-border)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
          >
            LIVE_PULSE_MONITOR <Zap size={14} />
          </button>
        </div>
      </div>

      {/* ── Feature Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {FEATURES.map((feat, i) => (
          <FeatureCard key={i} {...feat} />
        ))}
      </div>

      {/* ── Institutional Stats ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1px', background: 'var(--surface-border)',
        border: '1px solid var(--surface-border)',
        borderRadius: '24px', overflow: 'hidden',
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            padding: '2.5rem 1rem', textAlign: 'center',
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(16px)',
          }}>
            <p style={{
              fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em',
              color: s.accent ? 'var(--accent-primary)' : 'var(--text-primary)',
              textShadow: s.accent ? '0 0 25px var(--accent-glow)' : 'none',
              margin: '0 0 0.5rem',
            }}>
              {s.value}
            </p>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.25em', margin: 0 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '2rem', borderRadius: '24px',
        background: 'var(--surface-glass)',
        border: `1px solid ${hovered ? 'var(--accent-primary)' : 'var(--surface-border)'}`,
        boxShadow: hovered ? '0 0 30px var(--accent-glow)' : 'none',
        backdropFilter: 'blur(16px)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'default',
      }}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: '14px',
        background: 'var(--accent-muted)',
        border: '1px solid var(--accent-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent-primary)', marginBottom: '1.5rem',
        boxShadow: hovered ? '0 0 20px var(--accent-glow)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.15em', color: 'var(--text-primary)',
        margin: '0 0 0.75rem',
      }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.8, margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        {desc}
      </p>
    </div>
  );
};

export default LandingPage;