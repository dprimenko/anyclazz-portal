import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";
import { 
  isPublicRoute, 
  isCriticalRoute, 
  requiresAuth, 
  getValidationLevel,
  isHomePage,
  getRedirectRoute,
  routeConfig 
} from "./config/routes";
import { 
  validateTokenExpiration, 
  validateUserAccount,
  clearAccountValidationCache 
} from "./utils/authValidation";

function invalidateSession(context: any, reason: string) {
  console.log(`Invalidating session: ${reason}`);
  clearAccountValidationCache();
  const { pathname } = new URL(context.request.url);
  const callbackUrl = encodeURIComponent(pathname);
  return context.redirect(`/api/auth/keycloak-logout?callbackUrl=${callbackUrl}`);
}

export const onRequest = defineMiddleware(async (context, next) => {
  const session = await getSession(context.request);
  const { pathname } = new URL(context.request.url);
  const validationLevel = getValidationLevel(pathname);
  
  console.log(`🛡️  Auth Middleware - Path: ${pathname}, Session: ${!!session?.user}, Validation: ${validationLevel}`);
  
  // Si hay un error de refresh token, invalidar la sesión
  if (session && (session as any).error === 'RefreshAccessTokenError') {
    console.log('❌ RefreshAccessTokenError detected, invalidating session');
    return invalidateSession(context, 'Refresh token expired or invalid');
  }
  
  if (isHomePage(pathname)) {
    if (session?.user) {
      console.log(`🏠 Home page with session -> redirecting to ${getRedirectRoute('home')}`);
      return context.redirect(getRedirectRoute('home'));
    } else {
      console.log(`🏠 Home page without session -> continuing to public home`);
      return next();
    }
  }
  
  if (validationLevel === 'none') {
    console.log(`✅ Public route: ${pathname}`);
    return next();
  }
  
  if (!session?.user && requiresAuth(pathname)) {
    console.log(`🚫 No session for protected route: ${pathname} -> redirecting to login`);
    const callbackUrl = encodeURIComponent(`${pathname}${new URL(context.request.url).search}`);
    return context.redirect(`${routeConfig.loginRoute}?callbackUrl=${callbackUrl}`);
  }
  
  if (session?.user && pathname === routeConfig.loginRoute) {
    // Si el usuario autenticado está en login, verificar si hay un callbackUrl
    const url = new URL(context.request.url);
    const callbackUrl = url.searchParams.get('callbackUrl');
    
    if (callbackUrl) {
      console.log(`↩️  Authenticated user accessing login with callback -> redirecting to ${callbackUrl}`);
      return context.redirect(decodeURIComponent(callbackUrl));
    }
    
    console.log(`↩️  Authenticated user accessing login -> redirecting to ${getRedirectRoute('afterLogin')}`);
    return context.redirect(getRedirectRoute('afterLogin'));
  }
  
  if (session?.user && (validationLevel === 'basic' || validationLevel === 'complete')) {
    console.log(`🔍 Validating session for ${validationLevel} validation...`);
    
    const tokenValidation = validateTokenExpiration(session);
    if (!tokenValidation.isValid) {
      console.log(`❌ Token validation failed: ${tokenValidation.reason}`);
      if (tokenValidation.shouldInvalidateSession) {
        return invalidateSession(context, tokenValidation.reason || 'Token validation failed');
      }
      return context.redirect(routeConfig.loginRoute);
    }
    
    if (validationLevel === 'complete') {
      console.log(`🔒 Performing complete account validation for critical route: ${pathname}`);
      
      const accountValidation = await validateUserAccount(session);
      if (!accountValidation.isValid) {
        console.log(`❌ Account validation failed: ${accountValidation.reason}`);
        
        if (accountValidation.shouldInvalidateSession) {
          return invalidateSession(context, accountValidation.reason || 'Account validation failed');
        }
        
        console.warn(`⚠️  Account validation failed but continuing due to network error: ${accountValidation.reason}`);
      } else {
        console.log(`✅ Account validation successful`);
      }
    }
    
    console.log(`✅ Session validation passed for ${validationLevel} level`);
  }
  
  return next();
});