/** @type {import('tailwindcss').Config} */
export default {
  content: ['./entrypoints/popup/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // 여기에 커스텀 테마 설정을 추가할 수 있습니다
      colors: {
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Roboto', 'Open Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.25rem' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        text: '0 1px 2px rgba(0, 0, 0, 0.1)',
        button: '0 2px 4px rgba(0, 0, 0, 0.1)',
        'button-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
        float: '0 6px 12px -2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        lg: '0.75rem',
      },
      spacing: {
        4.5: '1.125rem',
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
        scale: 'transform',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },
      transitionTimingFunction: {
        'bounce-sm': 'cubic-bezier(0.18, 1.25, 0.4, 1)',
        'in-out-back': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-sm': 'bounce-sm 0.5s cubic-bezier(0.18, 1.25, 0.4, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'bounce-sm': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
      },
      scale: {
        102: '1.02',
        103: '1.03',
      },
    },
  },
  plugins: [],
};
