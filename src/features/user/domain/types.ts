import type { CommonParams } from "@/features/shared/domain/types";

export type AppLanguage = 'en' | 'es';

export interface UserProfile {
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string | null;
    timezone?: string | null;
    country?: string | null;
    city?: string | null;
    bio?: string | null;
    language?: AppLanguage;
}

export interface UpdateUserData {
    name?: string;
    surname?: string;
    email?: string;
    avatar?: File;
    timezone?: string;
    bio?: string | null;
    language?: AppLanguage;
    address?: {
        country?: string;
        city?: string;
    };
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
}

export interface GetUserProfileParams extends CommonParams {}

export interface UpdateUserParams extends CommonParams {
    data: UpdateUserData;
}

export interface ChangePasswordParams extends CommonParams {
    data: ChangePasswordData;
}

export interface UserRepository {
    getUserProfile(params: GetUserProfileParams): Promise<UserProfile>;
    updateUser(params: UpdateUserParams): Promise<void>;
    changePassword(params: ChangePasswordParams): Promise<void>;
}

// --- BE response types ---

export interface MyProfileResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
        country: string | null;
        city: string | null;
        timezone: string;
        bio: string | null;
        language: AppLanguage;
        createdAt: string;
    };
    roles: string[];
    studentProfile?: {
        id: string;
        email: string;
        name: string;
        surname: string;
        avatar: string | null;
        createdAt: string;
    };
    teacherProfile?: Record<string, unknown>;
}

export interface UpdateProfileResponse {
    id: string;
    email: string;
    name: string;
    surname: string;
    timezone: string;
    bio: string | null;
    avatar: string | null;
    language?: AppLanguage;
    address?: {
        country: string;
        city: string;
    };
}
