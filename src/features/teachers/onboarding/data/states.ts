export interface State {
    stateISO2: string;
    countryISO2: string;
    name: {
        es: string;
        en: string;
    };
}

export const states: State[] = [
    // España - Comunidades Autónomas
    { stateISO2: 'es-md', countryISO2: 'es', name: { es: 'Comunidad de Madrid', en: 'Community of Madrid' } },
    { stateISO2: 'es-ct', countryISO2: 'es', name: { es: 'Cataluña', en: 'Catalonia' } },
    { stateISO2: 'es-vc', countryISO2: 'es', name: { es: 'Comunidad Valenciana', en: 'Valencian Community' } },
    { stateISO2: 'es-an', countryISO2: 'es', name: { es: 'Andalucía', en: 'Andalusia' } },
    { stateISO2: 'es-ga', countryISO2: 'es', name: { es: 'Galicia', en: 'Galicia' } },
    { stateISO2: 'es-pv', countryISO2: 'es', name: { es: 'País Vasco', en: 'Basque Country' } },
    { stateISO2: 'es-ar', countryISO2: 'es', name: { es: 'Aragón', en: 'Aragon' } },
    { stateISO2: 'es-cl', countryISO2: 'es', name: { es: 'Castilla y León', en: 'Castile and León' } },
    { stateISO2: 'es-cm', countryISO2: 'es', name: { es: 'Castilla-La Mancha', en: 'Castile-La Mancha' } },
    { stateISO2: 'es-mu', countryISO2: 'es', name: { es: 'Región de Murcia', en: 'Region of Murcia' } },
    { stateISO2: 'es-as', countryISO2: 'es', name: { es: 'Principado de Asturias', en: 'Principality of Asturias' } },
    { stateISO2: 'es-ex', countryISO2: 'es', name: { es: 'Extremadura', en: 'Extremadura' } },
    { stateISO2: 'es-ib', countryISO2: 'es', name: { es: 'Islas Baleares', en: 'Balearic Islands' } },
    { stateISO2: 'es-cn', countryISO2: 'es', name: { es: 'Canarias', en: 'Canary Islands' } },
    { stateISO2: 'es-ri', countryISO2: 'es', name: { es: 'La Rioja', en: 'La Rioja' } },
    { stateISO2: 'es-na', countryISO2: 'es', name: { es: 'Navarra', en: 'Navarre' } },
    { stateISO2: 'es-cb', countryISO2: 'es', name: { es: 'Cantabria', en: 'Cantabria' } },

    // Estados Unidos - States
    { stateISO2: 'us-al', countryISO2: 'us', name: { es: 'Alabama', en: 'Alabama' } },
    { stateISO2: 'us-ak', countryISO2: 'us', name: { es: 'Alaska', en: 'Alaska' } },
    { stateISO2: 'us-az', countryISO2: 'us', name: { es: 'Arizona', en: 'Arizona' } },
    { stateISO2: 'us-ar', countryISO2: 'us', name: { es: 'Arkansas', en: 'Arkansas' } },
    { stateISO2: 'us-ca', countryISO2: 'us', name: { es: 'California', en: 'California' } },
    { stateISO2: 'us-co', countryISO2: 'us', name: { es: 'Colorado', en: 'Colorado' } },
    { stateISO2: 'us-ct', countryISO2: 'us', name: { es: 'Connecticut', en: 'Connecticut' } },
    { stateISO2: 'us-de', countryISO2: 'us', name: { es: 'Delaware', en: 'Delaware' } },
    { stateISO2: 'us-fl', countryISO2: 'us', name: { es: 'Florida', en: 'Florida' } },
    { stateISO2: 'us-ga', countryISO2: 'us', name: { es: 'Georgia', en: 'Georgia' } },
    { stateISO2: 'us-hi', countryISO2: 'us', name: { es: 'Hawái', en: 'Hawaii' } },
    { stateISO2: 'us-id', countryISO2: 'us', name: { es: 'Idaho', en: 'Idaho' } },
    { stateISO2: 'us-il', countryISO2: 'us', name: { es: 'Illinois', en: 'Illinois' } },
    { stateISO2: 'us-in', countryISO2: 'us', name: { es: 'Indiana', en: 'Indiana' } },
    { stateISO2: 'us-ia', countryISO2: 'us', name: { es: 'Iowa', en: 'Iowa' } },
    { stateISO2: 'us-ks', countryISO2: 'us', name: { es: 'Kansas', en: 'Kansas' } },
    { stateISO2: 'us-ky', countryISO2: 'us', name: { es: 'Kentucky', en: 'Kentucky' } },
    { stateISO2: 'us-la', countryISO2: 'us', name: { es: 'Luisiana', en: 'Louisiana' } },
    { stateISO2: 'us-me', countryISO2: 'us', name: { es: 'Maine', en: 'Maine' } },
    { stateISO2: 'us-md', countryISO2: 'us', name: { es: 'Maryland', en: 'Maryland' } },
    { stateISO2: 'us-ma', countryISO2: 'us', name: { es: 'Massachusetts', en: 'Massachusetts' } },
    { stateISO2: 'us-mi', countryISO2: 'us', name: { es: 'Míchigan', en: 'Michigan' } },
    { stateISO2: 'us-mn', countryISO2: 'us', name: { es: 'Minnesota', en: 'Minnesota' } },
    { stateISO2: 'us-ms', countryISO2: 'us', name: { es: 'Misisipi', en: 'Mississippi' } },
    { stateISO2: 'us-mo', countryISO2: 'us', name: { es: 'Misuri', en: 'Missouri' } },
    { stateISO2: 'us-mt', countryISO2: 'us', name: { es: 'Montana', en: 'Montana' } },
    { stateISO2: 'us-ne', countryISO2: 'us', name: { es: 'Nebraska', en: 'Nebraska' } },
    { stateISO2: 'us-nv', countryISO2: 'us', name: { es: 'Nevada', en: 'Nevada' } },
    { stateISO2: 'us-nh', countryISO2: 'us', name: { es: 'Nuevo Hampshire', en: 'New Hampshire' } },
    { stateISO2: 'us-nj', countryISO2: 'us', name: { es: 'Nueva Jersey', en: 'New Jersey' } },
    { stateISO2: 'us-nm', countryISO2: 'us', name: { es: 'Nuevo México', en: 'New Mexico' } },
    { stateISO2: 'us-ny', countryISO2: 'us', name: { es: 'Nueva York', en: 'New York' } },
    { stateISO2: 'us-nc', countryISO2: 'us', name: { es: 'Carolina del Norte', en: 'North Carolina' } },
    { stateISO2: 'us-nd', countryISO2: 'us', name: { es: 'Dakota del Norte', en: 'North Dakota' } },
    { stateISO2: 'us-oh', countryISO2: 'us', name: { es: 'Ohio', en: 'Ohio' } },
    { stateISO2: 'us-ok', countryISO2: 'us', name: { es: 'Oklahoma', en: 'Oklahoma' } },
    { stateISO2: 'us-or', countryISO2: 'us', name: { es: 'Oregón', en: 'Oregon' } },
    { stateISO2: 'us-pa', countryISO2: 'us', name: { es: 'Pensilvania', en: 'Pennsylvania' } },
    { stateISO2: 'us-ri', countryISO2: 'us', name: { es: 'Rhode Island', en: 'Rhode Island' } },
    { stateISO2: 'us-sc', countryISO2: 'us', name: { es: 'Carolina del Sur', en: 'South Carolina' } },
    { stateISO2: 'us-sd', countryISO2: 'us', name: { es: 'Dakota del Sur', en: 'South Dakota' } },
    { stateISO2: 'us-tn', countryISO2: 'us', name: { es: 'Tennessee', en: 'Tennessee' } },
    { stateISO2: 'us-tx', countryISO2: 'us', name: { es: 'Texas', en: 'Texas' } },
    { stateISO2: 'us-ut', countryISO2: 'us', name: { es: 'Utah', en: 'Utah' } },
    { stateISO2: 'us-vt', countryISO2: 'us', name: { es: 'Vermont', en: 'Vermont' } },
    { stateISO2: 'us-va', countryISO2: 'us', name: { es: 'Virginia', en: 'Virginia' } },
    { stateISO2: 'us-wa', countryISO2: 'us', name: { es: 'Washington', en: 'Washington' } },
    { stateISO2: 'us-wv', countryISO2: 'us', name: { es: 'Virginia Occidental', en: 'West Virginia' } },
    { stateISO2: 'us-wi', countryISO2: 'us', name: { es: 'Wisconsin', en: 'Wisconsin' } },
    { stateISO2: 'us-wy', countryISO2: 'us', name: { es: 'Wyoming', en: 'Wyoming' } },
    { stateISO2: 'us-dc', countryISO2: 'us', name: { es: 'Distrito de Columbia', en: 'District of Columbia' } },

    // Francia - Regiones
    { stateISO2: 'fr-idf', countryISO2: 'fr', name: { es: 'Isla de Francia', en: 'Île-de-France' } },
    { stateISO2: 'fr-ara', countryISO2: 'fr', name: { es: 'Auvernia-Ródano-Alpes', en: 'Auvergne-Rhône-Alpes' } },
    { stateISO2: 'fr-pac', countryISO2: 'fr', name: { es: 'Provenza-Alpes-Costa Azul', en: 'Provence-Alpes-Côte d\'Azur' } },
    { stateISO2: 'fr-occ', countryISO2: 'fr', name: { es: 'Occitania', en: 'Occitanie' } },
    { stateISO2: 'fr-naq', countryISO2: 'fr', name: { es: 'Nueva Aquitania', en: 'Nouvelle-Aquitaine' } },

    // Alemania - Estados
    { stateISO2: 'de-bw', countryISO2: 'de', name: { es: 'Baden-Wurtemberg', en: 'Baden-Württemberg' } },
    { stateISO2: 'de-by', countryISO2: 'de', name: { es: 'Baviera', en: 'Bavaria' } },
    { stateISO2: 'de-be', countryISO2: 'de', name: { es: 'Berlín', en: 'Berlin' } },
    { stateISO2: 'de-hh', countryISO2: 'de', name: { es: 'Hamburgo', en: 'Hamburg' } },
    { stateISO2: 'de-he', countryISO2: 'de', name: { es: 'Hesse', en: 'Hesse' } },
    { stateISO2: 'de-nw', countryISO2: 'de', name: { es: 'Renania del Norte-Westfalia', en: 'North Rhine-Westphalia' } },

    // Italia - Regiones
    { stateISO2: 'it-laz', countryISO2: 'it', name: { es: 'Lacio', en: 'Lazio' } },
    { stateISO2: 'it-lom', countryISO2: 'it', name: { es: 'Lombardía', en: 'Lombardy' } },
    { stateISO2: 'it-cam', countryISO2: 'it', name: { es: 'Campania', en: 'Campania' } },
    { stateISO2: 'it-pie', countryISO2: 'it', name: { es: 'Piamonte', en: 'Piedmont' } },
    { stateISO2: 'it-tos', countryISO2: 'it', name: { es: 'Toscana', en: 'Tuscany' } },

    // Reino Unido - Países constituyentes
    { stateISO2: 'gb-eng', countryISO2: 'gb', name: { es: 'Inglaterra', en: 'England' } },
    { stateISO2: 'gb-sct', countryISO2: 'gb', name: { es: 'Escocia', en: 'Scotland' } },
    { stateISO2: 'gb-wls', countryISO2: 'gb', name: { es: 'Gales', en: 'Wales' } },
    { stateISO2: 'gb-nir', countryISO2: 'gb', name: { es: 'Irlanda del Norte', en: 'Northern Ireland' } },

    // Portugal - Distritos principales
    { stateISO2: 'pt-11', countryISO2: 'pt', name: { es: 'Lisboa', en: 'Lisbon' } },
    { stateISO2: 'pt-13', countryISO2: 'pt', name: { es: 'Oporto', en: 'Porto' } },
    { stateISO2: 'pt-03', countryISO2: 'pt', name: { es: 'Braga', en: 'Braga' } },

    // Países Bajos - Provincias
    { stateISO2: 'nl-nh', countryISO2: 'nl', name: { es: 'Holanda Septentrional', en: 'North Holland' } },
    { stateISO2: 'nl-zh', countryISO2: 'nl', name: { es: 'Holanda Meridional', en: 'South Holland' } },
    { stateISO2: 'nl-ut', countryISO2: 'nl', name: { es: 'Utrecht', en: 'Utrecht' } },

    // Bélgica - Regiones
    { stateISO2: 'be-bru', countryISO2: 'be', name: { es: 'Región de Bruselas-Capital', en: 'Brussels-Capital Region' } },
    { stateISO2: 'be-vlg', countryISO2: 'be', name: { es: 'Flandes', en: 'Flanders' } },
    { stateISO2: 'be-wal', countryISO2: 'be', name: { es: 'Valonia', en: 'Wallonia' } },

    // Suiza - Cantones principales
    { stateISO2: 'ch-zh', countryISO2: 'ch', name: { es: 'Zúrich', en: 'Zurich' } },
    { stateISO2: 'ch-ge', countryISO2: 'ch', name: { es: 'Ginebra', en: 'Geneva' } },
    { stateISO2: 'ch-bs', countryISO2: 'ch', name: { es: 'Basilea-Ciudad', en: 'Basel-Stadt' } },
    { stateISO2: 'ch-be', countryISO2: 'ch', name: { es: 'Berna', en: 'Bern' } },

    // Austria - Estados
    { stateISO2: 'at-9', countryISO2: 'at', name: { es: 'Viena', en: 'Vienna' } },
    { stateISO2: 'at-5', countryISO2: 'at', name: { es: 'Salzburgo', en: 'Salzburg' } },
    { stateISO2: 'at-7', countryISO2: 'at', name: { es: 'Tirol', en: 'Tyrol' } },

    // Suecia - Condados principales
    { stateISO2: 'se-ab', countryISO2: 'se', name: { es: 'Estocolmo', en: 'Stockholm' } },
    { stateISO2: 'se-o', countryISO2: 'se', name: { es: 'Gotemburgo', en: 'Västra Götaland' } },
    { stateISO2: 'se-m', countryISO2: 'se', name: { es: 'Malmö', en: 'Skåne' } },

    // Noruega - Condados principales
    { stateISO2: 'no-03', countryISO2: 'no', name: { es: 'Oslo', en: 'Oslo' } },
    { stateISO2: 'no-46', countryISO2: 'no', name: { es: 'Vestland', en: 'Vestland' } },
    { stateISO2: 'no-50', countryISO2: 'no', name: { es: 'Trøndelag', en: 'Trøndelag' } },

    // Dinamarca - Regiones
    { stateISO2: 'dk-84', countryISO2: 'dk', name: { es: 'Región Capital', en: 'Capital Region' } },
    { stateISO2: 'dk-82', countryISO2: 'dk', name: { es: 'Jutlandia Central', en: 'Central Jutland' } },

    // Finlandia - Regiones principales
    { stateISO2: 'fi-01', countryISO2: 'fi', name: { es: 'Uusimaa', en: 'Uusimaa' } },

    // Polonia - Voivodatos principales
    { stateISO2: 'pl-14', countryISO2: 'pl', name: { es: 'Mazovia', en: 'Masovian' } },
    { stateISO2: 'pl-12', countryISO2: 'pl', name: { es: 'Pequeña Polonia', en: 'Lesser Poland' } },
    { stateISO2: 'pl-02', countryISO2: 'pl', name: { es: 'Baja Silesia', en: 'Lower Silesian' } },

    // República Checa - Regiones
    { stateISO2: 'cz-10', countryISO2: 'cz', name: { es: 'Praga', en: 'Prague' } },
    { stateISO2: 'cz-64', countryISO2: 'cz', name: { es: 'Moravia del Sur', en: 'South Moravian' } },

    // Grecia - Regiones
    { stateISO2: 'gr-i', countryISO2: 'gr', name: { es: 'Ática', en: 'Attica' } },
    { stateISO2: 'gr-b', countryISO2: 'gr', name: { es: 'Macedonia Central', en: 'Central Macedonia' } },

    // Irlanda - Condados principales
    { stateISO2: 'ie-d', countryISO2: 'ie', name: { es: 'Dublín', en: 'Dublin' } },
    { stateISO2: 'ie-co', countryISO2: 'ie', name: { es: 'Cork', en: 'Cork' } },
];
