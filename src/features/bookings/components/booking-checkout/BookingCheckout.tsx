import { useState } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getStripeErrorMessage } from '@/utils/stripeErrors';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { formatPrice } from '@/features/shared/utils/formatPrice';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useTranslations } from '@/i18n';
import { publish } from '@/features/shared/services/domainEventsBus';
import { SharedDomainEvents } from '@/features/shared/domain/events';
import { Checkbox } from '@/ui-library/shared/checkbox';
import type { PaymentMethod } from '@/services/paymentMethods';

interface BookingCheckoutProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  lang?: 'en' | 'es';
  requiresAction?: boolean;
  selectedSavedMethod?: PaymentMethod | null;
  saveForFuture?: boolean;
  onSaveForFutureChange?: (value: boolean) => void;
  accessToken?: string;
  stripeAccountId?: string | null;
}

const cardElementStyle = {
  base: {
    fontSize: '14px',
    color: '#1a1a1a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '::placeholder': { color: '#9ca3af' },
  },
  invalid: { color: '#ef4444' },
};

function CheckoutForm({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onError,
  lang = 'en',
  requiresAction = false,
  selectedSavedMethod,
  saveForFuture = false,
  onSaveForFutureChange,
  accessToken,
}: BookingCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const t = useTranslations({ lang });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe) {
      const errorMessage = 'Stripe is not initialized';
      publish(SharedDomainEvents.showToast, { message: errorMessage, variant: 'error' });
      onError(errorMessage);
      return;
    }

    setLoading(true);

    try {
      // Flow: 3DS confirmation required by backend
      if (requiresAction && clientSecret && !selectedSavedMethod) {
        const { error: paymentError } = await stripe.confirmCardPayment(clientSecret);
        if (paymentError) throw new Error(getStripeErrorMessage(paymentError));
        onSuccess();
        return;
      }

      // Flow: pay with a saved payment method
      if (selectedSavedMethod) {
        if (!selectedSavedMethod.stripe_payment_method_id) {
          throw new Error('Saved payment method has no Stripe ID');
        }
        const pmId = selectedSavedMethod.stripe_payment_method_id;

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: pmId,
        });
        if (error) throw new Error(getStripeErrorMessage(error));
        if (paymentIntent?.status === 'requires_action') {
          const { error: actionError } = await stripe.confirmCardPayment(clientSecret);
          if (actionError) throw new Error(getStripeErrorMessage(actionError));
        }

        onSuccess();
        return;
      }

      // Flow: new card via PaymentElement
      if (!elements) throw new Error('Payment form not ready');

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: 'if_required',
      });
      if (confirmError) throw new Error(getStripeErrorMessage(confirmError));

      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      publish(SharedDomainEvents.showToast, { message: errorMessage, variant: 'error' });
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const isUsingNewMethod = !selectedSavedMethod;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
      {isUsingNewMethod && (
        <div id="stripe_payment_methods">
          <PaymentElement
            options={{
              layout: {
                type: 'tabs',
                defaultCollapsed: false,
              },
            }}
          />
        </div>
      )}

      {isUsingNewMethod && onSaveForFutureChange && (
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            id="save-for-future"
            checked={saveForFuture}
            onCheckedChange={(checked) => onSaveForFutureChange(Boolean(checked))}
          />
          <span className="text-sm text-gray-700 select-none">
            {t('checkout.save_for_future')}
          </span>
        </label>
      )}

      <Button
        type="submit"
        colorType="primary"
        size="lg"
        disabled={!stripe || loading}
        label={
          loading
            ? t('subscription.processing')
            : `${t('subscription.confirm_payment')} • ${formatPrice(amount, currency, lang)}`
        }
        fullWidth
      />

      <div className="flex flex-col items-center gap-1.5 pt-1">
        <Text size="text-xs" colorType="tertiary" className="text-center">
          {t('subscription.refund_policy')}
        </Text>
        <div className="flex items-center gap-1.5">
          <Icon icon="shield" iconWidth={12} iconHeight={12} className="text-[var(--color-neutral-400)]" />
          <span className="text-xs text-[var(--color-neutral-400)]">Powered by</span>
          <Icon icon="stripe" iconWidth={36} iconHeight={15} className="text-[var(--color-neutral-400)]" />
        </div>
      </div>
    </form>
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

export function BookingCheckout({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onError,
  lang = 'en',
  requiresAction = false,
  selectedSavedMethod,
  saveForFuture,
  onSaveForFutureChange,
  accessToken,
  stripeAccountId,
}: BookingCheckoutProps) {
  if (!clientSecret) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
        <Text colorType="primary" size="text-sm">Payment initialization failed</Text>
      </div>
    );
  }

  const stripePromise = stripeAccountId
    ? loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY, { stripeAccount: stripeAccountId })
    : loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm
        lang={lang}
        clientSecret={clientSecret}
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
        requiresAction={requiresAction}
        selectedSavedMethod={selectedSavedMethod}
        saveForFuture={saveForFuture}
        onSaveForFutureChange={onSaveForFutureChange}
        accessToken={accessToken}
      />
    </Elements>
  );
}
