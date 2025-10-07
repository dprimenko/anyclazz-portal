import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  try {
    const origin = new URL(request.url).origin;
    
    // Limpiar cookies de sesión manualmente
    cookies.delete('authjs.session-token', { path: '/' });
    cookies.delete('__Secure-authjs.session-token', { path: '/' });
    cookies.delete('authjs.csrf-token', { path: '/' });
    cookies.delete('__Host-authjs.csrf-token', { path: '/' });
    
    // Obtener la URL de logout de Keycloak
    const keycloakLogoutUrl = new URL('http://localhost:8081/realms/anyclazz/protocol/openid-connect/logout');
    keycloakLogoutUrl.searchParams.set('post_logout_redirect_uri', `${origin}/login`);
    
    // Redirigir directamente a Keycloak logout
    return redirect(keycloakLogoutUrl.toString());
    
  } catch (error) {
    console.error('Error during Keycloak logout:', error);
    return redirect('/login');
  }
};

export const GET: APIRoute = async ({ request, redirect, cookies }) => {
  return POST({ request, redirect, cookies } as any);
};
