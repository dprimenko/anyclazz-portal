import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';
import type { ReferralData } from '@/features/shared/domain/referralTypes';

export class ReferralRepository {
    private readonly httpClient: FetchClient;

    constructor() {
        this.httpClient = new FetchClient(getApiUrl());
    }

    async getReferralData({ token }: { token: string }): Promise<ReferralData> {
        const response = await this.httpClient.get({
            url: '/me/referral',
            token,
        });
        return response.json();
    }
}
