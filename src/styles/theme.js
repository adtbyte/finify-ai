export const themes = {
  dark: {
    /* -------- Surfaces -------- */
    '--bg-main':          '#050505',
    '--bg-secondary':     '#0b0c10',
    '--surface-glass':    'rgba(15, 15, 20, 0.75)',
    '--surface-border':   'rgba(255, 255, 255, 0.08)',
    '--card-bg':          '#141414',

    /* -------- Branding -------- */
    '--accent-primary':   '#10b981',
    '--accent-secondary': '#059669',
    '--accent-muted':     'rgba(16, 185, 129, 0.12)',  // ✨ new
    '--accent-glow':      'rgba(16, 185, 129, 0.25)',

    /* -------- Typography -------- */
    '--text-primary':     '#ffffff',
    '--text-secondary':   'rgba(255, 255, 255, 0.7)',
    '--text-muted':       'rgba(255, 255, 255, 0.4)',

    /* -------- Interactive -------- */
    '--input-bg':         'rgba(255, 255, 255, 0.03)',
    '--input-border':     'rgba(255, 255, 255, 0.12)',
    '--shadow-elevated':  '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(16, 185, 129, 0.08)',  // ✨ emerald tint

    /* -------- Status -------- */  // ✨ new section
    '--status-gain':      '#34d399',
    '--status-loss':      '#f87171',
    '--status-warning':   '#fbbf24',
    '--status-neutral':   'rgba(255, 255, 255, 0.4)',
  },

  light: {
    /* -------- Surfaces -------- */
    '--bg-main':          '#f8fafc',
    '--bg-secondary':     '#f1f5f9',
    '--surface-glass':    'rgba(255, 255, 255, 0.75)',  // ✨ was 0.9
    '--surface-border':   'rgba(16, 185, 129, 0.15)',
    '--card-bg':          '#ffffff',

    /* -------- Branding -------- */
    '--accent-primary':   '#059669',
    '--accent-secondary': '#047857',
    '--accent-muted':     'rgba(5, 150, 105, 0.10)',    // ✨ new
    '--accent-glow':      'rgba(5, 150, 105, 0.15)',

    /* -------- Typography -------- */
    '--text-primary':     '#0f172a',
    '--text-secondary':   '#475569',
    '--text-muted':       '#94a3b8',

    /* -------- Interactive -------- */
    '--input-bg':         '#ffffff',
    '--input-border':     '#e2e8f0',
    '--shadow-elevated':  '0 20px 40px rgba(16, 185, 129, 0.12)',

    /* -------- Status -------- */  // ✨ new section
    '--status-gain':      '#059669',
    '--status-loss':      '#dc2626',
    '--status-warning':   '#d97706',
    '--status-neutral':   '#94a3b8',
  }
};