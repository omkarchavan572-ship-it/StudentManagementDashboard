/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c3d7ff',
          300: '#94b8ff',
          400: '#5e8eff',
          500: '#3b62f6',
          600: '#2543eb',
          700: '#1d31d8',
          800: '#1e29af',
          900: '#1e278a',
          950: '#111754',
        },
        slate: {
          850: '#151e2e',
          900: '#0f172a',
          950: '#090d16',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow': '0 0 20px rgba(59, 98, 246, 0.25)',
      }
    },
  },
  plugins: [],
}
