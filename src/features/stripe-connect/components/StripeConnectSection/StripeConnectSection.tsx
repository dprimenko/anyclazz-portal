import { type FC, useEffect } from 'react';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { useTranslations } from '@/i18n';
import { useStripeConnectStatus, useStripeConnectActions } from '../../hooks/useStripeConnect';
import { StripeStatusBadge } from '../StripeStatusBadge/StripeStatusBadge';
import { StripeConnectButton } from '../StripeConnectButton/StripeConnectButton';
import { StripeDashboardButton } from '../StripeDashboardButton/StripeDashboardButton';
import styles from './StripeConnectSection.module.css';

export interface StripeConnectSectionProps {
  accessToken: string;
  country?: string;
  lang?: 'es' | 'en';
}

export const StripeConnectSection: FC<StripeConnectSectionProps> = ({ 
  accessToken,
  country = 'US',
  lang,
}) => {
  const t = useTranslations(lang ? { lang } : undefined);
  const { status, isLoading, error: statusError, refetch } = useStripeConnectStatus(accessToken);
  const { startOnboarding, openDashboard, isProcessing, error: actionError } = useStripeConnectActions(accessToken);

  // Detectar si es mobile
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleConnect = async () => {
    const response = await startOnboarding(country);
    if (response?.onboarding_url) {
      if (isMobile) {
        // En móvil, redirigir en la misma ventana
        window.location.href = response.onboarding_url;
      } else {
        // En desktop, abrir en nueva ventana
        window.open(response.onboarding_url, '_blank');
      }
      
      // Refrescar el estado después de un breve delay
      setTimeout(() => {
        refetch();
      }, 2000);
    }
  };

  const handleOpenDashboard = async () => {
    const response = await openDashboard();
    if (response?.dashboard_url) {
      window.open(response.dashboard_url, '_blank');
    }
  };

  // Refrescar el estado cuando la ventana recupera el foco (usuario vuelve del onboarding)
  useEffect(() => {
    const handleFocus = () => {
      if (status?.connected && !status.can_receive_payments) {
        refetch();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [status, refetch]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Text size="text-lg" weight="semibold" colorType="primary">
            {t('stripe.title')}
          </Text>
          <Text size="text-md" colorType="tertiary">
            {t('common.loading')}...
          </Text>
        </div>
      </div>
    );
  }

  const error = statusError || actionError;
  const requirementsDue = status?.requirements?.currently_due?.length || 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Text size="text-lg" weight="semibold" colorType="primary">
            {t('stripe.title')}
          </Text>
          {status && (
            <StripeStatusBadge 
              status={status.status}
              canReceivePayments={status.can_receive_payments}
              requirementsDue={requirementsDue}
              lang={lang}
            />
          )}
        </div>
        <Text size="text-md" colorType="tertiary">
          {t('stripe.description')}
        </Text>
      </div>

      <Divider margin={16} />

      {error && (
        <div className={styles.errorAlert}>
          <Text size="text-sm" colorType="primary">
            {error}
          </Text>
        </div>
      )}

      {/* No conectado */}
      {status && !status.connected && (
        <div className={styles.notConnected}>
          <div className={styles.infoBox}>
            <Text size="text-md" weight="medium" colorType="primary">
              {t('stripe.not_connected_title')}
            </Text>
            <Text size="text-sm" colorType="secondary">
              {t('stripe.not_connected_description')}
            </Text>
            <ul className={styles.requirementsList}>
              <li>
                <Text size="text-sm" colorType="secondary">
                  {t('stripe.requirement_personal_info')}
                </Text>
              </li>
              <li>
                <Text size="text-sm" colorType="secondary">
                  {t('stripe.requirement_tax_info')}
                </Text>
              </li>
              <li>
                <Text size="text-sm" colorType="secondary">
                  {t('stripe.requirement_bank_account')}
                </Text>
              </li>
            </ul>
          </div>
          <div className={styles.actions}>
            <StripeConnectButton 
              onClick={handleConnect}
              loading={isProcessing}
              lang={lang}
            />
          </div>
        </div>
      )}

      {/* Conectado pero pendiente de información */}
      {status && status.connected && !status.can_receive_payments && requirementsDue > 0 && (
        <div className={styles.pendingInfo}>
          <div className={styles.warningBox}>
            <Text size="text-md" weight="medium" colorType="primary">
              {t('stripe.pending_info_title')}
            </Text>
            <Text size="text-sm" colorType="secondary">
              {t('stripe.pending_info_description', { count: requirementsDue })}
            </Text>
          </div>
          <div className={styles.actions}>
            <StripeConnectButton 
              onClick={handleConnect}
              loading={isProcessing}
              lang={lang}
            />
          </div>
        </div>
      )}

      {/* Conectado y en revisión */}
      {status && status.connected && !status.can_receive_payments && requirementsDue === 0 && (
        <div className={styles.underReview}>
          <div className={styles.infoBox}>
            <Text size="text-md" weight="medium" colorType="primary">
              {t('stripe.under_review_title')}
            </Text>
            <Text size="text-sm" colorType="secondary">
              {t('stripe.under_review_description')}
            </Text>
          </div>
        </div>
      )}

      {/* Conectado y activo */}
      {status && status.connected && status.can_receive_payments && (
        <div className={styles.connected}>
          <div className={styles.successBox}>
            <Text size="text-md" weight="medium" colorType="primary">
              {t('stripe.connected_title')}
            </Text>
            <Text size="text-sm" colorType="secondary">
              {t('stripe.connected_description')}
            </Text>
          </div>
          <div className={styles.actions}>
            <StripeDashboardButton 
              onClick={handleOpenDashboard}
              loading={isProcessing}
              lang={lang}
            />
          </div>
        </div>
      )}
    </div>
  );
};
