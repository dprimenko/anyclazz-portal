import type { AuthRepository, AuthUser } from "../../domain/types";
import { getSession } from 'auth-astro/server';

export class AnyclazzAuthRepository implements AuthRepository {
    async getCurrentUser(request: Request): Promise<AuthUser | null> {
        const session = await getSession(request);

        if (!session?.user) return null;

        return {
            id: session.user.id || '',
            email: session.user.email || '',
            name: session.user.name || '',
            role: session.userRole || 'student',
            // avatarUrl: session.user.avatarUrl || undefined,
        };
    }
}