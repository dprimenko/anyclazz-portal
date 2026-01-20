import { useMemo } from 'react';
import { Combobox, type ComboboxItem } from '@/ui-library/components/form/combobox/Combobox';
import { cities } from '../data/cities';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';

export interface CitySelectorProps {
    value?: string;
    onChange?: (cityISO2: string, countryISO2: string) => void;
    lang: 'es' | 'en';
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    showCountryInLabel?: boolean;
}

export function CitySelector({
    value,
    onChange,
    lang,
    placeholder = 'Select city...',
    searchPlaceholder = 'Search city...',
    emptyMessage = 'No cities found.',
    fullWidth = false,
    disabled = false,
    showCountryInLabel = false,
}: CitySelectorProps) {
    const cityItems: ComboboxItem[] = useMemo(() => {
        return cities.map(city => {
            const cityName = city.name[lang];
            
            return {
                value: city.cityISO2,
                label: cityName,
                prepend: (
                    <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                        <Icon 
                            icon={`flags/${city.countryISO2.toLowerCase()}`}
                            iconWidth={20}
                            iconHeight={20}
                        />
                    </div>
                ),
            };
        });
    }, [lang]);

    const handleChange = (cityISO2: string) => {
        const selectedCity = cities.find(city => city.cityISO2 === cityISO2);
        if (selectedCity && onChange) {
            onChange(cityISO2, selectedCity.countryISO2);
        }
    };

    return (
        <Combobox
            items={cityItems}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            fullWidth={fullWidth}
            disabled={disabled}
        />
    );
}
