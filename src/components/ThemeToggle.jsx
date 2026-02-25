import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        border: '1px solid var(--surface-border)',
        background: 'var(--input-bg)',
        color: 'var(--accent-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--accent-muted)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
        e.currentTarget.style.boxShadow = '0 0 10px var(--accent-glow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--input-bg)';
        e.currentTarget.style.borderColor = 'var(--surface-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {isDarkMode
        ? <Sun  size={16} color="var(--accent-primary)" />
        : <Moon size={16} color="var(--accent-primary)" />
      }
    </button>
  );
};

export default ThemeToggle;