import type { FC } from 'react';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { useTranslations } from '@/i18n';

export interface StripeDashboardButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  lang?: 'es' | 'en';
}

export const StripeDashboardButton: FC<StripeDashboardButtonProps> = ({ 
  onClick, 
  loading = false,
  disabled = false,
  variant = 'secondary',
  lang,
}) => {
  const t = useTranslations(lang ? { lang } : undefined);

  return (
    <Button
      onClick={onClick}
      colorType={variant}
      disabled={loading || disabled}
      label={loading ? t('common.loading') : t('stripe.open_dashboard')}
      icon="stripe"
    />
  );
};
