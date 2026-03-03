import type { FC } from 'react';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { useTranslations } from '@/i18n';

export interface StripeConnectButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  lang?: 'es' | 'en';
}

export const StripeConnectButton: FC<StripeConnectButtonProps> = ({ 
  onClick, 
  loading = false,
  disabled = false,
  lang,
}) => {
  const t = useTranslations(lang ? { lang } : undefined);

  return (
    <Button
      onClick={onClick}
      colorType="primary"
      disabled={loading || disabled}
      label={loading ? t('stripe.connecting') : t('stripe.connect_button')}
      icon={<Icon icon="wallet" iconWidth={20} iconHeight={20} />}
    />
  );
};
