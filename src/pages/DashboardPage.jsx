import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { 
  LayoutDashboard, History, PlusCircle, ArrowUpRight, 
  ShieldCheck, Zap, Database, Activity 
} from 'lucide-react';

const DashboardPage = () => {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVaultData = async () => {
      try {
        const res = await api.get('/portfolio/history');
        setStrategies(res.data);
      } catch (err) {
        console.error('VAULT_SYNC_ERROR', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVaultData();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="reveal-node" style={containerStyle}>
      {/* ── Header ── */}
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            <LayoutDashboard size={24} color="var(--accent-primary)" />
            Terminal_<span style={{ color: 'var(--accent-primary)' }}>Dashboard</span>
          </h1>
          <p style={subtitleStyle}>Secure Node Active // Operator: AUTH_VERIFIED</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={statusLabelStyle}>
            <ShieldCheck size={11} color="var(--accent-primary)" />
            Node_Status
          </div>
          <p style={statusValueStyle}>OPTIMAL</p>
        </div>
      </header>

      {/* ── System Metrics ── */}
      <div style={metricsGridStyle}>
        <MetricItem icon={<Zap size={14}/>} label="System_Uptime" value="99.9%" />
        <MetricItem icon={<Database size={14}/>} label="Vault_Capacity" value={`${strategies.length}/∞`} />
        <MetricItem icon={<Activity size={14}/>} label="Network_Latency" value="14ms" />
      </div>

      {/* ── Strategy Grid ── */}
      <div style={gridStyle}>
        {/* New Strategy CTA */}
        <button onClick={() => navigate('/generate')} style={ctaButtonStyle}>
          <div style={plusIconContainerStyle}>
            <PlusCircle size={26} color="var(--accent-primary)" />
          </div>
          <span style={ctaTextStyle}>Initialize_New_Strategy →</span>
        </button>

        {strategies.map((item) => (
          <StrategyCard
            key={item.id}
            item={item}
            onClick={() => navigate(`/portfolio/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

/* ── Components ── */

const MetricItem = ({ icon, label, value }) => (
  <div style={metricItemStyle}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
      {icon}
      <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
    </div>
    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</span>
  </div>
);

const StrategyCard = ({ item, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...cardStyle,
        borderColor: hovered ? 'var(--accent-primary)' : 'var(--surface-border)',
        boxShadow: hovered ? '0 0 24px var(--accent-glow)' : 'none',
      }}
    >
      <div style={cardHeaderStyle}>
        <div style={cardIconStyle}><History size={16} color="var(--accent-primary)" /></div>
        <ArrowUpRight size={16} color={hovered ? 'var(--accent-primary)' : 'var(--text-muted)'} />
      </div>
      <h3 style={{ ...cardTitleStyle, color: hovered ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
        {item.goal || 'Manual_Strategy_Sync'}
      </h3>
      <div style={cardFooterStyle}>
        <span style={cardDateStyle}>{new Date(item.created_at).toLocaleDateString()}</span>
        <span style={{ ...cardViewStyle, opacity: hovered ? 1 : 0 }}>OPEN_VAULT</span>
      </div>
    </div>
  );
};

const LoadingScreen = () => (
    <div style={loadingContainerStyle}>
      <div style={loaderRailStyle}><div style={loaderBarStyle} /></div>
      <p style={loaderTextStyle}>decrypting_vault_nodes...</p>
    </div>
);

/* ── Styles ── */

const containerStyle = { flex: 1, width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)' };
const titleStyle = { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 0.5rem' };
const subtitleStyle = { fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.28em', margin: 0 };
const statusLabelStyle = { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem', fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' };
const statusValueStyle = { fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--accent-primary)', margin: 0, textShadow: '0 0 12px var(--accent-glow)' };

const metricsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' };
const metricItemStyle = { padding: '1rem', background: 'var(--surface-glass)', border: '1px solid var(--surface-border)', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '4px' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' };
const ctaButtonStyle = { padding: '2rem', background: 'var(--surface-glass)', border: '1px dashed var(--surface-border)', borderRadius: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.3s ease' };
const ctaTextStyle = { fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)' };
const plusIconContainerStyle = { width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const cardStyle = { padding: '1.5rem', borderRadius: '18px', background: 'var(--surface-glass)', border: '1px solid var(--surface-border)', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative' };
const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' };
const cardIconStyle = { width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-muted)', border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const cardTitleStyle = { fontSize: '0.9rem', fontWeight: 700, margin: '0 0 1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const cardFooterStyle = { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--surface-border)', paddingTop: '0.75rem' };
const cardDateStyle = { fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase' };
const cardViewStyle = { fontSize: '0.55rem', fontWeight: 700, color: 'var(--accent-primary)', transition: 'opacity 0.2s ease' };

const loadingContainerStyle = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', minHeight: '60vh' };
const loaderRailStyle = { width: '120px', height: '2px', background: 'var(--surface-border)', borderRadius: '999px', overflow: 'hidden' };
const loaderBarStyle = { height: '100%', width: '40%', background: 'var(--accent-primary)', animation: 'slideLoader 1.4s ease-in-out infinite' };
const loaderTextStyle = { fontSize: '0.6rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.35em' };

export default DashboardPage;