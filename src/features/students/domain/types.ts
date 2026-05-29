export interface Student {
    id: string;
    name: string;
    surname: string;
    avatar?: string;
    timezone?: string;    // Timezone desde users table
}

export interface AdminStudent {
    id: string;
    email: string;
    name: string;
    surname: string;
    avatarUrl?: string;
    createdAt: string;
    timezone: string;
    totalLessons?: number;
}

export interface ListAdminStudentsResponse {
    students: AdminStudent[];
    meta: {
        currentPage: number;
        lastPage: number;
        size: number;
        total: number;
    };
}

export interface ListAdminStudentsParams {
    token: string;
    page: number;
    size: number;
    query?: string;
}