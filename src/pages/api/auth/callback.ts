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
    
    // Manejar específicamente el error de PKCE expirado o inválido
    if (error instanceof Error && (error.message.includes('pkceCodeVerifier') || error.message.includes('InvalidCheck'))) {
      console.log('PKCE code verifier error in callback, clearing cookies and redirecting to login');
      
      // Obtener callbackUrl de la URL actual si existe
      const callbackUrl = url.searchParams.get('callbackUrl');
      const callbackParam = callbackUrl ? `&callbackUrl=${callbackUrl}` : '';
      
      // Redirigir al endpoint que limpia las cookies
      return redirect(`/api/auth/clear-cookies?error=SessionExpired${callbackParam}`);
    }
    
    return redirect(routeConfig.defaultRedirectRoute);
  }
};
