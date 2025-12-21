import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
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
  }
}

export {};
