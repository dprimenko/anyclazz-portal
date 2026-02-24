import { useState } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getStripeErrorMessage } from '@/utils/stripeErrors';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { formatPrice } from '@/features/shared/utils/formatPrice';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useTranslations } from '@/i18n';

interface BookingCheckoutProps {
  clientSecret: string; // ✨ Ahora viene del backend al crear el booking
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  lang?: 'en' | 'es';
}

// Componente interno que usa el PaymentElement y confirma el pago
function CheckoutForm({ 
  amount,
  currency,
  onSuccess, 
  onError, 
  lang = 'en' 
}: BookingCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations({ lang });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe is not initialized');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Confirmar el pago con Stripe
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href, // PayPal redirige aquí después de aprobar
        },
        redirect: 'if_required', // Solo redirige si es necesario (ej: PayPal)
      });

      if (confirmError) {
        throw new Error(getStripeErrorMessage(confirmError));
      }

      // ✅ Pago completado exitosamente (para tarjetas sin 3DS)
      // El webhook actualizará el booking a 'confirmed'
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <Text colorType="primary" size="text-sm">{error}</Text>
        </div>
      )}

      {/* PaymentElement de Stripe - soporta card + PayPal automáticamente */}
      <div id="stripe_payment_methods">
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            }
          }}
        />
      </div>

      <Button
        type="submit"
        colorType="primary"
        size="lg"
        disabled={!stripe || loading}
        label={loading ? t('subscription.processing') : `${t('subscription.confirm_payment')} • ${formatPrice(amount, currency, lang)}`}
        fullWidth
      />
      
      <Text size="text-xs" colorType="tertiary" className="text-center leading-relaxed">
        {t('subscription.refund_policy')}
      </Text>
    </form>
  );
}

// Componente principal que recibe el clientSecret del backend
export function BookingCheckout({ clientSecret, amount, currency, onSuccess, onError, lang = 'en' }: BookingCheckoutProps) {
  const publishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.error('Stripe publishable key is not configured');
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
        <Text colorType="primary" size="text-sm">Payment configuration error. Please contact support.</Text>
      </div>
    );
  }

  const stripePromise = loadStripe(publishableKey);

  if (!clientSecret) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
        <Text colorType="primary" size="text-sm">Payment initialization failed</Text>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#FDB022',
      colorBackground: '#ffffff',
      colorText: '#1a1a1a',
      colorDanger: '#ef4444',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm 
        lang={lang}
        clientSecret={clientSecret}
        amount={amount}
        currency={currency}
        onSuccess={onSuccess} 
        onError={onError}
      />
    </Elements>
  );
}
