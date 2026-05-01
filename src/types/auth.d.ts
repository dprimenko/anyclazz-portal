import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
  interface User {
    id?: string;
    role?: string;
  }

  interface Session {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    userRole?: string;
    primaryRole?: string | null;
    platformId?: string;
    error?: string;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    userRole?: string;
    realmRoles?: string[];
    roles?: string[];
    platformId?: string;
    accessTokenExpires?: number;
    error?: string;
    hasRefreshToken?: boolean;
    /** Timestamp (ms) del momento del login, para controlar la duración máxima de sesión */
    loginAt?: number;
    /** Si es true, la sesión puede durar hasta 30 días; si no, máximo 8h */
    rememberMe?: boolean;
  }
}

export {};
