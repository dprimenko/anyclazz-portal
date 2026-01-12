export interface Language {
    code: string;
    name: {
        es: string;
        en: string;
    };
}

export const languages: Language[] = [
    { code: 'es', name: { es: 'Español', en: 'Spanish' } },
    { code: 'en', name: { es: 'Inglés', en: 'English' } },
    { code: 'fr', name: { es: 'Francés', en: 'French' } },
    { code: 'de', name: { es: 'Alemán', en: 'German' } },
    { code: 'it', name: { es: 'Italiano', en: 'Italian' } },
    { code: 'pt', name: { es: 'Portugués', en: 'Portuguese' } },
    { code: 'ru', name: { es: 'Ruso', en: 'Russian' } },
    { code: 'zh', name: { es: 'Chino', en: 'Chinese' } },
    { code: 'ja', name: { es: 'Japonés', en: 'Japanese' } },
    { code: 'ko', name: { es: 'Coreano', en: 'Korean' } },
    { code: 'ar', name: { es: 'Árabe', en: 'Arabic' } },
    { code: 'hi', name: { es: 'Hindi', en: 'Hindi' } },
    { code: 'nl', name: { es: 'Neerlandés', en: 'Dutch' } },
    { code: 'sv', name: { es: 'Sueco', en: 'Swedish' } },
    { code: 'no', name: { es: 'Noruego', en: 'Norwegian' } },
    { code: 'da', name: { es: 'Danés', en: 'Danish' } },
    { code: 'fi', name: { es: 'Finés', en: 'Finnish' } },
    { code: 'pl', name: { es: 'Polaco', en: 'Polish' } },
    { code: 'tr', name: { es: 'Turco', en: 'Turkish' } },
    { code: 'el', name: { es: 'Griego', en: 'Greek' } },
    { code: 'cs', name: { es: 'Checo', en: 'Czech' } },
    { code: 'hu', name: { es: 'Húngaro', en: 'Hungarian' } },
    { code: 'ro', name: { es: 'Rumano', en: 'Romanian' } },
    { code: 'th', name: { es: 'Tailandés', en: 'Thai' } },
    { code: 'vi', name: { es: 'Vietnamita', en: 'Vietnamese' } },
    { code: 'id', name: { es: 'Indonesio', en: 'Indonesian' } },
    { code: 'he', name: { es: 'Hebreo', en: 'Hebrew' } },
    { code: 'uk', name: { es: 'Ucraniano', en: 'Ukrainian' } },
];
