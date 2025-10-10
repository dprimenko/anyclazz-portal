import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
  interface Session {
    accessToken?: string;
    idToken?: string;
    userRole?: string;
    realmRoles?: string[];
    roles?: string[];
    accessTokenExpires?: number;
    error?: string;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    userRole?: string;
    realmRoles?: string[];
    roles?: string[];
    accessTokenExpires?: number;
    error?: string;
  }
}

export {};
