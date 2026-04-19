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
import { publish } from '@/features/shared/services/domainEventsBus';
import { SharedDomainEvents } from '@/features/shared/domain/events';
import { ProgressIndicator } from '@/ui-library/components/progress-indicator/ProgressIndicator';

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
  const t = useTranslations({ lang });
  const { createSubscription } = useCreateSubscription(token);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) {
      const errorMessage = 'Stripe is not initialized';
      publish(SharedDomainEvents.showToast, {
        message: errorMessage,
        variant: 'error',
      });
      onError(errorMessage);
      return;
    }

    setLoading(true);

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

        console.log('Subscription created:', { 
          status: subscription.status, 
          requires_action: subscription.requires_action,
          has_client_secret: !!subscription.client_secret 
        });

        // Si requiere acción adicional (3DS en el PaymentIntent de la primera factura)
        if (subscription.requires_action && subscription.client_secret) {
          console.log('Confirming invoice payment with 3DS...');
          const { error: paymentError } = await stripe.confirmCardPayment(subscription.client_secret);
          
          if (paymentError) {
            console.error('Payment confirmation failed:', paymentError);
            throw new Error(getStripeErrorMessage(paymentError));
          }
          
          // Pago completado con 3DS - el webhook activará el super tutor
          console.log('3DS payment confirmed successfully');
          onSuccess(subscription.subscription_id);
          return;
        }

        // Manejar los diferentes estados de la suscripción cuando NO requiere acción adicional
        if (subscription.status === 'active' || subscription.status === 'incomplete') {
          // ✅ Suscripción activada exitosamente (sin 3DS adicional)
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
      publish(SharedDomainEvents.showToast, {
        message: errorMessage,
        variant: 'error',
      });
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
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

  const publishableKey = "pk_test_51SdvZdRpuaFax7XpwLl84SqWauVhApPg4eCmdm9BzdbTzK2vQBzACLJ5jTcqFuD0Wsrl3vXW8QXaYy0VHio1mAlq00zmj0s5ot";
  
  if (!publishableKey) {
    console.error('Stripe publishable key is not configured');
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
        <Text colorType="primary" size="text-sm">Payment configuration error. Please contact support.</Text>
      </div>
    );
  }

  const stripePromise = loadStripe(publishableKey);

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
          
          // Mostrar error como toast
          publish(SharedDomainEvents.showToast, {
            message: errorMessage,
            variant: 'error',
          });
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
      <div className="flex items-center justify-center py-6">
          <ProgressIndicator message={processingPayPal ? t('subscription.processing_paypal_payment') : t('subscription.initializing_payment')} />
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
