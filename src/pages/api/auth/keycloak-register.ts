import type { APIRoute } from 'astro';

const keycloakIssuer = import.meta.env.KEYCLOAK_ISSUER || "http://localhost:8081/realms/anyclazz";
const keycloakClientId = import.meta.env.KEYCLOAK_CLIENT_ID || "anyclazz-app";

/**
 * Endpoint para redirigir al usuario al registro de Keycloak
 * Query params:
 * - role: 'student' o 'teacher' para autoseleccionar el rol en el formulario
 * 
 * Usa login_hint con formato "register:{role}" para que Keycloak:
 * 1. Muestre el formulario de registro (no login)
 * 2. Pre-seleccione el rol indicado
 */
export const GET: APIRoute = async ({ redirect, url, cookies }) => {
  try {
    const origin = url.origin;
    
    // Obtener el rol del query param (student o teacher)
    const role = url.searchParams.get('role') || 'student';
    
    console.log('📝 Redirecting to Keycloak registration with role:', role);
    
    // Construir la URL de callback
    const callbackUrl = url.searchParams.get('callbackUrl') || '/dashboard';
    const redirectUri = `${origin}/api/auth/callback/keycloak`;
    
    // Construir la URL de autorización directamente con kc_action y login_hint
    const authUrl = new URL(`${keycloakIssuer}/protocol/openid-connect/auth`);
    authUrl.searchParams.set('client_id', keycloakClientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid profile email roles');
    
    // Usar kc_action=REGISTER para forzar el formulario de registro
    authUrl.searchParams.set('kc_action', 'REGISTER');
    
    // Usar login_hint para pasar el rol a Keycloak (formato: register:role)
    // Tu plantilla de Keycloak puede parsear esto
    authUrl.searchParams.set('login_hint', `register:${role}`);
    
    console.log('📝 Auth URL:', authUrl.toString());
    
    // Guardar el callbackUrl en una cookie de sesión
    cookies.set('oauth_callback_url', callbackUrl, {
      path: '/',
      maxAge: 60 * 10, // 10 minutos
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return redirect(authUrl.toString(), 302);
  } catch (error) {
    console.error('❌ Error during registration redirect:', error);
    return redirect('/login?error=RegistrationError', 302);
  }
};
