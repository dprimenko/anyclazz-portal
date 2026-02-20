const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

export interface PaymentMethod {
  payment_method_id: string;
  type: 'card' | 'paypal';
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  paypal_email?: string;
  is_default: boolean;
  is_expired: boolean;
  created_at: string;
}

export interface SavePaymentMethodRequest {
  stripe_payment_method_id: string;
  set_as_default?: boolean;
}

export async function getPaymentMethods(token: string): Promise<PaymentMethod[]> {
  const response = await fetch(`${API_URL}/payment-methods`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payment methods');
  }

  return response.json();
}

export async function savePaymentMethod(
  token: string,
  data: SavePaymentMethodRequest
): Promise<PaymentMethod> {
  const response = await fetch(`${API_URL}/payment-methods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save payment method');
  }

  return response.json();
}

export async function deletePaymentMethod(
  token: string,
  paymentMethodId: string
): Promise<void> {
  const response = await fetch(`${API_URL}/payment-methods/${paymentMethodId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete payment method');
  }
}

export async function setDefaultPaymentMethod(
  token: string,
  paymentMethodId: string
): Promise<void> {
  const response = await fetch(`${API_URL}/payment-methods/${paymentMethodId}/default`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to set default payment method');
  }
}
