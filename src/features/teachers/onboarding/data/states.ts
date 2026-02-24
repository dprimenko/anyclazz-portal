export interface State {
    state: string;
    country: string;
    name: {
        es: string;
        en: string;
    };
}

export const states: State[] = [
    // España - Comunidades Autónomas
    { state: 'es-md', country: 'es', name: { es: 'Comunidad de Madrid', en: 'Community of Madrid' } },
    { state: 'es-ct', country: 'es', name: { es: 'Cataluña', en: 'Catalonia' } },
    { state: 'es-vc', country: 'es', name: { es: 'Comunidad Valenciana', en: 'Valencian Community' } },
    { state: 'es-an', country: 'es', name: { es: 'Andalucía', en: 'Andalusia' } },
    { state: 'es-ga', country: 'es', name: { es: 'Galicia', en: 'Galicia' } },
    { state: 'es-pv', country: 'es', name: { es: 'País Vasco', en: 'Basque Country' } },
    { state: 'es-ar', country: 'es', name: { es: 'Aragón', en: 'Aragon' } },
    { state: 'es-cl', country: 'es', name: { es: 'Castilla y León', en: 'Castile and León' } },
    { state: 'es-cm', country: 'es', name: { es: 'Castilla-La Mancha', en: 'Castile-La Mancha' } },
    { state: 'es-mu', country: 'es', name: { es: 'Región de Murcia', en: 'Region of Murcia' } },
    { state: 'es-as', country: 'es', name: { es: 'Principado de Asturias', en: 'Principality of Asturias' } },
    { state: 'es-ex', country: 'es', name: { es: 'Extremadura', en: 'Extremadura' } },
    { state: 'es-ib', country: 'es', name: { es: 'Islas Baleares', en: 'Balearic Islands' } },
    { state: 'es-cn', country: 'es', name: { es: 'Canarias', en: 'Canary Islands' } },
    { state: 'es-ri', country: 'es', name: { es: 'La Rioja', en: 'La Rioja' } },
    { state: 'es-na', country: 'es', name: { es: 'Navarra', en: 'Navarre' } },
    { state: 'es-cb', country: 'es', name: { es: 'Cantabria', en: 'Cantabria' } },

    // Estados Unidos - States
    { state: 'us-al', country: 'us', name: { es: 'Alabama', en: 'Alabama' } },
    { state: 'us-ak', country: 'us', name: { es: 'Alaska', en: 'Alaska' } },
    { state: 'us-az', country: 'us', name: { es: 'Arizona', en: 'Arizona' } },
    { state: 'us-ar', country: 'us', name: { es: 'Arkansas', en: 'Arkansas' } },
    { state: 'us-ca', country: 'us', name: { es: 'California', en: 'California' } },
    { state: 'us-co', country: 'us', name: { es: 'Colorado', en: 'Colorado' } },
    { state: 'us-ct', country: 'us', name: { es: 'Connecticut', en: 'Connecticut' } },
    { state: 'us-de', country: 'us', name: { es: 'Delaware', en: 'Delaware' } },
    { state: 'us-fl', country: 'us', name: { es: 'Florida', en: 'Florida' } },
    { state: 'us-ga', country: 'us', name: { es: 'Georgia', en: 'Georgia' } },
    { state: 'us-hi', country: 'us', name: { es: 'Hawái', en: 'Hawaii' } },
    { state: 'us-id', country: 'us', name: { es: 'Idaho', en: 'Idaho' } },
    { state: 'us-il', country: 'us', name: { es: 'Illinois', en: 'Illinois' } },
    { state: 'us-in', country: 'us', name: { es: 'Indiana', en: 'Indiana' } },
    { state: 'us-ia', country: 'us', name: { es: 'Iowa', en: 'Iowa' } },
    { state: 'us-ks', country: 'us', name: { es: 'Kansas', en: 'Kansas' } },
    { state: 'us-ky', country: 'us', name: { es: 'Kentucky', en: 'Kentucky' } },
    { state: 'us-la', country: 'us', name: { es: 'Luisiana', en: 'Louisiana' } },
    { state: 'us-me', country: 'us', name: { es: 'Maine', en: 'Maine' } },
    { state: 'us-md', country: 'us', name: { es: 'Maryland', en: 'Maryland' } },
    { state: 'us-ma', country: 'us', name: { es: 'Massachusetts', en: 'Massachusetts' } },
    { state: 'us-mi', country: 'us', name: { es: 'Míchigan', en: 'Michigan' } },
    { state: 'us-mn', country: 'us', name: { es: 'Minnesota', en: 'Minnesota' } },
    { state: 'us-ms', country: 'us', name: { es: 'Misisipi', en: 'Mississippi' } },
    { state: 'us-mo', country: 'us', name: { es: 'Misuri', en: 'Missouri' } },
    { state: 'us-mt', country: 'us', name: { es: 'Montana', en: 'Montana' } },
    { state: 'us-ne', country: 'us', name: { es: 'Nebraska', en: 'Nebraska' } },
    { state: 'us-nv', country: 'us', name: { es: 'Nevada', en: 'Nevada' } },
    { state: 'us-nh', country: 'us', name: { es: 'Nuevo Hampshire', en: 'New Hampshire' } },
    { state: 'us-nj', country: 'us', name: { es: 'Nueva Jersey', en: 'New Jersey' } },
    { state: 'us-nm', country: 'us', name: { es: 'Nuevo México', en: 'New Mexico' } },
    { state: 'us-ny', country: 'us', name: { es: 'Nueva York', en: 'New York' } },
    { state: 'us-nc', country: 'us', name: { es: 'Carolina del Norte', en: 'North Carolina' } },
    { state: 'us-nd', country: 'us', name: { es: 'Dakota del Norte', en: 'North Dakota' } },
    { state: 'us-oh', country: 'us', name: { es: 'Ohio', en: 'Ohio' } },
    { state: 'us-ok', country: 'us', name: { es: 'Oklahoma', en: 'Oklahoma' } },
    { state: 'us-or', country: 'us', name: { es: 'Oregón', en: 'Oregon' } },
    { state: 'us-pa', country: 'us', name: { es: 'Pensilvania', en: 'Pennsylvania' } },
    { state: 'us-ri', country: 'us', name: { es: 'Rhode Island', en: 'Rhode Island' } },
    { state: 'us-sc', country: 'us', name: { es: 'Carolina del Sur', en: 'South Carolina' } },
    { state: 'us-sd', country: 'us', name: { es: 'Dakota del Sur', en: 'South Dakota' } },
    { state: 'us-tn', country: 'us', name: { es: 'Tennessee', en: 'Tennessee' } },
    { state: 'us-tx', country: 'us', name: { es: 'Texas', en: 'Texas' } },
    { state: 'us-ut', country: 'us', name: { es: 'Utah', en: 'Utah' } },
    { state: 'us-vt', country: 'us', name: { es: 'Vermont', en: 'Vermont' } },
    { state: 'us-va', country: 'us', name: { es: 'Virginia', en: 'Virginia' } },
    { state: 'us-wa', country: 'us', name: { es: 'Washington', en: 'Washington' } },
    { state: 'us-wv', country: 'us', name: { es: 'Virginia Occidental', en: 'West Virginia' } },
    { state: 'us-wi', country: 'us', name: { es: 'Wisconsin', en: 'Wisconsin' } },
    { state: 'us-wy', country: 'us', name: { es: 'Wyoming', en: 'Wyoming' } },
    { state: 'us-dc', country: 'us', name: { es: 'Distrito de Columbia', en: 'District of Columbia' } },

    // Francia - Regiones
    { state: 'fr-idf', country: 'fr', name: { es: 'Isla de Francia', en: 'Île-de-France' } },
    { state: 'fr-ara', country: 'fr', name: { es: 'Auvernia-Ródano-Alpes', en: 'Auvergne-Rhône-Alpes' } },
    { state: 'fr-pac', country: 'fr', name: { es: 'Provenza-Alpes-Costa Azul', en: 'Provence-Alpes-Côte d\'Azur' } },
    { state: 'fr-occ', country: 'fr', name: { es: 'Occitania', en: 'Occitanie' } },
    { state: 'fr-naq', country: 'fr', name: { es: 'Nueva Aquitania', en: 'Nouvelle-Aquitaine' } },

    // Alemania - Estados
    { state: 'de-bw', country: 'de', name: { es: 'Baden-Wurtemberg', en: 'Baden-Württemberg' } },
    { state: 'de-by', country: 'de', name: { es: 'Baviera', en: 'Bavaria' } },
    { state: 'de-be', country: 'de', name: { es: 'Berlín', en: 'Berlin' } },
    { state: 'de-hh', country: 'de', name: { es: 'Hamburgo', en: 'Hamburg' } },
    { state: 'de-he', country: 'de', name: { es: 'Hesse', en: 'Hesse' } },
    { state: 'de-nw', country: 'de', name: { es: 'Renania del Norte-Westfalia', en: 'North Rhine-Westphalia' } },

    // Italia - Regiones
    { state: 'it-laz', country: 'it', name: { es: 'Lacio', en: 'Lazio' } },
    { state: 'it-lom', country: 'it', name: { es: 'Lombardía', en: 'Lombardy' } },
    { state: 'it-cam', country: 'it', name: { es: 'Campania', en: 'Campania' } },
    { state: 'it-pie', country: 'it', name: { es: 'Piamonte', en: 'Piedmont' } },
    { state: 'it-tos', country: 'it', name: { es: 'Toscana', en: 'Tuscany' } },

    // Reino Unido - Países constituyentes
    { state: 'gb-eng', country: 'gb', name: { es: 'Inglaterra', en: 'England' } },
    { state: 'gb-sct', country: 'gb', name: { es: 'Escocia', en: 'Scotland' } },
    { state: 'gb-wls', country: 'gb', name: { es: 'Gales', en: 'Wales' } },
    { state: 'gb-nir', country: 'gb', name: { es: 'Irlanda del Norte', en: 'Northern Ireland' } },

    // Portugal - Distritos principales
    { state: 'pt-11', country: 'pt', name: { es: 'Lisboa', en: 'Lisbon' } },
    { state: 'pt-13', country: 'pt', name: { es: 'Oporto', en: 'Porto' } },
    { state: 'pt-03', country: 'pt', name: { es: 'Braga', en: 'Braga' } },

    // Países Bajos - Provincias
    { state: 'nl-nh', country: 'nl', name: { es: 'Holanda Septentrional', en: 'North Holland' } },
    { state: 'nl-zh', country: 'nl', name: { es: 'Holanda Meridional', en: 'South Holland' } },
    { state: 'nl-ut', country: 'nl', name: { es: 'Utrecht', en: 'Utrecht' } },

    // Bélgica - Regiones
    { state: 'be-bru', country: 'be', name: { es: 'Región de Bruselas-Capital', en: 'Brussels-Capital Region' } },
    { state: 'be-vlg', country: 'be', name: { es: 'Flandes', en: 'Flanders' } },
    { state: 'be-wal', country: 'be', name: { es: 'Valonia', en: 'Wallonia' } },

    // Suiza - Cantones principales
    { state: 'ch-zh', country: 'ch', name: { es: 'Zúrich', en: 'Zurich' } },
    { state: 'ch-ge', country: 'ch', name: { es: 'Ginebra', en: 'Geneva' } },
    { state: 'ch-bs', country: 'ch', name: { es: 'Basilea-Ciudad', en: 'Basel-Stadt' } },
    { state: 'ch-be', country: 'ch', name: { es: 'Berna', en: 'Bern' } },

    // Austria - Estados
    { state: 'at-9', country: 'at', name: { es: 'Viena', en: 'Vienna' } },
    { state: 'at-5', country: 'at', name: { es: 'Salzburgo', en: 'Salzburg' } },
    { state: 'at-7', country: 'at', name: { es: 'Tirol', en: 'Tyrol' } },

    // Suecia - Condados principales
    { state: 'se-ab', country: 'se', name: { es: 'Estocolmo', en: 'Stockholm' } },
    { state: 'se-o', country: 'se', name: { es: 'Gotemburgo', en: 'Västra Götaland' } },
    { state: 'se-m', country: 'se', name: { es: 'Malmö', en: 'Skåne' } },

    // Noruega - Condados principales
    { state: 'no-03', country: 'no', name: { es: 'Oslo', en: 'Oslo' } },
    { state: 'no-46', country: 'no', name: { es: 'Vestland', en: 'Vestland' } },
    { state: 'no-50', country: 'no', name: { es: 'Trøndelag', en: 'Trøndelag' } },

    // Dinamarca - Regiones
    { state: 'dk-84', country: 'dk', name: { es: 'Región Capital', en: 'Capital Region' } },
    { state: 'dk-82', country: 'dk', name: { es: 'Jutlandia Central', en: 'Central Jutland' } },

    // Finlandia - Regiones principales
    { state: 'fi-01', country: 'fi', name: { es: 'Uusimaa', en: 'Uusimaa' } },

    // Polonia - Voivodatos principales
    { state: 'pl-14', country: 'pl', name: { es: 'Mazovia', en: 'Masovian' } },
    { state: 'pl-12', country: 'pl', name: { es: 'Pequeña Polonia', en: 'Lesser Poland' } },
    { state: 'pl-02', country: 'pl', name: { es: 'Baja Silesia', en: 'Lower Silesian' } },

    // República Checa - Regiones
    { state: 'cz-10', country: 'cz', name: { es: 'Praga', en: 'Prague' } },
    { state: 'cz-64', country: 'cz', name: { es: 'Moravia del Sur', en: 'South Moravian' } },

    // Grecia - Regiones
    { state: 'gr-i', country: 'gr', name: { es: 'Ática', en: 'Attica' } },
    { state: 'gr-b', country: 'gr', name: { es: 'Macedonia Central', en: 'Central Macedonia' } },

    // Irlanda - Condados principales
    { state: 'ie-d', country: 'ie', name: { es: 'Dublín', en: 'Dublin' } },
    { state: 'ie-co', country: 'ie', name: { es: 'Cork', en: 'Cork' } },
];
