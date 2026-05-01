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
import { AnyclazzAuthRepository } from "./features/auth/ssr/infrastructure/AnyclazzAuthRepository";
import { ApiTeacherRepository } from "./features/teachers/infrastructure/ApiTeacherRepository";

function invalidateSession(context: any, reason: string) {
  clearAccountValidationCache();
  
  // Limpiar caché de usuario - solo en cliente
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('anyclazz_user_profile');
      localStorage.removeItem('anyclazz_user_profile_expiry');
    } catch (error) {
      console.error('Error clearing user cache:', error);
    }
  }
  
  const { pathname } = new URL(context.request.url);
  const callbackUrl = encodeURIComponent(pathname);
  return context.redirect(`/api/auth/keycloak-logout?callbackUrl=${callbackUrl}`);
}

async function checkTeacherOnboarding(session: any, pathname: string): Promise<{ needsOnboarding: boolean; redirectTo?: string }> {
  try {
    // Verificar si el usuario es teacher
    const userRole = (session as any).userRole;
    if (userRole !== 'teacher') {
      return { needsOnboarding: false };
    }
    
    // No verificar si ya estamos en onboarding, login o logout
    if (pathname.startsWith('/onboarding/') || pathname.startsWith('/api/auth/') || pathname === '/login' || pathname === '/logout') {
      return { needsOnboarding: false };
    }
    
    const token = (session as any).accessToken;
    if (!token) {
      return { needsOnboarding: false };
    }
    
    // Obtener el perfil del usuario
    const authRepository = new AnyclazzAuthRepository();
    const profileData = await authRepository.getUserProfile(token);
    
    if (!profileData || !profileData.teacherProfile) {
      return { needsOnboarding: false };
    }
    
    const teacherId = profileData.teacherProfile.id;
    
    // Obtener los datos completos del teacher
    const teacherRepository = new ApiTeacherRepository();
    const teacher = await teacherRepository.getTeacher({ token, teacherId });
    
    // Verificar si tiene todos los campos del onboarding completos
    const hasAllFields = 
      teacher.studentLevel?.id &&
      teacher.subjectCategory?.id &&
      teacher.subject?.id &&
      teacher.teacherAddress?.country &&
      teacher.teacherAddress?.city &&
      teacher.speaksLanguages && teacher.speaksLanguages.length > 0 &&
      teacher.beganTeachingAt &&
      teacher.shortPresentation;
    
    if (!hasAllFields) {
      return { needsOnboarding: true, redirectTo: '/onboarding/what-do-you-teach' };
    }
    
    return { needsOnboarding: false };
  } catch (error) {
    console.error('Error checking teacher onboarding:', error);
    // En caso de error, permitir continuar
    return { needsOnboarding: false };
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = new URL(context.request.url);
  
  // SALIR TEMPRANO si estamos en rutas de autenticación para evitar loops
  if (pathname.startsWith('/api/auth/')) {
    return next();
  }
  
  // Verificar si el usuario acaba de hacer logout ANTES de obtener la sesión
  const loggedOutCookie = context.cookies.get('user_logged_out');
  const isLoggingOut = loggedOutCookie?.value === 'true';
  
  if (isLoggingOut) {
    // NO eliminar la cookie aquí, dejar que login.astro la lea también
    // La cookie expirará automáticamente después de 120 segundos
    
    // Si estamos en una ruta pública (login, home), continuar sin validar sesión
    if (isPublicRoute(pathname) || pathname === '/') {
      console.log(`✅ Public route after logout: ${pathname}`);
      return next();
    }
    
    // Si estamos en una ruta protegida, redirigir a login
    console.log(`🚫 Protected route after logout: ${pathname} -> redirecting to login`);
    const callbackUrl = encodeURIComponent(`${pathname}${new URL(context.request.url).search}`);
    return context.redirect(`${routeConfig.loginRoute}?callbackUrl=${callbackUrl}`);
  }
  
  const validationLevel = getValidationLevel(pathname);
  
  let session;
  try {
    session = await getSession(context.request);
  } catch (error) {
    // Manejar error de PKCE expirado o inválido
    if (error instanceof Error && (error.message.includes('pkceCodeVerifier') || error.message.includes('InvalidCheck'))) {
      console.log('❌ PKCE code verifier error detected in middleware, clearing auth cookies');
      
      // Limpiar todas las cookies de autenticación
      const response = context.redirect('/api/auth/clear-cookies');
      
      // Redirigir al login con mensaje de error solo si no estamos en ruta pública
      if (!isPublicRoute(pathname) && !pathname.startsWith('/api/auth')) {
        const callbackUrl = encodeURIComponent(`${pathname}${new URL(context.request.url).search}`);
        return context.redirect(`${routeConfig.loginRoute}?error=SessionExpired&callbackUrl=${callbackUrl}`);
      }
      
      // Si estamos en una ruta pública, continuar
      return next();
    }
    // Re-lanzar otros errores
    throw error;
  }
  
  console.log(`🛡️  Auth Middleware - Path: ${pathname}, Session: ${!!session?.user}, Validation: ${validationLevel}`);
  
  // Si hay un error de refresh token o sesión expirada, invalidar la sesión
  // PERO solo si NO estamos ya en una ruta de logout/auth para evitar loops
  if (session && ['RefreshAccessTokenError', 'SessionExpired'].includes((session as any).error)) {
    // Evitar loop: no redirigir si ya estamos en logout o clear-cookies
    if (!pathname.includes('/keycloak-logout') && !pathname.includes('/clear-cookies')) {
      console.log(`❌ ${(session as any).error} detected, invalidating session`);
      return invalidateSession(context, ((session as any).error as string));
    } else {
      console.log(`⚠️  Session error detected but already in logout flow, continuing`);
    }
  }

  // Verificar la duración máxima absoluta de la sesión para evitar rolling sessions
  // indefinidas. El check aquí (en lugar de en el jwt callback) permite leer el cookie
  // de preferencia "remember me" y aplicar el límite correcto.
  if (session?.user && (session as any).loginAt) {
    const sessionAge = Date.now() - (session as any).loginAt;
    const hasRememberMe = context.cookies.get('ac_session_pref')?.value === 'remember_me';
    const maxSessionAge = hasRememberMe
      ? 30 * 24 * 60 * 60 * 1000  // 30 días con remember me
      : 8 * 60 * 60 * 1000;        // 8 horas sin remember me

    if (sessionAge > maxSessionAge) {
      console.log(`⏰ Session absolute max exceeded (${Math.round(sessionAge / 3600000)}h), invalidating`);
      return invalidateSession(context, 'Session absolute max exceeded');
    }
  }
  
  // Permitir acceso a la landing page tanto para usuarios logueados como no logueados
  if (isHomePage(pathname)) {
    console.log(`🏠 Home page -> continuing (session: ${!!session?.user})`);
    return next();
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
  
  // Verificar onboarding del teacher
  if (session?.user) {
    const onboardingCheck = await checkTeacherOnboarding(session, pathname);
    if (onboardingCheck.needsOnboarding && onboardingCheck.redirectTo) {
      console.log(`🎓 Redirecting to onboarding: ${onboardingCheck.redirectTo}`);
      return context.redirect(onboardingCheck.redirectTo);
    }
  }

  // Añadir Cache-Control: no-store en páginas autenticadas para evitar que el
  // navegador sirva la página desde bfcache tras el logout (botón "atrás").
  const response = await next();
  if (session?.user && !pathname.startsWith('/api/') && !pathname.startsWith('/_astro/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  return response;
});