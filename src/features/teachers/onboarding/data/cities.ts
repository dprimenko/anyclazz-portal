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
    { cityISO2: 'MD', countryISO2: 'ES', name: { es: 'Madrid', en: 'Madrid' } },
    { cityISO2: 'B', countryISO2: 'ES', name: { es: 'Barcelona', en: 'Barcelona' } },
    { cityISO2: 'V', countryISO2: 'ES', name: { es: 'Valencia', en: 'Valencia' } },
    { cityISO2: 'SE', countryISO2: 'ES', name: { es: 'Sevilla', en: 'Seville' } },
    { cityISO2: 'Z', countryISO2: 'ES', name: { es: 'Zaragoza', en: 'Zaragoza' } },
    { cityISO2: 'MA', countryISO2: 'ES', name: { es: 'Málaga', en: 'Malaga' } },
    { cityISO2: 'MU', countryISO2: 'ES', name: { es: 'Murcia', en: 'Murcia' } },
    { cityISO2: 'PM', countryISO2: 'ES', name: { es: 'Palma de Mallorca', en: 'Palma de Mallorca' } },
    { cityISO2: 'GC', countryISO2: 'ES', name: { es: 'Las Palmas de Gran Canaria', en: 'Las Palmas de Gran Canaria' } },
    { cityISO2: 'BI', countryISO2: 'ES', name: { es: 'Bilbao', en: 'Bilbao' } },
    { cityISO2: 'A', countryISO2: 'ES', name: { es: 'Alicante', en: 'Alicante' } },
    { cityISO2: 'CO', countryISO2: 'ES', name: { es: 'Córdoba', en: 'Cordoba' } },
    { cityISO2: 'VA', countryISO2: 'ES', name: { es: 'Valladolid', en: 'Valladolid' } },
    { cityISO2: 'VI', countryISO2: 'ES', name: { es: 'Vitoria', en: 'Vitoria' } },
    { cityISO2: 'GR', countryISO2: 'ES', name: { es: 'Granada', en: 'Granada' } },
    
    // Estados Unidos
    { cityISO2: 'NY', countryISO2: 'US', name: { es: 'Nueva York', en: 'New York' } },
    { cityISO2: 'LA', countryISO2: 'US', name: { es: 'Los Ángeles', en: 'Los Angeles' } },
    { cityISO2: 'CHI', countryISO2: 'US', name: { es: 'Chicago', en: 'Chicago' } },
    { cityISO2: 'HOU', countryISO2: 'US', name: { es: 'Houston', en: 'Houston' } },
    { cityISO2: 'PHX', countryISO2: 'US', name: { es: 'Phoenix', en: 'Phoenix' } },
    { cityISO2: 'PHI', countryISO2: 'US', name: { es: 'Filadelfia', en: 'Philadelphia' } },
    { cityISO2: 'SA', countryISO2: 'US', name: { es: 'San Antonio', en: 'San Antonio' } },
    { cityISO2: 'SD', countryISO2: 'US', name: { es: 'San Diego', en: 'San Diego' } },
    { cityISO2: 'DAL', countryISO2: 'US', name: { es: 'Dallas', en: 'Dallas' } },
    { cityISO2: 'SJ', countryISO2: 'US', name: { es: 'San José', en: 'San Jose' } },
    { cityISO2: 'AUS', countryISO2: 'US', name: { es: 'Austin', en: 'Austin' } },
    { cityISO2: 'SF', countryISO2: 'US', name: { es: 'San Francisco', en: 'San Francisco' } },
    { cityISO2: 'SEA', countryISO2: 'US', name: { es: 'Seattle', en: 'Seattle' } },
    { cityISO2: 'DEN', countryISO2: 'US', name: { es: 'Denver', en: 'Denver' } },
    { cityISO2: 'MIA', countryISO2: 'US', name: { es: 'Miami', en: 'Miami' } },
    { cityISO2: 'BOS', countryISO2: 'US', name: { es: 'Boston', en: 'Boston' } },
    { cityISO2: 'LV', countryISO2: 'US', name: { es: 'Las Vegas', en: 'Las Vegas' } },
    { cityISO2: 'POR', countryISO2: 'US', name: { es: 'Portland', en: 'Portland' } },
];
