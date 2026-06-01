import { useTranslations } from '@/i18n';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { StripeConnectSection } from '@/features/stripe-connect';
import { useStripeConnectStatus } from '@/features/stripe-connect';
import type { StripeConnectStatusResponse } from '@/features/stripe-connect';

interface OnboardingStep5Props {
    lang: string;
    token: string;
    country: string;
    initialStatus?: StripeConnectStatusResponse | null;
    oauthCode?: string | null;
    oauthState?: string | null;
    oauthError?: string | null;
}

export default function OnboardingStep5({
    lang,
    token,
    country,
    initialStatus,
    oauthCode,
    oauthState,
    oauthError,
}: OnboardingStep5Props) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    const { status } = useStripeConnectStatus(token, false, initialStatus);

    const isConnected = status?.connected === true;

    const handleContinue = () => {
        window.location.href = '/dashboard';
    };

    const benefits: { icon: string; key: 'receive_payments' | 'secure' | 'fast_payouts' }[] = [
        { icon: 'dollar', key: 'receive_payments' },
        { icon: 'shield', key: 'secure' },
        { icon: 'wallet', key: 'fast_payouts' },
    ];

    return (
        <>
            {/* Title and Description */}
            <div className="text-center mb-8">
                <Text textLevel="h1" size="text-2xl" weight="semibold" colorType="primary" textalign="center" className="mb-2">
                    {t('onboarding.step5.title')}
                </Text>
                <Text size="text-md" colorType="tertiary" textalign="center">
                    {t('onboarding.step5.description')}
                </Text>
            </div>

            {/* Benefit cards */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {benefits.map(({ icon, key }) => (
                    <div
                        key={key}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--color-neutral-200)] bg-white text-center"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FFF4E7]">
                            <Icon icon={icon} iconWidth={20} iconHeight={20} iconColor="#F4A43A" />
                        </div>
                        <Text size="text-sm" weight="medium" colorType="secondary" textalign="center">
                            {t(`onboarding.step5.benefit.${key}`)}
                        </Text>
                    </div>
                ))}
            </div>

            {/* Stripe Connect Section */}
            <div className="mb-8">
                <StripeConnectSection
                    accessToken={token}
                    country={country}
                    initialStatus={status ?? initialStatus}
                    oauthCode={oauthCode}
                    oauthState={oauthState}
                    oauthError={oauthError}
                    lang={lang as 'en' | 'es'}
                />
            </div>

            {/* Continue Button */}
            <button
                type="button"
                onClick={handleContinue}
                disabled={!isConnected}
                className="w-full px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary-700)] text-white hover:bg-[var(--color-primary-800)]"
            >
                {t('onboarding.step5.continue')}
            </button>

            {!isConnected && (
                <p className="mt-3 text-center text-sm text-[var(--color-neutral-500)]">
                    {t('onboarding.step5.connect_first')}
                </p>
            )}
        </>
    );
}
