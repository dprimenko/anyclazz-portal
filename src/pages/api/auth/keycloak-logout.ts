import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Obtener la URL de logout de Keycloak
    const logoutUrl = new URL('http://localhost:8081/realms/anyclazz/protocol/openid-connect/logout');
    logoutUrl.searchParams.set('post_logout_redirect_uri', 'http://localhost:4321');
    
    // Primero hacer signout en Auth.js
    const signoutUrl = new URL('/api/auth/signout', request.url);
    
    // Redirigir a Keycloak logout después del signout local
    return redirect(logoutUrl.toString());
  } catch (error) {
    console.error('Error during Keycloak logout:', error);
    return redirect('/');
  }
};
