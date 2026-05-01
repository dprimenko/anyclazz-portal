import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';
import { routeConfig } from '../../../config/routes';

const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60; // 30 días en segundos

/**
 * Extiende la cookie de sesión de auth.js si el usuario eligió "Recordarme".
 * auth.js crea la cookie como session cookie (sin maxAge) por defecto.
 * Aquí la re-emitimos con maxAge=30d si ac_remember_me=1.
 */
function applyRememberMe(cookies: any, remember: boolean): void {
  if (!remember) return;

  const isProd = process.env.NODE_ENV === 'production';
  const sessionTokenName = isProd
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token';

  const sessionTokenValue = cookies.get(sessionTokenName)?.value;
  if (!sessionTokenValue) return;

  // Re-emitir la session cookie con maxAge de 30 días
  cookies.set(sessionTokenName, sessionTokenValue, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isProd,
    maxAge: REMEMBER_ME_MAX_AGE,
  });

  // Cookie de preferencia que el middleware usará para saber que hay "remember me"
  // y así no aplicar el límite absoluto de 8h
  cookies.set('ac_session_pref', 'remember_me', {
    httpOnly: false, // El middleware lo lee server-side, pero no necesita ser httpOnly
    sameSite: 'lax',
    path: '/',
    maxAge: REMEMBER_ME_MAX_AGE,
  });

  // Limpiar la cookie temporal de solicitud
  cookies.delete('ac_remember_me', { path: '/' });

  console.log('🔒 Remember Me applied: session cookie extended to 30 days');
}

export const GET: APIRoute = async ({ request, redirect, url, cookies }) => {
  try {
    const session = await getSession(request);
    
    if (!session?.user) {
      console.log('No session found in callback, redirecting to login');
      return redirect(routeConfig.loginRoute);
    }

    // Aplicar "Recordarme" si el usuario lo había seleccionado antes de ir a Keycloak
    const wantsRememberMe = cookies.get('ac_remember_me')?.value === '1';
    applyRememberMe(cookies, wantsRememberMe);

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
