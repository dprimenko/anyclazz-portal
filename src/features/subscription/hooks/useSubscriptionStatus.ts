import { useState, useEffect } from 'react';
import { ApiSubscriptionRepository } from '../infrastructure/ApiSubscriptionRepository';
import type { SubscriptionStatusResponse } from '../domain/types';

export function useSubscriptionStatus(token: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SubscriptionStatusResponse | null>(null);

  const subscriptionRepository = new ApiSubscriptionRepository();

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true);
        setError(null);

        const response = await subscriptionRepository.getSubscriptionStatus(token);
        setData(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscription status';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchStatus();
    }
  }, [token]);

  return {
    loading,
    error,
    hasSubscription: data?.has_subscription ?? false,
    subscription: data?.subscription,
    refetch: async () => {
      try {
        setLoading(true);
        const response = await subscriptionRepository.getSubscriptionStatus(token);
        setData(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscription status';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  };
}
