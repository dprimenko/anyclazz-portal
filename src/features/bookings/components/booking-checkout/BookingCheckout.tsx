import { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createSetupIntent, createPaymentIntent } from '@/services/stripe';
import { getStripeErrorMessage } from '@/utils/stripeErrors';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { formatPrice } from '@/features/shared/utils/formatPrice';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useTranslations } from '@/i18n';

interface BookingCheckoutProps {
  bookingId: string;
  amount: number;
  currency: string;
  token: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  lang?: 'en' | 'es';
}

// Componente interno que usa el PaymentElement y maneja la confirmación del SetupIntent
function CheckoutForm({ 
  bookingId,
  amount,
  currency,
  token, 
  onSuccess, 
  onError, 
  setupIntentId, 
  lang = 'en' 
}: BookingCheckoutProps & { setupIntentId: string }) {
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
      // Paso 1: Confirmar el SetupIntent con los datos del formulario
      const { error: setupError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/me/my-agenda?payment=pending&booking_id=${bookingId}`,
        },
        redirect: 'if_required', // Solo redirige si es necesario (ej: PayPal)
      });

      if (setupError) {
        throw new Error(getStripeErrorMessage(setupError));
      }

      // Paso 2: Si el SetupIntent fue exitoso SIN redirección, crear el Payment Intent
      if (setupIntent && setupIntent.status === 'succeeded') {
        const paymentIntent = await createPaymentIntent(token, bookingId, setupIntentId);

        if (!paymentIntent) {
          throw new Error('Failed to create payment intent');
        }

        // Manejar los diferentes estados del Payment Intent
        if (paymentIntent.status === 'succeeded') {
          // ✅ Pago completado exitosamente
          onSuccess();
        } else if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_confirmation') {
          // Requiere confirmación adicional (SCA/3D Secure)
          if (paymentIntent.client_secret) {
            const { error: paymentError } = await stripe.confirmCardPayment(paymentIntent.client_secret);
            
            if (paymentError) {
              throw new Error(getStripeErrorMessage(paymentError));
            }
            
            onSuccess();
          } else {
            throw new Error('Payment requires confirmation but no client_secret provided');
          }
        } else if (paymentIntent.status === 'requires_payment_method') {
          throw new Error('Payment method is required');
        } else {
          // Estado inesperado
          throw new Error(`Unexpected payment intent status: ${paymentIntent.status}`);
        }
      } else {
        throw new Error(`Unexpected SetupIntent status: ${setupIntent?.status}`);
      }
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

// Componente principal que crea el SetupIntent para capturar el payment method
export function BookingCheckout({ bookingId, amount, currency, token, onSuccess, onError, lang = 'en' }: BookingCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [setupIntentId, setSetupIntentId] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayPal, setProcessingPayPal] = useState(false);
  const t = useTranslations({ lang });

  const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    // Detectar si viene de PayPal (Stripe agrega estos parámetros al return_url)
    async function handlePayPalReturn() {
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams(window.location.search);
      const setupIntentIdFromUrl = urlParams.get('setup_intent');
      const redirectStatus = urlParams.get('redirect_status');
      const paymentPending = urlParams.get('payment');
      const bookingIdFromUrl = urlParams.get('booking_id');

      // Si viene de PayPal con un SetupIntent exitoso
      if (setupIntentIdFromUrl && redirectStatus === 'succeeded' && paymentPending === 'pending' && bookingIdFromUrl === bookingId) {
        setProcessingPayPal(true);
        setLoading(true);

        try {
          console.log('Processing PayPal return with SetupIntent:', setupIntentIdFromUrl);

          // Crear el Payment Intent con el setup_intent_id
          const paymentIntent = await createPaymentIntent(token, bookingId, setupIntentIdFromUrl);

          if (!paymentIntent) {
            throw new Error(t('booking.failed_to_create_payment'));
          }

          // Verificar el estado del Payment Intent
          if (paymentIntent.status === 'succeeded') {
            console.log('Payment completed successfully:', paymentIntent);

            // Limpiar los parámetros de la URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('setup_intent');
            newUrl.searchParams.delete('setup_intent_client_secret');
            newUrl.searchParams.delete('redirect_status');
            newUrl.searchParams.delete('payment');
            newUrl.searchParams.delete('booking_id');
            window.history.replaceState({}, '', newUrl.toString());

            // Llamar al callback de éxito
            onSuccess();
          } else {
            throw new Error(`Unexpected payment intent status: ${paymentIntent.status}`);
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to process PayPal payment';
          console.error('Error processing PayPal return:', err);
          setInitError(errorMessage);
          onError(errorMessage);

          // Limpiar los parámetros de la URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('setup_intent');
          newUrl.searchParams.delete('setup_intent_client_secret');
          newUrl.searchParams.delete('redirect_status');
          newUrl.searchParams.delete('payment');
          newUrl.searchParams.delete('booking_id');
          window.history.replaceState({}, '', newUrl.toString());
        } finally {
          setProcessingPayPal(false);
          setLoading(false);
        }
        return; // No continuar con el flujo normal
      }
    }

    // Primero verificar si viene de PayPal
    handlePayPalReturn().then(() => {
      // Solo crear SetupIntent si NO viene de PayPal
      const urlParams = new URLSearchParams(window.location.search);
      const setupIntentIdFromUrl = urlParams.get('setup_intent');

      if (!setupIntentIdFromUrl) {
        initializeSetupIntent();
      }
    });

    // Crear SetupIntent para capturar información del payment method
    async function initializeSetupIntent() {
      try {
        setInitError(null);
        setLoading(true);

        // Crear SetupIntent en el backend
        const setupIntent = await createSetupIntent(token);
        
        setClientSecret(setupIntent.client_secret);
        setSetupIntentId(setupIntent.setup_intent_id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('subscription.failed_to_initialize_payment');
        setInitError(errorMessage);
        onError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  }, [token, bookingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Text colorType="tertiary">
          {processingPayPal ? t('booking.processing_paypal_payment') : t('subscription.initializing_payment')}
        </Text>
      </div>
    );
  }

  if (initError || !clientSecret || !setupIntentId) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
        <Text colorType="primary" size="text-sm">{initError || t('subscription.failed_to_initialize_payment')}</Text>
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
        bookingId={bookingId}
        amount={amount}
        currency={currency}
        token={token} 
        onSuccess={onSuccess} 
        onError={onError}
        setupIntentId={setupIntentId}
      />
    </Elements>
  );
}
