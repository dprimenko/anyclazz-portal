import type { APIRoute } from 'astro';

const keycloakIssuer = import.meta.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/anyclazz";
const keycloakClientId = import.meta.env.KEYCLOAK_CLIENT_ID || "anyclazz-app";

function base64urlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const GET: APIRoute = async ({ redirect, url, cookies }) => {
  try {
    const origin = url.origin;
    const role = url.searchParams.get('role') || 'student';
    const callbackUrl = url.searchParams.get('callbackUrl') || '/dashboard';
    const redirectUri = `${origin}/api/auth/callback/keycloak`;

    // Generate PKCE
    const verifierBytes = new Uint8Array(32);
    crypto.getRandomValues(verifierBytes);
    const codeVerifier = base64urlEncode(verifierBytes.buffer);
    const challengeBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
    const codeChallenge = base64urlEncode(challengeBytes);

    const authUrl = new URL(`${keycloakIssuer}/protocol/openid-connect/registrations`);
    authUrl.searchParams.set('client_id', keycloakClientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid profile email roles');
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    authUrl.searchParams.set('login_hint', `register:${role}`);

    // Detectar si la request viene por HTTPS (producción) para usar el prefijo correcto
    // en las cookies de auth.js. Esto debe coincidir con lo que auth.js espera leer.
    const useSecureCookies = url.protocol === 'https:';
    const secure = useSecureCookies;

    // Store code_verifier para el callback de auth.js.
    // El nombre debe coincidir con el override de auth.config.ts (sin prefijo __Secure-).
    cookies.set('authjs.pkce.code_verifier', codeVerifier, {
      path: '/',
      maxAge: 60 * 10,
      httpOnly: true,
      sameSite: 'lax',
      secure,
    });

    // Indicar a auth.js a dónde redirigir tras el callback exitoso.
    // Auth.js lee esta cookie en el handler /api/auth/callback/keycloak.
    // En producción (HTTPS) usa el prefijo __Secure- (comportamiento por defecto de auth.js).
    const callbackUrlCookieName = useSecureCookies
      ? '__Secure-authjs.callback-url'
      : 'authjs.callback-url';

    cookies.set(callbackUrlCookieName, callbackUrl, {
      path: '/',
      maxAge: 60 * 10,
      httpOnly: false,
      sameSite: 'lax',
      secure,
    });

    return redirect(authUrl.toString(), 302);
  } catch (error) {
    console.error('❌ Error during registration redirect:', error);
    return redirect('/login?error=RegistrationError', 302);
  }
};
