import { type FC, useEffect, useState } from 'react';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { useTranslations } from '@/i18n';
import type { ui } from '@/i18n/ui';
import { useStripeConnectStatus, useStripeConnectActions } from '../../hooks/useStripeConnect';
import type { StripeConnectStatusResponse } from '../../domain/types';
import { StripeConnectButton } from '../StripeConnectButton/StripeConnectButton';
import { ProgressIndicator } from '@/ui-library/components/progress-indicator/ProgressIndicator';
import { Notification } from '@/ui-library/components/notification/Notification';

export interface StripeConnectSectionProps {
  accessToken: string;
  country?: string;
  initialStatus?: StripeConnectStatusResponse | null;
  oauthCode?: string | null;
  oauthState?: string | null;
  oauthError?: string | null;
  lang?: keyof typeof ui;
}

export const StripeConnectSection: FC<StripeConnectSectionProps> = ({ 
  accessToken,
  country = 'US',
  initialStatus,
  oauthCode,
  oauthState,
  oauthError,
  lang = 'en',
}) => {
  const t = useTranslations({ lang });
  const { status, isLoading, error: statusError, refetch } = useStripeConnectStatus(accessToken, true, initialStatus);
  const { startOnboarding, completeOAuth, isProcessing, error: actionError } = useStripeConnectActions(accessToken);
  const [oauthProcessed, setOauthProcessed] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Detectar si es mobile
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Manejar OAuth callback
  useEffect(() => {
    if (oauthProcessed) return;

    const handleOAuthCallback = async () => {
      // Error en OAuth
      if (oauthError) {
        console.error('OAuth error:', oauthError);
        setOauthProcessed(true);
        return;
      }

      // Completar OAuth exitoso
      if (oauthCode && oauthState) {
        setOauthProcessed(true);
        
        try {
          const result = await completeOAuth(oauthCode, oauthState);
          
          if (result?.success) {
            setSuccessMessage(t('stripe.connected_success'));
            // Refrescar el estado después de completar OAuth
            await refetch();
          }
        } catch (error) {
          console.error('Error completing OAuth:', error);
        }
      }
    };

    handleOAuthCallback();
  }, [oauthCode, oauthState, oauthError, completeOAuth, refetch, oauthProcessed, t]);

  const handleConnect = async () => {
    const response = await startOnboarding(country);
    
    console.log('Stripe onboarding response:', response);
    
    if (response?.message === 'Account already connected') {
      // Cuenta ya conectada - refrescar estado y verificar
      await refetch();
      
      // Si la cuenta está restringida, sugerir ir al dashboard
      if (response.status === 'restricted' || status?.needs_reconnection) {
        // Si hay onboarding_url, podría ser un link para actualizar
        if (response.onboarding_url) {
          window.location.href = response.onboarding_url;
        } else {
          // Sugerir ir al dashboard de Stripe directamente
          alert(t('stripe.go_to_dashboard_message'));
          window.open('https://dashboard.stripe.com', '_blank');
        }
      }
      return;
    }
    
    if (response?.onboarding_url) {
      // Guardar state en sessionStorage para validación (opcional)
      if (response.state) {
        sessionStorage.setItem('stripe_oauth_state', response.state);
      }
      
      // Redirigir a Stripe OAuth
      window.location.href = response.onboarding_url;
    }
  };

  // Limpiar mensaje de éxito después de un tiempo
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <ProgressIndicator size="lg" />
      </div>
    );
  }

  const error = statusError || actionError || (oauthError ? t('stripe.oauth_error') : null);
  const requirementsDue = status?.requirements?.currently_due?.length || 0;
  const pastDue = status?.requirements?.past_due?.length || 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Mensaje de éxito OAuth */}
      {successMessage && (
        <Notification 
          colorType="success" 
          text={`✓ ${successMessage}`}
          onClose={() => setSuccessMessage(null)}
          closable
        />
      )}

      {/* Error general */}
      {error && (
        <Notification 
          colorType="error" 
          text={`✕ ${error}`}
          onClose={() => {}}
        />
      )}

      {/* Cuenta NO conectada */}
      {status && !status.connected && (
        <Notification 
          colorType="info" 
          text={t('stripe.not_connected_description')}
          actions={(
            <StripeConnectButton 
              onClick={handleConnect}
              loading={isProcessing}
            />
          )}
          onClose={() => {}}
        />
      )}

      {/* Cuenta necesita reconexión */}
      {status?.needs_reconnection && (
        <Notification 
          colorType="warning" 
          text={`⚠ ${t('stripe.needs_reconnection')}`}
          actions={(
            <StripeConnectButton 
              onClick={handleConnect}
              loading={isProcessing}
            />
          )}
          onClose={() => {}}
        />
      )}

      {/* Información urgente vencida */}
      {status && status.connected && pastDue > 0 && (
        <Notification 
          colorType="error" 
          text={`✕ ${t('stripe.past_due_requirements', { count: pastDue })}`}
          actions={(
            <StripeConnectButton 
              onClick={handleConnect}
              loading={isProcessing}
            />
          )}
          onClose={() => {}}
        />
      )}

      {/* Conectado pero pendiente de información */}
      {status && status.connected && !status.can_receive_payments && requirementsDue > 0 && pastDue === 0 && (
        <Notification 
          colorType="secondary" 
          text={t('stripe.pending_info_description', { count: requirementsDue })}
          actions={(
            <StripeConnectButton 
              onClick={handleConnect}
              loading={isProcessing}
            />
          )} 
          onClose={() => {}}
        />
      )}

      {/* Cuenta restringida sin requisitos específicos mostrados */}
      {status && status.connected && status.status === 'restricted' && !status.needs_reconnection && pastDue === 0 && requirementsDue === 0 && (
        <Notification 
          colorType="warning" 
          text={t('stripe.account_restricted_message')}
          actions={(
            <StripeConnectButton 
              onClick={handleConnect}
              loading={isProcessing}
            />
          )}
          onClose={() => {}}
        />
      )}

      {/* Conectado y en revisión */}
      {status && status.connected && !status.can_receive_payments && requirementsDue === 0 && pastDue === 0 && !status.needs_reconnection && (
        <Notification 
          colorType="info" 
          text={`⏳ ${t('stripe.under_review_description')}`}
          onClose={() => {}}
        />
      )}
    </div>
  );
};
