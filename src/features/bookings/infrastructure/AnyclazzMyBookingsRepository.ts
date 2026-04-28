import { FetchClient } from '@/features/shared/services/httpClient';
import type { BookingsRepository, BookingWithTeacher, CancelBookingParams, CancelBookingResponse, CreateBookingParams, GetBookingByIdParams, GetBookingPaymentPreviewParams, GetBookingsParams, GetBookingsResponse, GetTeacherAvailabilityParams, IBookingPaymentPreview, PayBookingParams } from '../domain/types';
import { getApiUrl } from '@/features/shared/services/environment';
import type { ClassType } from '@/features/teachers/domain/types';

export class AnyclazzMyBookingsRepository implements BookingsRepository {
    private readonly httpClient: FetchClient;
    
    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }
    
    async getBookings({token, filter, sort, page, size, startAt, endAt, timezone}: GetBookingsParams): Promise<GetBookingsResponse> {
        const params: Record<string, any> = {
            sort
        };

        if (filter !== undefined) {
            params.filter = filter;
        }

        if (startAt !== undefined) {
            params.startAt = startAt;
        }

        if (endAt !== undefined) {
            params.endAt = endAt;
        }

        if (page !== undefined) {
            params.page = page;
        }

        if (size !== undefined) {
            params.size = size;
        }

        if (timezone !== undefined) {
            params.timezone = timezone;
        }

        const apiResponse = await this.httpClient.get({
            url: '/me/bookings',
            token: token,
            data: params,
        });

        const data = await apiResponse.json();

        //console.log('Fetched bookings data:', data);
        
        return {
            bookings: data.bookings,
            meta: data.meta
        };
    }
    
    async getTeacherAvailability({teacherId, startAt, endAt, duration, classTypeId, token}: GetTeacherAvailabilityParams): Promise<any> {
        const params: Record<string, any> = {
            startAt,
            endAt,
            duration,
        };

        if (classTypeId !== undefined) {
            params.classTypeId = classTypeId;
        }

        const apiResponse = await this.httpClient.get({
            url: `/teacher-availability/${teacherId}`,
            token: token,
            data: params,
        });

        const response = await apiResponse.json();
        return response;
    }

    async createBooking({teacherId, classTypeId, startAt, endAt, timeZone, token}: CreateBookingParams): Promise<any> {
        const params: Record<string, any> = {
            classTypeId,
            startAt,
            endAt,
        };

        // Solo agregar timeZone si está definido
        if (timeZone !== undefined) {
            params.timeZone = timeZone;
        }

        const apiResponse = await this.httpClient.post({
            url: `/booking/${teacherId}/lesson`,
            token: token,
            data: params,
        });

        const response = await apiResponse.json();
        console.log('createBooking response:', response);
        return response;
    }

    async getBookingById({bookingId, token}: GetBookingByIdParams): Promise<BookingWithTeacher>{
        const apiResponse = await this.httpClient.get({
            url: `/bookings/${bookingId}`,
            token: token
        });


        const data = await apiResponse.json();

        console.log('getBookingById raw response:', JSON.stringify(data, null, 2));

        data['classType'] = {
            type: data['classType'].type as unknown as ClassType,
            price: {
                price: data['classType'].price?.price ?? data['classType'].price?.amount,
                currency: data['classType'].price?.currencyCode ?? data['classType'].price?.currency,
            }
        };

        // Map snake_case payment fields to camelCase
        if (data['payment']) {
            data['payment'] = {
                ...data['payment'],
                clientSecret: data['payment'].clientSecret ?? data['payment'].client_secret,
                paymentIntentId: data['payment'].paymentIntentId ?? data['payment'].payment_intent_id,
                referral_discount: data['payment'].referral_discount ?? null,
            };
        }

        return data;
    }

    async getBookingPaymentPreview({bookingId, token}: GetBookingPaymentPreviewParams): Promise<IBookingPaymentPreview> {
        const apiResponse = await this.httpClient.get({
            url: `/payments/booking/${bookingId}/preview`,
            token: token,
        });

        const data = await apiResponse.json();
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