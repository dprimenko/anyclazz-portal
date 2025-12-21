import type { Session } from "@auth/core/types";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'teacher';
    avatarUrl?: string;
}

export interface AuthRepository {
    getCurrentUser(session: Session | null): AuthUser | null;
}