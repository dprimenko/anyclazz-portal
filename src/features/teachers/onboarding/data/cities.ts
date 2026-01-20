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
    { cityISO2: 'm', countryISO2: 'es', name: { es: 'Madrid', en: 'Madrid' } },
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

    // Francia
    { cityISO2: 'par', countryISO2: 'fr', name: { es: 'París', en: 'Paris' } },
    { cityISO2: 'mar', countryISO2: 'fr', name: { es: 'Marsella', en: 'Marseille' } },
    { cityISO2: 'lyo', countryISO2: 'fr', name: { es: 'Lyon', en: 'Lyon' } },
    { cityISO2: 'tou', countryISO2: 'fr', name: { es: 'Toulouse', en: 'Toulouse' } },
    { cityISO2: 'nic', countryISO2: 'fr', name: { es: 'Niza', en: 'Nice' } },

    // Alemania
    { cityISO2: 'ber', countryISO2: 'de', name: { es: 'Berlín', en: 'Berlin' } },
    { cityISO2: 'mun', countryISO2: 'de', name: { es: 'Múnich', en: 'Munich' } },
    { cityISO2: 'ham', countryISO2: 'de', name: { es: 'Hamburgo', en: 'Hamburg' } },
    { cityISO2: 'fra', countryISO2: 'de', name: { es: 'Fráncfort', en: 'Frankfurt' } },
    { cityISO2: 'col', countryISO2: 'de', name: { es: 'Colonia', en: 'Cologne' } },

    // Italia
    { cityISO2: 'rom', countryISO2: 'it', name: { es: 'Roma', en: 'Rome' } },
    { cityISO2: 'mil', countryISO2: 'it', name: { es: 'Milán', en: 'Milan' } },
    { cityISO2: 'nap', countryISO2: 'it', name: { es: 'Nápoles', en: 'Naples' } },
    { cityISO2: 'tur', countryISO2: 'it', name: { es: 'Turín', en: 'Turin' } },
    { cityISO2: 'flo', countryISO2: 'it', name: { es: 'Florencia', en: 'Florence' } },

    // Reino Unido
    { cityISO2: 'lon', countryISO2: 'gb', name: { es: 'Londres', en: 'London' } },
    { cityISO2: 'man', countryISO2: 'gb', name: { es: 'Mánchester', en: 'Manchester' } },
    { cityISO2: 'bir', countryISO2: 'gb', name: { es: 'Birmingham', en: 'Birmingham' } },
    { cityISO2: 'gla', countryISO2: 'gb', name: { es: 'Glasgow', en: 'Glasgow' } },
    { cityISO2: 'liv', countryISO2: 'gb', name: { es: 'Liverpool', en: 'Liverpool' } },

    // Portugal
    { cityISO2: 'lis', countryISO2: 'pt', name: { es: 'Lisboa', en: 'Lisbon' } },
    { cityISO2: 'opo', countryISO2: 'pt', name: { es: 'Oporto', en: 'Porto' } },
    { cityISO2: 'bra', countryISO2: 'pt', name: { es: 'Braga', en: 'Braga' } },

    // Países Bajos
    { cityISO2: 'ams', countryISO2: 'nl', name: { es: 'Ámsterdam', en: 'Amsterdam' } },
    { cityISO2: 'rot', countryISO2: 'nl', name: { es: 'Rotterdam', en: 'Rotterdam' } },
    { cityISO2: 'hag', countryISO2: 'nl', name: { es: 'La Haya', en: 'The Hague' } },
    { cityISO2: 'utr', countryISO2: 'nl', name: { es: 'Utrecht', en: 'Utrecht' } },

    // Bélgica
    { cityISO2: 'bru', countryISO2: 'be', name: { es: 'Bruselas', en: 'Brussels' } },
    { cityISO2: 'ant', countryISO2: 'be', name: { es: 'Amberes', en: 'Antwerp' } },
    { cityISO2: 'ghe', countryISO2: 'be', name: { es: 'Gante', en: 'Ghent' } },

    // Suiza
    { cityISO2: 'zur', countryISO2: 'ch', name: { es: 'Zúrich', en: 'Zurich' } },
    { cityISO2: 'gen', countryISO2: 'ch', name: { es: 'Ginebra', en: 'Geneva' } },
    { cityISO2: 'bas', countryISO2: 'ch', name: { es: 'Basilea', en: 'Basel' } },
    { cityISO2: 'ber_ch', countryISO2: 'ch', name: { es: 'Berna', en: 'Bern' } },

    // Austria
    { cityISO2: 'vie', countryISO2: 'at', name: { es: 'Viena', en: 'Vienna' } },
    { cityISO2: 'sal', countryISO2: 'at', name: { es: 'Salzburgo', en: 'Salzburg' } },
    { cityISO2: 'inn', countryISO2: 'at', name: { es: 'Innsbruck', en: 'Innsbruck' } },

    // Suecia
    { cityISO2: 'sto', countryISO2: 'se', name: { es: 'Estocolmo', en: 'Stockholm' } },
    { cityISO2: 'got', countryISO2: 'se', name: { es: 'Gotemburgo', en: 'Gothenburg' } },
    { cityISO2: 'mal', countryISO2: 'se', name: { es: 'Malmö', en: 'Malmo' } },

    // Noruega
    { cityISO2: 'osl', countryISO2: 'no', name: { es: 'Oslo', en: 'Oslo' } },
    { cityISO2: 'ber_no', countryISO2: 'no', name: { es: 'Bergen', en: 'Bergen' } },
    { cityISO2: 'tro', countryISO2: 'no', name: { es: 'Trondheim', en: 'Trondheim' } },

    // Dinamarca
    { cityISO2: 'cop', countryISO2: 'dk', name: { es: 'Copenhague', en: 'Copenhagen' } },
    { cityISO2: 'aar', countryISO2: 'dk', name: { es: 'Aarhus', en: 'Aarhus' } },

    // Finlandia
    { cityISO2: 'hel', countryISO2: 'fi', name: { es: 'Helsinki', en: 'Helsinki' } },
    { cityISO2: 'esp', countryISO2: 'fi', name: { es: 'Espoo', en: 'Espoo' } },

    // Polonia
    { cityISO2: 'war', countryISO2: 'pl', name: { es: 'Varsovia', en: 'Warsaw' } },
    { cityISO2: 'kra', countryISO2: 'pl', name: { es: 'Cracovia', en: 'Krakow' } },
    { cityISO2: 'wro', countryISO2: 'pl', name: { es: 'Breslavia', en: 'Wroclaw' } },

    // República Checa
    { cityISO2: 'pra', countryISO2: 'cz', name: { es: 'Praga', en: 'Prague' } },
    { cityISO2: 'brn', countryISO2: 'cz', name: { es: 'Brno', en: 'Brno' } },

    // Grecia
    { cityISO2: 'ath', countryISO2: 'gr', name: { es: 'Atenas', en: 'Athens' } },
    { cityISO2: 'the', countryISO2: 'gr', name: { es: 'Tesalónica', en: 'Thessaloniki' } },

    // Irlanda
    { cityISO2: 'dub', countryISO2: 'ie', name: { es: 'Dublín', en: 'Dublin' } },
    { cityISO2: 'cor', countryISO2: 'ie', name: { es: 'Cork', en: 'Cork' } },
];
