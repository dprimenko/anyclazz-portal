import type { CommonParams } from "@/features/shared/domain/types";
import type { Teacher } from "@/features/teachers/domain/types";

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
    teacher: Teacher;
    classType: string;
    status: 'online' | 'on-site';
}

export interface GetTeacherAvailabilityParams extends CommonParams {
    teacherId: string;
    from: string;
    to: string;
    duration: number;
}

export interface BookingsRepository {
    getUpcomingBookings(request: Request): Promise<BookingWithTeacher[]>;
    getTeacherAvailability(params: GetTeacherAvailabilityParams): Promise<any>;
}