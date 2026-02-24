import { useMemo } from 'react';
import { Combobox, type ComboboxItem } from '@/ui-library/components/form/combobox/Combobox';
import { cities } from '../data/cities';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';

export interface CitySelectorProps {
    value?: string;
    onChange?: (city: string, country: string) => void;
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
        // Priorizar ciudades de Estados Unidos (US) al inicio de la lista
        // La primera versión de la app está diseñada para EEUU
        const usCities = cities.filter(city => city.country.toLowerCase() === 'us');
        const otherCities = cities.filter(city => city.country.toLowerCase() !== 'us');
        const sortedCities = [...usCities, ...otherCities];
        
        return sortedCities.map(city => {
            const cityName = city.name[lang];
            
            return {
                value: city.city,
                label: cityName,
                prepend: (
                    <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                        <Icon 
                            icon={`flags/${city.country.toLowerCase()}`}
                            iconWidth={20}
                            iconHeight={20}
                        />
                    </div>
                ),
            };
        });
    }, [lang]);

    const handleChange = (city: string) => {
        const selectedCity = cities.find(c => c.city === city);
        if (selectedCity && onChange) {
            onChange(city, selectedCity.country);
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
