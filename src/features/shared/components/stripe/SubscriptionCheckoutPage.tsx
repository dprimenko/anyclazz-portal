import { useState, useEffect } from 'react';
import { getSuperTutorPlan } from '@/services/stripe';
import { SubscriptionCheckout } from './SubscriptionCheckout';
import type { StripePlan } from '@/services/stripe';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Card } from '@/ui-library/components/ssr/card/Card';
import { formatPrice } from '../../utils/formatPrice';
import { useTranslations } from '@/i18n';

interface SubscriptionCheckoutPageProps {
  interval: 'week' | 'month' | 'year';
  accessToken: string;
  lang: 'en' | 'es';
}

export function SubscriptionCheckoutPage({ interval, accessToken, lang }: SubscriptionCheckoutPageProps) {
  const [plan, setPlan] = useState<StripePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations({ lang });

  console.log('SubscriptionCheckoutPage mounted', { interval, accessToken: accessToken?.substring(0, 20), lang });

  useEffect(() => {
    console.log('useEffect running', { interval, accessToken: accessToken?.substring(0, 20) });
    
    async function loadPlan() {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading plan:', interval);
        const planData = await getSuperTutorPlan(accessToken, interval);
        console.log('Plan loaded:', planData);
        setPlan(planData);
      } catch (err) {
        console.error('Error loading plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to load plan');
      } finally {
        setLoading(false);
      }
    }
    
    if (accessToken && interval) {
      console.log('Calling loadPlan...');
      loadPlan();
    } else {
      console.log('Missing required data:', { accessToken: !!accessToken, interval });
    }
  }, [interval, accessToken]);

  function handleSuccess(subscriptionId: string) {
    console.log('Subscription created successfully:', subscriptionId);
    // Redirigir a página de perfil con mensaje de éxito
    window.location.href = '/profile?tab=super_tutor&subscription=success';
  }

  function handleError(errorMessage: string) {
    setError(errorMessage);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-center">
        <Text colorType="tertiary">{t('subscription.loading')}</Text>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex items-center justify-center p-12 text-center">
        <Text colorType="primary">{error || t('subscription.failed_to_load_data')}</Text>
      </div>
    );
  }

  const intervalText = interval === 'week' ? t('subscription.weekly') : interval === 'month' ? t('subscription.monthly') : t('subscription.annually');
  const renewalText = interval === 'week' 
    ? t('subscription.auto_renews_weekly')
    : interval === 'month' 
      ? t('subscription.auto_renews_monthly') 
      : t('subscription.auto_renews_yearly');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex flex-col gap-5">
        {/* Plan Details */}
        <Card className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Text size="text-md" weight="medium" colorType="primary">
                    {t('subscription.upgrade_to_super_tutor')}
                </Text>
                <Text size="text-md" colorType="tertiary">
                    {t('subscription.get_verified_badge')}
                </Text>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <Text colorType="secondary" size="text-md">{t('subscription.plan')}</Text>
                    <Text weight="medium" colorType="primary">{plan.product.name}</Text>
                </div>
                <div className="flex justify-between items-center">
                    <Text colorType="secondary" size="text-md">{t('subscription.billing')}</Text>
                    <Text weight="medium" colorType="primary">
                    {formatPrice(plan.amount, plan.currency, lang)} / {interval}
                    </Text>
                </div>
                <div className="flex justify-between items-center">
                    <Text colorType="secondary" size="text-md">{t('subscription.renewal')}</Text>
                    <Text weight="medium" colorType="primary">{renewalText}</Text>
                </div>
                <div className="flex justify-between items-center">
                    <Text colorType="secondary" size="text-md">{t('subscription.badge_activation')}</Text>
                    <Text weight="medium" colorType="primary">{t('subscription.instantly_after_payment')}</Text>
                </div>
            </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-5 flex flex-col gap-4">
          <Text size="text-md" colorType="primary" weight="medium">
            {t('subscription.order_summary')}
          </Text>
          <div className='flex flex-col'>
            <div className="flex justify-between items-center">
                <Text colorType="secondary" size="text-md">{t('subscription.billing')}</Text>
                <Text colorType="primary" size='text-md'>
                {formatPrice(plan.amount, plan.currency, lang)}
                </Text>
            </div>
            <Divider margin={10} />
            <div className="flex justify-between items-center">
                <Text colorType="secondary" size="text-md">{t('common.total')}</Text>
                <Text weight="medium" size="text-lg" colorType="primary">
                {formatPrice(plan.amount, plan.currency, lang)}
                </Text>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col">
        {/* Payment Method */}
        <div className="card rounded-xl p-5">
          <Text size="text-md" weight="medium" colorType="primary">
            {t('subscription.payment_method')}
          </Text>
          <SubscriptionCheckout
            plan={plan}
            token={accessToken}
            onSuccess={handleSuccess}
            onError={handleError}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
