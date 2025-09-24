import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
  interface Session {
    accessToken?: string;
    userRole?: string;
    realmRoles?: string[];
    roles?: string[];
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    userRole?: string;
    realmRoles?: string[];
    roles?: string[];
  }
}

export {};
