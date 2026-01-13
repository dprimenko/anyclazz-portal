import { useState, useMemo } from "react";
import { useTranslations } from "@/i18n";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { ClassType } from "../../domain/types";
import { Combobox, type ComboboxItem } from '@/ui-library/components/form/combobox/Combobox';
import { cities } from '../../onboarding/data/cities';
import { countries } from '../../onboarding/data/countries';

export interface TeachersFiltersProps {
    onFiltersChange: (filters: {
        search?: string;
        countryISO2?: string;
        cityISO2?: string;
        classTypeId?: string;
        minPrice?: number;
        maxPrice?: number;
    }) => void;
    onClear: () => void;
}

const CLASS_TYPE_OPTIONS = [
    { id: ClassType.onlineSingle, labelKey: 'classtype.online_single', icon: '👤' },
    { id: ClassType.onlineGroup, labelKey: 'classtype.online_group', icon: '👥' },
    { id: ClassType.onsiteSingle, labelKey: 'classtype.onsite_single', icon: '🏠' },
    { id: ClassType.onsiteGroup, labelKey: 'classtype.onsite_group', icon: '🏫' },
];

export function TeachersFilters({ onFiltersChange, onClear }: TeachersFiltersProps) {
    const t = useTranslations();
    const [search, setSearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedClassType, setSelectedClassType] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();

    // Get current language (es or en)
    const currentLang = typeof window !== 'undefined' ? 
        (window.location.pathname.startsWith('/en') ? 'en' : 'es') : 'es';

    // Transform countries data to ComboboxItem format with current locale
    const countryItems: ComboboxItem[] = useMemo(() => 
        countries.map(country => ({
            value: country.countryISO2,
            label: country.name[currentLang as keyof typeof country.name],
        })),
        [currentLang]
    );

    // Transform cities data to ComboboxItem format, filtered by selected country
    const cityItems: ComboboxItem[] = useMemo(() => {
        const filteredCities = selectedCountry 
            ? cities.filter(city => city.countryISO2 === selectedCountry)
            : cities;
        
        return filteredCities.map(city => ({
            value: city.cityISO2,
            label: city.name[currentLang as keyof typeof city.name],
        }));
    }, [selectedCountry, currentLang]);

    const handleSearch = () => {
        onFiltersChange({
            search: search || undefined,
            countryISO2: selectedCountry || undefined,
            cityISO2: selectedCity || undefined,
            classTypeId: selectedClassType || undefined,
            minPrice,
            maxPrice,
        });
    };

    const handleClear = () => {
        setSearch('');
        setSelectedCountry('');
        setSelectedCity('');
        setSelectedClassType('');
        setMinPrice(undefined);
        setMaxPrice(undefined);
        onClear();
    };

    const handleCountryChange = (countryISO2: string) => {
        setSelectedCountry(countryISO2);
        setSelectedCity(''); // Reset city when country changes
        onFiltersChange({
            search: search || undefined,
            countryISO2: countryISO2 || undefined,
            cityISO2: undefined,
            classTypeId: selectedClassType || undefined,
            minPrice,
            maxPrice,
        });
    };

    const handleCityChange = (cityISO2: string) => {
        setSelectedCity(cityISO2);
        onFiltersChange({
            search: search || undefined,
            countryISO2: selectedCountry || undefined,
            cityISO2: cityISO2 || undefined,
            classTypeId: selectedClassType || undefined,
            minPrice,
            maxPrice,
        });
    };

    const handleClassTypeChange = (classType: string) => {
        const newClassType = selectedClassType === classType ? '' : classType;
        setSelectedClassType(newClassType);
        onFiltersChange({
            search: search || undefined,
            countryISO2: selectedCountry || undefined,
            cityISO2: selectedCity || undefined,
            classTypeId: newClassType || undefined,
            minPrice,
            maxPrice,
        });
    };

    const handlePriceChange = (min?: number, max?: number) => {
        setMinPrice(min);
        setMaxPrice(max);
        onFiltersChange({
            search: search || undefined,
            countryISO2: selectedCountry || undefined,
            cityISO2: selectedCity || undefined,
            classTypeId: selectedClassType || undefined,
            minPrice: min,
            maxPrice: max,
        });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder={t('teachers.search_placeholder')}
                        className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Icon 
                        icon="search" 
                        iconWidth={20} 
                        iconHeight={20} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" 
                    />
                </div>
                <Button
                    colorType="primary"
                    label={t('common.search')}
                    onClick={handleSearch}
                />
                {(search || selectedCountry || selectedClassType || minPrice || maxPrice) && (
                    <Button
                        colorType="secondary"
                        label={t('common.clear')}
                        onClick={handleClear}
                    />
                )}
            </div>

            {/* Filters Row */}
            <div className="flex gap-2 flex-wrap items-start">
                {/* Country Filter */}
                <div className="min-w-[200px]">
                    <Combobox
                        items={countryItems}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        placeholder={t('teachers.all_countries')}
                        searchPlaceholder={t('onboarding.nationality.search')}
                        emptyMessage={t('onboarding.nationality.empty')}
                        fullWidth={false}
                    />
                </div>

                {/* City Filter - Only show if country is selected */}
                {selectedCountry && (
                    <div className="min-w-[200px]">
                        <Combobox
                            items={cityItems}
                            value={selectedCity}
                            onChange={handleCityChange}
                            placeholder={t('teachers.all_cities')}
                            searchPlaceholder={t('onboarding.location.search')}
                            emptyMessage={t('onboarding.location.empty')}
                            fullWidth={false}
                        />
                    </div>
                )}

                {/* Class Type Filter */}
                {CLASS_TYPE_OPTIONS.map(option => (
                    <button
                        key={option.id}
                        onClick={() => handleClassTypeChange(option.id)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-all ${
                            selectedClassType === option.id
                                ? 'border-primary-700 bg-primary-100 text-primary-700'
                                : 'border-neutral-300 bg-white hover:border-neutral-400'
                        }`}
                    >
                        <span>{option.icon}</span>
                        <Text size="text-sm" colorType={selectedClassType === option.id ? 'primary' : 'secondary'}>
                            {t(option.labelKey)}
                        </Text>
                    </button>
                ))}

                {/* Price Filter */}
                <PriceRangeFilter
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceChange={handlePriceChange}
                />
            </div>
        </div>
    );
}
