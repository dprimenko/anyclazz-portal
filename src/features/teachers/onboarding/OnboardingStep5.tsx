import { useState } from 'react';
import { useTranslations } from '@/i18n';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { StripeConnectSection } from '@/features/stripe-connect';
import { useStripeConnectStatus } from '@/features/stripe-connect';
import type { StripeConnectStatusResponse } from '@/features/stripe-connect';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

// Formats a raw IBAN string into groups of 4: "ES12 3456 7890 ..."
function formatIban(value: string): string {
    const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return raw.match(/.{1,4}/g)?.join(' ') ?? raw;
}

// MOD-97 checksum per ISO 13616
function validateIban(formatted: string): boolean {
    const raw = formatted.replace(/\s/g, '').toUpperCase();
    if (raw.length < 5 || raw.length > 34) return false;
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(raw)) return false;

    const rearranged = raw.slice(4) + raw.slice(0, 4);
    const numeric = rearranged
        .split('')
        .map((c) => (c >= 'A' && c <= 'Z' ? String(c.charCodeAt(0) - 55) : c))
        .join('');

    // Process in chunks to avoid BigInt precision issues with very large numbers
    let remainder = 0;
    for (let i = 0; i < numeric.length; i += 7) {
        const chunk = remainder + numeric.slice(i, i + 7);
        remainder = parseInt(chunk, 10) % 97;
    }
    return remainder === 1;
}

interface OnboardingStep5Props {
    lang: string;
    token: string;
    teacherId: string;
    country: string;
    initialStatus?: StripeConnectStatusResponse | null;
    oauthCode?: string | null;
    oauthState?: string | null;
    oauthError?: string | null;
    initialIban?: string | null;
    initialAccountHolderName?: string | null;
}

export default function OnboardingStep5({
    lang,
    token,
    teacherId,
    country,
    initialStatus,
    oauthCode,
    oauthState,
    oauthError,
    initialIban,
    initialAccountHolderName,
}: OnboardingStep5Props) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    const { status } = useStripeConnectStatus(token, false, initialStatus);

    const isConnected = status?.connected === true;

    // Store the display value (with spaces) in state; raw value is derived when needed
    const [iban, setIban] = useState(initialIban ? formatIban(initialIban) : '');
    const [accountHolderName, setAccountHolderName] = useState(initialAccountHolderName ?? '');
    const [ibanTouched, setIbanTouched] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const ibanRaw = iban.replace(/\s/g, '');
    const ibanValid = ibanRaw.length > 0 && validateIban(iban);
    const ibanError = ibanTouched && ibanRaw.length > 0 && !ibanValid;

    const bankFieldsFilled = ibanValid && accountHolderName.trim().length > 0;
    const canContinue = isConnected || bankFieldsFilled;

    const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatIban(e.target.value);
        setIban(formatted);
        setSaveError(null);
    };

    const handleContinue = async () => {
        if (!canContinue) return;

        if (!isConnected && bankFieldsFilled) {
            setSaving(true);
            try {
                const res = await fetch(`${API_URL}/teachers/${teacherId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ iban: ibanRaw, accountHolderName: accountHolderName.trim() }),
                });
                if (!res.ok) throw new Error();
            } catch {
                setSaving(false);
                setSaveError('Error saving bank details. Please try again.');
                return;
            }
            setSaving(false);
        }

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
            <div className="mb-6">
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

            {/* Divider + bank transfer section (only when Stripe not connected) */}
            {!isConnected && (
                <>
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-[var(--color-neutral-200)]" />
                        <Text size="text-sm" colorType="tertiary">
                            {t('onboarding.step5.bank_transfer_title')}
                        </Text>
                        <div className="flex-1 h-px bg-[var(--color-neutral-200)]" />
                    </div>

                    <div className="flex flex-col gap-4 mb-6 p-4 rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-bg-secondary,#FAFAFA)]">
                        <Text size="text-sm" colorType="secondary">
                            {t('onboarding.step5.bank_transfer_description')}
                        </Text>

                        {/* Full name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">
                                {t('onboarding.step5.account_holder_name')}
                            </label>
                            <input
                                type="text"
                                value={accountHolderName}
                                onChange={(e) => { setAccountHolderName(e.target.value); setSaveError(null); }}
                                placeholder={t('onboarding.step5.account_holder_name_placeholder')}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--color-neutral-300)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-700)] focus:border-transparent"
                            />
                        </div>

                        {/* IBAN with mask + validation */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">
                                {t('onboarding.step5.iban')}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="text"
                                    autoCorrect="off"
                                    autoCapitalize="characters"
                                    spellCheck={false}
                                    value={iban}
                                    onChange={handleIbanChange}
                                    onBlur={() => setIbanTouched(true)}
                                    placeholder={t('onboarding.step5.iban_placeholder')}
                                    maxLength={42} // 34 chars + up to 8 spaces
                                    className={[
                                        'w-full px-3 py-2 pr-9 rounded-lg border bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:border-transparent',
                                        ibanError
                                            ? 'border-red-400 focus:ring-red-300'
                                            : ibanValid
                                                ? 'border-green-400 focus:ring-green-300'
                                                : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary-700)]',
                                    ].join(' ')}
                                />
                                {/* Status icon inside the input */}
                                {ibanValid && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-base leading-none">✓</span>
                                )}
                                {ibanError && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-base leading-none">✗</span>
                                )}
                            </div>
                            {ibanError && (
                                <p className="text-xs text-red-500">{t('onboarding.step5.iban_invalid')}</p>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Continue Button */}
            <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue || saving}
                className="w-full px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary-700)] text-white hover:bg-[var(--color-primary-800)]"
            >
                {saving ? t('common.saving') : t('onboarding.step5.continue')}
            </button>

            {!canContinue && (
                <p className="mt-3 text-center text-sm text-[var(--color-neutral-500)]">
                    {t('onboarding.step5.fill_both_fields')}
                </p>
            )}

            {saveError && (
                <p className="mt-3 text-center text-sm text-red-500">{saveError}</p>
            )}
        </>
    );
}
