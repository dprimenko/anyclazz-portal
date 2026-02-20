import { useEffect, useState } from 'react';
import { useCreateSubscription } from './useCreateSubscription';

interface UsePayPalReturnHandlerProps {
  token: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Hook para manejar el retorno de PayPal después de confirmar el SetupIntent.
 * 
 * Cuando el usuario aprueba el pago en PayPal, Stripe redirige de vuelta a:
 * /profile?tab=super_tutor&subscription=pending&interval=month&setup_intent=seti_xxx
 * 
 * Este hook detecta esos parámetros y crea la suscripción automáticamente.
 */
export function usePayPalReturnHandler({ token, onSuccess, onError }: UsePayPalReturnHandlerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createSubscription } = useCreateSubscription(token);

  useEffect(() => {
    async function handlePayPalReturn() {
      // Solo ejecutar en el cliente
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams(window.location.search);
      const subscriptionStatus = urlParams.get('subscription');
      const setupIntentId = urlParams.get('setup_intent');
      const interval = urlParams.get('interval') as 'week' | 'month' | 'year' | null;

      // Verificar que tenemos todos los parámetros necesarios
      if (subscriptionStatus === 'pending' && setupIntentId && interval) {
        setIsProcessing(true);
        setError(null);

        try {
          console.log('Processing PayPal return with SetupIntent:', setupIntentId);
          
          // Crear la suscripción con el setup_intent_id
          const subscription = await createSubscription({
            interval,
            setup_intent_id: setupIntentId,
          });

          if (!subscription) {
            throw new Error('Failed to create subscription');
          }

          // Verificar el estado de la suscripción
          if (subscription.status === 'active' || subscription.status === 'incomplete') {
            console.log('Subscription created successfully:', subscription);
            
            // Limpiar los parámetros de la URL y redirigir a success
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('subscription', 'success');
            newUrl.searchParams.delete('setup_intent');
            newUrl.searchParams.delete('interval');
            newUrl.searchParams.delete('setup_intent_client_secret');
            newUrl.searchParams.delete('redirect_status');
            
            window.history.replaceState({}, '', newUrl.toString());
            onSuccess?.();
          } else {
            throw new Error(`Unexpected subscription status: ${subscription.status}`);
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to process PayPal payment';
          console.error('Error processing PayPal return:', err);
          setError(errorMessage);
          onError?.(errorMessage);
          
          // Limpiar los parámetros de la URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('subscription');
          newUrl.searchParams.delete('setup_intent');
          newUrl.searchParams.delete('interval');
          newUrl.searchParams.delete('setup_intent_client_secret');
          newUrl.searchParams.delete('redirect_status');
          
          window.history.replaceState({}, '', newUrl.toString());
        } finally {
          setIsProcessing(false);
        }
      }
    }

    handlePayPalReturn();
  }, [token]);

  return {
    isProcessing,
    error,
  };
}
