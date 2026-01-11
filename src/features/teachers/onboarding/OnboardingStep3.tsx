import { useState } from 'react';
import { useTranslations, getLangFromUrl } from '@/i18n';
import { Combobox, type ComboboxItem } from '@/ui-library/components/form/combobox/Combobox';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { cities } from './data/cities';
import esFlag from '@/assets/images/icons/flags/es.svg';
import usFlag from '@/assets/images/icons/flags/us.svg';

export default function OnboardingStep3() {
    const t = useTranslations();
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const getFlagForCountry = (countryISO2: string): string => {
        const flags: Record<string, string> = {
            'ES': esFlag.src,
            'US': usFlag.src
        };
        return flags[countryISO2] || '';
    };

    // Transform cities data to ComboboxItem format with current locale
    const lang = (typeof window !== 'undefined' ? getLangFromUrl(new URL(window.location.href)) : 'es') as 'es' | 'en';
    const cityItems: ComboboxItem[] = cities.map(city => ({
        value: city.cityISO2,
        label: city.name[lang],
    }));

    const handleContinue = async () => {
        if (!selectedCity) return;

        setIsSaving(true);
        try {
            // TODO: Call API to update teacher location
            // const selectedCityData = cities.find(c => c.cityISO2 === selectedCity);
            // await updateTeacher({ 
            //   teacherAddress: { 
            //     countryISO2: selectedCityData.countryISO2,
            //     cityISO2: selectedCityData.cityISO2 
            //   }
            // });
            
            window.location.href = '/onboarding/quick-intro';
        } catch (error) {
            console.error('Error saving location:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const selectedCityData = cities.find(c => c.cityISO2 === selectedCity);
    const selectedCityFlag = selectedCityData ? getFlagForCountry(selectedCityData.countryISO2) : '';

    const isFormValid = selectedCity !== '';

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

            {/* Location Selector */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-[var(--color-neutral-900)] mb-3">
                    {t('onboarding.location')} <span className="text-[var(--color-primary-700)]">*</span>
                </label>
                <div className="flex items-center gap-3">
                    {selectedCityFlag && (
                        <img 
                            src={selectedCityFlag} 
                            alt="" 
                            className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                    )}
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
