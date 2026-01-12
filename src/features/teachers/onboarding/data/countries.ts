export interface Country {
    countryISO2: string;
    name: {
        es: string;
        en: string;
    };
}

export const countries: Country[] = [
    // Europa
    { countryISO2: 'es', name: { es: 'España', en: 'Spain' } },
    { countryISO2: 'fr', name: { es: 'Francia', en: 'France' } },
    { countryISO2: 'de', name: { es: 'Alemania', en: 'Germany' } },
    { countryISO2: 'it', name: { es: 'Italia', en: 'Italy' } },
    { countryISO2: 'pt', name: { es: 'Portugal', en: 'Portugal' } },
    { countryISO2: 'gb', name: { es: 'Reino Unido', en: 'United Kingdom' } },
    { countryISO2: 'ie', name: { es: 'Irlanda', en: 'Ireland' } },
    { countryISO2: 'nl', name: { es: 'Países Bajos', en: 'Netherlands' } },
    { countryISO2: 'be', name: { es: 'Bélgica', en: 'Belgium' } },
    { countryISO2: 'ch', name: { es: 'Suiza', en: 'Switzerland' } },
    { countryISO2: 'at', name: { es: 'Austria', en: 'Austria' } },
    { countryISO2: 'se', name: { es: 'Suecia', en: 'Sweden' } },
    { countryISO2: 'no', name: { es: 'Noruega', en: 'Norway' } },
    { countryISO2: 'dk', name: { es: 'Dinamarca', en: 'Denmark' } },
    { countryISO2: 'fi', name: { es: 'Finlandia', en: 'Finland' } },
    { countryISO2: 'pl', name: { es: 'Polonia', en: 'Poland' } },
    { countryISO2: 'cz', name: { es: 'República Checa', en: 'Czech Republic' } },
    { countryISO2: 'gr', name: { es: 'Grecia', en: 'Greece' } },
    { countryISO2: 'ro', name: { es: 'Rumania', en: 'Romania' } },
    { countryISO2: 'hu', name: { es: 'Hungría', en: 'Hungary' } },
    
    // América
    { countryISO2: 'us', name: { es: 'Estados Unidos', en: 'United States' } },
    { countryISO2: 'ca', name: { es: 'Canadá', en: 'Canada' } },
    { countryISO2: 'mx', name: { es: 'México', en: 'Mexico' } },
    { countryISO2: 'ar', name: { es: 'Argentina', en: 'Argentina' } },
    { countryISO2: 'br', name: { es: 'Brasil', en: 'Brazil' } },
    { countryISO2: 'cl', name: { es: 'Chile', en: 'Chile' } },
    { countryISO2: 'co', name: { es: 'Colombia', en: 'Colombia' } },
    { countryISO2: 'pe', name: { es: 'Perú', en: 'Peru' } },
    { countryISO2: 've', name: { es: 'Venezuela', en: 'Venezuela' } },
    { countryISO2: 'ec', name: { es: 'Ecuador', en: 'Ecuador' } },
    { countryISO2: 'uy', name: { es: 'Uruguay', en: 'Uruguay' } },
    { countryISO2: 'py', name: { es: 'Paraguay', en: 'Paraguay' } },
    { countryISO2: 'bo', name: { es: 'Bolivia', en: 'Bolivia' } },
    { countryISO2: 'cr', name: { es: 'Costa Rica', en: 'Costa Rica' } },
    { countryISO2: 'pa', name: { es: 'Panamá', en: 'Panama' } },
    { countryISO2: 'cu', name: { es: 'Cuba', en: 'Cuba' } },
    { countryISO2: 'do', name: { es: 'República Dominicana', en: 'Dominican Republic' } },
    
    // Asia
    { countryISO2: 'cn', name: { es: 'China', en: 'China' } },
    { countryISO2: 'jp', name: { es: 'Japón', en: 'Japan' } },
    { countryISO2: 'kr', name: { es: 'Corea del Sur', en: 'South Korea' } },
    { countryISO2: 'in', name: { es: 'India', en: 'India' } },
    { countryISO2: 'th', name: { es: 'Tailandia', en: 'Thailand' } },
    { countryISO2: 'vn', name: { es: 'Vietnam', en: 'Vietnam' } },
    { countryISO2: 'ph', name: { es: 'Filipinas', en: 'Philippines' } },
    { countryISO2: 'id', name: { es: 'Indonesia', en: 'Indonesia' } },
    { countryISO2: 'sg', name: { es: 'Singapur', en: 'Singapore' } },
    { countryISO2: 'my', name: { es: 'Malasia', en: 'Malaysia' } },
    
    // Oceanía
    { countryISO2: 'au', name: { es: 'Australia', en: 'Australia' } },
    { countryISO2: 'nz', name: { es: 'Nueva Zelanda', en: 'New Zealand' } },
    
    // África
    { countryISO2: 'za', name: { es: 'Sudáfrica', en: 'South Africa' } },
    { countryISO2: 'eg', name: { es: 'Egipto', en: 'Egypt' } },
    { countryISO2: 'ma', name: { es: 'Marruecos', en: 'Morocco' } },
    { countryISO2: 'ng', name: { es: 'Nigeria', en: 'Nigeria' } },
    { countryISO2: 'ke', name: { es: 'Kenia', en: 'Kenya' } },
];
