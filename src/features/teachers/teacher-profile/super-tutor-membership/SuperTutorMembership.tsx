import { useState, useEffect } from "react";
import type { Teacher, TeacherRepository } from "../../domain/types";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { useTranslations } from "@/i18n";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { Card } from "@/ui-library/components/ssr/card/Card";
import { Icon } from  "@/ui-library/components/ssr/icon/Icon";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { Modal } from "@/ui-library/components/modal/Modal";
import { getSuperTutorPlans, getActiveSubscription, cancelSubscription, type StripePlan, type ActiveSubscription } from "@/services/stripe";
import { ProgressIndicator } from "@/ui-library/components/progress-indicator";
import { formatPrice } from "@/features/shared/utils/formatPrice";

export function SuperTutorMembership({ teacher, accessToken, repository }: { teacher: Teacher; accessToken: string; repository: TeacherRepository; }) {
    const t = useTranslations();
    const [plans, setPlans] = useState<StripePlan[]>([]);
    const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [canceling, setCanceling] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);
                
                const [plansResponse, subscriptionResponse] = await Promise.all([
                    getSuperTutorPlans(accessToken),
                    getActiveSubscription(accessToken),
                ]);
                
                setPlans(plansResponse.plans);
                setActiveSubscription(subscriptionResponse.subscription);
            } catch (err) {
                console.error('Error loading data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [accessToken]);

    const getIntervalLabel = (interval: string): string => {
        const labels: Record<string, string> = {
            'week': t('subscription.weekly'),
            'month': t('subscription.monthly'),
            'year': t('subscription.annually'),
        };
        return labels[interval] || interval;
    };

    const isActivePlan = (plan: StripePlan): boolean => {
        return activeSubscription?.price_id === plan.price_id;
    };

    const getPlanButtonConfig = (plan: StripePlan) => {
        if (isActivePlan(plan)) {
            return {
                label: t('subscription.cancel_plan'),
                disabled: false,
                colorType: 'secondary',
                textColor: '!text-red-600',
                onClick: () => setShowCancelModal(true),
            };
        }
        
        if (activeSubscription && activeSubscription.status === 'active') {
            return {
                label: t('subscription.change_plan'),
                disabled: false,
                colorType: 'primary',
                onClick: () => window.location.href = `/super-tutor/checkout/${plan.interval}`,
            };
        }
        
        return {
            label: t('subscription.boost_your_profile_btn'),
            disabled: false,
            colorType: 'primary',
            onClick: () => window.location.href = `/super-tutor/checkout/${plan.interval}`,
        };
    };

    const handleCancelSubscription = async (immediately: boolean) => {
        try {
            setCanceling(true);
            await cancelSubscription(accessToken, immediately);
            
            // Recargar datos para actualizar el estado
            const subscriptionResponse = await getActiveSubscription(accessToken);
            setActiveSubscription(subscriptionResponse.subscription);
            setShowCancelModal(false);
            
            // Opcional: mostrar mensaje de éxito
            alert(t('subscription.subscription_canceled'));
        } catch (err) {
            console.error('Error canceling subscription:', err);
            alert(err instanceof Error ? err.message : 'Failed to cancel subscription');
        } finally {
            setCanceling(false);
        }
    };

    return (
        <div className="mt-6 flex flex-col gap-8">
            <div className="flex flex-col gap-[2px]">
                <Text size="text-lg" weight="semibold" colorType="primary">{t('subscription.boost_your_profile')}</Text>
                <Text size="text-md" colorType="tertiary">{t('subscription.supertutors_increase_chance')}</Text>
            </div>
            <Divider />
            <div>
                <div className="flex flex-col gap-[2px]">
                    <Text size="text-md" weight="medium" colorType="primary">{t('subscription.stand_out_attract_students')}</Text>
                    <Text size="text-md" colorType="tertiary">{t('subscription.by_becoming_super_tutor')}</Text>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-6">
                    <Card className="p-4 md:p-6 flex flex-row gap-4 md:flex-col md:gap-6">
                        <div>
                            <Icon icon="verified" iconWidth={56} iconHeight={56} />
                        </div>
                        <div className="flex flex-col gap-[2px]">
                            <Text size="text-md" weight="medium" colorType="primary">{t('subscription.verified_badge')}</Text>
                            <Text size="text-sm" colorType="tertiary">{t('subscription.build_trust')}</Text>
                        </div>
                    </Card>
                    <Card className="p-4 md:p-6 flex flex-row gap-4 md:flex-col md:gap-6">
                        <div>
                            <Icon icon="rocket-02" iconWidth={56} iconHeight={56} />
                        </div>
                        <div className="flex flex-col gap-[2px]">
                            <Text size="text-md" weight="medium" colorType="primary">{t('subscription.priority_listing')}</Text>
                            <Text size="text-sm" colorType="tertiary">{t('subscription.profile_appears_higher')}</Text>
                        </div>
                    </Card>
                    <Card className="p-4 md:p-6 flex flex-row gap-4 md:flex-col md:gap-6">
                        <div>
                            <Icon icon="annotation-check" iconWidth={56} iconHeight={56} />
                        </div>
                        <div className="flex flex-col gap-[2px]">
                            <Text size="text-md" weight="medium" colorType="primary">{t('subscription.advanced_analytics')}</Text>
                            <Text size="text-sm" colorType="tertiary">{t('subscription.track_performance')}</Text>
                        </div>
                    </Card>
                </div>
            </div>
            <Divider />
            <div>
                <div className="flex flex-col">
                    <Text size="text-sm" weight="medium" colorType="secondary">{t('subscription.pricing')}</Text>
                </div>
                {loading ? (
                    <div className="mt-6">
                        <ProgressIndicator message={t('subscription.loading_plans')} />
                    </div>
                ) : error ? (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <Text colorType="primary" size="text-sm">{error}</Text>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-6">
                        {plans.map(plan => {
                            const isActive = isActivePlan(plan);
                            const buttonConfig = getPlanButtonConfig(plan);
                            
                            return (
                                <Card 
                                    key={plan.interval} 
                                    className={`p-4 md:p-6 flex flex-col items-center border-1 ${
                                        isActive 
                                            ? '!border-[var(--color-primary-600)] bg-[var(--color-primary-200)]' 
                                            : '!border-[var(--color-primary-200)] bg-[var(--color-primary-100)]'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Text size="text-md" weight="semibold" colorType="primary">
                                            {getIntervalLabel(plan.interval)}
                                        </Text>
                                        {isActive && (
                                            <span className="px-2 py-0.5 bg-[var(--color-primary-600)] text-white text-xs font-medium rounded-full">
                                                {t('subscription.active')}
                                            </span>
                                        )}
                                    </div>
                                    <Space size={20} direction="vertical" />
                                    <Text size="text-3xl" weight="semibold" colorType="primary">
                                        {formatPrice(plan.amount, plan.currency)}
                                    </Text>
                                    <Space size={12} direction="vertical" />
                                    <Text size="text-sm" colorType="tertiary">{t('subscription.you_can_cancel_anytime')}</Text>
                                    <Space size={20} direction="vertical" />
                                    <Space size={16} direction="vertical" />
                                    <Button 
                                        colorType={buttonConfig.colorType}
                                        className={buttonConfig.textColor}
                                        label={buttonConfig.label}
                                        fullWidth 
                                        disabled={buttonConfig.disabled}
                                        onClick={buttonConfig.onClick} 
                                    />
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
            <Space size={48} />

            {/* Modal de cancelación */}
            {showCancelModal && (
                <Modal onClose={() => !canceling && setShowCancelModal(false)} fitContent withCloseIcon>
                    <div className="p-6 flex flex-col gap-6">
                        <div>
                            <Text size="text-lg" weight="semibold" colorType="primary">
                                {t('subscription.cancel_subscription')}
                            </Text>
                            <Space size={8} direction="vertical" />
                            <Text size="text-md" colorType="tertiary">
                                {t('subscription.cancel_confirm')}
                            </Text>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <Button
                                colorType="primary"
                                label={canceling ? t('subscription.canceling') : t('subscription.cancel_at_period_end')}
                                onClick={() => handleCancelSubscription(false)}
                                disabled={canceling}
                                fullWidth
                            />
                            <Button
                                colorType="tertiary"
                                label={canceling ? t('subscription.canceling') : t('subscription.cancel_immediately')}
                                onClick={() => handleCancelSubscription(true)}
                                disabled={canceling}
                                fullWidth
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
