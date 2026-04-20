import { useState, useEffect } from 'react';
import { BookingCheckout } from './BookingCheckout';
import { SavedPaymentMethods } from './SavedPaymentMethods';
import { Modal } from '@/ui-library/components/modal/Modal';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useTranslations } from '@/i18n';
import { usePaymentMethods } from '@/features/bookings/hooks/usePaymentMethods';
import { createSetupIntent } from '@/services/stripe';

interface BookingCheckoutWrapperProps {
  clientSecret: string;
  amount: number;
  currency: string;
  accessToken: string;
  lang?: 'en' | 'es';
  bookingDate?: string;
  bookingId?: string;
  requiresAction?: boolean;
}

export function BookingCheckoutWrapper({
  clientSecret,
  amount,
  currency,
  accessToken,
  lang = 'en',
  bookingDate,
  bookingId,
  requiresAction = false,
}: BookingCheckoutWrapperProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [saveForFuture, setSaveForFuture] = useState(false);
  const [setupClientSecret, setSetupClientSecret] = useState<string | null>(null);
  const [setupIntentReady, setSetupIntentReady] = useState(false);

  const { paymentMethods, loading: loadingMethods } = usePaymentMethods(accessToken);

  // Pre-select the default payment method once loaded
  useEffect(() => {
    if (selectedPaymentMethodId === null && paymentMethods.length > 0) {
      const defaultMethod = paymentMethods.find((m) => m.is_default) ?? paymentMethods[0];
      setSelectedPaymentMethodId(defaultMethod.payment_method_id);
    }
  }, [paymentMethods]);

  useEffect(() => {
    createSetupIntent(accessToken, 'payment_method')
      .then(({ client_secret }) => setSetupClientSecret(client_secret))
      .catch(() => {/* non-blocking: checkout will fall back to confirmPayment */})
      .finally(() => setSetupIntentReady(true));
  }, [accessToken]);

  const t = useTranslations({ lang });

  const selectedSavedMethod =
    selectedPaymentMethodId !== null
      ? (paymentMethods.find((m) => m.payment_method_id === selectedPaymentMethodId) ?? null)
      : null;

  const handleSuccess = () => {
    setShowSuccessModal(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    console.error('Payment error:', errorMessage);
  };

  const handleGoToAgenda = () => {
    const params = new URLSearchParams();
    if (bookingDate) params.set('day', bookingDate.slice(0, 10));
    if (bookingId) params.set('bookingId', bookingId);
    const query = params.toString();
    window.location.href = query ? `/me/my-agenda?${query}` : '/me/my-agenda';
  };

  return (
    <>
      {paymentMethods.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          <Text size="text-sm" weight="medium" colorType="secondary" className="mb-1">
            {t('checkout.saved_payment_methods')}
          </Text>
          <SavedPaymentMethods
            paymentMethods={paymentMethods}
            selectedId={selectedPaymentMethodId}
            onSelect={setSelectedPaymentMethodId}
            lang={lang}
          />
        </div>
      )}

      {(!setupIntentReady || loadingMethods) ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#FDB022] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <BookingCheckout
          clientSecret={clientSecret}
          setupClientSecret={setupClientSecret ?? undefined}
          amount={amount}
          currency={currency}
          onSuccess={handleSuccess}
          onError={handleError}
          lang={lang}
          requiresAction={requiresAction}
          selectedSavedMethod={selectedSavedMethod}
          saveForFuture={saveForFuture}
          onSaveForFutureChange={setSaveForFuture}
          accessToken={accessToken}
        />
      )}

      {showSuccessModal && (
        <Modal width={480} persistent fitContent>
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl gap-6">
            <div className="w-[48px] h-[48px] bg-[#FFF4E7] rounded-full flex items-center justify-center">
              <Icon icon="check-rounded" iconWidth={20} iconHeight={20} />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Text textLevel="h2" size="text-lg" weight="semibold" colorType="primary">
                {t('booking.payment_successful')} 🎉
              </Text>
              <Text size="text-sm" colorType="secondary">
                {t('booking.payment_successful_message')}
              </Text>
            </div>
            <Button
              colorType="primary"
              label={t('booking.go_to_agenda')}
              onClick={handleGoToAgenda}
              fullWidth
            />
          </div>
        </Modal>
      )}
    </>
  );
}

