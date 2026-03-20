import type { FC } from 'react';
import type { StripeAccountStatus } from '../../domain/types';
import styles from './StripeStatusBadge.module.css';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { useTranslations } from '@/i18n';
import { Chip } from '@/ui-library/components/ssr/chip/Chip';
import { Text } from '@/ui-library/components/ssr/text/Text';
import type { ColorType } from '@/ui-library/shared/constants';

export interface StripeStatusBadgeProps {
  status: StripeAccountStatus;
  canReceivePayments: boolean;
  requirementsDue?: number;
  lang?: 'es' | 'en';
}

export const StripeStatusBadge: FC<StripeStatusBadgeProps> = ({ 
  status, 
  canReceivePayments,
  requirementsDue = 0,
  lang,
}) => {
  const t = useTranslations(lang ? { lang } : undefined);

  const getStatusConfig = () => {
    if (status === 'not_connected') {
      return {
        label: t('stripe.status.not_connected'),
        colorType: "secondary" as ColorType,
        icon: 'alert-circle' as const,
      };
    }

    if (canReceivePayments && status === 'enabled') {
      return {
        label: t('stripe.status.enabled'),
        colorType: "primary" as ColorType,
        icon: 'check-rounded' as const,
        iconColor: '#F4A43A',
      };
    }

    if (requirementsDue > 0) {
      return {
        label: t('stripe.status.pending_info'),
        colorType: "secondary" as ColorType,
        icon: 'alert-circle' as const,
      };
    }

    if (status === 'pending') {
      return {
        label: t('stripe.status.under_review'),
        colorType: "secondary" as ColorType,
        icon: 'alert-circle' as const,
      };
    }

    if (status === 'restricted' || status === 'disabled') {
      return {
        label: t('stripe.status.restricted'),
        colorType: "secondary" as ColorType,
        icon: 'alert-circle' as const,
      };
    }

    return {
      label: t('stripe.status.unknown'),
      colorType: "secondary" as ColorType,
      icon: 'alert-circle' as const,
    };
  };

  const config = getStatusConfig();

  return (
    <Chip colorType={config.colorType} size="sm">
        <div className="flex items-center justify-center gap-2">
          <Icon icon={config.icon} iconColor={config.iconColor} iconWidth={16} iconHeight={16} />
          <Text size="text-sm" colorType="secondary" weight='medium'>
            {config.label}
          </Text>
        </div>
    </Chip>
  );
};
