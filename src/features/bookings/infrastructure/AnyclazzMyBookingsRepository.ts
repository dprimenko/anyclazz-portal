import { FetchClient } from '@/features/shared/services/httpClient';
import type { BookingsRepository, BookingWithTeacher, GetTeacherAvailabilityParams } from '../domain/types';
import { getApiUrl } from '@/features/shared/services/environment';

export class AnyclazzMyBookingsRepository implements BookingsRepository {
    private readonly httpClient: FetchClient;
    
    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }
    
    async getUpcomingBookings({token}: { token: string }): Promise<BookingWithTeacher[]> {
        const apiResponse = await this.httpClient.get({
            url: '/me/bookings',
            token: token
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

    async createBooking({teacherId, from, to, duration, token}: CreateBookingParams): Promise<any> {
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