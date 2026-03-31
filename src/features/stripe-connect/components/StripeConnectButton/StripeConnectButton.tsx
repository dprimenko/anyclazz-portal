import type { FC } from 'react';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { useTranslations } from '@/i18n';

export interface StripeConnectButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const StripeConnectButton: FC<StripeConnectButtonProps> = ({ 
  onClick, 
  loading = false,
  disabled = false,
}) => {
  const t = useTranslations();

  return (
    <Button
      onClick={onClick}
      colorType="primary"
      disabled={loading || disabled}
      label={loading ? t('stripe.connecting') : t('stripe.connect_button')}
      icon="stripe"
      iconColor='#FFFFFF'
    />
  );
};
