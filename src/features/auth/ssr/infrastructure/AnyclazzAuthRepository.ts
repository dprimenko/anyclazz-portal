import type { Session } from "@auth/core/types";
import type { AuthRepository, AuthUser } from "../../domain/types";
import { getSession } from 'auth-astro/server';

export class AnyclazzAuthRepository implements AuthRepository {
    getCurrentUser(session: Session | null): AuthUser | null {
        if (!session?.user) return null;

        return {
            id: session.platformId || '',
            email: session.user.email || '',
            name: session.user.name || '',
            role: session.userRole || 'student',
            // avatarUrl: session.user.avatarUrl || undefined,
        };
    }
}