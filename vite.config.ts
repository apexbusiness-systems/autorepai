import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const htmlPlugin = (env) => {
  const isDoorstep = env.VITE_BRANDING_MODE === 'doorstep';
  const themeColor = isDoorstep ? '#377620' : '#ef4444';
  const name = isDoorstep ? 'Doorstep Auto' : 'AutoRepAi';
  const favicon = isDoorstep ? '/doorstep/favicon.ico' : '/vite.svg';

  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html
        .replace(/__BRAND_NAME__/g, name)
        .replace(/__BRAND_COLOR__/g, themeColor)
        .replace(/__BRAND_FAVICON__/g, favicon);
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isDoorstep = env.VITE_BRANDING_MODE === 'doorstep';

  const themeColor = isDoorstep ? '#377620' : '#ef4444';
  const name = isDoorstep ? 'Doorstep Auto' : 'AutoRepAi';
  const icon = isDoorstep ? '/doorstep/doorstep-logo.png' : '/vite.svg';

  return {
    plugins: [
      react(),
      htmlPlugin(env),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name,
          short_name: name,
          theme_color: themeColor,
          display: 'standalone',
          icons: [
            {
              src: icon,
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: icon,
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                },
              },
            },
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-api',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 24 * 60 * 60, // 1 Day
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: 8080,
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' https://browser.sentry-cdn.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https: wss:;",
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    }
  };
});
