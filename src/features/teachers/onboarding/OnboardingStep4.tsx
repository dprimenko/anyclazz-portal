import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from '@/i18n';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { ApiTeacherRepository } from '../infrastructure/ApiTeacherRepository';
import { Checkbox } from '@/ui-library/shared';

interface OnboardingStep4Props {
    lang: string;
    teacherId: string;
    token: string;
    initialData?: {
        beganTeachingAt?: string;
        shortPresentation?: string;
    };
}

export default function OnboardingStep4({ lang, teacherId, token, initialData }: OnboardingStep4Props) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    const [experienceDate, setExperienceDate] = useState<string>('');
    const [shortBio, setShortBio] = useState<string>(initialData?.shortPresentation || '');
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);

    const repository = useMemo(() => new ApiTeacherRepository(), []);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Solo números
        
        if (value.length > 4) {
            value = value.slice(0, 4);
        }
        
        setExperienceDate(value);
    };

    const parseYearToTimestamp = (yearStr: string): string | null => {
        if (yearStr.length !== 4) return null;
        
        const year = parseInt(yearStr, 10);
        const currentYear = new Date().getFullYear();
        
        if (isNaN(year) || year < 1900 || year > currentYear) return null;
        
        // Crear fecha con el 1 de enero del año especificado
        const date = new Date(year, 0, 1);
        return date.toISOString();
    };

    const handleContinue = async () => {
        const timestamp = parseYearToTimestamp(experienceDate);
        
        if (!timestamp || !shortBio.trim()) {
            console.error('Invalid data');
            return;
        }

        setIsSaving(true);
        try {
            await repository.updateTeacher({
                token,
                teacherId,
                data: {
                    beganTeachingAt: timestamp,
                    shortPresentation: shortBio,
                },
            });
            
            // Redirigir al dashboard o página de éxito
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Error saving introduction:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const isFormValid = parseYearToTimestamp(experienceDate) !== null && shortBio.trim().length > 0 && termsAccepted;

    return (
        <>
            {/* Title and Description */}
            <div className="text-center mb-8">
                <Text textLevel="h1" size="text-2xl" weight="semibold" colorType="primary" textalign="center" className="mb-2">
                    {t('onboarding.step4.title')}
                </Text>
                <Text size="text-md" colorType="tertiary" textalign="center">
                    {t('onboarding.step4.description')}
                </Text>
            </div>

            {/* Experience Date */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-[var(--color-neutral-900)] mb-3">
                    {t('onboarding.experience')} <span className="text-[var(--color-primary-700)]">*</span>
                </label>
                <input
                    type="text"
                    value={experienceDate}
                    onChange={handleDateChange}
                    placeholder={t('onboarding.experience.placeholder')}
                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary-700)] transition-colors"
                />
            </div>

            {/* Short Bio */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-[var(--color-neutral-900)] mb-3">
                    {t('onboarding.shortBio')} <span className="text-[var(--color-primary-700)]">*</span>
                </label>
                <textarea
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                    placeholder={t('onboarding.shortBio.placeholder')}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-neutral-300)] bg-white text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none focus:border-[var(--color-primary-700)] transition-colors resize-none"
                />
            </div>

            <label className="mb-8 flex items-center gap-3 cursor-pointer">
                <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                />
                <Text textLevel='span' weight="medium" size="text-md" className="user-select-none">
                    {t('onboarding.terms.agree')}{' '}
                    <a 
                        href="/legal/terms-and-conditions" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <Text underline colorType="primary" weight="medium" size="text-md" textLevel='span'>
                            {t('onboarding.terms.link')}
                        </Text>
                    </a>
                </Text>
            </label>

            {/* Continue Button */}
            <button
                type="button"
                onClick={handleContinue}
                disabled={!isFormValid || isSaving}
                className="w-full px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary-700)] text-white hover:bg-[var(--color-primary-800)]"
            >
                {isSaving ? t('onboarding.saving') : t('onboarding.finish')}
            </button>
        </>
    );
}
