import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';
import { routeConfig } from '../../../config/routes';

export const GET: APIRoute = async ({ request, redirect, url }) => {
  try {
    const session = await getSession(request);
    
    if (!session?.user) {
      console.log('No session found in callback, redirecting to login');
      return redirect(routeConfig.loginRoute);
    }
    
    // Intentar obtener el callbackUrl de los parámetros de la URL
    const callbackUrl = url.searchParams.get('callbackUrl');
    
    if (callbackUrl) {
      console.log(`Redirecting to callback URL: ${callbackUrl}`);
      return redirect(decodeURIComponent(callbackUrl));
    }
    
    // Si no hay callbackUrl, redirigir a la ruta por defecto
    console.log(`No callback URL found, redirecting to default: ${routeConfig.defaultRedirectRoute}`);
    return redirect(routeConfig.defaultRedirectRoute);
    
  } catch (error) {
    console.error('Error in auth callback:', error);
    
    // Manejar específicamente el error de PKCE expirado
    if (error instanceof Error && error.message.includes('pkceCodeVerifier')) {
      console.log('PKCE code verifier expired, redirecting to login with session expired message');
      return redirect(`${routeConfig.loginRoute}?error=SessionExpired`);
    }
    
    return redirect(routeConfig.defaultRedirectRoute);
  }
};
