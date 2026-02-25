/** @type {import('tailwindcss').Config} */
module.exports = {
  // 🎯 Scans all your React files for utility classes
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  
  // 🌓 Enables dark mode support via the 'class' strategy (useful for your ThemeContext)
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // Implementing your preferred Emerald accent
        emerald: {
          500: '#10b981',
          400: '#34d399',
          600: '#059669',
        },
        // Custom Charcoal shades for the premium design aesthetic
        charcoal: {
          950: '#0a0a0a', // Deep background
          900: '#141414', // Card surface
          800: '#1a1a1a', // Hover state
        },
      },
      
      fontFamily: {
        // High-fidelity monospace stack for the financial terminal feel
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      animation: {
        // The laser scan effect for your Identity Gate
        'scan': 'scan 4s linear infinite',
        // Smooth fade-in for AI-generated strategy nodes
        'reveal': 'reveal 0.7s ease-out forwards',
      },

      keyframes: {
        scan: {
          '0%': { top: '0%', opacity: '0' },
          '5%': { opacity: '1' },
          '95%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      boxShadow: {
        // Emerald bloom effect for buttons
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.15)',
      },
    },
  },

  plugins: [
    // Standard plugins to support the Strategy Engine's AI rationales
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}