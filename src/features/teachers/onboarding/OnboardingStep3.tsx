import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from '@/i18n';
import { Combobox, type ComboboxItem } from '@/ui-library/components/form/combobox/Combobox';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { cities } from './data/cities';
import { countries } from './data/countries';
import { LanguageSelector } from './components/LanguageSelector';
import type { TeacherLanguage } from '../domain/types';
import { ApiTeacherRepository } from '../infrastructure/ApiTeacherRepository';
import esFlag from '@/assets/images/icons/flags/es.svg';
import usFlag from '@/assets/images/icons/flags/us.svg';

interface OnboardingStep3Props {
    lang: string;
    teacherId: string;
    token: string;
    initialData?: {
        nationalityId?: string;
        cityISO2?: string;
        speaksLanguages?: TeacherLanguage[];
    };
}

export default function OnboardingStep3({ lang, teacherId, token, initialData }: OnboardingStep3Props) {
    const t = useTranslations();
    const [selectedNationality, setSelectedNationality] = useState<string>(initialData?.nationalityId || '');
    const [selectedCity, setSelectedCity] = useState<string>(initialData?.cityISO2 || '');
    const [selectedLanguages, setSelectedLanguages] = useState<TeacherLanguage[]>(initialData?.speaksLanguages || []);
    const [isSaving, setIsSaving] = useState(false);

    const repository = useMemo(() => new ApiTeacherRepository(), []);

    // const getFlagForCountry = (countryISO2: string): string => {
    //     const flags: Record<string, string> = {
    //         'ES': esFlag.src,
    //         'US': usFlag.src
    //     };
    //     return flags[countryISO2] || '';
    // };

    // Transform cities data to ComboboxItem format with current locale
    const cityItems: ComboboxItem[] = cities.map(city => ({
        value: city.cityISO2,
        label: city.name[lang as keyof typeof city.name],
    }));

    // Transform countries data to ComboboxItem format with current locale
    const nationalityItems: ComboboxItem[] = countries.map(country => ({
        value: country.countryISO2,
        label: country.name[lang as keyof typeof country.name],
    }));


    const handleContinue = async () => {
        if (!selectedCity || !selectedNationality || selectedLanguages.length === 0) return;

        setIsSaving(true);
        try {
            // Obtener la información completa de la ciudad seleccionada
            const selectedCityData = cities.find(c => c.cityISO2 === selectedCity);
            
            if (!selectedCityData) {
                console.error('City data not found');
                return;
            }

            // Llamar al repositorio para actualizar los datos del profesor
            await repository.updateTeacher({
                token,
                teacherId,
                data: {
                    nationalityId: selectedNationality,
                    address: {
                        countryISO2: selectedCityData.countryISO2,
                        cityISO2: selectedCityData.cityISO2,
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

    const selectedCityData = cities.find(c => c.cityISO2 === selectedCity);
    // const selectedCityFlag = selectedCityData ? getFlagForCountry(selectedCityData.countryISO2) : '';

    const isFormValid = selectedNationality !== '' && selectedCity !== '' && selectedLanguages.length > 0;

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
                <div className="flex items-center gap-3">
                    {/* {selectedCityFlag && (
                        <img 
                            src={selectedCityFlag} 
                            alt="" 
                            className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                    )} */}
                    <Combobox
                        items={cityItems}
                        value={selectedCity}
                        onChange={setSelectedCity}
                        placeholder={t('onboarding.location.placeholder')}
                        searchPlaceholder={t('onboarding.location.search')}
                        emptyMessage={t('onboarding.location.empty')}
                        fullWidth={true}
                    />
                </div>
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
