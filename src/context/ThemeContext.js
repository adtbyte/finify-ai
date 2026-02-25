import React, { createContext, useContext, useState, useLayoutEffect, useMemo } from 'react';
import { themes } from '../styles/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(
    () => localStorage.getItem('finify-mode') || 'dark'
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[mode];
    if (!currentTheme) return;

    Object.entries(currentTheme).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });
    root.setAttribute('data-theme', mode);
    localStorage.setItem('finify-mode', mode);
  }, [mode]);

  const toggleTheme = () => setMode(prev => prev === 'dark' ? 'light' : 'dark');

  /* Expose flat CSS vars as a nested object for any component that needs them */
  const theme = useMemo(() => {
    const t = themes[mode] || {};
    return {
      colors: {
        primary:   t['--accent-primary']   || '#10b981',
        secondary: t['--accent-secondary'] || '#059669',
        text: {
          main:      t['--text-primary']   || '#ffffff',
          secondary: t['--text-secondary'] || 'rgba(255,255,255,0.7)',
          muted:     t['--text-muted']     || 'rgba(255,255,255,0.4)',
        },
        background: {
          main:      t['--bg-main']      || '#050505',
          secondary: t['--bg-secondary'] || '#0b0c10',
        },
        border: t['--surface-border'] || 'rgba(255,255,255,0.08)',
      },
    };
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, isDarkMode: mode === 'dark', toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);