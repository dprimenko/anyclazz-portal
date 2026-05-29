import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';
import type { GetBookingsResponse } from '../domain/types';

interface AdminBookingsParams {
    token: string;
    entityId: string;
    page?: number;
    size?: number;
}

export class ApiAdminBookingsRepository {
    private readonly httpClient: FetchClient;

    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }

    async getStudentBookings({ token, entityId, page = 1, size = 20 }: AdminBookingsParams): Promise<GetBookingsResponse> {
        const response = await this.httpClient.get({
            url: `/admin/students/${entityId}/bookings`,
            token,
            data: { page, size },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch student bookings');
        }

        const data = await response.json();
        return { bookings: data.bookings, meta: data.meta };
    }

    async getTeacherBookings({ token, entityId, page = 1, size = 20 }: AdminBookingsParams): Promise<GetBookingsResponse> {
        const response = await this.httpClient.get({
            url: `/admin/teachers/${entityId}/bookings`,
            token,
            data: { page, size },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch teacher bookings');
        }

        const data = await response.json();
        return { bookings: data.bookings, meta: data.meta };
    }
}
