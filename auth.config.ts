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
    maxAge: 10 * 60 * 60, // 10 horas (igual que ssoSessionMaxLifespan de Keycloak)
  },
  callbacks: {
    async jwt({ token, account, profile, trigger }): Promise<JWT> {
      // Login inicial: guardar tokens y datos del usuario
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 60 * 60 * 1000; // expires_at en ms
        
        // Decodificar el JWT para extraer información adicional
        if (account.access_token) {
          try {
            const payload = JSON.parse(atob(account.access_token.split('.')[1]));
            console.log('🔍 Full JWT payload:', JSON.stringify(payload, null, 2));
            console.log('📋 Available scopes in token:', payload.scope);
            
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
        
        return token;
      }
      
      // Verificar si el token necesita ser refrescado
      const now = Date.now();
      const shouldRefresh = token.accessTokenExpires && now >= (token.accessTokenExpires as number) - (5 * 60 * 1000); // Refrescar 5 minutos antes de expirar
      
      if (shouldRefresh && token.refreshToken) {
        console.log('🔄 Access token expiring soon, refreshing...');
        
        try {
          const response = await fetch('http://localhost:8081/realms/anyclazz/protocol/openid-connect/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: 'anyclazz-app',
              client_secret: 'anyclazz-app-secret-2024',
              grant_type: 'refresh_token',
              refresh_token: token.refreshToken as string,
            }),
          });
          
          if (response.ok) {
            const refreshedTokens = await response.json();
            
            console.log('✅ Token refreshed successfully');
            
            // Actualizar tokens
            token.accessToken = refreshedTokens.access_token;
            token.idToken = refreshedTokens.id_token;
            token.accessTokenExpires = Date.now() + (refreshedTokens.expires_in * 1000);
            
            // Si hay un nuevo refresh token, actualizarlo también
            if (refreshedTokens.refresh_token) {
              token.refreshToken = refreshedTokens.refresh_token;
            }
            
            // Actualizar información del usuario desde el nuevo token
            try {
              const payload = JSON.parse(atob(refreshedTokens.access_token.split('.')[1]));
              token.userRole = payload.userRole || payload.roles?.[0] || null;
              token.realmRoles = payload.realm_roles || [];
              token.roles = payload.roles || [];
            } catch (error) {
              console.error('Error decoding refreshed JWT:', error);
            }
            
            return token;
          } else {
            console.error('❌ Failed to refresh token:', response.status, response.statusText);
            // Si falla el refresh, marcar el token como expirado
            token.error = 'RefreshAccessTokenError';
            return token;
          }
        } catch (error) {
          console.error('❌ Error refreshing token:', error);
          token.error = 'RefreshAccessTokenError';
          return token;
        }
      }
      
      return token;
    },
    async session({ session, token }): Promise<Session> {
      // Si hay un error de refresh, invalidar la sesión
      if (token.error === 'RefreshAccessTokenError') {
        console.error('❌ Session invalid due to refresh error');
        // La sesión será inválida y el middleware redirigirá al logout
        return { ...session, error: 'RefreshAccessTokenError' } as Session;
      }
      
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken;
        (session as any).idToken = token.idToken;
        (session as any).userRole = token.userRole;
        (session as any).realmRoles = token.realmRoles;
        (session as any).roles = token.roles;
        (session as any).accessTokenExpires = token.accessTokenExpires;
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