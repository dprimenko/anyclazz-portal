export interface AdminTeacher {
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string | null;
    superTutorTo?: string | null;
    location?: {
        city?: string;
        country?: string;
    };
    subject?: {
        id: string;
        name: { en: string; es: string };
    } | null;
    lessonsNumber: number;
    studentsNumber: number;
    reviewsNumber: number;
    averageRating: number;
    createdAt: string;
}

export interface ListAdminTeachersResponse {
    teachers: AdminTeacher[];
    meta: {
        currentPage: number;
        lastPage: number;
        size: number;
        total: number;
    };
}

export interface ListAdminTeachersParams {
    token: string;
    page: number;
    size: number;
    query?: string;
}
