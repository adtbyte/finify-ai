import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, Zap } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const dynamicAutofillBg = isDarkMode ? '#000000' : '#ffffff';
  const dynamicAutofillText = isDarkMode ? '#ffffff' : '#000000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return toast.error('INPUT_REQUIRED');
    }
    setLoading(true);
    try {
      await register(formData);
      toast.success('NODE_DEPLOYED');
      navigate('/login');
    } catch (error) {
      toast.error('REGISTRATION_FAILED');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldId, extra = {}) => ({
    width: '100%',
    boxSizing: 'border-box',
    WebkitBoxShadow: `0 0 0px 1000px ${dynamicAutofillBg} inset`,
    WebkitTextFillColor: dynamicAutofillText,
    caretColor: 'var(--accent-primary)',
    border: `1px solid ${focused === fieldId ? 'var(--accent-primary)' : 'var(--surface-border)'}`,
    boxShadow: focused === fieldId ? '0 0 10px var(--accent-glow)' : 'none',
    background: 'var(--bg-main)',
    color: 'var(--text-primary)',
    padding: '0.7rem 0.9rem', // Thinner padding
    borderRadius: '10px',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'all 0.25s ease',
    ...extra,
  });

  const labelStyle = (field) => ({
    display: 'block', 
    fontSize: '0.55rem', // Smaller label
    fontWeight: 800,
    textTransform: 'uppercase', 
    letterSpacing: '0.12em',
    color: focused === field ? 'var(--accent-primary)' : 'var(--text-muted)',
    marginBottom: '0.35rem', 
  });

  return (
    <div style={pageWrapper}>
      {/* Background Ambience */}
      <div aria-hidden="true" style={glowTopLeft} />
      <div aria-hidden="true" style={glowBottomRight} />

      {/* COMPACT CARD */}
      <div className="reveal-node glow-card" style={cardStyle}>
        {/* Compact Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <div style={iconContainer}>
              <UserPlus size={20} color="var(--accent-primary)" style={{ filter: 'drop-shadow(0 0 3px var(--accent-primary))' }} />
            </div>
          </div>
          <h1 style={titleStyle}>NEW_NODE</h1>
          <p style={subtitleStyle}>Operator Credentialing</p>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={labelStyle('name')}>Full Name</label>
            <input
              type="text"
              placeholder="Operator Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              style={inputStyle('name')}
            />
          </div>

          <div>
            <label style={labelStyle('email')}>Email Address</label>
            <input
              type="email"
              placeholder="operator@finify.ai"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              style={inputStyle('email')}
            />
          </div>

          <div>
            <label style={labelStyle('password')}>Master Key</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                style={inputStyle('password', { paddingRight: '2.5rem' })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtnStyle}>
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle('confirmPassword')}>Confirm Key</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                onFocus={() => setFocused('confirmPassword')}
                onBlur={() => setFocused(null)}
                style={inputStyle('confirmPassword', { paddingRight: '2.5rem' })}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={eyeBtnStyle}>
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button type="submit" className="cyber-btn glow-button" disabled={loading} style={deployBtnStyle}>
            {loading ? <Zap size={14} className="animate-pulse" /> : 'INITIALIZE_DEPLOYMENT'}
          </button>
        </form>

        <div style={footerStyle}>
          <p style={footerText}>
            Member? <Link to="/login" style={linkStyle}>Log in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .glow-card:hover { border-color: var(--accent-primary) !important; box-shadow: 0 0 20px var(--accent-glow), var(--shadow-elevated) !important; }
        .glow-button { background: var(--accent-primary) !important; color: #000 !important; transition: transform 0.2s; font-weight: 800; font-size: 0.75rem; letter-spacing: 0.1em; }
        .glow-button:hover { box-shadow: 0 0 15px var(--accent-primary); transform: scale(1.01); }
        .reveal-node { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────── Style Constants ─────────────────────────────── */

const pageWrapper = {
  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '1.5rem', background: 'var(--bg-main)', minHeight: '100vh', width: '100vw'
};

const cardStyle = {
  width: '100%', maxWidth: '340px', padding: '2rem 1.75rem', borderRadius: '22px', // Compacted Width & Padding
  background: 'var(--surface-glass)', border: '1px solid var(--surface-border)',
  boxShadow: 'var(--shadow-elevated)', backdropFilter: 'blur(20px)', zIndex: 1,
};

const titleStyle = { fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.2rem', letterSpacing: '0.05em' };
const subtitleStyle = { fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', margin: 0 };

const iconContainer = {
  width: '42px', height: '42px', borderRadius: '12px', background: 'var(--accent-muted)',
  border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const deployBtnStyle = { marginTop: '0.5rem', height: '44px', border: 'none', borderRadius: '10px', cursor: 'pointer' };

const eyeBtnStyle = { position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' };

const footerStyle = { marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)', textAlign: 'center' };
const footerText = { fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' };
const linkStyle = { color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 900 };

const glowTopLeft = { position: 'fixed', top: '-15%', left: '-10%', width: '40vw', height: '40vw', background: 'var(--accent-glow)', filter: 'blur(100px)', opacity: 0.3, pointerEvents: 'none' };
const glowBottomRight = { position: 'fixed', bottom: '-15%', right: '-10%', width: '30vw', height: '30vw', background: 'var(--accent-glow)', filter: 'blur(120px)', opacity: 0.2, pointerEvents: 'none' };

export default RegisterPage;