import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
