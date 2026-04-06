import {ui, defaultLang, routes, showDefaultLang} from './ui';
import { useContext, useState, useEffect } from 'react';
import { LanguageContext } from './LanguageProvider';
import type { AstroCookies } from 'astro';

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
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

// Función para obtener el idioma de la cookie (funciona en cliente y servidor)
export function getLangFromCookie(
    cookiesOrString?: AstroCookies | string
): keyof typeof ui | undefined {
    let lang: string | undefined;
    
    if (cookiesOrString) {
        // Si es un objeto AstroCookies (Astro SSR)
        if (typeof cookiesOrString === 'object' && 'get' in cookiesOrString) {
            lang = cookiesOrString.get(LANG_COOKIE_NAME)?.value;
        }
        // Si es un string de cookies (legacy SSR)
        else if (typeof cookiesOrString === 'string') {
            lang = getCookieFromString(cookiesOrString, LANG_COOKIE_NAME);
        }
    } else if (typeof window !== 'undefined') {
        // Client: leer de document.cookie
        lang = getCookieClient(LANG_COOKIE_NAME);
    }
    
    if (lang && lang in ui) {
        return lang as keyof typeof ui;
    }
    return undefined;
}

// Función para guardar el idioma en la cookie (cliente React)
export function setLangCookie(lang: keyof typeof ui) {
    setCookieClient(LANG_COOKIE_NAME, lang);
}

// ============================================================
// Helpers para Astro SSR
// ============================================================

/**
 * Obtiene el idioma desde las cookies de Astro
 * Usar en páginas .astro con Astro.cookies
 */
export function getLangFromAstro(cookies: AstroCookies): keyof typeof ui {
    const cookieLang = cookies.get(LANG_COOKIE_NAME)?.value;
    if (cookieLang && cookieLang in ui) {
        return cookieLang as keyof typeof ui;
    }
    return defaultLang;
}

/**
 * Guarda el idioma en las cookies de Astro
 * Usar en páginas .astro con Astro.cookies
 */
export function setLangInAstro(cookies: AstroCookies, lang: keyof typeof ui) {
    cookies.set(LANG_COOKIE_NAME, lang, { 
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 año
        sameSite: 'lax'
    });
}

/**
 * Obtiene el idioma desde la URL o cookies (fallback a defaultLang)
 * @deprecated Usa getLangFromAstro(Astro.cookies) en páginas .astro
 */
export function getLangFromUrl(url: URL, cookiesOrString?: AstroCookies | string): keyof typeof ui {
    // Intentar leer de cookie
    const cookieLang = getLangFromCookie(cookiesOrString);
    if (cookieLang) return cookieLang;
    
    // Fallback a defaultLang
    return defaultLang;
}

/**
 * Helper para usar en páginas Astro SSR - obtiene el idioma desde cookies del request
 * @deprecated Usa getLangFromAstro(Astro.cookies) en su lugar
 */
export function getLangFromRequest(request: Request, url: URL): keyof typeof ui {
    const cookieHeader = request.headers.get('cookie');
    return getLangFromUrl(url, cookieHeader || undefined);
}

/**
 * Obtiene el idioma actual desde cookies (funciona en cliente y servidor)
 * @param cookiesOrString - Puede ser AstroCookies (Astro SSR) o string de cookies (legacy)
 */
export function getCurrentLang(cookiesOrString?: AstroCookies | string): keyof typeof ui {
    const cookieLang = getLangFromCookie(cookiesOrString);
    if (cookieLang) {
        return cookieLang;
    }
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

/**
 * Hook de traducciones para usar en código SSR (páginas .astro)
 * Lee el idioma desde cookies
 */
export function useTranslationsSSR(lang?: string) {
    return function t(key: string, params?: Record<string, string | number>) {
        const currentLang = lang ?? 'en';

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
    // When lang is explicitly provided, use it directly without cookie state
    // This ensures SSR and client render use the same value (prevents hydration mismatch)
    // Only use cookieLang state when no explicit lang or context is provided
    const [cookieLang, setCookieLang] = useState<keyof typeof ui>(lang || defaultLang as keyof typeof ui);
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