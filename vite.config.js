import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Expose only the public Supabase values to the browser, whether they are
  // named VITE_SUPABASE_* or SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY.
  // (SUPABASE_SERVICE_ROLE_KEY is secret and must NEVER match these prefixes.)
  envPrefix: ['VITE_', 'SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_ANON_KEY'],
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'MonProf',
        short_name: 'MonProf',
        description: "Apprenez les langues en discutant avec des interlocuteurs virtuels",
        theme_color: '#1E3A5F',
        background_color: '#F5F0E6',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        lang: 'fr',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Do not cache API calls
        navigateFallbackDenylist: [/^\/api/]
      }
    })
  ]
});
