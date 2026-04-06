import type { Session } from "@auth/core/types";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    timezone: string;
    role: 'student' | 'teacher' | 'admin';
    language?: 'en' | 'es';
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
    teacherStatus?: string;
    teacherStatusUpdate?: string;
    isSuperTutor?: boolean;
    createdAt?: string;
}

export interface ProfileApiResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        timezone?: string;
        createdAt: string;
        roles: string[];
        language?: 'en' | 'es';
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
        status: string;
        statusUpdate: string;
        statusUpdatedAt: string;
        superTutorTo?: string;
        createdAt: string;
    };
}

export interface AuthRepository {
    getCurrentUser(session: Session | null): Promise<AuthUser | null>;
    getUserProfile(accessToken: string): Promise<ProfileApiResponse | null>;
}