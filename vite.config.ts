import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(new URL('.', import.meta.url).pathname, 'src')
    }
  },
  server: {
    port: 8080
  }
});
