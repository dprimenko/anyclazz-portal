import type { CommonParams } from "@/features/shared/domain/types";
import type { Student } from "@/features/students/domain/types";
import type { ClassType, Teacher, TeacherClassType } from "@/features/teachers/domain/types";

export interface Booking {
    id?: string;
    teacherId: string;
    studentId: string;
    classTypeId: string;
    startAt: string;
    endAt: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface BookingWithTeacher extends Booking {
    teacher?: Teacher;
    student?: Student;
    classType: TeacherClassType;
    status: 'online' | 'on-site';
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

export interface GetUpcomingBookingsParams extends CommonParams {
    
}

export interface GetBookingByIdParams extends CommonParams {
    bookingId: string;
}

export interface BookingsRepository {
    getUpcomingBookings(params: GetUpcomingBookingsParams): Promise<BookingWithTeacher[]>;
    getTeacherAvailability(params: GetTeacherAvailabilityParams): Promise<any>;
    getBookingById(params: GetBookingByIdParams): Promise<BookingWithTeacher>;
}