import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fcfaf2',
          100: '#f6eedc',
          200: '#eedfb8',
          300: '#e4cd8b',
          400: '#dcb865',
          500: '#d4af37', // Metallic Gold
          600: '#b69229',
          700: '#927124',
          800: '#795c24',
          900: '#674f23',
          950: '#3a2b10',
        },
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'tilt': 'tilt 10s infinite linear',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(0.5deg)' },
          '75%': { transform: 'rotate(-0.5deg)' },
        },
      },
    }
  },
  plugins: []
} satisfies Config;
