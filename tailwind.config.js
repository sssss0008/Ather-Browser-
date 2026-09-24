/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aether: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d8fe',
          300: '#a4bffd',
          400: '#7a9cfb',
          500: '#5474f6',
          600: '#3953eb',
          700: '#2c3ed7',
          800: '#2834ae',
          900: '#253089',
          950: '#161c54',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
};
