import type { APIRoute } from 'astro';
import { routeConfig } from '../../../config/routes';

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  console.log('🧹 Clearing all auth cookies due to PKCE error');
  
  // Lista de cookies relacionadas con autenticación que necesitan ser limpiadas
  const authCookies = [
    'authjs.pkce.code_verifier',
    'authjs.callback-url',
    'authjs.csrf-token',
    'authjs.session-token',
    '__Secure-authjs.session-token',
    '__Host-authjs.csrf-token',
  ];
  
  // Eliminar cada cookie
  authCookies.forEach(cookieName => {
    cookies.delete(cookieName, {
      path: '/',
    });
  });
  
  // Obtener el callbackUrl si existe
  const callbackUrl = url.searchParams.get('callbackUrl');
  
  // Redirigir al login con el mensaje de sesión expirada
  if (callbackUrl) {
    return redirect(`${routeConfig.loginRoute}?error=SessionExpired&callbackUrl=${callbackUrl}`);
  }
  
  return redirect(`${routeConfig.loginRoute}?error=SessionExpired`);
};
