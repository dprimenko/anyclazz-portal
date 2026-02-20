import { useState } from 'react';
import { ApiSubscriptionRepository } from '../infrastructure/ApiSubscriptionRepository';
import type { CreateSubscriptionRequest, SubscriptionResponse } from '../domain/types';

export function useCreateSubscription(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SubscriptionResponse | null>(null);

  const subscriptionRepository = new ApiSubscriptionRepository();

  async function createSubscription(requestData: CreateSubscriptionRequest): Promise<SubscriptionResponse | null> {
    try {
      setLoading(true);
      setError(null);

      const response = await subscriptionRepository.createSubscription(token, requestData);
      setData(response);
      return response;
    } catch (err) {
      console.error('[useCreateSubscription] Error creating subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    createSubscription,
    loading,
    error,
    data,
  };
}
