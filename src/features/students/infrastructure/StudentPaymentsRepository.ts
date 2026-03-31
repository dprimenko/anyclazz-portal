import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';
import type { GetStudentPaymentsResponse } from '../domain/paymentTypes';

export interface GetStudentPaymentsParams {
    token: string;
    page?: number;
    limit?: number;
}

export class StudentPaymentsRepository {
    private readonly httpClient: FetchClient;

    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }

    async getPaymentHistory({
        token,
        page = 1,
        limit = 10,
    }: GetStudentPaymentsParams): Promise<GetStudentPaymentsResponse> {
        const response = await this.httpClient.get({
            url: '/students/me/payments/history',
            token,
            data: { page, limit },
        });

        return response.json();
    }
}
