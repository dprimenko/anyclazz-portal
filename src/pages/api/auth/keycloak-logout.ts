import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

export const POST: APIRoute = async ({ request, redirect, cookies, url }) => {
  try {
    const origin = new URL(request.url).origin;
    
    // Obtener la sesión actual para acceder al id_token
    const session = await getSession(request);
    const idToken = (session as any)?.idToken;
    
    // Obtener el callbackUrl de los parámetros
    const callbackUrl = url.searchParams.get('callbackUrl');
    
    // Si hay callbackUrl = logout automático por expiración -> volver a la página
    // Si NO hay callbackUrl = logout explícito -> ir a /dashboard
    const redirectPath = callbackUrl ? `/login?callbackUrl=${callbackUrl}` : '/dashboard';
    
    console.log(`Logout type: ${callbackUrl ? 'Automatic (expired)' : 'Explicit (user action)'}`);
    console.log(`Will redirect to: ${redirectPath}`);
    
    // Limpiar cookies de sesión manualmente
    cookies.delete('authjs.session-token', { path: '/' });
    cookies.delete('__Secure-authjs.session-token', { path: '/' });
    cookies.delete('authjs.csrf-token', { path: '/' });
    cookies.delete('__Host-authjs.csrf-token', { path: '/' });
    
    // Obtener la URL de logout de Keycloak
    const keycloakLogoutUrl = new URL('http://localhost:8081/realms/anyclazz/protocol/openid-connect/logout');
    keycloakLogoutUrl.searchParams.set('post_logout_redirect_uri', `${origin}${redirectPath}`);
    
    // Añadir el id_token_hint si está disponible (requerido por Keycloak)
    if (idToken) {
      keycloakLogoutUrl.searchParams.set('id_token_hint', idToken);
    }
    
    // Redirigir directamente a Keycloak logout
    return redirect(keycloakLogoutUrl.toString());
    
  } catch (error) {
    console.error('Error during Keycloak logout:', error);
    return redirect('/login');
  }
};

export const GET: APIRoute = async ({ request, redirect, cookies, url }) => {
  return POST({ request, redirect, cookies, url } as any);
};
