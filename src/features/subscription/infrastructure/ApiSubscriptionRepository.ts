import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';
import type {
  CreateSubscriptionRequest,
  SubscriptionResponse,
  SubscriptionStatusResponse,
  CancelSubscriptionRequest,
  SubscriptionRepository,
} from '../domain/types';

export class ApiSubscriptionRepository implements SubscriptionRepository {
  private readonly httpClient: FetchClient;

  constructor() {
    this.httpClient = new FetchClient(getApiUrl());
  }

  async createSubscription(token: string, data: CreateSubscriptionRequest): Promise<SubscriptionResponse> {
    console.log('[ApiSubscriptionRepository] Creating subscription with data:', data);
    
    const response = await this.httpClient.post({
      url: '/teachers/subscription',
      token,
      data,
    });

    const result = await response.json();
    console.log('[ApiSubscriptionRepository] Subscription created:', result);
    
    return result;
  }

  async getSubscriptionStatus(token: string): Promise<SubscriptionStatusResponse> {
    const response = await this.httpClient.get({
      url: '/teachers/subscription/status',
      token,
    });

    return response.json();
  }

  async cancelSubscription(token: string, data: CancelSubscriptionRequest): Promise<void> {
    await this.httpClient.post({
      url: '/teachers/subscription/cancel',
      token,
      data,
    });
  }
}
