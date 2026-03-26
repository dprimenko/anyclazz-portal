import type {
    TeacherApprovalRepository,
    ListTeacherApprovalsParams,
    ListTeacherApprovalsResponse,
    ApproveTeacherParams,
    RejectTeacherParams,
    ApprovalActionResponse,
    TeacherApproval,
} from '../domain/types';
import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';
import type { ApiTeacherApproval } from './types';

export class ApiTeacherApprovalRepository implements TeacherApprovalRepository {
    private readonly httpClient: FetchClient;

    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }

    async listTeacherApprovals({
        token,
        page,
        size,
        query,
        statuses,
    }: ListTeacherApprovalsParams): Promise<ListTeacherApprovalsResponse> {
        const data: Record<string, string | number> = {
            page: page,
            size: size,
        };

        // Si se pasan múltiples estados, unirlos con coma
        if (statuses && statuses.length > 0) {
            data.statuses = statuses.join(',');
        } else {
            // Por defecto, solo pending según doc del backend
            data.statuses = 'pending';
        }

        if (query) {
            data.query = query;
        }

        const response = await this.httpClient.get({
            url: '/admin/teachers',
            token: token,
            data,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch teacher approvals');
        }

        const result = await response.json();

        return {
            teachers: result.teachers.map(this.toTeacherApproval),
            meta: {
                currentPage: result.meta.currentPage,
                lastPage: result.meta.lastPage,
                size: result.meta.size,
                total: result.meta.total,
            },
        };
    }

    async approveTeacher({ token, teacherId }: ApproveTeacherParams): Promise<ApprovalActionResponse> {
        const response = await this.httpClient.put({
            url: `/admin/teachers/${teacherId}/approve`,
            token: token,
        });

        if (response.status === 404) {
            throw new Error('TEACHER_NOT_FOUND');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to approve teacher' }));
            throw new Error(error.message || 'Failed to approve teacher');
        }

        return {
            success: true,
            message: 'Teacher approved successfully',
        };
    }

    async rejectTeacher({ token, teacherId }: RejectTeacherParams): Promise<ApprovalActionResponse> {
        const response = await this.httpClient.put({
            url: `/admin/teachers/${teacherId}/reject`,
            token: token,
        });

        if (response.status === 404) {
            throw new Error('TEACHER_NOT_FOUND');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to reject teacher' }));
            throw new Error(error.message || 'Failed to reject teacher');
        }

        return {
            success: true,
            message: 'Teacher rejected successfully',
        };
    }

    private toTeacherApproval(apiTeacherApproval: ApiTeacherApproval): TeacherApproval {
        return {
            id: apiTeacherApproval.id,
            name: apiTeacherApproval.name,
            surname: apiTeacherApproval.surname,
            email: apiTeacherApproval.email,
            avatar: apiTeacherApproval.avatar,
            createdAt: apiTeacherApproval.createdAt || '',
            status: apiTeacherApproval.status,
            statusUpdatedAt: apiTeacherApproval.statusUpdatedAt,
            location: apiTeacherApproval.teacherAddress
                ? {
                      country: apiTeacherApproval.teacherAddress.country,
                      city: apiTeacherApproval.teacherAddress.city,
                  }
                : undefined,
            subject: apiTeacherApproval.subject || null,
        };
    }
}
