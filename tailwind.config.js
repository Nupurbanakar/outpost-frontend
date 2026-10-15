/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Manrope', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        ink: '#202c3d',
        paper: '#f7f4ec',
        'paper-light': '#fbf9f3',
        line: '#ded7ca',
        gold: {
          DEFAULT: '#d69b42',
          dark: '#94651f',
          hover: '#a56f28',
          light: '#f2e5cc',
        },
        green: {
          DEFAULT: '#467c68',
          light: '#deebe4',
          dark: '#376c59',
        },
        rose: {
          DEFAULT: '#b86a64',
          light: '#f0dfdc',
          dark: '#9a5550',
        },
        muted: '#72777b',
        placeholder: '#9a9b97',
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
};

