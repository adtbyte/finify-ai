import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import theme hook
import toast from 'react-hot-toast';
import { Eye, EyeOff, Cpu, Zap } from 'lucide-react';

const LoginPage = () => {
  const { isDarkMode } = useTheme(); // Consuming your dual-theme state
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  // Dynamic colors for Webkit Autofill based on theme state
  const dynamicAutofillBg = isDarkMode ? '#050505' : '#ffffff';
  const dynamicAutofillText = isDarkMode ? '#ffffff' : '#0f172a';

  const [scanKey, setScanKey] = useState(0);
  useEffect(() => { setScanKey(k => k + 1); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('INPUT_REQUIRED: Please enter your credentials.');
    
    setLoading(true);
    try {
      await login(email, password);
      toast.success('AUTHENTICATION_SUCCESS: Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('ACCESS_DENIED: Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  /* ───────── Dynamic Style Helpers ───────── */
  const inputStyle = (fieldId, extra = {}) => ({
    width: '100%',
    boxSizing: 'border-box',
    // Syncs browser autofill with the current theme background
    WebkitBoxShadow: `0 0 0px 1000px ${dynamicAutofillBg} inset`,
    WebkitTextFillColor: dynamicAutofillText,
    caretColor: 'var(--accent-primary)',
    border: `1px solid ${focused === fieldId ? 'var(--accent-primary)' : 'var(--surface-border)'}`,
    background: 'var(--bg-main)',
    color: 'var(--text-primary)',
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
    ...extra,
  });

  const labelStyle = (fieldId) => ({
    display: 'block', 
    fontSize: '0.65rem', 
    fontWeight: 800,
    textTransform: 'uppercase', 
    letterSpacing: '0.15em',
    color: focused === fieldId ? 'var(--accent-primary)' : 'var(--text-muted)',
    marginBottom: '0.5rem', 
    transition: 'color 0.2s ease',
  });

  return (
    <div style={pageWrapper}>
      {/* Ambient glows */}
      <div aria-hidden="true" style={glowTopLeft} />
      <div aria-hidden="true" style={glowBottomRight} />

      {/* ── Login Card ── */}
      <div
        className="reveal-node"
        style={cardStyle}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 0 40px var(--accent-glow), var(--shadow-elevated)';
          e.currentTarget.style.borderColor = 'var(--accent-primary)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
          e.currentTarget.style.borderColor = 'var(--surface-border)';
        }}
      >
        <span key={scanKey} className="animate-laser" aria-hidden="true" />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={iconBox}>
              <Cpu size={22} color="var(--accent-primary)" />
            </div>
          </div>
          <h1 style={titleStyle}>Welcome Back</h1>
          <p style={subtitleStyle}>Sign in to access your node</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Email */}
          <div>
            <label htmlFor="login-email" style={labelStyle('email')}>Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="operator@finify.ai"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              autoComplete="email"
              style={inputStyle('email')}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" style={labelStyle('password')}>Master Key</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                autoComplete="current-password"
                style={inputStyle('password', { paddingRight: '3rem' })}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={eyeButtonStyle}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="cyber-btn"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? <><Zap size={14} className="animate-pulse" /> SYNCHRONIZING...</> : 'Access Node'}
          </button>
        </form>

        {/* Footer */}
        <div style={footerStyle}>
          <p style={footerText}>
            No account?{' '}
            <Link to="/register" style={registerLinkStyle}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────── Styles ─────────────────────────────── */

const pageWrapper = {
  flex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '2rem 1rem', background: 'var(--bg-main)', position: 'relative', overflow: 'hidden'
};

const cardStyle = {
  position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px', padding: '2.5rem',
  borderRadius: '24px', background: 'var(--surface-glass)', border: '1px solid var(--surface-border)',
  boxShadow: 'var(--shadow-elevated)', backdropFilter: 'blur(20px)', transition: 'all 0.4s ease'
};

const titleStyle = { fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.4rem', letterSpacing: '-0.02em' };
const subtitleStyle = { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', margin: 0 };

const iconBox = {
  width: '50px', height: '50px', borderRadius: '15px', background: 'var(--accent-muted)',
  border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 0 18px var(--accent-glow)'
};

const eyeButtonStyle = {
  position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s ease'
};

const footerStyle = { marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--surface-border)', textAlign: 'center' };
const footerText = { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)' };
const registerLinkStyle = { color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 800 };

const glowTopLeft = { position: 'fixed', top: '-10%', left: '-10%', width: '35vw', height: '35vw', background: 'var(--accent-glow)', filter: 'blur(100px)', opacity: 0.4, pointerEvents: 'none' };
const glowBottomRight = { position: 'fixed', bottom: '-10%', right: '-10%', width: '25vw', height: '25vw', background: 'var(--accent-glow)', filter: 'blur(100px)', opacity: 0.2, pointerEvents: 'none' };

export default LoginPage;