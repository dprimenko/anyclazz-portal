import { useState, useEffect } from 'react';
import { getPaymentMethods, savePaymentMethod, type PaymentMethod } from '@/services/paymentMethods';

export function usePaymentMethods(accessToken: string) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getPaymentMethods(accessToken)
      .then(setPaymentMethods)
      .catch((err) => {
        console.error('Failed to fetch payment methods:', err);
        setError(err instanceof Error ? err.message : 'Failed to load payment methods');
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleSavePaymentMethod = async (stripePaymentMethodId: string, setAsDefault = false) => {
    try {
      const saved = await savePaymentMethod(accessToken, {
        stripe_payment_method_id: stripePaymentMethodId,
        set_as_default: setAsDefault,
      });
      setPaymentMethods((prev) => [...prev, saved]);
      return saved;
    } catch (err) {
      console.error('Failed to save payment method:', err);
      throw err;
    }
  };

  return { paymentMethods, loading, error, savePaymentMethod: handleSavePaymentMethod };
}
