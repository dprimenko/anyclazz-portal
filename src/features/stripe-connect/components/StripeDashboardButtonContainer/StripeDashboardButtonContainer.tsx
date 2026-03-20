import type { FC } from 'react';
import { useStripeConnectActions } from '../../hooks/useStripeConnect';
import { StripeDashboardButton } from '../StripeDashboardButton/StripeDashboardButton';

export interface StripeDashboardButtonContainerProps {
  accessToken: string;
  variant?: 'primary' | 'secondary';
  lang?: 'es' | 'en';
  disabled?: boolean;
}

/**
 * Contenedor para el botón de Dashboard de Stripe con lógica integrada
 * Maneja la apertura del dashboard y el estado de loading
 */
export const StripeDashboardButtonContainer: FC<StripeDashboardButtonContainerProps> = ({ 
  accessToken,
  variant = 'secondary',
  lang,
  disabled = false,
}) => {
  const { openDashboard, isProcessing } = useStripeConnectActions(accessToken);

  const handleOpenDashboard = async () => {
    const response = await openDashboard();
    if (response?.url) {
      window.open(response.url, '_blank');
    }
  };

  return (
    <StripeDashboardButton
      onClick={handleOpenDashboard}
      loading={isProcessing}
      disabled={disabled}
      variant={variant}
      lang={lang}
    />
  );
};
