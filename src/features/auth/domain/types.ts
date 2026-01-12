import type { Session } from "@auth/core/types";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'teacher';
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
    status?: string;
    createdAt?: string;
}

export interface ProfileApiResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        status: string;
        createdAt: string;
        roles: string[];
    };
    roles: string[];
    studentProfile?: {
        id: string;
        email: string;
        name: string;
        surname: string;
        avatar: string;
        createdAt: string;
    };
    teacherProfile?: {
        id: string;
        email: string;
        name: string;
        surname: string;
        avatar: string;
        createdAt: string;
    };
}

export interface AuthRepository {
    getCurrentUser(session: Session | null): Promise<AuthUser | null>;
    getUserProfile(accessToken: string): Promise<ProfileApiResponse | null>;
}