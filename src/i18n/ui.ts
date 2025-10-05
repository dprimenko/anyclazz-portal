import es from './resources/es';
import en from './resources/en';

export const languages = {
    en: 'English',
    es: 'Español',
};

export const defaultLang = 'en';

export const ui = {
    es,
    en
} as const;

export const routes = {
    es: {
        'notice': 'aviso-legal',
    },
    en: {
        'notice': 'notice',
    },
}

export const showDefaultLang = true;