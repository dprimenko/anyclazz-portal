import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: netlify(),

  vite: {
    server: {
      allowedHosts: ['localhost', 'anyclazz.a.pinggy.link'],
      proxy: {
        '^/maps/api/.*': {
          target: 'https://maps.googleapis.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/maps\/api/, '/maps/api')
        }
      }
    },
  },

  env: {
    schema: {
      API_URL: envField.string({ context: "client", access: "public" }),
      GOOGLE_MAPS_API_KEY: envField.string({ context: "client", access: "public" }),
    }
  }
});