import { useMemo } from 'react';
import { Combobox, type ComboboxItem } from '@/ui-library/components/form/combobox/Combobox';
import { cities } from '../data/cities';
import esFlag from '@/assets/images/icons/flags/es.svg';
import usFlag from '@/assets/images/icons/flags/us.svg';

// Map of country flags
const FLAG_MAP: Record<string, string> = {
    'es': esFlag.src,
    'us': usFlag.src,
};

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
            const flagSrc = FLAG_MAP[city.countryISO2.toLowerCase()];
            const cityName = city.name[lang];
            
            return {
                value: city.cityISO2,
                label: cityName,
                prepend: flagSrc ? (
                    <img 
                        src={flagSrc} 
                        alt="" 
                        className="w-5 h-5 rounded-full object-cover"
                    />
                ) : null,
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
