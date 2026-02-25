import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axiosConfig';
import { useTheme } from '../context/ThemeContext';
import ReactMarkdown from 'react-markdown';
import { Trash2, Download, Archive, Calendar, ShieldCheck, Eye, X, BarChart3, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const VaultPage = () => {
  const { isDarkMode } = useTheme(); // Consuming your specific ThemeContext
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  /* ───────── 1. API Synchronization ───────── */
  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get('/portfolio/history');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setHistory(data);
    } catch (err) {
      toast.error("VAULT_SYNC_FAILURE");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("PERMANENT_WIPE: Proceed?")) return;
    try {
      await api.delete(`/portfolio/${id}`);
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success("DATA_PURGED");
    } catch (err) { toast.error("PURGE_ERROR"); }
  };

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  if (loading) return <div style={centerStyle}>SYNCHRONIZING_VAULT...</div>;

  return (
    <div className="reveal-node" style={containerStyle}>
      {/* ── Page Header ── */}
      <div style={headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Archive size={28} color="var(--accent-primary)"/>
          <h2 style={headerStyle}>STRATEGY_VAULT</h2>
        </div>
        <span style={vaultBadge}>{history.length} NODES</span>
      </div>

      {/* ── Strategy Grid ── */}
      <div style={listStyle}>
        {history.length === 0 ? (
          <div style={emptyState}>NO_DATA_FOUND: INITIALIZE_STRATEGY</div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="vault-card" style={cardStyle}>
              <div style={{ flex: 1 }}>
                <div style={tagRow}>
                  <span style={metaText}><Calendar size={14}/> {new Date(item.created_at).toLocaleDateString()}</span>
                  <span style={riskTag}><ShieldCheck size={14}/> RISK: {item.risk_score}</span>
                </div>
                <h4 style={titleStyle}>{item.goal}</h4>
              </div>

              <div style={actionColumn}>
                <button onClick={() => setSelectedItem(item)} style={iconBtn} title="View"><Eye size={22}/></button>
                <button onClick={() => handleDelete(item.id)} style={deleteBtn} title="Purge"><Trash2 size={22}/></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── THEME FIXED MODAL (OLED BLACK) ── */}
      {selectedItem && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={modalHeader}>
              <span style={modalId}>NODE_DATA // ID_{selectedItem.id}</span>
              <button onClick={() => setSelectedItem(null)} style={closeBtn}><X size={24}/></button>
            </div>
            
            <div style={modalBody}>
              <h3 style={modalTitle}>{selectedItem.goal}</h3>
              
              <div className="markdown-vault">
                <p style={labelSmall}><AlignLeft size={14}/> STRATEGIC_SUMMARY</p>
                <div style={widgetBox}>
                  <ReactMarkdown>{selectedItem.summary}</ReactMarkdown>
                </div>

                <p style={labelSmall}><AlignLeft size={14}/> AGENTIC_RATIONALE</p>
                <div style={widgetBox}>
                  <ReactMarkdown>{selectedItem.rationale}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Use variables from your ThemeContext themes object */
        .markdown-vault p { 
          color: var(--text-primary); 
          font-size: 0.95rem; 
          line-height: 1.7; 
          margin-bottom: 1rem; 
        }
        
        .vault-card { 
          background: var(--card-bg); 
          border: 1px solid var(--surface-border); 
          border-radius: 16px; 
          transition: all 0.2s ease; 
        }
        
        .vault-card:hover { 
          border-color: var(--accent-primary) !important; 
          transform: translateY(-3px); 
          box-shadow: var(--shadow-elevated);
        }

        .reveal-node { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────── Styles ─────────────────────────────── */

const containerStyle = { 
  padding: '4rem 2rem', 
  maxWidth: '1000px', 
  margin: '0 auto', 
  background: 'var(--bg-main)', 
  minHeight: '100vh' 
};

const headerRow = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '3rem', 
  borderBottom: '1px solid var(--surface-border)', 
  paddingBottom: '1.5rem' 
};

const headerStyle = { color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 800, margin: 0 };

const vaultBadge = { 
  fontSize: '0.75rem', 
  color: 'var(--accent-primary)', 
  fontWeight: 700, 
  background: 'var(--accent-muted)', 
  padding: '6px 14px', 
  borderRadius: '8px', 
  border: '1px solid var(--surface-border)' 
};

const listStyle = { display: 'flex', flexDirection: 'column', gap: '1.5rem' };
const cardStyle = { display: 'flex', padding: '2rem', alignItems: 'center', gap: '2rem' };
const tagRow = { display: 'flex', gap: '1.5rem', marginBottom: '1rem' };

const metaText = { 
  fontSize: '0.8rem', 
  color: 'var(--text-muted)', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px' 
};

const riskTag = { ...metaText, color: 'var(--accent-primary)', fontWeight: 800 };
const titleStyle = { margin: '0 0 1rem', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700 };

const actionColumn = { 
  display: 'flex', 
  gap: '1.5rem', 
  borderLeft: '1px solid var(--surface-border)', 
  paddingLeft: '1.8rem', 
  justifyContent: 'center' 
};

const iconBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' };
const deleteBtn = { ...iconBtn, color: 'var(--status-loss)' };

const modalOverlay = { 
  position: 'fixed', 
  inset: 0, 
  background: 'rgba(0,0,0,0.85)', 
  backdropFilter: 'blur(20px)', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  zIndex: 9999 
};

const modalContent = { 
  width: '92%', 
  maxWidth: '850px', 
  background: 'var(--bg-main)', 
  border: '1px solid var(--accent-primary)', 
  borderRadius: '24px', 
  maxHeight: '85vh', 
  display: 'flex', 
  flexDirection: 'column', 
  overflow: 'hidden',
  boxShadow: 'var(--shadow-elevated)'
};

const modalHeader = { 
  padding: '1.5rem 2.5rem', 
  borderBottom: '1px solid var(--surface-border)', 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  background: 'var(--bg-secondary)'
};

const modalId = { color: 'var(--accent-primary)', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 800 };
const modalBody = { padding: '3rem', overflowY: 'auto' };
const modalTitle = { fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-primary)' };

const widgetBox = { 
  background: 'var(--bg-secondary)', 
  border: '1px solid var(--surface-border)', 
  padding: '1.5rem', 
  borderRadius: '12px', 
  marginBottom: '2rem' 
};

const labelSmall = { 
  fontSize: '0.75rem', 
  fontWeight: 900, 
  color: 'var(--accent-primary)', 
  marginBottom: '1rem', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px' 
};

const closeBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' };
const centerStyle = { 
  height: '80vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  color: 'var(--accent-primary)', 
  background: 'var(--bg-main)' 
};

const emptyState = { 
  textAlign: 'center', 
  color: 'var(--text-muted)', 
  padding: '8rem', 
  border: '1px dashed var(--surface-border)', 
  borderRadius: '24px' 
};

export default VaultPage;