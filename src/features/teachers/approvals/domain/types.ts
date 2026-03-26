import type { CommonParams } from '@/features/shared/domain/types';

export type TeacherApprovalStatus = 'pending' | 'confirmed' | 'rejected';
export type TeacherApprovalFilter = 'pending' | 'rejected' | 'confirmed';

export interface TeacherApproval {
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string | null;
    createdAt: string;
    status: TeacherApprovalStatus | null;
    statusUpdatedAt: string | null;
    location?: {
        country?: string;
        city?: string;
    };
    subject?: {
        id: string;
        name: { en: string; es: string };
    } | null;
}

export interface ListTeacherApprovalsParams extends CommonParams {
    page: number;
    size: number;
    query?: string;
    statuses?: TeacherApprovalFilter[];  // Puede aceptar múltiples estados
}

export interface ListTeacherApprovalsResponse {
    teachers: TeacherApproval[];
    meta: {
        currentPage: number;
        lastPage: number;
        size: number;
        total: number;
    };
}

export interface ApproveTeacherParams extends CommonParams {
    teacherId: string;
}

export interface RejectTeacherParams extends CommonParams {
    teacherId: string;
}

export interface ApprovalActionResponse {
    success: boolean;
    message?: string;
}

export interface TeacherApprovalRepository {
    listTeacherApprovals(params: ListTeacherApprovalsParams): Promise<ListTeacherApprovalsResponse>;
    approveTeacher(params: ApproveTeacherParams): Promise<ApprovalActionResponse>;
    rejectTeacher(params: RejectTeacherParams): Promise<ApprovalActionResponse>;
}
