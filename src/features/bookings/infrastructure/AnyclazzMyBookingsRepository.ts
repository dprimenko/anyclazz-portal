import { FetchClient } from '@/features/shared/services/httpClient';
import type { BookingsRepository, BookingWithTeacher, CreateBookingParams, GetBookingByIdParams, GetTeacherAvailabilityParams, PayBookingParams } from '../domain/types';
import { getApiUrl } from '@/features/shared/services/environment';
import type { ClassType } from '@/features/teachers/domain/types';

export class AnyclazzMyBookingsRepository implements BookingsRepository {
    private readonly httpClient: FetchClient;
    
    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }
    
    async getUpcomingBookings({token}: { token: string }): Promise<BookingWithTeacher[]> {
        const params = {
            filter: 'upcoming',
            sort: 'asc'
        };

        console.log(token);

        const apiResponse = await this.httpClient.get({
            url: '/me/bookings',
            token: token,
            data: params,
        });

        const data = await apiResponse.json();
        
        console.log('Fetched upcoming bookings:', data);
        return data;
    }

    async getLastLessons({token}: { token: string }): Promise<BookingWithTeacher[]> {
        const params = {
            filter: 'last',
            sort: 'desc'
        };

        const apiResponse = await this.httpClient.get({
            url: '/me/bookings',
            token: token,
            data: params,
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

    async createBooking({teacherId, classTypeId, startAt, endAt, timeZone, token}: CreateBookingParams): Promise<any> {
        const params = {
            classTypeId,
            startAt,
            endAt,
            timeZone,
        };

        const apiResponse = await this.httpClient.post({
            url: `/booking/${teacherId}/lesson`,
            token: token,
            data: params,
        });

        const response = await apiResponse.json();
        return response;
    }

    async getBookingById({bookingId, token}: GetBookingByIdParams): Promise<BookingWithTeacher>{
        const apiResponse = await this.httpClient.get({
            url: `/bookings/${bookingId}`,
            token: token
        });


        const data = await apiResponse.json();
        console.log('Fetched booking data:', data.teacher.subject);

        data['classType'] = {
            type: data['classType'].type as unknown as ClassType,
            price: {
                amount: data['classType'].price.price,
                currency: data['classType'].price.currencyCode,
            }
        };

        return data;
    }

    async payBooking({bookingId, cardName, cardNumber, expiry, cvv, saveCard, token}: PayBookingParams): Promise<any> {
        const params = {
            cardName,
            cardNumber,
            expiry,
            cvv,
            saveCard,
        };

        const apiResponse = await this.httpClient.post({
            url: `/bookings/${bookingId}/pay`,
            token: token,
            data: params,
        });

        const response = await apiResponse.json();
        return response;
    }
}