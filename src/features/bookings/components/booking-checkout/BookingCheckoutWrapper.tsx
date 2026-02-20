import { useState } from 'react';
import { BookingCheckout } from './BookingCheckout';
import { Modal } from '@/ui-library/components/modal/Modal';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useTranslations } from '@/i18n';

interface BookingCheckoutWrapperProps {
  bookingId: string;
  amount: number;
  currency: string;
  token: string;
  lang?: 'en' | 'es';
}

export function BookingCheckoutWrapper({ bookingId, amount, currency, token, lang = 'en' }: BookingCheckoutWrapperProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations({ lang });

  const handleSuccess = () => {
    setShowSuccessModal(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    console.error('Payment error:', errorMessage);
  };

  const handleGoToAgenda = () => {
    window.location.href = '/me/my-agenda';
  };

  return (
    <>
      <BookingCheckout
        bookingId={bookingId}
        amount={amount}
        currency={currency}
        token={token}
        onSuccess={handleSuccess}
        onError={handleError}
        lang={lang}
      />

      {showSuccessModal && (
        <Modal width={480} persistent>
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
