export interface Language {
    code: string;
    name: {
        es: string;
        en: string;
    };
}

export const languages: Language[] = [
    // Lenguas romances
    { code: 'es', name: { es: 'Español', en: 'Spanish' } },
    { code: 'en', name: { es: 'Inglés', en: 'English' } },
    { code: 'fr', name: { es: 'Francés', en: 'French' } },
    { code: 'it', name: { es: 'Italiano', en: 'Italian' } },
    { code: 'pt', name: { es: 'Portugués', en: 'Portuguese' } },
    { code: 'ro', name: { es: 'Rumano', en: 'Romanian' } },
    { code: 'ca', name: { es: 'Catalán', en: 'Catalan' } },
    { code: 'gl', name: { es: 'Gallego', en: 'Galician' } },
    
    // Lenguas germánicas
    { code: 'de', name: { es: 'Alemán', en: 'German' } },
    { code: 'nl', name: { es: 'Neerlandés', en: 'Dutch' } },
    { code: 'sv', name: { es: 'Sueco', en: 'Swedish' } },
    { code: 'no', name: { es: 'Noruego', en: 'Norwegian' } },
    { code: 'da', name: { es: 'Danés', en: 'Danish' } },
    { code: 'is', name: { es: 'Islandés', en: 'Icelandic' } },
    { code: 'af', name: { es: 'Afrikáans', en: 'Afrikaans' } },
    
    // Lenguas eslavas
    { code: 'ru', name: { es: 'Ruso', en: 'Russian' } },
    { code: 'pl', name: { es: 'Polaco', en: 'Polish' } },
    { code: 'cs', name: { es: 'Checo', en: 'Czech' } },
    { code: 'sk', name: { es: 'Eslovaco', en: 'Slovak' } },
    { code: 'uk', name: { es: 'Ucraniano', en: 'Ukrainian' } },
    { code: 'bg', name: { es: 'Búlgaro', en: 'Bulgarian' } },
    { code: 'hr', name: { es: 'Croata', en: 'Croatian' } },
    { code: 'sr', name: { es: 'Serbio', en: 'Serbian' } },
    { code: 'sl', name: { es: 'Esloveno', en: 'Slovenian' } },
    { code: 'be', name: { es: 'Bielorruso', en: 'Belarusian' } },
    
    // Lenguas celtas
    { code: 'cy', name: { es: 'Galés', en: 'Welsh' } },
    { code: 'ga', name: { es: 'Irlandés', en: 'Irish' } },
    { code: 'gd', name: { es: 'Gaélico escocés', en: 'Scottish Gaelic' } },
    
    // Lenguas bálticas
    { code: 'lt', name: { es: 'Lituano', en: 'Lithuanian' } },
    { code: 'lv', name: { es: 'Letón', en: 'Latvian' } },
    
    // Lenguas urálicas
    { code: 'fi', name: { es: 'Finés', en: 'Finnish' } },
    { code: 'hu', name: { es: 'Húngaro', en: 'Hungarian' } },
    { code: 'et', name: { es: 'Estonio', en: 'Estonian' } },
    
    // Lenguas helénicas
    { code: 'el', name: { es: 'Griego', en: 'Greek' } },
    
    // Lenguas semíticas
    { code: 'ar', name: { es: 'Árabe', en: 'Arabic' } },
    { code: 'he', name: { es: 'Hebreo', en: 'Hebrew' } },
    { code: 'am', name: { es: 'Amhárico', en: 'Amharic' } },
    
    // Lenguas túrcicas
    { code: 'tr', name: { es: 'Turco', en: 'Turkish' } },
    { code: 'az', name: { es: 'Azerí', en: 'Azerbaijani' } },
    { code: 'kk', name: { es: 'Kazajo', en: 'Kazakh' } },
    { code: 'uz', name: { es: 'Uzbeko', en: 'Uzbek' } },
    
    // Lenguas indoiranias
    { code: 'hi', name: { es: 'Hindi', en: 'Hindi' } },
    { code: 'ur', name: { es: 'Urdu', en: 'Urdu' } },
    { code: 'bn', name: { es: 'Bengalí', en: 'Bengali' } },
    { code: 'pa', name: { es: 'Panyabí', en: 'Punjabi' } },
    { code: 'fa', name: { es: 'Persa', en: 'Persian' } },
    { code: 'ps', name: { es: 'Pastún', en: 'Pashto' } },
    { code: 'ta', name: { es: 'Tamil', en: 'Tamil' } },
    { code: 'te', name: { es: 'Telugu', en: 'Telugu' } },
    { code: 'mr', name: { es: 'Maratí', en: 'Marathi' } },
    { code: 'gu', name: { es: 'Guyaratí', en: 'Gujarati' } },
    { code: 'kn', name: { es: 'Canarés', en: 'Kannada' } },
    { code: 'ml', name: { es: 'Malabar', en: 'Malayalam' } },
    { code: 'si', name: { es: 'Cingalés', en: 'Sinhala' } },
    { code: 'ne', name: { es: 'Nepalí', en: 'Nepali' } },
    
    // Lenguas siníticas
    { code: 'zh', name: { es: 'Chino', en: 'Chinese' } },
    { code: 'zh-cn', name: { es: 'Chino simplificado', en: 'Chinese Simplified' } },
    { code: 'zh-tw', name: { es: 'Chino tradicional', en: 'Chinese Traditional' } },
    { code: 'yue', name: { es: 'Cantonés', en: 'Cantonese' } },
    
    // Lenguas japónicas
    { code: 'ja', name: { es: 'Japonés', en: 'Japanese' } },
    
    // Lenguas coreanas
    { code: 'ko', name: { es: 'Coreano', en: 'Korean' } },
    
    // Lenguas tai-kadai
    { code: 'th', name: { es: 'Tailandés', en: 'Thai' } },
    { code: 'lo', name: { es: 'Lao', en: 'Lao' } },
    
    // Lenguas austroasiáticas
    { code: 'vi', name: { es: 'Vietnamita', en: 'Vietnamese' } },
    { code: 'km', name: { es: 'Jemer', en: 'Khmer' } },
    
    // Lenguas austronesias
    { code: 'id', name: { es: 'Indonesio', en: 'Indonesian' } },
    { code: 'ms', name: { es: 'Malayo', en: 'Malay' } },
    { code: 'tl', name: { es: 'Tagalo', en: 'Tagalog' } },
    { code: 'jv', name: { es: 'Javanés', en: 'Javanese' } },
    
    // Lenguas caucásicas
    { code: 'ka', name: { es: 'Georgiano', en: 'Georgian' } },
    { code: 'hy', name: { es: 'Armenio', en: 'Armenian' } },
    
    // Lenguas afroasiáticas
    { code: 'so', name: { es: 'Somalí', en: 'Somali' } },
    { code: 'ha', name: { es: 'Hausa', en: 'Hausa' } },
    
    // Lenguas niger-congo
    { code: 'sw', name: { es: 'Suajili', en: 'Swahili' } },
    { code: 'yo', name: { es: 'Yoruba', en: 'Yoruba' } },
    { code: 'ig', name: { es: 'Igbo', en: 'Igbo' } },
    { code: 'zu', name: { es: 'Zulú', en: 'Zulu' } },
    { code: 'xh', name: { es: 'Xhosa', en: 'Xhosa' } },
    
    // Otras lenguas europeas
    { code: 'eu', name: { es: 'Euskera', en: 'Basque' } },
    { code: 'sq', name: { es: 'Albanés', en: 'Albanian' } },
    { code: 'mk', name: { es: 'Macedonio', en: 'Macedonian' } },
    { code: 'mt', name: { es: 'Maltés', en: 'Maltese' } },
    
    // Lenguas criollas
    { code: 'ht', name: { es: 'Criollo haitiano', en: 'Haitian Creole' } },
    
    // Lenguas indígenas de América
    { code: 'qu', name: { es: 'Quechua', en: 'Quechua' } },
    { code: 'gn', name: { es: 'Guaraní', en: 'Guarani' } },
    { code: 'ay', name: { es: 'Aimara', en: 'Aymara' } },
    
    // Otras lenguas asiáticas
    { code: 'my', name: { es: 'Birmano', en: 'Burmese' } },
    { code: 'mn', name: { es: 'Mongol', en: 'Mongolian' } },
    { code: 'bo', name: { es: 'Tibetano', en: 'Tibetan' } },
    { code: 'dz', name: { es: 'Dzongkha', en: 'Dzongkha' } },
];
