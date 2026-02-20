import { useEffect, useState } from 'react';
import { getPaymentMethods, savePaymentMethod } from '@/services/paymentMethods';
import type { PaymentMethod } from '@/services/paymentMethods';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { AddCardModal } from './AddCardModal';
import { AddPayPalModal } from './AddPayPalModal';
import { PaymentMethodSelector } from './PaymentMethodSelector';

interface PaymentMethodsListProps {
  token: string;
  onMethodSelected?: (methodId: string) => void;
  selectedMethodId?: string;
}

export function PaymentMethodsList({ token, onMethodSelected, selectedMethodId }: PaymentMethodsListProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddPayPalModal, setShowAddPayPalModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMethods();
  }, []);

  async function loadMethods() {
    try {
      setLoading(true);
      const data = await getPaymentMethods(token);
      setMethods(data);
    } catch (err) {
      console.error('Error loading payment methods:', err);
      setError(err instanceof Error ? err.message : 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  }

  async function handleCardAdded(stripePaymentMethodId: string) {
    try {
      setError(null);
      
      // Guardar en el backend
      const savedMethod = await savePaymentMethod(token, {
        stripe_payment_method_id: stripePaymentMethodId,
        set_as_default: methods.length === 0, // Si es la primera, marcarla como default
      });

      // Actualizar la lista
      setMethods([...methods, savedMethod]);
      
      // Si hay un callback, notificar
      if (onMethodSelected) {
        onMethodSelected(savedMethod.payment_method_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save payment method');
    }
  }

  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'visa';
      case 'mastercard':
        return 'mastercard';
      default:
        return 'wallet';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-tertiary">Loading payment methods...</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <Text colorType="primary" size="text-sm">{error}</Text>
        </div>
      )}

      {/* Lista de métodos de pago */}
      <div className="flex flex-col gap-2">
        {methods.map((method) => (
          <label 
            key={method.payment_method_id} 
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
              selectedMethodId === method.payment_method_id 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Radio button */}
              <input
                type="radio"
                name="payment-method"
                value={method.payment_method_id}
                checked={selectedMethodId === method.payment_method_id}
                onChange={() => onMethodSelected?.(method.payment_method_id)}
                className="w-5 h-5 text-primary-orange focus:ring-primary-orange"
              />

              {/* Icono de la tarjeta/método */}
              <div className="flex items-center justify-center w-12 h-8">
                {method.type === 'card' ? (
                  <Icon icon={getCardIcon(method.card_brand)} iconWidth={48} iconHeight={32} />
                ) : method.type === 'paypal' ? (
                  <Icon icon="paypal" iconWidth={48} iconHeight={32} />
                ) : null}
              </div>

              {/* Información del método */}
              <div className="flex flex-col gap-0.5">
                <Text weight="medium" colorType="primary" size="text-sm">
                  {method.type === 'card' ? (
                    `${method.card_brand?.charAt(0).toUpperCase()}${method.card_brand?.slice(1)} ending in ${method.card_last4}`
                  ) : method.type === 'paypal' ? (
                    method.paypal_email
                  ) : (
                    'Payment method'
                  )}
                </Text>
                {method.type === 'card' && method.card_exp_month && method.card_exp_year && (
                  <Text size="text-xs" colorType="tertiary">
                    Expiry {method.card_exp_month.toString().padStart(2, '0')}/{method.card_exp_year}
                  </Text>
                )}
                {method.is_expired && (
                  <Text size="text-xs" colorType="primary">Expired</Text>
                )}
              </div>
            </div>

            {/* Indicador de selección (opcional, ya tenemos el radio) */}
            {selectedMethodId === method.payment_method_id && (
              <div className="text-primary ml-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 10l2.5 2.5L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Botón para añadir nuevo método de pago */}
      <button 
        className="flex items-center gap-2 p-3 text-primary hover:text-primary/80 transition-colors w-full justify-start"
        onClick={() => setShowSelector(true)}
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <Text size="text-sm" weight="medium">
          Add new payment method
        </Text>
      </button>

      {/* Selector de tipo de método de pago */}
      <PaymentMethodSelector
        open={showSelector}
        onClose={() => setShowSelector(false)}
        onSelectCard={() => setShowAddCardModal(true)}
        onSelectPayPal={() => setShowAddPayPalModal(true)}
      />

      {/* Modal para añadir tarjeta */}
      <AddCardModal 
        open={showAddCardModal} 
        onClose={() => setShowAddCardModal(false)}
        onCardAdded={handleCardAdded}
      />

      {/* Modal para añadir PayPal */}
      <AddPayPalModal
        open={showAddPayPalModal}
        onClose={() => setShowAddPayPalModal(false)}
        onPayPalAdded={handleCardAdded}
      />
    </div>
  );
}
