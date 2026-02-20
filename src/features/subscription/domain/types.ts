export interface CreateSubscriptionRequest {
  interval: 'week' | 'month' | 'year';
  payment_method_id?: string;
  setup_intent_id?: string;
}

export interface SubscriptionResponse {
  subscription_id: string;
  stripe_subscription_id: string;
  status: string;
  interval: string;
  current_period_end: string;
  client_secret: string | null;
  payment_intent_status?: string | null;
  requires_payment_method?: boolean;
  is_upgrade?: boolean;
  message?: string;
}

export interface SubscriptionStatusResponse {
  has_subscription: boolean;
  subscription?: {
    subscription_id: string;
    stripe_subscription_id: string;
    interval: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
  };
}

export interface CancelSubscriptionRequest {
  immediately?: boolean;
}

export interface SubscriptionRepository {
  createSubscription(token: string, data: CreateSubscriptionRequest): Promise<SubscriptionResponse>;
  getSubscriptionStatus(token: string): Promise<SubscriptionStatusResponse>;
  cancelSubscription(token: string, data: CancelSubscriptionRequest): Promise<void>;
}
