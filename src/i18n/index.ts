import {ui, defaultLang, routes, showDefaultLang} from './ui';

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function getCurrentLang() {
    return defaultLang;
}

export function useTranslatedPath(lang: keyof typeof ui) {
    return function translatePath(path: string, l: string = lang) {
        const pathName = path.replaceAll('/', '')
         // @ts-ignore
        const hasTranslation = defaultLang !== l && routes[l] !== undefined && routes[l][pathName] !== undefined
         // @ts-ignore
        const translatedPath = hasTranslation ? '/' + routes[l][pathName] : path

        return !showDefaultLang && l === defaultLang ? translatedPath : `/${l}${translatedPath}`
    }
}

export function useTranslations({ lang }: { lang?: keyof typeof ui } = {}) {
    return function t(key: string, params?: Record<string, string | number>) {
        // @ts-ignore
        let translation = lang ? ui[lang][key] : ui[defaultLang][key];
        
        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                const placeholder = `{{${paramKey}}}`;
                translation = translation.replace(new RegExp(placeholder, 'g'), String(paramValue));
            });
        }
        
        return translation;
    }
}

export function getRouteFromUrl(url: URL): string | undefined {
    const pathname = new URL(url).pathname;
    const parts = pathname?.split('/');
    const path = parts.pop() || parts.pop();

    if (path === undefined) {
        return undefined;
    }

    const currentLang = getLangFromUrl(url);

    if (defaultLang === currentLang) {
        const route = Object.values(routes)[0];
         // @ts-ignore
        return route[path] !== undefined ? route[path] : undefined;
    }

    const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined  => {
        return Object.keys(obj).find((key) => obj[key] === value);
    }

    const reversedKey = getKeyByValue(routes[currentLang], path);

    if (reversedKey !== undefined) {
        return reversedKey;
    }

    return undefined;
}