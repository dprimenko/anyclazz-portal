/**
 * @deprecated Use ApiSubscriptionRepository from @/features/subscription instead
 * This file is kept for backwards compatibility only
 */

import { ApiSubscriptionRepository } from '@/features/subscription';
import type {
  CreateSubscriptionRequest,
  SubscriptionResponse,
  SubscriptionStatusResponse,
} from '@/features/subscription';

const subscriptionRepository = new ApiSubscriptionRepository();

/**
 * @deprecated Use subscriptionRepository.createSubscription() instead
 */
export async function createSuperTutorSubscription(
  token: string,
  data: CreateSubscriptionRequest
): Promise<SubscriptionResponse> {
  return subscriptionRepository.createSubscription(token, data);
}

/**
 * @deprecated Use subscriptionRepository.getSubscriptionStatus() instead
 */
export async function getSubscriptionStatus(
  token: string
): Promise<SubscriptionStatusResponse> {
  return subscriptionRepository.getSubscriptionStatus(token);
}

/**
 * @deprecated Use subscriptionRepository.cancelSubscription() instead
 */
export async function cancelSubscription(
  token: string,
  immediately: boolean = false
): Promise<void> {
  return subscriptionRepository.cancelSubscription(token, { immediately });
}

// Re-export types for backwards compatibility
export type { CreateSubscriptionRequest, SubscriptionResponse, SubscriptionStatusResponse };
