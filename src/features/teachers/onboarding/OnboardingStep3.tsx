import { useState, useMemo } from 'react';
import { useTranslations } from '@/i18n';
import { Combobox, type ComboboxItem } from '@/ui-library/components/form/combobox/Combobox';
import { GoogleCityAutocomplete, type GoogleCitySelection } from '@/ui-library/components/form/city-autocomplete/GoogleCityAutocomplete';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { countries } from './data/countries';
import { LanguageSelector } from './components/LanguageSelector';
import type { TeacherLanguage } from '../domain/types';
import { ApiTeacherRepository } from '../infrastructure/ApiTeacherRepository';

interface OnboardingStep3Props {
    lang: string;
    teacherId: string;
    token: string;
    initialData?: {
        nationalityId?: string;
        city?: string;
        speaksLanguages?: TeacherLanguage[];
    };
}

export default function OnboardingStep3({ lang, teacherId, token, initialData }: OnboardingStep3Props) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    const [selectedNationality, setSelectedNationality] = useState<string>(initialData?.nationalityId || '');
    const [selectedCity, setSelectedCity] = useState<GoogleCitySelection | null>(null);
    const [selectedLanguages, setSelectedLanguages] = useState<TeacherLanguage[]>(initialData?.speaksLanguages || []);
    const [isSaving, setIsSaving] = useState(false);

    const repository = useMemo(() => new ApiTeacherRepository(), []);

    // Transform countries data to ComboboxItem format with current locale
    const nationalityItems: ComboboxItem[] = countries.map(country => ({
        value: country.country,
        label: country.name[lang as keyof typeof country.name],
    }));


    const handleContinue = async () => {
        if (!selectedCity || !selectedNationality || selectedLanguages.length === 0) return;

        setIsSaving(true);
        try {
            // Llamar al repositorio para actualizar los datos del profesor
            await repository.updateTeacher({
                token,
                teacherId,
                data: {
                    nationalityId: selectedNationality,
                    address: {
                        country: selectedCity.country,
                        city: selectedCity.city,
                        fullAddress: selectedCity.fullAddress,
                    },
                    speaksLanguages: selectedLanguages,
                },
            });

            window.location.href = '/onboarding/quick-intro';
        } catch (error) {
            console.error('Error saving location and languages:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const isFormValid = selectedNationality !== '' && selectedCity !== null && selectedLanguages.length > 0;

    return (
        <>
            {/* Title and Description */}
            <div className="text-center mb-8">
                <Text textLevel="h1" size="text-2xl" weight="semibold" colorType="primary" textalign="center" className="mb-2">
                    {t('onboarding.step3.title')}
                </Text>
                <Text size="text-md" colorType="tertiary" textalign="center">
                    {t('onboarding.step3.description')}
                </Text>
            </div>

            {/* Nationality Selector */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-[var(--color-neutral-900)] mb-3">
                    {t('onboarding.nationality')} <span className="text-[var(--color-primary-700)]">*</span>
                </label>
                <Combobox
                    items={nationalityItems}
                    value={selectedNationality}
                    onChange={setSelectedNationality}
                    placeholder={t('onboarding.nationality.placeholder')}
                    searchPlaceholder={t('onboarding.nationality.search')}
                    emptyMessage={t('onboarding.nationality.empty')}
                    fullWidth={true}
                />
            </div>

            {/* Location Selector */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-[var(--color-neutral-900)] mb-3">
                    {t('onboarding.location')} <span className="text-[var(--color-primary-700)]">*</span>
                </label>
                <GoogleCityAutocomplete
                    value={selectedCity?.fullAddress}
                    onSelect={setSelectedCity}
                    onClear={() => setSelectedCity(null)}
                    lang={lang as 'es' | 'en'}
                    placeholder={t('onboarding.location.placeholder')}
                    emptyMessage={t('onboarding.location.empty')}
                    fullWidth={true}
                />
            </div>

            {/* Languages Selector */}
            <div className="mb-8">
                <LanguageSelector
                    lang={lang}
                    value={selectedLanguages}
                    onChange={setSelectedLanguages}
                    label={t('onboarding.languages')}
                    required
                />
            </div>

            {/* Continue Button */}
            <button
                type="button"
                onClick={handleContinue}
                disabled={!isFormValid || isSaving}
                className="w-full px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary-700)] text-white hover:bg-[var(--color-primary-800)]"
            >
                {isSaving ? t('onboarding.saving') : t('onboarding.continue')}
            </button>
        </>
    );
}
