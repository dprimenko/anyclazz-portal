export interface RouteConfig {
  publicRoutes: string[];
  protectedRoutes: string[];
  criticalRoutes: string[];
  loginRoute: string;
  defaultRedirectRoute: string;
  homeRedirectRoute: string;
}

export interface RoutePattern {
  path: string;
  includeChildren?: boolean;
  children?: string[];
}

export const routeConfig: RouteConfig = {
  publicRoutes: [
    '/',
    '/login',
    '/logout-cleanup',
    '/api/auth',
    '/404',
    '/robots.txt',
    '/favicon.ico'
  ],
  protectedRoutes: [
    '/dashboard',
    '/teachers',
    '/feed',
  ],
  criticalRoutes: [
    '/messages',
    '/me',
    '/settings',
    '/profile'
  ],
  loginRoute: '/login',
  defaultRedirectRoute: '/dashboard',
  homeRedirectRoute: '/dashboard'
};

function matchesRoutePattern(pathname: string, routePattern: string): boolean {
  return pathname === routePattern || pathname.startsWith(`${routePattern}/`);
}

export function isPublicRoute(pathname: string): boolean {
  return routeConfig.publicRoutes.some(route => matchesRoutePattern(pathname, route));
}

export function isProtectedRoute(pathname: string): boolean {
  return routeConfig.protectedRoutes.some(route => matchesRoutePattern(pathname, route));
}

export function isCriticalRoute(pathname: string): boolean {
  return routeConfig.criticalRoutes.some(route => matchesRoutePattern(pathname, route));
}

export function requiresAuth(pathname: string): boolean {
  return !isPublicRoute(pathname);
}

export function getValidationLevel(pathname: string): 'none' | 'basic' | 'complete' {
  if (isPublicRoute(pathname)) return 'none';
  if (isCriticalRoute(pathname)) return 'complete';
  if (isProtectedRoute(pathname)) return 'basic';
  return 'basic';
}

export function getRouteInfo(pathname: string): {
  path: string;
  isPublic: boolean;
  isProtected: boolean;
  isCritical: boolean;
  validationLevel: 'none' | 'basic' | 'complete';
  matchedPattern?: string;
} {
  const isPublic = isPublicRoute(pathname);
  const isProtected = isProtectedRoute(pathname);
  const isCritical = isCriticalRoute(pathname);
  
  let matchedPattern: string | undefined;
  
  if (isPublic) {
    matchedPattern = routeConfig.publicRoutes.find(route => matchesRoutePattern(pathname, route));
  } else if (isCritical) {
    matchedPattern = routeConfig.criticalRoutes.find(route => matchesRoutePattern(pathname, route));
  } else if (isProtected) {
    matchedPattern = routeConfig.protectedRoutes.find(route => matchesRoutePattern(pathname, route));
  }
  
  return {
    path: pathname,
    isPublic,
    isProtected,
    isCritical,
    validationLevel: getValidationLevel(pathname),
    matchedPattern
  };
}

export function getChildRoutes(parentRoute: string): string[] {
  const allRoutes = [
    ...routeConfig.publicRoutes,
    ...routeConfig.protectedRoutes,
    ...routeConfig.criticalRoutes
  ];
  
  return allRoutes.filter(route => 
    route !== parentRoute && route.startsWith(`${parentRoute}/`)
  );
}

export function isConfiguredRoute(pathname: string): boolean {
  const allRoutes = [
    ...routeConfig.publicRoutes,
    ...routeConfig.protectedRoutes,
    ...routeConfig.criticalRoutes
  ];
  
  return allRoutes.includes(pathname);
}

export function isHomePage(pathname: string): boolean {
  return pathname === '/';
}

export function getRedirectRoute(context: 'home' | 'afterLogin' | 'default' = 'default'): string {
  switch (context) {
    case 'home':
      return routeConfig.homeRedirectRoute;
    case 'afterLogin':
      return routeConfig.defaultRedirectRoute;
    default:
      return routeConfig.defaultRedirectRoute;
  }
}