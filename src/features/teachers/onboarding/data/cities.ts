export interface City {
    city: string;
    country: string;
    name: {
        es: string;
        en: string;
    };
}

export const cities: City[] = [
    // España
    { city: 'm', country: 'es', name: { es: 'Madrid', en: 'Madrid' } },
    { city: 'b', country: 'es', name: { es: 'Barcelona', en: 'Barcelona' } },
    { city: 'v', country: 'es', name: { es: 'Valencia', en: 'Valencia' } },
    { city: 'se', country: 'es', name: { es: 'Sevilla', en: 'Seville' } },
    { city: 'z', country: 'es', name: { es: 'Zaragoza', en: 'Zaragoza' } },
    { city: 'ma', country: 'es', name: { es: 'Málaga', en: 'Malaga' } },
    { city: 'mu', country: 'es', name: { es: 'Murcia', en: 'Murcia' } },
    { city: 'pm', country: 'es', name: { es: 'Palma de Mallorca', en: 'Palma de Mallorca' } },
    { city: 'gc', country: 'es', name: { es: 'Las Palmas de Gran Canaria', en: 'Las Palmas de Gran Canaria' } },
    { city: 'bi', country: 'es', name: { es: 'Bilbao', en: 'Bilbao' } },
    { city: 'a', country: 'es', name: { es: 'Alicante', en: 'Alicante' } },
    { city: 'co', country: 'es', name: { es: 'Córdoba', en: 'Cordoba' } },
    { city: 'va', country: 'es', name: { es: 'Valladolid', en: 'Valladolid' } },
    { city: 'vi', country: 'es', name: { es: 'Vitoria', en: 'Vitoria' } },
    { city: 'gr', country: 'es', name: { es: 'Granada', en: 'Granada' } },
    
    // Estados Unidos
    { city: 'ny', country: 'us', name: { es: 'Nueva York', en: 'New York' } },
    { city: 'la', country: 'us', name: { es: 'Los Ángeles', en: 'Los Angeles' } },
    { city: 'chi', country: 'us', name: { es: 'Chicago', en: 'Chicago' } },
    { city: 'hou', country: 'us', name: { es: 'Houston', en: 'Houston' } },
    { city: 'phx', country: 'us', name: { es: 'Phoenix', en: 'Phoenix' } },
    { city: 'phi', country: 'us', name: { es: 'Filadelfia', en: 'Philadelphia' } },
    { city: 'sa', country: 'us', name: { es: 'San Antonio', en: 'San Antonio' } },
    { city: 'sd', country: 'us', name: { es: 'San Diego', en: 'San Diego' } },
    { city: 'dal', country: 'us', name: { es: 'Dallas', en: 'Dallas' } },
    { city: 'sj', country: 'us', name: { es: 'San José', en: 'San Jose' } },
    { city: 'aus', country: 'us', name: { es: 'Austin', en: 'Austin' } },
    { city: 'sf', country: 'us', name: { es: 'San Francisco', en: 'San Francisco' } },
    { city: 'sea', country: 'us', name: { es: 'Seattle', en: 'Seattle' } },
    { city: 'den', country: 'us', name: { es: 'Denver', en: 'Denver' } },
    { city: 'mia', country: 'us', name: { es: 'Miami', en: 'Miami' } },
    { city: 'bos', country: 'us', name: { es: 'Boston', en: 'Boston' } },
    { city: 'lv', country: 'us', name: { es: 'Las Vegas', en: 'Las Vegas' } },
    { city: 'por', country: 'us', name: { es: 'Portland', en: 'Portland' } },
    { city: 'dc', country: 'us', name: { es: 'Washington D.C.', en: 'Washington D.C.' } },
    { city: 'atl', country: 'us', name: { es: 'Atlanta', en: 'Atlanta' } },
    { city: 'nas', country: 'us', name: { es: 'Nashville', en: 'Nashville' } },
    { city: 'jax', country: 'us', name: { es: 'Jacksonville', en: 'Jacksonville' } },
    { city: 'ftw', country: 'us', name: { es: 'Fort Worth', en: 'Fort Worth' } },
    { city: 'clt', country: 'us', name: { es: 'Charlotte', en: 'Charlotte' } },
    { city: 'ind', country: 'us', name: { es: 'Indianápolis', en: 'Indianapolis' } },
    { city: 'cbus', country: 'us', name: { es: 'Columbus', en: 'Columbus' } },
    { city: 'det', country: 'us', name: { es: 'Detroit', en: 'Detroit' } },
    { city: 'mem', country: 'us', name: { es: 'Memphis', en: 'Memphis' } },
    { city: 'lou', country: 'us', name: { es: 'Louisville', en: 'Louisville' } },
    { city: 'bal', country: 'us', name: { es: 'Baltimore', en: 'Baltimore' } },
    { city: 'milw', country: 'us', name: { es: 'Milwaukee', en: 'Milwaukee' } },
    { city: 'abq', country: 'us', name: { es: 'Albuquerque', en: 'Albuquerque' } },
    { city: 'tuc', country: 'us', name: { es: 'Tucson', en: 'Tucson' } },
    { city: 'fre', country: 'us', name: { es: 'Fresno', en: 'Fresno' } },
    { city: 'sac', country: 'us', name: { es: 'Sacramento', en: 'Sacramento' } },
    { city: 'kci', country: 'us', name: { es: 'Kansas City', en: 'Kansas City' } },
    { city: 'lgb', country: 'us', name: { es: 'Long Beach', en: 'Long Beach' } },
    { city: 'mesa', country: 'us', name: { es: 'Mesa', en: 'Mesa' } },
    { city: 'rdu', country: 'us', name: { es: 'Raleigh', en: 'Raleigh' } },
    { city: 'oma', country: 'us', name: { es: 'Omaha', en: 'Omaha' } },
    { city: 'cle', country: 'us', name: { es: 'Cleveland', en: 'Cleveland' } },
    { city: 'msp', country: 'us', name: { es: 'Mineápolis', en: 'Minneapolis' } },
    { city: 'cos', country: 'us', name: { es: 'Colorado Springs', en: 'Colorado Springs' } },
    { city: 'wic', country: 'us', name: { es: 'Wichita', en: 'Wichita' } },
    { city: 'arlt', country: 'us', name: { es: 'Arlington', en: 'Arlington' } },
    { city: 'msy', country: 'us', name: { es: 'Nueva Orleans', en: 'New Orleans' } },
    { city: 'tpa', country: 'us', name: { es: 'Tampa', en: 'Tampa' } },
    { city: 'hnl', country: 'us', name: { es: 'Honolulú', en: 'Honolulu' } },
    { city: 'anh', country: 'us', name: { es: 'Anaheim', en: 'Anaheim' } },
    { city: 'crp', country: 'us', name: { es: 'Corpus Christi', en: 'Corpus Christi' } },
    { city: 'riv', country: 'us', name: { es: 'Riverside', en: 'Riverside' } },
    { city: 'lex', country: 'us', name: { es: 'Lexington', en: 'Lexington' } },
    { city: 'stl', country: 'us', name: { es: 'San Luis', en: 'St. Louis' } },
    { city: 'pit', country: 'us', name: { es: 'Pittsburgh', en: 'Pittsburgh' } },
    { city: 'anc', country: 'us', name: { es: 'Anchorage', en: 'Anchorage' } },
    { city: 'cin', country: 'us', name: { es: 'Cincinnati', en: 'Cincinnati' } },
    { city: 'mco', country: 'us', name: { es: 'Orlando', en: 'Orlando' } },
    { city: 'stpfl', country: 'us', name: { es: 'San Petersburgo', en: 'St. Petersburg' } },
    { city: 'orf', country: 'us', name: { es: 'Norfolk', en: 'Norfolk' } },
    { city: 'msn', country: 'us', name: { es: 'Madison', en: 'Madison' } },
    { city: 'dur', country: 'us', name: { es: 'Durham', en: 'Durham' } },
    { city: 'lub', country: 'us', name: { es: 'Lubbock', en: 'Lubbock' } },
    { city: 'btr', country: 'us', name: { es: 'Baton Rouge', en: 'Baton Rouge' } },
    { city: 'irv', country: 'us', name: { es: 'Irvine', en: 'Irvine' } },
    { city: 'sdl', country: 'us', name: { es: 'Scottsdale', en: 'Scottsdale' } },
    { city: 'frmt', country: 'us', name: { es: 'Fremont', en: 'Fremont' } },
    { city: 'sbd', country: 'us', name: { es: 'San Bernardino', en: 'San Bernardino' } },
    { city: 'bhm', country: 'us', name: { es: 'Birmingham', en: 'Birmingham' } },
    { city: 'roc', country: 'us', name: { es: 'Rochester', en: 'Rochester' } },
    { city: 'ric', country: 'us', name: { es: 'Richmond', en: 'Richmond' } },
    { city: 'rno', country: 'us', name: { es: 'Reno', en: 'Reno' } },
    { city: 'hnd', country: 'us', name: { es: 'Henderson', en: 'Henderson' } },
    { city: 'lnk', country: 'us', name: { es: 'Lincoln', en: 'Lincoln' } },
    { city: 'buf', country: 'us', name: { es: 'Búfalo', en: 'Buffalo' } },
    { city: 'jcy', country: 'us', name: { es: 'Jersey City', en: 'Jersey City' } },
    { city: 'nwk', country: 'us', name: { es: 'Newark', en: 'Newark' } },
    { city: 'tol', country: 'us', name: { es: 'Toledo', en: 'Toledo' } },
    { city: 'gso', country: 'us', name: { es: 'Greensboro', en: 'Greensboro' } },
    { city: 'spm', country: 'us', name: { es: 'Saint Paul', en: 'Saint Paul' } },
    { city: 'lrd', country: 'us', name: { es: 'Laredo', en: 'Laredo' } },
    { city: 'elp', country: 'us', name: { es: 'El Paso', en: 'El Paso' } },
    { city: 'cvu', country: 'us', name: { es: 'Chula Vista', en: 'Chula Vista' } },
    { city: 'pln', country: 'us', name: { es: 'Plano', en: 'Plano' } },
    { city: 'hiaj', country: 'us', name: { es: 'Hialeah', en: 'Hialeah' } },
    { city: 'fwa', country: 'us', name: { es: 'Fort Wayne', en: 'Fort Wayne' } },
    { city: 'cha', country: 'us', name: { es: 'Chandler', en: 'Chandler' } },
    { city: 'grl', country: 'us', name: { es: 'Garland', en: 'Garland' } },
    { city: 'wsm', country: 'us', name: { es: 'Winston-Salem', en: 'Winston-Salem' } },

    // Francia
    { city: 'par', country: 'fr', name: { es: 'París', en: 'Paris' } },
    { city: 'mar', country: 'fr', name: { es: 'Marsella', en: 'Marseille' } },
    { city: 'lyo', country: 'fr', name: { es: 'Lyon', en: 'Lyon' } },
    { city: 'tou', country: 'fr', name: { es: 'Toulouse', en: 'Toulouse' } },
    { city: 'nic', country: 'fr', name: { es: 'Niza', en: 'Nice' } },

    // Alemania
    { city: 'ber', country: 'de', name: { es: 'Berlín', en: 'Berlin' } },
    { city: 'mun', country: 'de', name: { es: 'Múnich', en: 'Munich' } },
    { city: 'ham', country: 'de', name: { es: 'Hamburgo', en: 'Hamburg' } },
    { city: 'fra', country: 'de', name: { es: 'Fráncfort', en: 'Frankfurt' } },
    { city: 'col', country: 'de', name: { es: 'Colonia', en: 'Cologne' } },

    // Italia
    { city: 'rom', country: 'it', name: { es: 'Roma', en: 'Rome' } },
    { city: 'mil', country: 'it', name: { es: 'Milán', en: 'Milan' } },
    { city: 'nap', country: 'it', name: { es: 'Nápoles', en: 'Naples' } },
    { city: 'tur', country: 'it', name: { es: 'Turín', en: 'Turin' } },
    { city: 'flo', country: 'it', name: { es: 'Florencia', en: 'Florence' } },

    // Reino Unido
    { city: 'lon', country: 'gb', name: { es: 'Londres', en: 'London' } },
    { city: 'man', country: 'gb', name: { es: 'Mánchester', en: 'Manchester' } },
    { city: 'bir', country: 'gb', name: { es: 'Birmingham', en: 'Birmingham' } },
    { city: 'gla', country: 'gb', name: { es: 'Glasgow', en: 'Glasgow' } },
    { city: 'liv', country: 'gb', name: { es: 'Liverpool', en: 'Liverpool' } },

    // Portugal
    { city: 'lis', country: 'pt', name: { es: 'Lisboa', en: 'Lisbon' } },
    { city: 'opo', country: 'pt', name: { es: 'Oporto', en: 'Porto' } },
    { city: 'bra', country: 'pt', name: { es: 'Braga', en: 'Braga' } },

    // Países Bajos
    { city: 'ams', country: 'nl', name: { es: 'Ámsterdam', en: 'Amsterdam' } },
    { city: 'rot', country: 'nl', name: { es: 'Rotterdam', en: 'Rotterdam' } },
    { city: 'hag', country: 'nl', name: { es: 'La Haya', en: 'The Hague' } },
    { city: 'utr', country: 'nl', name: { es: 'Utrecht', en: 'Utrecht' } },

    // Bélgica
    { city: 'bru', country: 'be', name: { es: 'Bruselas', en: 'Brussels' } },
    { city: 'ant', country: 'be', name: { es: 'Amberes', en: 'Antwerp' } },
    { city: 'ghe', country: 'be', name: { es: 'Gante', en: 'Ghent' } },

    // Suiza
    { city: 'zur', country: 'ch', name: { es: 'Zúrich', en: 'Zurich' } },
    { city: 'gen', country: 'ch', name: { es: 'Ginebra', en: 'Geneva' } },
    { city: 'bas', country: 'ch', name: { es: 'Basilea', en: 'Basel' } },
    { city: 'ber_ch', country: 'ch', name: { es: 'Berna', en: 'Bern' } },

    // Austria
    { city: 'vie', country: 'at', name: { es: 'Viena', en: 'Vienna' } },
    { city: 'sal', country: 'at', name: { es: 'Salzburgo', en: 'Salzburg' } },
    { city: 'inn', country: 'at', name: { es: 'Innsbruck', en: 'Innsbruck' } },

    // Suecia
    { city: 'sto', country: 'se', name: { es: 'Estocolmo', en: 'Stockholm' } },
    { city: 'got', country: 'se', name: { es: 'Gotemburgo', en: 'Gothenburg' } },
    { city: 'mal', country: 'se', name: { es: 'Malmö', en: 'Malmo' } },

    // Noruega
    { city: 'osl', country: 'no', name: { es: 'Oslo', en: 'Oslo' } },
    { city: 'ber_no', country: 'no', name: { es: 'Bergen', en: 'Bergen' } },
    { city: 'tro', country: 'no', name: { es: 'Trondheim', en: 'Trondheim' } },

    // Dinamarca
    { city: 'cop', country: 'dk', name: { es: 'Copenhague', en: 'Copenhagen' } },
    { city: 'aar', country: 'dk', name: { es: 'Aarhus', en: 'Aarhus' } },

    // Finlandia
    { city: 'hel', country: 'fi', name: { es: 'Helsinki', en: 'Helsinki' } },
    { city: 'esp', country: 'fi', name: { es: 'Espoo', en: 'Espoo' } },

    // Polonia
    { city: 'war', country: 'pl', name: { es: 'Varsovia', en: 'Warsaw' } },
    { city: 'kra', country: 'pl', name: { es: 'Cracovia', en: 'Krakow' } },
    { city: 'wro', country: 'pl', name: { es: 'Breslavia', en: 'Wroclaw' } },

    // República Checa
    { city: 'pra', country: 'cz', name: { es: 'Praga', en: 'Prague' } },
    { city: 'brn', country: 'cz', name: { es: 'Brno', en: 'Brno' } },

    // Grecia
    { city: 'ath', country: 'gr', name: { es: 'Atenas', en: 'Athens' } },
    { city: 'the', country: 'gr', name: { es: 'Tesalónica', en: 'Thessaloniki' } },

    // Irlanda
    { city: 'dub', country: 'ie', name: { es: 'Dublín', en: 'Dublin' } },
    { city: 'cor', country: 'ie', name: { es: 'Cork', en: 'Cork' } },
];
