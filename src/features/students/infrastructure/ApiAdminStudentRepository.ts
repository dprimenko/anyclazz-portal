import type { AdminStudent, ListAdminStudentsParams, ListAdminStudentsResponse } from '../domain/types';
import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';

export class ApiAdminStudentRepository {
    private readonly httpClient: FetchClient;

    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }

    async listStudents({ token, page, size, query }: ListAdminStudentsParams): Promise<ListAdminStudentsResponse> {
        const data: Record<string, string | number> = { page, size };

        if (query) {
            data.query = query;
        }

        const response = await this.httpClient.get({
            url: '/admin/students',
            token,
            data,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }

        const result = await response.json();

        return {
            students: result.students.map((s: AdminStudent): AdminStudent => ({
                id: s.id,
                email: s.email,
                name: s.name,
                surname: s.surname,
                avatarUrl: s.avatarUrl,
                createdAt: s.createdAt,
                timezone: s.timezone,
                totalLessons: s.totalLessons,
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
