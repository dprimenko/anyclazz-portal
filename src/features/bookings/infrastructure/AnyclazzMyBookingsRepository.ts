import { FetchClient } from '@/features/shared/services/httpClient';
import type { BookingsRepository, BookingWithTeacher, GetTeacherAvailabilityParams } from '../domain/types';
import { getApiUrl } from '@/features/shared/services/environment';
import { getSession } from 'auth-astro/server';

export class AnyclazzMyBookingsRepository implements BookingsRepository {
    private readonly httpClient: FetchClient;
    
    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }
    
    async getUpcomingBookings(request: Request): Promise<BookingWithTeacher[]> {
        const session = await getSession(request);
        
        if (!session?.accessToken) {
            throw new Error('No access token found');
        }

        const apiResponse = await this.httpClient.get({
            url: '/me/bookings',
            token: session.accessToken as string,
        });

        const data = await apiResponse.json();
        return data;
    }
    
    async getTeacherAvailability({teacherId, from, to, duration, token}: GetTeacherAvailabilityParams): Promise<any> {
        const params = {
            from,
            to,
            duration,
        };

        const apiResponse = await this.httpClient.get({
            url: `/teacher-availability/${teacherId}`,
            token: token,
            data: params,
        });

        const response = await apiResponse.json();
        return response;
    }
}