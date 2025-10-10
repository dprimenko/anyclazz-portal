import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

export const POST: APIRoute = async ({ request, redirect, cookies, url }) => {
  try {
    const origin = new URL(request.url).origin;
    
    console.log('🚪 Starting logout process...');
    
    // Obtener la sesión actual para acceder al id_token y refresh_token
    const session = await getSession(request);
    const idToken = (session as any)?.idToken;
    const refreshToken = (session as any)?.refreshToken;
    
    console.log('🔑 ID Token found:', !!idToken);
    console.log('🔄 Refresh Token found:', !!refreshToken);
    
    // Obtener el callbackUrl de los parámetros
    const callbackUrl = url.searchParams.get('callbackUrl');
    
    // Si hay callbackUrl = logout automático por expiración -> volver a login con callback
    // Si NO hay callbackUrl = logout explícito -> ir a login sin callback
    const redirectPath = callbackUrl ? `/login?callbackUrl=${callbackUrl}` : '/login';
    
    console.log(`Logout type: ${callbackUrl ? 'Automatic (expired)' : 'Explicit (user action)'}`);
    console.log(`Will redirect to: ${redirectPath}`);
    
    // Si hay refresh token, revocarlo explícitamente en Keycloak
    if (refreshToken) {
      try {
        console.log('🗑️  Revoking refresh token in Keycloak...');
        const revokeResponse = await fetch('http://localhost:8081/realms/anyclazz/protocol/openid-connect/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: 'anyclazz-app',
            client_secret: 'anyclazz-app-secret-2024',
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
    
    // Limpiar TODAS las cookies posibles de auth
    const cookiesToDelete = [
      'authjs.session-token',
      '__Secure-authjs.session-token',
      'authjs.csrf-token',
      '__Host-authjs.csrf-token',
      'authjs.callback-url',
      '__Secure-authjs.callback-url',
    ];
    
    cookiesToDelete.forEach(cookieName => {
      cookies.delete(cookieName, { path: '/' });
      cookies.delete(cookieName, { path: '/', domain: 'localhost' });
      console.log(`🗑️  Deleted cookie: ${cookieName}`);
    });
    
    // Si no hay idToken, redirigir directamente sin pasar por Keycloak
    if (!idToken) {
      console.log('⚠️  No ID token, redirecting directly to login');
      return redirect(redirectPath);
    }
    
    // Obtener la URL de logout de Keycloak
    const keycloakLogoutUrl = new URL('http://localhost:8081/realms/anyclazz/protocol/openid-connect/logout');
    keycloakLogoutUrl.searchParams.set('post_logout_redirect_uri', `${origin}${redirectPath}`);
    keycloakLogoutUrl.searchParams.set('id_token_hint', idToken);
    
    console.log('🔓 Keycloak logout URL:', keycloakLogoutUrl.toString());
    
    // Redirigir directamente a Keycloak logout
    return redirect(keycloakLogoutUrl.toString());
    
  } catch (error) {
    console.error('❌ Error during Keycloak logout:', error);
    return redirect('/login');
  }
};

export const GET: APIRoute = async ({ request, redirect, cookies, url }) => {
  return POST({ request, redirect, cookies, url } as any);
};
