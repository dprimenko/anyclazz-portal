import type { CommonParams } from "@/features/shared/domain/types";
import type { Student } from "@/features/students/domain/types";
import type { ClassType, Teacher, TeacherClassType } from "@/features/teachers/domain/types";

export interface Booking {
    id?: string;
    teacherId: string;
    studentId: string;
    classTypeId: string;
    startAt: string;      // ISO 8601 UTC
    endAt: string;        // ISO 8601 UTC
    timeZone: string;     // Timezone del profesor (desde backend)
    meetingUrl?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'failed' | 'refunded';
    createdAt?: string;
    updatedAt?: string;
}

export interface BookingWithTeacher extends Booking {
    teacher?: Teacher;
    student?: Student;
    classType: TeacherClassType;
    payment?: {
        clientSecret: string;
        amount: number;
        currency: string;
        paymentIntentId: string;
        status?: string;
    };
}

export interface CreateBookingParams extends CommonParams {
    teacherId: string;
    classTypeId: string;
    startAt: string;
    endAt: string;
    timeZone: string;
}

export interface GetTeacherAvailabilityParams extends CommonParams {
    teacherId: string;
    from: string;
    to: string;
    duration: number;
}

export interface GetBookingsParams extends CommonParams {
    filter?: 'last' | 'upcoming';
    sort: 'desc' | 'asc';
    page?: number;
    size?: number;
    from?: string;
    to?: string;
    timeZone?: string;
}

export interface GetBookingsResponse {
    bookings: BookingWithTeacher[];
    meta: {
        currentPage: number;
        lastPage: number;
        size: number;
        total: number;
    };
}

export interface GetBookingByIdParams extends CommonParams {
    bookingId: string;
}

export interface PayBookingParams extends CommonParams {
    bookingId: string;
    cardName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    saveCard: boolean;
}

export interface CancelBookingParams extends CommonParams {
    bookingId: string;
}

export interface CancelBookingResponse {
    success: boolean;
    refunded: boolean;
    refundAmount?: number;
    message: string;
}

export interface BookingsRepository {
    getBookings(params: GetBookingsParams): Promise<GetBookingsResponse>;
    getTeacherAvailability(params: GetTeacherAvailabilityParams): Promise<any>;
    getBookingById(params: GetBookingByIdParams): Promise<BookingWithTeacher>;
    cancelBooking(params: CancelBookingParams): Promise<CancelBookingResponse>;
}