import type { APIRoute, AstroCookies } from 'astro';
import { getSession } from 'auth-astro/server';

const keycloakIssuer = import.meta.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/anyclazz";
const keycloakClientId = import.meta.env.KEYCLOAK_CLIENT_ID || "anyclazz-app";
const keycloakClientSecret = import.meta.env.KEYCLOAK_CLIENT_SECRET || "anyclazz-app-secret-2024";

/**
 * Mapa de todas las cookies de sesión con los atributos exactos con los que
 * fueron creadas. Para que el browser borre una cookie, el Set-Cookie de
 * borrado (maxAge=0) DEBE usar los mismos atributos Path y Domain, y para
 * cookies con prefijo __Secure- o __Host- también debe incluir Secure=true.
 *
 * Reglas de los prefijos de cookies (RFC 6265bis):
 *   __Secure-  → requiere Secure=true
 *   __Host-    → requiere Secure=true, Path=/, sin Domain
 */
const AUTH_COOKIES: Array<{
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
}> = [
  // Sin prefijo — usado en desarrollo (HTTP)
  { name: 'authjs.session-token',             httpOnly: true,  secure: false, sameSite: 'lax' },
  { name: 'authjs.csrf-token',                httpOnly: true,  secure: false, sameSite: 'lax' },
  { name: 'authjs.callback-url',              httpOnly: false, secure: false, sameSite: 'lax' },
  { name: 'authjs.pkce.code_verifier',        httpOnly: true,  secure: false, sameSite: 'lax' },
  // __Secure- prefijo — requiere Secure=true (HTTPS / producción)
  { name: '__Secure-authjs.session-token',    httpOnly: true,  secure: true,  sameSite: 'lax' },
  { name: '__Secure-authjs.callback-url',     httpOnly: false, secure: true,  sameSite: 'lax' },
  // __Host- prefijo — requiere Secure=true y Path=/ (y sin Domain)
  { name: '__Host-authjs.csrf-token',         httpOnly: true,  secure: true,  sameSite: 'lax' },
  // Cookies propias de la app
  { name: 'ac_session_pref',  httpOnly: false, secure: false, sameSite: 'lax' },
  { name: 'ac_remember_me',   httpOnly: false, secure: false, sameSite: 'lax' },
];

/**
 * Elimina todas las cookies de autenticación de forma correcta.
 * Usa cookies.set() con maxAge=0 en lugar de cookies.delete() porque
 * permite especificar exactamente los atributos que necesita cada cookie.
 * IMPORTANTE: no se pasa `domain` para no romper las cookies __Host-.
 */
function clearAuthCookies(cookies: AstroCookies): void {
  const PAST = new Date(0);
  for (const cookie of AUTH_COOKIES) {
    cookies.set(cookie.name, '', {
      path: '/',
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
      secure: cookie.secure,
      maxAge: 0,
      expires: PAST,
    });
  }
  console.log(`🗑️  Cleared ${AUTH_COOKIES.length} auth cookies`);
}

/**
 * Termina la sesión SSO de Keycloak desde el servidor (back-channel logout).
 *
 * Se hace servidor → Keycloak para que el navegador del usuario nunca toque
 * la página de KC. Así, si KC falla (token stale, redeploy, Google 500, KC
 * caído) el error es completamente transparente: las cookies locales ya
 * fueron limpiadas y el usuario aterriza en /login sin fricción.
 */
async function terminateKeycloakSession(
  idToken: string | undefined,
  refreshToken: string | undefined,
): Promise<void> {
  try {
    const body = new URLSearchParams({
      client_id: keycloakClientId,
      client_secret: keycloakClientSecret,
    });

    // id_token_hint acelera el proceso cuando el token es válido.
    // Si es stale (tras redeploy) KC devuelve 400 → lo ignoramos.
    if (idToken && idToken.split('.').length === 3) {
      body.append('id_token_hint', idToken);
    }

    // refresh_token permite a KC invalidar la sesión SSO asociada
    if (refreshToken) {
      body.append('refresh_token', refreshToken);
    }

    const response = await fetch(
      `${keycloakIssuer}/protocol/openid-connect/logout`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      },
    );

    if (response.ok || response.status === 204) {
      console.log('✅ Keycloak back-channel logout successful');
    } else {
      // 400 = token stale/inválido | 401 = client auth | 500 = IDP federado
      // No fatal: las cookies locales se limpian igualmente
      console.warn(
        `⚠️  Keycloak back-channel logout returned ${response.status} (non-fatal, local session already cleared)`,
      );
    }
  } catch (error) {
    console.warn('⚠️  Keycloak back-channel logout network error (non-fatal):', error);
  }
}

export const POST: APIRoute = async ({ request, redirect, cookies, url }) => {
  try {
    console.log('🚪 Starting logout process...');

    // Obtener sesión ANTES de limpiar las cookies
    let idToken: string | undefined;
    let refreshToken: string | undefined;

    try {
      const session = await getSession(request);
      idToken = (session as any)?.idToken;
      refreshToken = (session as any)?.refreshToken;
      console.log('🔑 ID Token found:', !!idToken, '| Refresh Token found:', !!refreshToken);
    } catch {
      console.log('⚠️  Could not get session, proceeding with logout anyway');
    }

    const callbackUrl = url.searchParams.get('callbackUrl');
    // Pasar por logout-cleanup para limpiar también las cookies del cliente (no-httpOnly)
    const nextPath = callbackUrl ? `/login?callbackUrl=${callbackUrl}` : '/';
    const redirectPath = `/logout-cleanup?next=${encodeURIComponent(nextPath)}`;

    // Paso 1: Terminar sesión en Keycloak (back-channel, tolerante a fallos)
    await terminateKeycloakSession(idToken, refreshToken);

    // Paso 2: Limpiar todas las cookies de autenticación locales
    clearAuthCookies(cookies);

    // Paso 3: Marcar el logout para que middleware y login.astro no redirijan
    // al dashboard aunque el JWT todavía esté en caché en algún sitio
    cookies.set('user_logged_out', 'true', {
      path: '/',
      maxAge: 120,
      httpOnly: false,
      sameSite: 'lax',
      secure: false,
    });

    console.log(`✅ Logout complete, redirecting to ${redirectPath}`);
    return redirect(redirectPath, 302);

  } catch (error) {
    console.error('❌ Unexpected error during logout:', error);
    return redirect('/login');
  }
};

export const GET: APIRoute = async (context) => {
  return POST(context);
};
