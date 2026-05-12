import type { CommonParams } from "@/features/shared/domain/types";
import type { Student } from "@/features/students/domain/types";
import type { ClassType, Teacher, TeacherClassType } from "@/features/teachers/domain/types";

export interface Booking {
    id?: string;
    teacherId: string;
    studentId: string;
    classTypeId: string;
    startAt: string;      // ISO 8601 UTC, e.g. "2026-04-28T14:00:00+00:00"
    endAt: string;        // ISO 8601 UTC, e.g. "2026-04-28T15:00:00+00:00"
    timezone: string;     // IANA timezone del profesor, e.g. "America/New_York"
    meetingUrl?: string;
    status: 'pending' | 'processing' | 'confirmed' | 'completed' | 'cancelled' | 'failed' | 'refunded';
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
        requiresAction?: boolean;
        referral_discount?: IReferralDiscount | null;
    };
}

export interface CreateBookingParams extends CommonParams {
    teacherId: string;
    classTypeId: string;
    startAt: string;      // ISO 8601 con timezone incluido
    endAt: string;        // ISO 8601 con timezone incluido
    timeZone?: string;    // Opcional: solo para parsear fechas si se envían sin timezone
}

export interface GetTeacherAvailabilityParams extends CommonParams {
    teacherId: string;
    startAt: string;      // ISO 8601 - inicio del rango de búsqueda
    endAt: string;        // ISO 8601 - fin del rango de búsqueda
    duration: number;
    classTypeId?: string;
}

export interface GetBookingsParams extends CommonParams {
    filter?: 'last' | 'upcoming';
    sort: 'desc' | 'asc';
    page?: number;
    size?: number;
    startAt?: string;     // ISO 8601 - inicio del rango de búsqueda
    endAt?: string;       // ISO 8601 - fin del rango de búsqueda
    timezone?: string;    // Opcional: para filtrar por timezone específico
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

export interface IReferralDiscount {
    discount_amount: number;
    discount_percent: number;
    original_amount: number;
    charged_amount: number;
    currency: string;
    credit_type: 'referred_first_booking' | 'referrer_reward';
}

export interface IBookingPaymentPreview {
    booking_id: string;
    original_amount: number;
    charged_amount: number;
    discount_amount: number;
    discount_percent: number | null;
    currency: string;
    referral_discount: IReferralDiscount | null;
}

export interface GetBookingPaymentPreviewParams extends CommonParams {
    bookingId: string;
}

export interface BookingsRepository {
    getBookings(params: GetBookingsParams): Promise<GetBookingsResponse>;
    getTeacherAvailability(params: GetTeacherAvailabilityParams): Promise<any>;
    getBookingById(params: GetBookingByIdParams): Promise<BookingWithTeacher>;
    getBookingPaymentPreview(params: GetBookingPaymentPreviewParams): Promise<IBookingPaymentPreview>;
    cancelBooking(params: CancelBookingParams): Promise<CancelBookingResponse>;
}