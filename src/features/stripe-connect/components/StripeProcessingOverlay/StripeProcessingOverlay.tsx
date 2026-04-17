import { type FC } from 'react';
import { useTranslations } from '@/i18n';
import { Overlay } from '@/ui-library/components/overlay';
import { Spinner } from '@/ui-library/shared';
import type { ui } from '@/i18n/ui';
import styles from './StripeProcessingOverlay.module.css';

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
    <Overlay className={styles.stripeOverlay}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.stripeLogo}>
            <svg viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" width="60" height="25" aria-label="Stripe">
              <path
                fill="#635BFF"
                d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.87zm-4.32 14.29c.98 0 2.1-.33 3.1-.78v3.5a8.34 8.34 0 0 1-3.77.82c-3.58 0-5.46-2.46-5.46-7.4V8.62h-2.96V5.57h2.96V2.04l4.12-.88v4.41h4.12v3.05h-4.12v6.3c0 1.98.84 2.74 1.99 2.74zm-11.7 1.15c-1.5 0-2.65-.84-3.04-1.36l-.06 1.07H5.1V.6l4.12-.87.01 5.37a4.91 4.91 0 0 1 3.12-1.09c3.07 0 5.61 2.74 5.61 7.4 0 5.23-2.57 7.6-5.74 7.6zm-.9-11.27c-.94 0-1.54.34-1.96.8l.02 6.08c.4.46 1 .8 1.94.8 1.51 0 2.52-1.65 2.52-3.87 0-2.14-1.03-3.81-2.52-3.81zM0 17.37l.01-16.8 4.12-.88V17.2c0 .1-.04.17-.13.17H0z"
              />
            </svg>
          </div>

          <div className={styles.spinnerWrapper}>
            <Spinner className="w-12 h-12 [border-top-color:#635BFF]" />
          </div>

          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>

          <div className={styles.secureNotice}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" aria-hidden="true">
              <path d="M12 2L4 5v6c0 5.25 3.41 10.16 8 11.38C16.59 21.16 20 16.25 20 11V5l-8-3z" fill="currentColor" opacity="0.7"/>
            </svg>
            <span>{t('stripe.secure_process')}</span>
          </div>
        </div>
      </div>
    </Overlay>
  );
};
