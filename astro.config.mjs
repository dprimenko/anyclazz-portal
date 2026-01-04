import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

import auth from 'auth-astro';

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), auth()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),

  vite: {
    server: {
      allowedHosts: ['localhost', 'anyclazz.a.pinggy.link']
    },

    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    },

    plugins: [tailwindcss()]
  },

  env: {
    schema: {
      API_URL: envField.string({ context: "server", access: "public" }),
      KEYCLOAK_ISSUER: envField.string({ context: "server", access: "public" }),
      KEYCLOAK_CLIENT_ID: envField.string({ context: "server", access: "public" }),
      KEYCLOAK_CLIENT_SECRET: envField.string({ context: "server", access: "public" }),
      AUTH_SECRET: envField.string({ context: "server", access: "public" }),
    }
  }
});