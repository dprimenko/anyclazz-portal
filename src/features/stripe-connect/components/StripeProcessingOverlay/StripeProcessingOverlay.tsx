import { type FC } from 'react';
import { useTranslations } from '@/i18n';
import { Overlay } from '@/ui-library/components/overlay';
import { Spinner } from '@/ui-library/shared';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import type { ui } from '@/i18n/ui';
import stripeLogo from '@/assets/images/stripe.svg';

export interface StripeProcessingOverlayProps {
  mode: 'redirecting' | 'processing';
  lang?: keyof typeof ui;
}

export const StripeProcessingOverlay: FC<StripeProcessingOverlayProps> = ({ mode, lang = 'en' }) => {
  const t = useTranslations({ lang });

  const title = mode === 'redirecting'
    ? t('stripe.redirecting_to_stripe')
    : t('stripe.processing_connection');

  const description = mode === 'redirecting'
    ? t('stripe.redirecting_description')
    : t('stripe.processing_description');

  return (
    <Overlay className="!fixed inset-0 flex items-center justify-center bg-neutral-300/85 backdrop-blur-[10px] z-[9999] animate-in fade-in duration-200">
      <div className="flex items-center justify-center p-6 w-full">
        <div className="flex flex-col items-center gap-5 bg-white rounded-2xl px-6 py-10 md:px-12 shadow-[0_20px_60px_rgba(0,0,0,0.15),0_4px_16px_rgba(0,0,0,0.08)] max-w-sm w-full text-center">
          <div className="opacity-90">
            <img src={stripeLogo.src} alt="Stripe" width="120" height="50" />
          </div>

          <div className="flex items-center justify-center text-[#635BFF]">
            <Spinner className="w-12 h-12 [border-top-color:#635BFF]" />
          </div>

          <h2 className="text-lg font-semibold text-[var(--color-neutral-900,#111827)] m-0 leading-snug">
            {title}
          </h2>
          <p className="text-sm text-[var(--color-neutral-600,#4b5563)] m-0 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-[var(--color-neutral-500,#6b7280)] pt-1">
            <Icon icon="shield" iconColor="#6b7280" iconWidth={16} iconHeight={16} />
            <span>{t('stripe.secure_process')}</span>
          </div>
        </div>
      </div>
    </Overlay>
  );
};
