const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

export interface StripePlan {
  interval: 'week' | 'month' | 'year';
  price_id: string;
  amount: number;
  currency: string;
  recurring_interval: string;
  recurring_interval_count: number;
  product: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface GetPlansResponse {
  plans: StripePlan[];
  currency: string;
}

export interface ActiveSubscription {
  id: string;
  stripe_subscription_id: string;
  price_id: string;
  interval: 'week' | 'month' | 'year';
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
}

export interface SetupIntentResponse {
  client_secret: string;
  setup_intent_id: string;
  customer_id: string;
  publishable_key: string;
}

export interface PaymentIntentResponse {
  payment_intent_id: string;
  client_secret: string | null;
  amount: number;
  currency: string;
  status: string;
  type: 'booking' | 'subscription';
}

export async function getSuperTutorPlans(token: string): Promise<GetPlansResponse> {
  const response = await fetch(`${API_URL}/super-tutor/plans`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch plans');
  }
  
  return response.json();
}

export async function getSuperTutorPlan(token: string, interval: 'week' | 'month' | 'year'): Promise<StripePlan> {
  const response = await fetch(`${API_URL}/super-tutor/plans/${interval}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${interval} plan`);
  }
  
  return response.json();
}

export async function getActiveSubscription(token: string): Promise<{ subscription: ActiveSubscription | null }> {
  const response = await fetch(`${API_URL}/teachers/subscription`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get subscription');
  }

  return response.json();
}

export async function createSetupIntent(token: string): Promise<SetupIntentResponse> {
  const response = await fetch(`${API_URL}/setup-intent`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usage: 'subscription' }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create setup intent');
  }

  return response.json();
}

export async function cancelSubscription(
  token: string,
  immediately: boolean = false
): Promise<any> {
  const response = await fetch(`${API_URL}/teachers/subscription/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ immediately }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to cancel subscription');
  }

  return response.json();
}

export async function createPaymentIntent(
  token: string,
  bookingId: string,
  setupIntentId: string
): Promise<PaymentIntentResponse> {
  const response = await fetch(`${API_URL}/payment-intents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      booking_id: bookingId,
      setup_intent_id: setupIntentId 
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create payment intent');
  }

  return response.json();
}
