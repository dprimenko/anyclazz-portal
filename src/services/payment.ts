const API_URL = import.meta.env.PUBLIC_API_URL;

interface CreatePaymentIntentRequest {
  booking_id?: string;
  subscription_id?: string;
  payment_method_id?: string;
}

interface PaymentIntentResponse {
  payment_intent_id: string;
  client_secret: string;
  amount: string;
  currency: string;
  status: string;
  type: 'booking' | 'subscription';
}

export async function createPaymentIntent(
  token: string,
  data: CreatePaymentIntentRequest
): Promise<PaymentIntentResponse> {
  const response = await fetch(`${API_URL}/payment-intents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment intent');
  }

  return response.json();
}
