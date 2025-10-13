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