import type { AdminTeacher, ListAdminTeachersParams, ListAdminTeachersResponse } from '../domain/types';
import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';

interface ApiAdminTeacher {
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string | null;
    superTutorTo?: string | null;
    teacherAddress?: { city?: string; country?: string } | null;
    subject?: { id: string; name: { en: string; es: string } } | null;
    subjects?: Array<{ id: string; name: { en: string; es: string } }>;
    lessonsNumber?: number;
    studentsNumber?: number;
    reviewsNumber?: number;
    averageRating?: number;
    createdAt?: string;
}

export class ApiAdminTeacherRepository {
    private readonly httpClient: FetchClient;

    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }

    async listTeachers({ token, page, size, query }: ListAdminTeachersParams): Promise<ListAdminTeachersResponse> {
        const data: Record<string, string | number> = { page, size };

        if (query) {
            data.query = query;
        }

        const response = await this.httpClient.get({
            url: '/admin/teachers/confirmed',
            token,
            data,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch teachers');
        }

        const result = await response.json();

        return {
            teachers: result.teachers.map((t: ApiAdminTeacher): AdminTeacher => ({
                id: t.id,
                name: t.name,
                surname: t.surname,
                email: t.email,
                avatar: t.avatar,
                superTutorTo: t.superTutorTo,
                location: t.teacherAddress
                    ? { city: t.teacherAddress.city, country: t.teacherAddress.country }
                    : undefined,
                subject: t.subject ?? (t.subjects?.[0] ?? null),
                lessonsNumber: t.lessonsNumber ?? 0,
                studentsNumber: t.studentsNumber ?? 0,
                reviewsNumber: t.reviewsNumber ?? 0,
                averageRating: t.averageRating ?? 0,
                createdAt: t.createdAt ?? '',
            })),
            meta: {
                currentPage: result.meta.currentPage,
                lastPage: result.meta.lastPage,
                size: result.meta.size,
                total: result.meta.total,
            },
        };
    }
}
