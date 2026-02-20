import { useEffect, useState } from 'react';
import { createPaymentIntent } from '@/services/stripe';

interface UsePayPalBookingReturnHandlerProps {
  token: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Hook para manejar el retorno de PayPal después de confirmar el SetupIntent para bookings.
 * 
 * Cuando el usuario aprueba el pago en PayPal, Stripe redirige de vuelta a:
 * /me/my-agenda?payment=pending&booking_id=xxx&setup_intent=seti_xxx
 * 
 * Este hook detecta esos parámetros y crea el payment intent automáticamente.
 */
export function usePayPalBookingReturnHandler({ token, onSuccess, onError }: UsePayPalBookingReturnHandlerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handlePayPalReturn() {
      // Solo ejecutar en el cliente
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      const setupIntentId = urlParams.get('setup_intent');
      const bookingId = urlParams.get('booking_id');

      // Verificar que tenemos todos los parámetros necesarios
      if (paymentStatus === 'pending' && setupIntentId && bookingId) {
        setIsProcessing(true);
        setError(null);

        try {
          console.log('Processing PayPal return for booking with SetupIntent:', setupIntentId);
          
          // Crear el payment intent con el setup_intent_id
          const paymentIntent = await createPaymentIntent(token, bookingId, setupIntentId);

          if (!paymentIntent) {
            throw new Error('Failed to create payment intent');
          }

          // Verificar el estado del payment intent
          if (paymentIntent.status === 'succeeded') {
            console.log('Payment completed successfully:', paymentIntent);
            
            // Limpiar los parámetros de la URL y redirigir a success
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('payment', 'success');
            newUrl.searchParams.delete('setup_intent');
            newUrl.searchParams.delete('booking_id');
            newUrl.searchParams.delete('setup_intent_client_secret');
            newUrl.searchParams.delete('redirect_status');
            
            window.history.replaceState({}, '', newUrl.toString());
            onSuccess?.();
          } else if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_confirmation') {
            // Este caso no debería ocurrir con PayPal, pero lo manejamos
            console.log('Payment requires additional action');
            throw new Error('Payment requires additional confirmation');
          } else {
            throw new Error(`Unexpected payment intent status: ${paymentIntent.status}`);
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to process PayPal payment';
          console.error('Error processing PayPal return:', err);
          setError(errorMessage);
          onError?.(errorMessage);
          
          // Limpiar los parámetros de la URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('payment');
          newUrl.searchParams.delete('setup_intent');
          newUrl.searchParams.delete('booking_id');
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
