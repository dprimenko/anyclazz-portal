import Keycloak from '@auth/core/providers/keycloak';
import { defineConfig } from 'auth-astro';
import type { JWT } from '@auth/core/jwt';
import type { Session } from '@auth/core/types';
import './src/types/auth.d.ts';

const keycloakIssuer = import.meta.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/anyclazz";
const keycloakClientId = import.meta.env.KEYCLOAK_CLIENT_ID || "anyclazz-app";
const keycloakClientSecret = import.meta.env.KEYCLOAK_CLIENT_SECRET || "anyclazz-app-secret-2024";

export default defineConfig({
  secret: import.meta.env.AUTH_SECRET || "gy07h9vlgxrjb0gdtsIRDLf4GxaN9HFY",
  debug: false,
  pages: {
    error: '/auth-error',
  },
  providers: [
    Keycloak({
      clientId: keycloakClientId,
      clientSecret: keycloakClientSecret,
      issuer: keycloakIssuer,
      authorization: {
        url: `${keycloakIssuer}/protocol/openid-connect/auth`,
        params: {
          prompt: "login",
          scope: "openid profile email roles"
        }
      },
      token: `${keycloakIssuer}/protocol/openid-connect/token`,
      userinfo: `${keycloakIssuer}/protocol/openid-connect/userinfo`,
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hora (sin offline_access, no hay refresh de larga duración)
  },
  cookies: {
    pkceCodeVerifier: {
      name: 'authjs.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 30,
      },
    },
  },
  callbacks: {
    async jwt({ token, account, profile, trigger }): Promise<JWT> {
      // Login inicial: guardar tokens y datos del usuario
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 60 * 60 * 1000; // expires_at en ms
        
        // Detectar si el usuario tiene refresh token
        // Nota: Sin offline_access, el refresh token tiene duración limitada
        token.hasRefreshToken = !!account.refresh_token;
        
        // Decodificar el JWT para extraer información adicional
        if (account.access_token) {
          try {
            const payload = JSON.parse(atob(account.access_token.split('.')[1]));
            
            // 🔍 DEBUG: Ver todo el payload del token
            console.log('🔍 JWT Payload completo:', JSON.stringify(payload, null, 2));
            console.log('🔍 selectedRoleForSession:', payload.selectedRoleForSession);
            console.log('🔍 userRole:', payload.userRole);
            console.log('🔍 roles:', payload.roles);
            
            // Extraer solo la información esencial
            token.name = payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim() || payload.preferred_username || payload.email;
            
            // Manejar userRole que puede venir como string o array
            let selectedRole = payload.selectedRoleForSession;
            if (!selectedRole) {
              // Si no hay selectedRoleForSession, usar userRole (puede ser array o string)
              if (Array.isArray(payload.userRole)) {
                selectedRole = payload.userRole[0]; // Tomar el primero del array
              } else {
                selectedRole = payload.userRole;
              }
            }
            
            // Normalizar el rol a 'student' o 'teacher'
            if (selectedRole === 'teacher' || selectedRole === 'ROLE_TEACHER') {
              token.userRole = 'teacher';
            } else if (selectedRole === 'student' || selectedRole === 'ROLE_STUDENT') {
              token.userRole = 'student';
            } else {
              // Si no es ninguno de los anteriores, buscar en roles
              const roles = payload.roles || [];
              token.userRole = roles.includes('teacher') || roles.includes('ROLE_TEACHER') ? 'teacher' : 'student';
            }
            
            token.realmRoles = payload.realm_roles || [];
            token.roles = payload.roles || [];
            token.platformId = payload.platformId || payload.platform_id || null;
            
            console.log('✅ token.userRole asignado:', token.userRole);
            
          } catch (error) {
            console.error('Error decoding JWT:', error);
          }
        }
        
        return token;
      }
      
      // Verificar si el token necesita ser refrescado
      // Solo hacer refresh si el usuario tiene refresh token
      if (!token.hasRefreshToken) {
        console.log('⏱️  No refresh token available');
        return token;
      }
      
      // Verificar si el token necesita ser refrescado
      const now = Date.now();
      const shouldRefresh = token.accessTokenExpires && now >= (token.accessTokenExpires as number) - (5 * 60 * 1000); // Refrescar 5 minutos antes de expirar
      
      if (shouldRefresh && token.refreshToken) {
        console.log('🔄 Access token expiring soon, refreshing...');
        
        try {
          const tokenUrl = `${keycloakIssuer}/protocol/openid-connect/token`;
          const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: keycloakClientId,
              client_secret: keycloakClientSecret,
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
              
              console.log('🔄 JWT Payload en refresh:', JSON.stringify(payload, null, 2));
              console.log('🔄 selectedRoleForSession:', payload.selectedRoleForSession);
              
              // Manejar userRole que puede venir como string o array
              let selectedRole = payload.selectedRoleForSession;
              if (!selectedRole) {
                if (Array.isArray(payload.userRole)) {
                  selectedRole = payload.userRole[0];
                } else {
                  selectedRole = payload.userRole;
                }
              }
              
              // Normalizar el rol
              if (selectedRole === 'teacher' || selectedRole === 'ROLE_TEACHER') {
                token.userRole = 'teacher';
              } else if (selectedRole === 'student' || selectedRole === 'ROLE_STUDENT') {
                token.userRole = 'student';
              } else {
                const roles = payload.roles || [];
                token.userRole = roles.includes('teacher') || roles.includes('ROLE_TEACHER') ? 'teacher' : 'student';
              }
              
              token.realmRoles = payload.realm_roles || [];
              token.roles = payload.roles || [];
              token.platformId = payload.platformId || payload.platform_id || null;
              
              console.log('✅ token.userRole actualizado:', token.userRole);
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
        return { ...session, error: 'RefreshAccessTokenError' } as Session;
      }
      
      // Solo pasar datos esenciales a la sesión (reduce tamaño de cookie)
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken;
        (session as any).idToken = token.idToken;
        (session as any).refreshToken = token.refreshToken; // Necesario para revocación
        (session as any).userRole = token.userRole;
        (session as any).platformId = token.platformId;
        
        // Añadir role al objeto user para facilitar acceso
        if (session.user) {
          (session.user as any).role = token.userRole;
        }
        
        // Solo pasar el primer role en lugar de todos los arrays
        const roles = (token.roles as string[]) || [];
        const realmRoles = (token.realmRoles as string[]) || [];
        (session as any).primaryRole = roles[0] || realmRoles[0] || null;
        
        console.log('📦 Session userRole final:', (session as any).userRole);
        console.log('📦 Session user.role final:', session.user?.role);
      }
      
      // Asegurar que el nombre esté disponible en la sesión
      if (token.name) {
        session.user.name = token.name as string;
      }
      
      return session;
    },
  },
});