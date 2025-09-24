import Keycloak from '@auth/core/providers/keycloak';
import { defineConfig } from 'auth-astro';
import type { JWT } from '@auth/core/jwt';
import type { Session, User } from '@auth/core/types';
import './src/types/auth.d.ts';

export default defineConfig({
  secret: process.env.AUTH_SECRET || "gy07h9vlgxrjb0gdtsIRDLf4GxaN9HFY",
  debug: true,
  providers: [
    Keycloak({
      clientId: "anyclazz-app",
      clientSecret: "anyclazz-app-secret-2024",
      issuer: "http://localhost:8081/realms/anyclazz",
      authorization: {
        params: {
          prompt: "login",
        }
      },
      token: "http://localhost:8081/realms/anyclazz/protocol/openid-connect/token",
      userinfo: "http://localhost:8081/realms/anyclazz/protocol/openid-connect/userinfo",
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  events: {
    async signOut(message) {
      // Logout de Keycloak cuando se hace signOut
      const logoutUrl = `http://localhost:8081/realms/anyclazz/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent('http://localhost:4321')}`;
      console.log('Keycloak logout URL:', logoutUrl);
    },
  },
  callbacks: {
    async jwt({ token, account, profile }): Promise<JWT> {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        
        // Decodificar el JWT para extraer información adicional
        if (account.access_token) {
          try {
            const payload = JSON.parse(atob(account.access_token.split('.')[1]));
            token.userRole = payload.userRole || payload.roles?.[0] || null;
            token.realmRoles = payload.realm_roles || [];
            token.roles = payload.roles || [];
          } catch (error) {
            console.error('Error decoding JWT:', error);
          }
        }
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken;
        (session as any).userRole = token.userRole;
        (session as any).realmRoles = token.realmRoles;
        (session as any).roles = token.roles;
      }
      return session;
    },
  },
});