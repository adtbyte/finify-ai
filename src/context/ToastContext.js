import React, { createContext, useContext } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => (
  <ToastContext.Provider value={toast}>
    {children}
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'var(--surface-glass)',
          color: 'var(--text-primary)',
          border: '1px solid var(--surface-border)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontFamily: 'monospace',
        },
        success: {
          iconTheme: {
            primary: 'var(--accent-primary)',
            secondary: 'var(--bg-main)',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: 'var(--bg-main)',
          },
        },
      }}
    />
  </ToastContext.Provider>
);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};