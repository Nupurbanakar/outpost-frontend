/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Manrope', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        // Outpost Design System Colors
        ink: '#202c3d',
        paper: {
          DEFAULT: '#f7f4ec',
          light: '#fbf9f3',
        },
        line: '#ded7ca',
        primary: {
          DEFAULT: '#d69b42',
          50: '#f2e5cc',
          100: '#f1e6d2',
          500: '#d69b42',
          600: '#a56f28',
          700: '#94651f',
          800: '#80591f',
          dark: '#94651f',
          hover: '#a56f28',
          light: '#f2e5cc',
        },
        gold: {
          DEFAULT: '#d69b42',
          dark: '#94651f',
          hover: '#a56f28',
          light: '#f2e5cc',
        },
        green: {
          DEFAULT: '#467c68',
          50: '#deebe4',
          100: '#e2ece5',
          500: '#467c68',
          600: '#376c59',
          700: '#376b58',
          dark: '#376c59',
          light: '#deebe4',
        },
        rose: {
          DEFAULT: '#b86a64',
          50: '#f0e2df',
          100: '#f0dfdc',
          500: '#b86a64',
          600: '#9a5550',
          700: '#925651',
          dark: '#9a5550',
          light: '#f0dfdc',
        },
        muted: {
          DEFAULT: '#72777b',
          text: '#72777b',
        },
        placeholder: '#9a9b97',
        // Sidebar / Dark theme
        sidebar: {
          bg: '#202c3d',
          text: '#f7f4ec',
          accent: '#e5b45d',
          muted: '#c3c8c9',
        },
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        16: '64px',
        24: '96px',
      },
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        full: '50%',
      },
      boxShadow: {
        card: '0 8px 22px rgba(32, 44, 61, 0.06)',
        hero: '9px 12px 0 rgba(41, 51, 66, 0.035)',
        auth: '0 15px 50px rgba(31, 43, 57, 0.07)',
      },
    },
  },
  plugins: [],
};

