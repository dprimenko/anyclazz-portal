import {ui, defaultLang, routes, showDefaultLang} from './ui';
import { getApiUrl } from '@/features/shared/services/environment';
import { useContext, useState, useEffect } from 'react';
import { LanguageContext } from './LanguageProvider';

const LANG_COOKIE_NAME = 'app_lang';

// Función para obtener cookies en el cliente
function getCookieClient(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
}

// Función para obtener cookies desde un string de cookies (SSR)
function getCookieFromString(cookieString: string | undefined, name: string): string | undefined {
    if (!cookieString) return undefined;
    const value = `; ${cookieString}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
}

// Función para establecer cookies en el cliente
function setCookieClient(name: string, value: string, days: number = 365) {
    if (typeof document === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

// Función para obtener el idioma de la cookie (funciona en cliente y servidor)
export function getLangFromCookie(cookieString?: string): keyof typeof ui | undefined {
    let lang: string | undefined;
    
    if (cookieString) {
        // SSR: leer de cookieString
        lang = getCookieFromString(cookieString, LANG_COOKIE_NAME);
    } else if (typeof window !== 'undefined') {
        // Client: leer de document.cookie
        lang = getCookieClient(LANG_COOKIE_NAME);
    }
    
    if (lang && lang in ui) {
        return lang as keyof typeof ui;
    }
    return undefined;
}

// Función para guardar el idioma en la cookie
export function setLangCookie(lang: keyof typeof ui) {
    setCookieClient(LANG_COOKIE_NAME, lang);
}

export function getLangFromUrl(url: URL, cookieString?: string): keyof typeof ui {
    // Si no está en la URL, intentar leer de cookie
    const cookieLang = getLangFromCookie(cookieString);
    if (cookieLang) return cookieLang;
    
    // Fallback a defaultLang
    return defaultLang;
}

// Helper para usar en páginas Astro SSR - obtiene el idioma desde la URL y cookies del request
export function getLangFromRequest(request: Request, url: URL): keyof typeof ui {
    const cookieHeader = request.headers.get('cookie');
    return getLangFromUrl(url, cookieHeader || undefined);
}

export function getCurrentLang(cookieString?: string): keyof typeof ui {
    // Intentar leer de cookie (funciona en SSR si se pasa cookieString, y en cliente)
    const cookieLang = getLangFromCookie(cookieString);
    if (cookieLang) {
        return cookieLang;
    }
    return defaultLang;
}

export async function getLangFromApi({ token }: { token?: string }): Promise<keyof typeof ui | undefined> {
    if (!token) return getCurrentLang();
    try {
        const response = await fetch(`${getApiUrl()}/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return undefined;
        const data = await response.json();
        const lang = data?.user?.language;
        if (lang && lang in ui) {
            return lang as keyof typeof ui;
        }
    } catch {
        // silently fail
    }
    return undefined;
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

export function useTranslationsSSR({token}: { token?: string } = {}) {
    return async function t(key: string, params?: Record<string, string | number>) {
        // Usar el idioma proporcionado o el idioma actual (cookie o default)
        let currentLang;
        if (token) {
            currentLang = await getLangFromApi({ token }) || getCurrentLang();
        } else {
            currentLang = getCurrentLang();
        }

        // @ts-ignore
        let translation = ui[currentLang][key] || ui[defaultLang][key];
        
        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                const placeholder = `{{${paramKey}}}`;
                translation = translation.replace(new RegExp(placeholder, 'g'), String(paramValue));
            });
        }
        
        return translation;
    }
}

export function useTranslations({ lang }: { lang?: keyof typeof ui } = {}) {
    const contextLang = useContext(LanguageContext);
    // Start with defaultLang so SSR and initial client render produce identical HTML (prevents hydration mismatch).
    // After mount, update to the cookie-based lang when no explicit provider or prop lang is set.
    const [cookieLang, setCookieLang] = useState<keyof typeof ui>(defaultLang as keyof typeof ui);
    useEffect(() => {
        if (!lang && contextLang === null) {
            const resolved = getCurrentLang();
            if (resolved !== cookieLang) setCookieLang(resolved);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return function t(key: string, params?: Record<string, string | number>) {
        // Priority: explicit lang arg > LanguageProvider context > post-mount cookie > defaultLang
        const currentLang = lang ?? contextLang ?? cookieLang;

        // @ts-ignore
        let translation = ui[currentLang][key] || ui[defaultLang][key];
        
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