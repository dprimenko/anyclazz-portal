export interface City {
    cityISO2: string;
    countryISO2: string;
    name: {
        es: string;
        en: string;
    };
}

export const cities: City[] = [
    // España
    { cityISO2: 'md', countryISO2: 'es', name: { es: 'Madrid', en: 'Madrid' } },
    { cityISO2: 'b', countryISO2: 'es', name: { es: 'Barcelona', en: 'Barcelona' } },
    { cityISO2: 'v', countryISO2: 'es', name: { es: 'Valencia', en: 'Valencia' } },
    { cityISO2: 'se', countryISO2: 'es', name: { es: 'Sevilla', en: 'Seville' } },
    { cityISO2: 'z', countryISO2: 'es', name: { es: 'Zaragoza', en: 'Zaragoza' } },
    { cityISO2: 'ma', countryISO2: 'es', name: { es: 'Málaga', en: 'Malaga' } },
    { cityISO2: 'mu', countryISO2: 'es', name: { es: 'Murcia', en: 'Murcia' } },
    { cityISO2: 'pm', countryISO2: 'es', name: { es: 'Palma de Mallorca', en: 'Palma de Mallorca' } },
    { cityISO2: 'gc', countryISO2: 'es', name: { es: 'Las Palmas de Gran Canaria', en: 'Las Palmas de Gran Canaria' } },
    { cityISO2: 'bi', countryISO2: 'es', name: { es: 'Bilbao', en: 'Bilbao' } },
    { cityISO2: 'a', countryISO2: 'es', name: { es: 'Alicante', en: 'Alicante' } },
    { cityISO2: 'co', countryISO2: 'es', name: { es: 'Córdoba', en: 'Cordoba' } },
    { cityISO2: 'va', countryISO2: 'es', name: { es: 'Valladolid', en: 'Valladolid' } },
    { cityISO2: 'vi', countryISO2: 'es', name: { es: 'Vitoria', en: 'Vitoria' } },
    { cityISO2: 'gr', countryISO2: 'es', name: { es: 'Granada', en: 'Granada' } },
    
    // Estados Unidos
    { cityISO2: 'ny', countryISO2: 'us', name: { es: 'Nueva York', en: 'New York' } },
    { cityISO2: 'la', countryISO2: 'us', name: { es: 'Los Ángeles', en: 'Los Angeles' } },
    { cityISO2: 'chi', countryISO2: 'us', name: { es: 'Chicago', en: 'Chicago' } },
    { cityISO2: 'hou', countryISO2: 'us', name: { es: 'Houston', en: 'Houston' } },
    { cityISO2: 'phx', countryISO2: 'us', name: { es: 'Phoenix', en: 'Phoenix' } },
    { cityISO2: 'phi', countryISO2: 'us', name: { es: 'Filadelfia', en: 'Philadelphia' } },
    { cityISO2: 'sa', countryISO2: 'us', name: { es: 'San Antonio', en: 'San Antonio' } },
    { cityISO2: 'sd', countryISO2: 'us', name: { es: 'San Diego', en: 'San Diego' } },
    { cityISO2: 'dal', countryISO2: 'us', name: { es: 'Dallas', en: 'Dallas' } },
    { cityISO2: 'sj', countryISO2: 'us', name: { es: 'San José', en: 'San Jose' } },
    { cityISO2: 'aus', countryISO2: 'us', name: { es: 'Austin', en: 'Austin' } },
    { cityISO2: 'sf', countryISO2: 'us', name: { es: 'San Francisco', en: 'San Francisco' } },
    { cityISO2: 'sea', countryISO2: 'us', name: { es: 'Seattle', en: 'Seattle' } },
    { cityISO2: 'den', countryISO2: 'us', name: { es: 'Denver', en: 'Denver' } },
    { cityISO2: 'mia', countryISO2: 'us', name: { es: 'Miami', en: 'Miami' } },
    { cityISO2: 'bos', countryISO2: 'us', name: { es: 'Boston', en: 'Boston' } },
    { cityISO2: 'lv', countryISO2: 'us', name: { es: 'Las Vegas', en: 'Las Vegas' } },
    { cityISO2: 'por', countryISO2: 'us', name: { es: 'Portland', en: 'Portland' } },
];
