import { type FC, useState } from 'react';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Modal } from '@/ui-library/components/modal/Modal';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useTranslations } from '@/i18n';
import { createSetupIntent } from '@/services/stripe';
import { savePaymentMethod } from '@/services/paymentMethods';
import type { PaymentMethod } from '@/services/paymentMethods';
import { publish } from '@/features/shared/services/domainEventsBus';
import { SharedDomainEvents } from '@/features/shared/domain/events';
import { Checkbox } from '@/ui-library/shared/checkbox';
import { getStripeErrorMessage } from '@/utils/stripeErrors';

const stripeElementStyle = {
  base: {
    fontSize: '14px',
    color: '#1a1a1a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '::placeholder': { color: '#9ca3af' },
  },
  invalid: { color: '#ef4444' },
};

interface AddCardFormProps {
  accessToken: string;
  lang?: 'en' | 'es';
  onSuccess: (method: PaymentMethod) => void;
  onCancel: () => void;
}

function AddCardForm({ accessToken, lang = 'en', onSuccess, onCancel }: AddCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations({ lang });
  const [loading, setLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    setLoading(true);
    try {
      // 1. Create SetupIntent
      const { client_secret: clientSecret } = await createSetupIntent(accessToken);

      // 2. Confirm the SetupIntent
      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: { name: cardholderName || undefined },
        },
      });

      if (error) throw new Error(getStripeErrorMessage(error));
      if (!setupIntent?.payment_method) throw new Error('Setup failed');

      // 3. Save payment method in our backend
      const saved = await savePaymentMethod(accessToken, {
        stripe_payment_method_id: setupIntent.payment_method as string,
        set_as_default: setAsDefault,
      });

      publish(SharedDomainEvents.showToast, {
        message: t('payments.card_saved'),
        variant: 'success',
      });
      onSuccess(saved);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      publish(SharedDomainEvents.showToast, { message: msg, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Name on card */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Name on card
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="e.g. Olivia Rhye"
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDB022] focus:border-transparent"
        />
      </div>

      {/* Card number */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">{t('payments.card_details')}</label>
        <div className="px-3 py-2.5 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#FDB022] focus-within:border-transparent">
          <CardNumberElement options={{ style: stripeElementStyle }} />
        </div>
      </div>

      {/* Expiry + CVV */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">Expiry</label>
          <div className="px-3 py-2.5 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#FDB022] focus-within:border-transparent">
            <CardExpiryElement options={{ style: stripeElementStyle }} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">CVV</label>
          <div className="px-3 py-2.5 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#FDB022] focus-within:border-transparent">
            <CardCvcElement options={{ style: stripeElementStyle }} />
          </div>
        </div>
      </div>

      {/* Set as default checkbox */}
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          id="set-as-default-new"
          checked={setAsDefault}
          onCheckedChange={(v) => setSetAsDefault(Boolean(v))}
        />
        <span className="text-sm text-gray-700 select-none">{t('payments.save_as_default')}</span>
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          colorType="secondary"
          label={t('common.cancel')}
          onClick={onCancel}
          fullWidth
        />
        <Button
          type="submit"
          colorType="primary"
          disabled={loading || !stripe}
          label={loading ? t('payments.adding_card') : t('payments.add_card')}
          fullWidth
        />
      </div>
    </form>
  );
}

const stripePromise = loadStripe(
  import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    'pk_test_51SdvZdRpuaFax7XpwLl84SqWauVhApPg4eCmdm9BzdbTzK2vQBzACLJ5jTcqFuD0Wsrl3vXW8QXaYy0VHio1mAlq00zmj0s5ot'
);

interface AddPaymentMethodModalProps {
  accessToken: string;
  lang?: 'en' | 'es';
  onSuccess: (method: PaymentMethod) => void;
  onClose: () => void;
}

export const AddPaymentMethodModal: FC<AddPaymentMethodModalProps> = ({
  accessToken,
  lang = 'en',
  onSuccess,
  onClose,
}) => {
  const t = useTranslations({ lang });

  return (
    <Modal width={480} fitContent onClose={onClose} withCloseIcon>
      <div className="flex flex-col gap-5 bg-white rounded-2xl p-6 w-full">
        <div>
          <Text textLevel="h2" size="text-lg" weight="semibold" colorType="primary">
            {t('payments.add_method_title')}
          </Text>
          <Text size="text-sm" colorType="tertiary">
            {t('payments.add_method_subtitle')}
          </Text>
        </div>

        <Elements stripe={stripePromise}>
          <AddCardForm
            accessToken={accessToken}
            lang={lang}
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        </Elements>
      </div>
    </Modal>
  );
};
