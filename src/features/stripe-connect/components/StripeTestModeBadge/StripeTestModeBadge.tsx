import type { FC } from 'react';
import { useTranslations } from '@/i18n';

export interface StripeTestModeBadgeProps {
  lang?: 'es' | 'en';
}

/**
 * Badge que indica cuando Stripe está en modo test/desarrollo
 * Solo se muestra si la clave pública comienza con 'pk_test_'
 */
export const StripeTestModeBadge: FC<StripeTestModeBadgeProps> = ({ lang }) => {
  const t = useTranslations(lang ? { lang } : undefined);
  
  // Detectar si estamos en modo test
  const publishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const isTestMode = publishableKey?.startsWith('pk_test_');

  // No mostrar nada si estamos en producción
  if (!isTestMode) return null;

  return (
    <div
      style={{
        padding: '8px 12px',
        background: '#ff9800',
        color: 'white',
        borderRadius: '4px',
        marginBottom: '16px',
        fontSize: '14px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      role="alert"
      aria-label="Stripe test mode indicator"
    >
      <span>🧪</span>
      <span>{t('stripe.test_mode_badge')}</span>
    </div>
  );
};
