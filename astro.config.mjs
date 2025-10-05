import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import tailwindcss from "@tailwindcss/vite";

import auth from 'auth-astro';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), auth()],
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
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      API_URL: envField.string({ context: "client", access: "public" }),
      GOOGLE_MAPS_API_KEY: envField.string({ context: "client", access: "public" }),
      KEYCLOAK_ISSUER: envField.string({ context: "server", access: "public" }),
      KEYCLOAK_CLIENT_ID: envField.string({ context: "server", access: "public" }),
      KEYCLOAK_CLIENT_SECRET: envField.string({ context: "server", access: "public" }),
      AUTH_SECRET: envField.string({ context: "server", access: "public" }),
    }
  }
});