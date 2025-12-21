import type { APIRoute } from 'astro';
import { routeConfig } from '../../../config/routes';

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  console.log('🧹 Clearing all auth cookies');
  
  // Lista de cookies relacionadas con autenticación que necesitan ser limpiadas
  const authCookies = [
    'authjs.pkce.code_verifier',
    'authjs.callback-url',
    'authjs.csrf-token',
    'authjs.session-token',
    '__Secure-authjs.session-token',
    '__Host-authjs.csrf-token',
  ];
  
  // Eliminar cada cookie con todas las variantes posibles
  authCookies.forEach(cookieName => {
    // Opción 1: path=/
    cookies.delete(cookieName, {
      path: '/',
    });
    // Opción 2: path=/, domain=localhost
    cookies.delete(cookieName, {
      path: '/',
      domain: 'localhost',
    });
    // Opción 3: path=/, maxAge=0
    cookies.set(cookieName, '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });
    console.log(`🗑️  Cleared cookie: ${cookieName}`);
  });
  
  // Obtener el next URL si existe (para logout) o callbackUrl (para errores)
  const nextUrl = url.searchParams.get('next');
  const callbackUrl = url.searchParams.get('callbackUrl');
  
  if (nextUrl) {
    console.log(`➡️  Redirecting to: ${nextUrl}`);
    return redirect(nextUrl);
  }
  
  // Redirigir al login con el mensaje de sesión expirada
  if (callbackUrl) {
    return redirect(`${routeConfig.loginRoute}?error=SessionExpired&callbackUrl=${callbackUrl}`);
  }
  
  return redirect(`${routeConfig.loginRoute}?error=SessionExpired`);
};
