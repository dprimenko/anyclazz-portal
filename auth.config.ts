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
          scope: "openid profile email roles"
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
            console.log('🔍 Full JWT payload:', JSON.stringify(payload, null, 2));
            console.log('📋 Available scopes in token:', payload.scope);
            console.log('👤 Name field:', payload.name);
            console.log('� Given name:', payload.given_name);
            console.log('👨 Family name:', payload.family_name);
            console.log('�📧 Email field:', payload.email);
            console.log('🎭 All available fields:', Object.keys(payload));
            
            // Extraer el nombre del token y agregarlo al token de sesión
            token.name = payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim() || payload.preferred_username || payload.email;
            
            token.userRole = payload.userRole || payload.roles?.[0] || null;
            token.realmRoles = payload.realm_roles || [];
            token.roles = payload.roles || [];
            
            console.log('✅ Token name configured:', token.name);
          } catch (error) {
            console.error('Error decoding JWT:', error);
          }
        }
        
        console.log('🔗 Account object:', JSON.stringify(account, null, 2));
        console.log('👤 Profile object:', JSON.stringify(profile, null, 2));
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
      
      // Asegurar que el nombre esté disponible en la sesión
      if (token.name) {
        session.user.name = token.name as string;
      }
      
      console.log('🎯 Final session user name:', session.user.name);
      return session;
    },
  },
});