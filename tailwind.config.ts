import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          500: '#1f6feb',
          700: '#0f4dbd'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
