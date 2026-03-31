import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';
import type { GetPaymentHistoryResponse, PaymentsDashboardResponse } from '../domain/paymentHistoryTypes';

export interface GetPaymentHistoryParams {
    token: string;
    page?: number;
    limit?: number;
}

export interface DownloadInvoiceParams {
    token: string;
    downloadUrl: string;
    filename?: string;
}

export class PaymentsHistoryRepository {
    private readonly httpClient: FetchClient;

    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }

    async getPaymentHistory({
        token,
        page = 1,
        limit = 10,
    }: GetPaymentHistoryParams): Promise<GetPaymentHistoryResponse> {
        const response = await this.httpClient.get({
            url: '/teachers/me/payments/history',
            token,
            data: { page, limit },
        });

        return response.json();
    }

    async getPaymentsDashboard({ token }: { token: string }): Promise<PaymentsDashboardResponse> {
        const response = await this.httpClient.get({
            url: '/teachers/me/payments/dashboard',
            token,
        });

        return response.json();
    }

    async downloadInvoice({ token, downloadUrl, filename = 'invoice.pdf' }: DownloadInvoiceParams): Promise<void> {
        const path = downloadUrl.replace(/^\/api\/v1/, '');
        const response = await this.httpClient.get({
            url: path,
            token,
            accept: 'application/pdf',
        });

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(objectUrl);
    }
}
