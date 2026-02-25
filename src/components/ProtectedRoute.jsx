import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: '1rem',
      backgroundColor: 'var(--bg-main)',
    }}>
      <div style={{ position: 'relative', width: '36px', height: '36px' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'var(--accent-primary)', opacity: 0.2,
          animation: 'protectedPing 1.2s cubic-bezier(0,0,0.2,1) infinite',
        }} />
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: '2px solid var(--surface-border)',
          borderTopColor: 'var(--accent-primary)',
          animation: 'protectedSpin 0.9s linear infinite',
        }} />
      </div>
      <p style={{
        fontSize: '0.6rem', color: 'var(--accent-primary)',
        textTransform: 'uppercase', letterSpacing: '0.3em',
        margin: 0, animation: 'protectedPulse 1.5s ease-in-out infinite',
      }}>
        Authenticating_Identity...
      </p>
      <style>{`
        @keyframes protectedSpin  { to { transform: rotate(360deg); } }
        @keyframes protectedPing  { 75%,100% { transform: scale(2); opacity: 0; } }
        @keyframes protectedPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default ProtectedRoute;