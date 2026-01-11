import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

const keycloakIssuer = import.meta.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/anyclazz";
const keycloakClientId = import.meta.env.KEYCLOAK_CLIENT_ID || "anyclazz-app";
const keycloakClientSecret = import.meta.env.KEYCLOAK_CLIENT_SECRET || "anyclazz-app-secret-2024";

export const POST: APIRoute = async ({ request, redirect, cookies, url, locals }) => {
  try {
    const origin = new URL(request.url).origin;
    
    console.log('🚪 Starting logout process...');
    
    // Obtener la sesión actual para acceder al id_token ANTES de limpiarlo
    let session;
    let idToken;
    let refreshToken;
    
    try {
      session = await getSession(request);
      idToken = (session as any)?.idToken;
      refreshToken = (session as any)?.refreshToken;
      console.log('🔑 ID Token found:', !!idToken);
      console.log('🔄 Refresh Token found:', !!refreshToken);
    } catch (error) {
      console.log('⚠️  Could not get session, proceeding with logout');
    }
    
    // Guardar el id_token antes de limpiar
    const savedIdToken = idToken;
    
    const callbackUrl = url.searchParams.get('callbackUrl');
    const redirectPath = callbackUrl ? `/login?callbackUrl=${callbackUrl}` : '/login';
    
    console.log(`Logout type: ${callbackUrl ? 'Automatic (expired)' : 'Explicit (user action)'}`);
    console.log(`Will redirect to: ${redirectPath}`);
    
    // Revocar refresh token si existe
    if (refreshToken) {
      try {
        console.log('🗑️  Revoking refresh token in Keycloak...');
        const revokeResponse = await fetch(`${keycloakIssuer}/protocol/openid-connect/revoke`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: keycloakClientId,
            client_secret: keycloakClientSecret,
            token: refreshToken,
            token_type_hint: 'refresh_token',
          }),
        });
        
        if (revokeResponse.ok) {
          console.log('✅ Refresh token revoked successfully');
        } else {
          console.warn('⚠️  Failed to revoke refresh token:', revokeResponse.status);
        }
      } catch (error) {
        console.error('❌ Error revoking refresh token:', error);
      }
    }
    
    // Limpiar todas las cookies de autenticación manualmente
    const cookiesToDelete = [
      'authjs.session-token',
      '__Secure-authjs.session-token',
      'authjs.csrf-token',
      '__Host-authjs.csrf-token',
      'authjs.callback-url',
      '__Secure-authjs.callback-url',
      'authjs.pkce.code_verifier',
    ];
    
    cookiesToDelete.forEach(cookieName => {
      cookies.delete(cookieName, { path: '/' });
      cookies.delete(cookieName, { path: '/', domain: 'localhost' });
      console.log(`🗑️  Deleted cookie: ${cookieName}`);
    });
    
    // Establecer una cookie de señal para indicar que el usuario hizo logout
    // Esta cookie la verificará el middleware para invalidar la sesión
    cookies.set('user_logged_out', 'true', {
      path: '/',
      maxAge: 120, // 120 segundos para completar el flujo de logout
      httpOnly: false,
      sameSite: 'lax'
    });
    
    console.log('🏴 Set user_logged_out flag cookie');
    
    // Ahora redirigir a Keycloak logout usando el id_token que guardamos
    try {
      const keycloakLogoutUrl = new URL(`${keycloakIssuer}/protocol/openid-connect/logout`);
      keycloakLogoutUrl.searchParams.set('post_logout_redirect_uri', `${origin}${redirectPath}`);
      
      // Usar el id_token que guardamos antes de limpiar las cookies
      if (savedIdToken && savedIdToken.split('.').length === 3) {
        keycloakLogoutUrl.searchParams.set('id_token_hint', savedIdToken);
        console.log('🔓 Keycloak logout with id_token_hint');
      } else {
        console.log('🔓 Keycloak logout without id_token_hint (token missing or invalid)');
      }
      
      console.log('🔓 Keycloak logout URL:', keycloakLogoutUrl.toString());
      
      return redirect(keycloakLogoutUrl.toString(), 302);
    } catch (error) {
      console.warn('⚠️  Error during Keycloak logout, redirecting directly:', error);
      return redirect(redirectPath);
    }
    
  } catch (error) {
    console.error('❌ Error during Keycloak logout:', error);
    return redirect('/login');
  }
};

export const GET: APIRoute = async (context) => {
  return POST(context);
};
