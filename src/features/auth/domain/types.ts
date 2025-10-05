export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'teacher';
    avatarUrl?: string;
}

export interface AuthRepository {
    getCurrentUser(request: Request): Promise<AuthUser | null>;
}