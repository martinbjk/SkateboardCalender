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
        // Ändrad från röd (#ff2d55) till grön på uttrycklig begäran — ger
        // en tydligare "live/på gång nu"-känsla och används konsekvent
        // överallt (StatusTag, CalendarView, Hero), inte bara i korten.
        live: '#22c55e'
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
      boxShadow: {
        // Lagrad, mjuk "djup"-skugga för korten (två skikt: en tight
        // kontaktskugga + en bredare, mjukare ambient-skugga) — samma
        // teknik som Material/iOS-kort använder för verklig djupkänsla
        // istället för en enda platt skugga.
        card: '0 1px 2px rgba(16, 16, 18, 0.06), 0 6px 16px -4px rgba(16, 16, 18, 0.10)',
        'card-dark': '0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 20px -4px rgba(0, 0, 0, 0.45)',
        'card-hover': '0 2px 4px rgba(16, 16, 18, 0.08), 0 14px 28px -6px rgba(16, 16, 18, 0.16)',
        'card-hover-dark': '0 2px 4px rgba(0, 0, 0, 0.35), 0 16px 32px -6px rgba(0, 0, 0, 0.55)',
        // Mjukad efter feedback: tunnare, mer transparent ring + lättare
        // yttre glöd (för stark glöd kändes "gaming").
        'live-ring': '0 0 0 1.5px rgba(34, 197, 94, 0.35), 0 0 12px -2px rgba(34, 197, 94, 0.22)'
      },
      borderRadius: {
        stamp: '2px'
      }
    }
  },
  plugins: []
};

export default config;
