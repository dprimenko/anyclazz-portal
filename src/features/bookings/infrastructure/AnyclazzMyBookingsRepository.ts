import { FetchClient } from '@/features/shared/services/httpClient';
import type { BookingsRepository, BookingWithTeacher, CancelBookingParams, CancelBookingResponse, CreateBookingParams, GetBookingByIdParams, GetBookingsParams, GetBookingsResponse, GetTeacherAvailabilityParams, PayBookingParams } from '../domain/types';
import { getApiUrl } from '@/features/shared/services/environment';
import type { ClassType } from '@/features/teachers/domain/types';

export class AnyclazzMyBookingsRepository implements BookingsRepository {
    private readonly httpClient: FetchClient;
    
    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }
    
    async getBookings({token, filter, sort, page, size, from, to, timeZone}: GetBookingsParams): Promise<GetBookingsResponse> {
        const params: Record<string, any> = {
            sort
        };

        if (filter !== undefined) {
            params.filter = filter;
        }

        if (from !== undefined) {
            params.from = from;
        }

        if (to !== undefined) {
            params.to = to;
        }

        if (page !== undefined) {
            params.page = page;
        }

        if (size !== undefined) {
            params.size = size;
        }

        if (timeZone !== undefined) {
            params.timezone = timeZone;
        }

        const apiResponse = await this.httpClient.get({
            url: '/me/bookings',
            token: token,
            data: params,
        });

        const data = await apiResponse.json();
        
        return {
            bookings: data.bookings,
            meta: data.meta
        };
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

        data['classType'] = {
            type: data['classType'].type as unknown as ClassType,
            price: {
                amount: data['classType'].price.price,
                currency: data['classType'].price.currencyCode,
            }
        };

        return data;
    }

    async cancelBooking({bookingId, token}: CancelBookingParams): Promise<CancelBookingResponse> {
        const apiResponse = await this.httpClient.delete({
            url: `/bookings/${bookingId}/cancel`,
            token: token
        });

        const data = await apiResponse.json();
        return data;
    }
}