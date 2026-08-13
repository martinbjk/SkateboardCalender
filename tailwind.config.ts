import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        asphalt: {
          950: '#101012',
          900: '#16161a',
          800: '#1e1e22',
          700: '#2c2b28',
          600: '#3a3936'
        },
        chalk: {
          100: '#f2f0eb',
          300: '#c9c5ba',
          500: '#9a968c'
        },
        concrete: {
          100: '#edeae2',
          200: '#e2ded3',
          300: '#cfcabb'
        },
        spray: {
          DEFAULT: '#ff5a1f',
          dark: '#d94413',
          light: '#ff8a5c'
        },
        hazard: {
          DEFAULT: '#f5d90a',
          dark: '#c9b100'
        },
        live: '#ff2d55'
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace']
      },
      backgroundImage: {
        grip: "radial-gradient(currentColor 1px, transparent 1px)",
        hazardstripe:
          'repeating-linear-gradient(45deg, var(--tw-gradient-from) 0 10px, var(--tw-gradient-to) 10px 20px)'
      },
      backgroundSize: {
        grip: '6px 6px'
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        'pulse-live': 'pulse-live 1.4s ease-in-out infinite',
        marquee: 'marquee 22s linear infinite'
      },
      borderRadius: {
        stamp: '2px'
      }
    }
  },
  plugins: []
};

export default config;
