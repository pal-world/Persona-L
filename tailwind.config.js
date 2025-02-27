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
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        lg: '0.75rem',
      },
      spacing: {
        4.5: '1.125rem',
      },
    },
  },
  plugins: [],
};
