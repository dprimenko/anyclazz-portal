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
      allowedHosts: ['localhost', 'anyclazz.a.pinggy.link']
    },
    plugins: [tailwindcss()],
    css: {
      modules: {
        localsConvention: 'camelCase', // Permite usar camelCase en vez de kebab-case
        generateScopedName: '[name]__[local]___[hash:base64:5]', // Formato de los nombres de clase
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@use "sass:math";`, // Variables globales SCSS si las necesitas
        },
      },
    },
  },

  env: {
    schema: {
      API_URL: envField.string({ context: "client", access: "public" }),
      KEYCLOAK_ISSUER: envField.string({ context: "server", access: "public" }),
      KEYCLOAK_CLIENT_ID: envField.string({ context: "server", access: "public" }),
      KEYCLOAK_CLIENT_SECRET: envField.string({ context: "server", access: "public" }),
      AUTH_SECRET: envField.string({ context: "server", access: "public" }),
    }
  }
});