import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { ReactNode } from 'react';

interface StripeProviderProps {
  children: ReactNode;
  publishableKey: string;
}

export function StripeProvider({ children, publishableKey }: StripeProviderProps) {
  // Cargar Stripe inmediatamente
  const stripePromise = loadStripe(publishableKey);

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
