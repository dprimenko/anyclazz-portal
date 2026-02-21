import { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCreateSubscription } from '@/features/subscription';
import { getStripeErrorMessage } from '@/utils/stripeErrors';
import type { StripePlan } from '@/services/stripe';
import { createSetupIntent } from '@/services/stripe';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { formatPrice } from '../../utils/formatPrice';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useTranslations } from '@/i18n';

interface SubscriptionCheckoutProps {
  plan: StripePlan;
  token: string;
  onSuccess: (subscriptionId: string) => void;
  onError: (error: string) => void;
  lang?: 'en' | 'es';
}

// Componente interno que usa el PaymentElement y maneja la confirmación del SetupIntent
function CheckoutForm({ 
  plan, 
  token, 
  onSuccess, 
  onError, 
  setupIntentId, 
  lang = 'en' 
}: SubscriptionCheckoutProps & { setupIntentId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations({ lang });
  const { createSubscription } = useCreateSubscription(token);

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
          return_url: `${window.location.origin}/super-tutor/checkout/${plan.interval}?subscription=pending`, // PayPal redirige aquí
        },
        redirect: 'if_required', // Solo redirige si es necesario (ej: PayPal)
      });

      if (setupError) {
        throw new Error(getStripeErrorMessage(setupError));
      }

      // Paso 2: Si el SetupIntent fue exitoso SIN redirección, crear la suscripción
      if (setupIntent && setupIntent.status === 'succeeded') {
        const subscription = await createSubscription({
          interval: plan.interval,
          setup_intent_id: setupIntentId,
        });

        if (!subscription) {
          throw new Error(t('subscription.failed_to_create_subscription'));
        }

        // Manejar los diferentes estados de la suscripción
        if (subscription.status === 'active') {
          // ✅ Suscripción activada exitosamente
          onSuccess(subscription.subscription_id);
        } else if (subscription.status === 'incomplete' && subscription.client_secret) {
          // Algunos casos requieren confirmación adicional (SCA/3D Secure)
          const { error: paymentError } = await stripe.confirmCardPayment(subscription.client_secret);
          
          if (paymentError) {
            throw new Error(getStripeErrorMessage(paymentError));
          }
          
          onSuccess(subscription.subscription_id);
        } else if (subscription.requires_payment_method) {
          throw new Error(t('subscription.requires_payment_method'));
        } else {
          // Estado inesperado
          throw new Error(`Unexpected subscription status: ${subscription.status}`);
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
        label={loading ? t('subscription.processing') : `${t('subscription.confirm_payment')} • ${formatPrice(plan.amount, plan.currency, lang)}`}
        fullWidth
      />
      
      <Text size="text-xs" colorType="tertiary" className="text-center leading-relaxed">
        {t('subscription.refund_policy')}
      </Text>
    </form>
  );
}

// Componente principal que crea el SetupIntent para capturar el payment method
export function SubscriptionCheckout({ plan, token, onSuccess, onError, lang = 'en' }: SubscriptionCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [setupIntentId, setSetupIntentId] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayPal, setProcessingPayPal] = useState(false);
  const t = useTranslations({ lang });
  const { createSubscription } = useCreateSubscription(token);

  const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    // Detectar si viene de PayPal (Stripe agrega estos parámetros al return_url)
    async function handlePayPalReturn() {
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams(window.location.search);
      const setupIntentIdFromUrl = urlParams.get('setup_intent');
      const redirectStatus = urlParams.get('redirect_status');
      const subscriptionPending = urlParams.get('subscription');

      // Si viene de PayPal con un SetupIntent exitoso
      if (setupIntentIdFromUrl && redirectStatus === 'succeeded' && subscriptionPending === 'pending') {
        setProcessingPayPal(true);
        setLoading(true);

        try {
          console.log('Processing PayPal return with SetupIntent:', setupIntentIdFromUrl);

          // Crear la suscripción con el setup_intent_id
          const subscription = await createSubscription({
            interval: plan.interval,
            setup_intent_id: setupIntentIdFromUrl,
          });

          if (!subscription) {
            throw new Error(t('subscription.failed_to_create_subscription'));
          }

          // Verificar el estado de la suscripción
          if (subscription.status === 'active' || subscription.status === 'incomplete') {
            console.log('Subscription created successfully:', subscription);

            // Limpiar los parámetros de la URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('setup_intent');
            newUrl.searchParams.delete('setup_intent_client_secret');
            newUrl.searchParams.delete('subscription');
            newUrl.searchParams.delete('redirect_status');
            window.history.replaceState({}, '', newUrl.toString());

            // Llamar al callback de éxito
            onSuccess(subscription.subscription_id);
          } else {
            throw new Error(`Unexpected subscription status: ${subscription.status}`);
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
          newUrl.searchParams.delete('subscription');
          newUrl.searchParams.delete('redirect_status');
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
  }, [token, plan.interval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Text colorType="tertiary">
          {processingPayPal ? t('subscription.processing_paypal_payment') : t('subscription.initializing_payment')}
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
        plan={plan} 
        token={token} 
        onSuccess={onSuccess} 
        onError={onError}
        setupIntentId={setupIntentId}
      />
    </Elements>
  );
}
