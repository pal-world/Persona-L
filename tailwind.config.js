/** @type {import('tailwindcss').Config} */
export default {
  content: ['./entrypoints/popup/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // 여기에 커스텀 테마 설정을 추가할 수 있습니다
      colors: {
        purple: {
          50: '#F0E8FF', // 약간 더 진한 라벤더 회색
          100: '#E5D8F0', // 더 진한 회색빛 보라
          200: '#D0A6DE', // 더 진한 라일락
          300: '#C090DC', // 더 진한 중간 톤의 라일락
          400: '#AE7CBB', // 더 진한 자주빛
          500: '#9470C4', // 더 진한 라벤더 보라 (메인 컬러)
          600: '#8050A8', // 더 진한 프릳 보라
          700: '#6E4090', // 더 진한 깊은 보라
          800: '#5C3478', // 더 진한 어두운 보라
          900: '#4A2860', // 더 진한 매우 어두운 보라
          950: '#361848', // 더 진한 가장 어두운 보라
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
          400: 'rgba(255, 255, 255, 0.4)',
          500: 'rgba(255, 255, 255, 0.5)',
          600: 'rgba(255, 255, 255, 0.6)',
          700: 'rgba(255, 255, 255, 0.7)',
          800: 'rgba(255, 255, 255, 0.8)',
          900: 'rgba(255, 255, 255, 0.9)',
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
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.1)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
        'inner-glass': 'inset 0 0 8px 0 rgba(31, 38, 135, 0.1)',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      spacing: {
        4.5: '1.125rem',
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
        scale: 'transform',
        blur: 'filter',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
        600: '600ms',
      },
      transitionTimingFunction: {
        'bounce-sm': 'cubic-bezier(0.18, 1.25, 0.4, 1)',
        'in-out-back': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-sm': 'bounce-sm 0.5s cubic-bezier(0.18, 1.25, 0.4, 1)',
        'spin-slow': 'spin 3s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
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
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      scale: {
        102: '1.02',
        103: '1.03',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
};
