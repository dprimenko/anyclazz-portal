import { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { Modal } from '@/ui-library/components/modal/Modal';
import { Button } from '@/ui-library/shared/button';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { getStripeErrorMessage } from '@/utils/stripeErrors';

interface AddPayPalModalProps {
  open: boolean;
  onClose: () => void;
  onPayPalAdded: (paymentMethodId: string) => void;
}

export function AddPayPalModal({ open, onClose, onPayPalAdded }: AddPayPalModalProps) {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddPayPal() {
    if (!stripe) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Crear Payment Method de tipo PayPal
      // Esto normalmente requiere redirección a PayPal para autenticación
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'paypal',
      });

      if (stripeError) {
        throw new Error(getStripeErrorMessage(stripeError));
      }

      if (!paymentMethod) {
        throw new Error('Failed to create PayPal payment method');
      }

      // Notificar al componente padre
      onPayPalAdded(paymentMethod.id);

      // Cerrar modal
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add PayPal');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      setError(null);
      onClose();
    }
  }

  if (!open) {
    return null;
  }

  return (
    <Modal onClose={handleClose} width={480}>
      <div className="flex flex-col h-full bg-white">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex justify-between items-center">
            <Text size="text-lg" weight="semibold" colorType="primary">
              Add PayPal
            </Text>
            <button 
              onClick={handleClose} 
              className="text-tertiary hover:text-primary transition-colors"
              disabled={loading}
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <Text size="text-sm" colorType="tertiary">
            You'll be redirected to PayPal to authorize the payment method.
          </Text>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <Text colorType="primary" size="text-sm">{error}</Text>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleAddPayPal}
              disabled={!stripe || loading}
              className="flex-1"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              {loading ? 'Connecting...' : 'Connect PayPal'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
