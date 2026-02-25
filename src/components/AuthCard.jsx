import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AuthCard = ({
  children,
  title,
  subtitle,
  icon: Icon,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  const [scanKey, setScanKey] = useState(0);
  useEffect(() => { setScanKey(k => k + 1); }, []);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      boxSizing: 'border-box',
      position: 'relative',
      background: 'radial-gradient(ellipse at 50% 40%, var(--bg-secondary) 0%, var(--bg-main) 70%)',
    }}>
      {/* Ambient glows */}
      <div aria-hidden="true" style={{
        position: 'fixed', top: '-100px', left: '-100px',
        width: '350px', height: '350px',
        background: 'var(--accent-glow)', borderRadius: '50%',
        filter: 'blur(90px)', opacity: 0.55, pointerEvents: 'none', zIndex: 0,
      }} />
      <div aria-hidden="true" style={{
        position: 'fixed', bottom: '-80px', right: '-80px',
        width: '280px', height: '280px',
        background: 'var(--accent-glow)', borderRadius: '50%',
        filter: 'blur(100px)', opacity: 0.3, pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Card */}
      <div
        className="reveal-node"
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '400px',
          padding: '2rem', borderRadius: '20px',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          background: 'var(--surface-glass)',
          border: '1px solid var(--surface-border)',
          boxShadow: 'var(--shadow-elevated)',
          overflow: 'hidden',
          transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow   = '0 0 40px var(--accent-glow), var(--shadow-elevated)';
          e.currentTarget.style.borderColor = 'var(--accent-primary)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow   = 'var(--shadow-elevated)';
          e.currentTarget.style.borderColor = 'var(--surface-border)';
        }}
      >
        <span key={scanKey} className="animate-laser" aria-hidden="true" />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'var(--accent-muted)',
              border: '1px solid var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}>
              {Icon && <Icon size={22} color="var(--accent-primary)" />}
            </div>
          </div>
          <h1 style={{
            fontSize: '1.4rem', fontWeight: 300, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', margin: '0 0 0.3rem',
          }}>
            {title}
          </h1>
          <p style={{
            fontSize: '0.58rem', textTransform: 'uppercase',
            letterSpacing: '0.22em', color: 'var(--text-muted)', margin: 0,
          }}>
            {subtitle}
          </p>
        </div>

        {/* Page content */}
        {children}

        {/* Footer */}
        {footerText && (
          <div style={{
            marginTop: '1.5rem', paddingTop: '1.25rem',
            borderTop: '1px solid var(--surface-border)',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '0.58rem', textTransform: 'uppercase',
              letterSpacing: '0.2em', color: 'var(--text-muted)', margin: 0,
            }}>
              {footerText}{' '}
              {footerLinkText && footerLinkTo && (
                <Link
                  to={footerLinkTo}
                  style={{
                    color: 'var(--accent-primary)', textDecoration: 'none',
                    fontWeight: 700, transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {footerLinkText}
                </Link>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;