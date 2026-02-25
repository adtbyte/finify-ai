import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import the new hook
import { Activity, Archive, LayoutDashboard, LogOut, Cpu, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme(); // Use global theme state
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={navWrapper}>
      <Link to="/" style={brandLink}>
        <Cpu size={32} color="var(--accent-primary)" />
        <span style={brandText}>FINIFY_AI</span>
      </Link>

      <div style={navLinks}>
        <Link to="/generate" style={linkStyle(isActive('/generate'))}>
          <LayoutDashboard size={22} /> GENERATE
        </Link>
        <Link to="/vault" style={linkStyle(isActive('/vault'))}>
          <Archive size={22} /> VAULT
        </Link>
        <Link to="/live" style={linkStyle(isActive('/live'))}>
          <Activity size={22} /> LIVE_PULSE
        </Link>
      </div>

      <div style={userSection}>
        {/* FIXED TOGGLE: Now calls toggleTheme from Context */}
        <button onClick={toggleTheme} style={themeToggleBtn(isDark)}>
          {isDark ? <Moon size={22} /> : <Sun size={22} color="#f59e0b" />}
        </button>

        {user ? (
          <>
            <div style={userInfo}>
              <span style={userLabel}>SESSION_OPERATOR</span>
              <span style={userName}>{user.full_name?.toUpperCase()}</span>
            </div>
            <button onClick={handleLogout} style={logoutBtn}>
              <LogOut size={24} />
            </button>
          </>
        ) : (
          <Link to="/login" style={loginBtn}>INITIALIZE_SESSION</Link>
        )}
      </div>
    </nav>
  );
};

/* --- Visual Styles (Big Text) --- */
const navWrapper = { width: '100%', height: '80px', background: 'var(--nav-bg)', borderBottom: '2px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 3rem', boxSizing: 'border-box', position: 'sticky', top: 0, zIndex: 1000 };
const brandLink = { display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' };
const brandText = { fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.2em', fontFamily: 'monospace' };
const navLinks = { display: 'flex', gap: '3.5rem', alignItems: 'center' };
const linkStyle = (act) => ({ textDecoration: 'none', color: act ? 'var(--accent-primary)' : 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 900, letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'monospace', borderBottom: act ? '3px solid var(--accent-primary)' : '3px solid transparent', padding: '10px 0' });
const userSection = { display: 'flex', alignItems: 'center', gap: '30px' };
const themeToggleBtn = (isDark) => ({ background: 'none', border: '1px solid var(--surface-border)', borderRadius: '10px', color: isDark ? '#666' : '#f59e0b', cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center' });
const userInfo = { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' };
const userLabel = { fontSize: '0.6rem', color: 'var(--accent-primary)', fontWeight: 900, letterSpacing: '0.15em' };
const userName = { fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'monospace' };
const logoutBtn = { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px', borderRadius: '12px', cursor: 'pointer' };
const loginBtn = { background: 'var(--accent-primary)', color: '#000', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 900, fontFamily: 'monospace' };

export default Navbar;