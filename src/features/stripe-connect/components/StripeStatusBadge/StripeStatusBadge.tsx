import type { FC } from 'react';
import type { StripeAccountStatus } from '../../domain/types';
import styles from './StripeStatusBadge.module.css';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { useTranslations } from '@/i18n';

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
        colorClass: styles.statusGray,
        icon: 'alert-circle' as const,
      };
    }

    if (canReceivePayments && status === 'enabled') {
      return {
        label: t('stripe.status.enabled'),
        colorClass: styles.statusGreen,
        icon: 'check-rounded' as const,
      };
    }

    if (requirementsDue > 0) {
      return {
        label: t('stripe.status.pending_info'),
        colorClass: styles.statusYellow,
        icon: 'alert-circle' as const,
      };
    }

    if (status === 'pending') {
      return {
        label: t('stripe.status.under_review'),
        colorClass: styles.statusBlue,
        icon: 'alert-circle' as const,
      };
    }

    if (status === 'restricted' || status === 'disabled') {
      return {
        label: t('stripe.status.restricted'),
        colorClass: styles.statusRed,
        icon: 'alert-circle' as const,
      };
    }

    return {
      label: t('stripe.status.unknown'),
      colorClass: styles.statusGray,
      icon: 'alert-circle' as const,
    };
  };

  const config = getStatusConfig();

  return (
    <div className={`${styles.badge} ${config.colorClass}`}>
      <Icon icon={config.icon} iconWidth={16} iconHeight={16} />
      <span className={styles.label}>{config.label}</span>
    </div>
  );
};
