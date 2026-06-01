export interface AdminTeacherStripeConnect {
    connected: boolean;
    accountId?: string | null;
    accountType?: string | null;
    status?: string | null;
    onboardingCompleted?: boolean;
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
}

export interface AdminTeacherAvailability {
    hasAvailability: boolean;
    totalFutureSlots: number;
    nextSlotStart?: string | null;
    nextSlotEnd?: string | null;
}

export interface AdminTeacherClassTypeDuration {
    duration: number;
    price: { price: number; currencyCode: string };
}

export interface AdminTeacherClassType {
    type: string;
    durations: AdminTeacherClassTypeDuration[];
}

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
    hasPricing: boolean;
    classTypes?: AdminTeacherClassType[];
    stripeConnect?: AdminTeacherStripeConnect;
    availability?: AdminTeacherAvailability;
    minimalConfigured: boolean;
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
    minimalConfigured?: boolean;
}
