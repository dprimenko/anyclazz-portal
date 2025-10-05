import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";

/**
 * Valida si el token JWT ha expirado
 */
function isTokenExpired(session: any): boolean {
  try {
    if (!session?.accessToken) return true;
    
    // Decodificar el JWT para obtener el exp
    const tokenParts = session.accessToken.split('.');
    if (tokenParts.length !== 3) return true;
    
    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Verificar si el token ha expirado
    if (payload.exp && payload.exp < currentTime) {
      console.log('Token expired:', new Date(payload.exp * 1000));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error validating token expiration:', error);
    return true;
  }
}

/**
 * Valida si la cuenta del usuario sigue existiendo en Keycloak
 */
async function validateUserAccount(session: any): Promise<boolean> {
  try {
    if (!session?.accessToken) return false;
    
    // Hacer una llamada al endpoint de userinfo de Keycloak
    const keycloakUserInfoUrl = process.env.KEYCLOAK_ISSUER 
      ? `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`
      : "http://localhost:8081/realms/anyclazz/protocol/openid-connect/userinfo";
    
    const response = await fetch(keycloakUserInfoUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.log(`User validation failed: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const userInfo = await response.json();
    console.log('User account validated:', userInfo.sub);
    return true;
    
  } catch (error) {
    console.error('Error validating user account:', error);
    return false;
  }
}

/**
 * Invalida la sesión redirigiendo al logout
 */
function invalidateSession(context: any) {
  console.log('Invalidating session - redirecting to logout');
  return context.redirect('/api/auth/signout?callbackUrl=/login');
}

export const onRequest = defineMiddleware(async (context, next) => {
  const session = await getSession(context.request);
  const { pathname } = new URL(context.request.url);
  
  console.log(`Middleware - Path: ${pathname}, Session exists: ${!!session?.user}`);
  
  // Rutas que no requieren autenticación
  const publicRoutes = ['/login', '/api/auth', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Si hay sesión, validarla
  if (session?.user && !isPublicRoute) {
    console.log('Validating existing session...');
    
    // 1. Verificar si el token ha expirado
    if (isTokenExpired(session)) {
      console.log('Token expired - invalidating session');
      return invalidateSession(context);
    }
    
    // 2. Validar que la cuenta sigue existiendo (solo en rutas críticas)
    const criticalRoutes = ['/dashboard', '/feed', '/me'];
    const isCriticalRoute = criticalRoutes.some(route => pathname.startsWith(route));
    
    if (isCriticalRoute) {
      const isValidAccount = await validateUserAccount(session);
      if (!isValidAccount) {
        console.log('User account no longer valid - invalidating session');
        return invalidateSession(context);
      }
    }
  }
  
  // Si no hay sesión y la ruta requiere autenticación
  if (!session?.user && !isPublicRoute) {
    console.log(`Redirecting to login - no session for protected route: ${pathname}`);
    return context.redirect('/login');
  }
  
  // Si hay sesión válida pero el usuario accede a login, redirigir al feed
  if (session?.user && pathname === '/login') {
    console.log(`Redirecting authenticated user from login to feed`);
    return context.redirect('/feed');
  }
  
  return next();
});