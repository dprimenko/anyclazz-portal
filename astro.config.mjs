import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

import auth from 'auth-astro';

import tailwindcss from "@tailwindcss/vite";

const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://anyclazz.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    react(),
    auth(),
    sitemap({
      // Excluir rutas privadas/autenticadas del sitemap
      filter: (page) => {
        const privatePatterns = [
          '/dashboard',
          '/login',
          '/logout',
          '/profile',
          '/payments',
          '/onboarding',
          '/booking',
          '/messages',
          '/me/',
          '/admin',
          '/api/',
          '/feed/',
          '/auth-error',
          '/ref/',
        ];
        return !privatePatterns.some((pattern) => page.includes(pattern));
      },
    }),
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),

  image: {
    service: {
      config: {
        limitInputPixels: false,
      }
    },
    domains: [],
    remotePatterns: []
  },

  vite: {
    server: {
      allowedHosts: ['localhost', 'primenko.a.pinggy.link']
    },

    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    },

    plugins: [tailwindcss()],
  }
});