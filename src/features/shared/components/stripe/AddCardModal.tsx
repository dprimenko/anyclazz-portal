import { useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { Modal } from '@/ui-library/components/modal/Modal';
import { Button } from '@/ui-library/shared/button';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Input } from '@/ui-library/shared/input';
import { getStripeErrorMessage } from '@/utils/stripeErrors';

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onCardAdded: (paymentMethodId: string) => void;
}

const STRIPE_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a1a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

export function AddCardModal({ open, onClose, onCardAdded }: AddCardModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardholderName.trim()) {
      setError('Please enter the cardholder name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error('Card element not found');
      }

      // Crear Payment Method con Stripe
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: cardholderName,
        },
      });

      if (stripeError) {
        throw new Error(getStripeErrorMessage(stripeError));
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Notificar al componente padre con el ID del payment method
      onCardAdded(paymentMethod.id);

      // Limpiar formulario
      setCardholderName('');
      cardNumberElement.clear();
      elements.getElement(CardExpiryElement)?.clear();
      elements.getElement(CardCvcElement)?.clear();

      // Cerrar modal
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add card');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      setError(null);
      setCardholderName('');
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
              Add new payment method
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
            Enter your card details.
          </Text>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <Text colorType="primary" size="text-sm">{error}</Text>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="cardholderName" className="text-sm font-medium text-primary">
                Name on card
              </label>
              <Input
                id="cardholderName"
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Olivia Rhye"
                disabled={loading}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cardNumber" className="text-sm font-medium text-primary">
                Card number
              </label>
              <div className="flex items-center h-10 px-3 py-2 border border-border rounded-md bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                <CardNumberElement
                  id="cardNumber"
                  options={STRIPE_ELEMENT_OPTIONS}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="cardExpiry" className="text-sm font-medium text-primary">
                  Expiry
                </label>
                <div className="flex items-center h-10 px-3 py-2 border border-border rounded-md bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                  <CardExpiryElement
                    id="cardExpiry"
                    options={STRIPE_ELEMENT_OPTIONS}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2" style={{ width: '120px' }}>
                <label htmlFor="cardCvc" className="text-sm font-medium text-primary">
                  CVV
                </label>
                <div className="flex items-center h-10 px-3 py-2 border border-border rounded-md bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                  <CardCvcElement
                    id="cardCvc"
                    options={STRIPE_ELEMENT_OPTIONS}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

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
                type="submit"
                variant="default"
                disabled={!stripe || loading}
                className="flex-1"
                style={{ backgroundColor: 'var(--color-primary-600)' }}
              >
                {loading ? 'Adding...' : 'Add card'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
