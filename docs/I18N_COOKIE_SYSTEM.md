# Sistema de Internacionalización basado en Cookies

El sistema i18n ahora usa **cookies** en lugar de base de datos para almacenar el idioma del usuario. Esto simplifica el flujo y permite que Astro SSR y React compartan el mismo valor de idioma.

## Flujo del Sistema

1. **Usuario selecciona idioma** → Se guarda en cookie `app_lang`
2. **Astro lee la cookie** en cada request → Pasa el valor a React
3. **React usa el mismo valor** sin hacer llamadas adicionales

## Uso en Páginas Astro (.astro)

### Método Recomendado (usando Astro.cookies)

```astro
---
import { getLangFromAstro } from '@/i18n';
import Main from '@/layout/Main.astro';

// Obtener idioma desde cookie
const lang = getLangFromAstro(Astro.cookies);

// Opcional: establecer un idioma por defecto si no existe
// import { setLangInAstro } from '@/i18n';
// if (!Astro.cookies.get('app_lang')) {
//   setLangInAstro(Astro.cookies, 'es');
// }
---

<Main title="Mi Página">
  <MiComponente client:load lang={lang} />
</Main>
```

### Método Legacy (aún funciona)

```astro
---
import { getLangFromUrl, getLangFromRequest } from '@/i18n';

// Opción 1: Desde URL
const lang = getLangFromUrl(Astro.url);

// Opción 2: Desde Request (lee cookies del header)
const lang = getLangFromRequest(Astro.request, Astro.url);
---
```

## Uso en Componentes React

### Con LanguageProvider (recomendado)

```tsx
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { useTranslations } from '@/i18n';

// En la página Astro, pasar el idioma
<LanguageProvider lang={lang}>
  <MiComponente client:load />
</LanguageProvider>

// En el componente React
export function MiComponente() {
  const t = useTranslations(); // Usa el idioma del Provider
  
  return <h1>{t('common.welcome')}</h1>;
}
```

### Sin Provider (lee desde cookie)

```tsx
import { useTranslations } from '@/i18n';

export function MiComponente() {
  // Lee automáticamente desde la cookie
  const t = useTranslations();
  
  return <h1>{t('common.welcome')}</h1>;
}
```

### Con idioma explícito

```tsx
import { useTranslations } from '@/i18n';

export function MiComponente({ lang }: { lang: 'en' | 'es' }) {
  const t = useTranslations({ lang });
  
  return <h1>{t('common.welcome')}</h1>;
}
```

## Cambiar el Idioma del Usuario

### Desde React (cliente) - Método Recomendado

**Usar el endpoint API para establecer la cookie desde el servidor:**

```tsx
async function handleLanguageChange(newLang: 'en' | 'es') {
  try {
    const response = await fetch('/api/set-language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lang: newLang }),
    });

    if (response.ok) {
      // Opcional: limpiar caché si es necesario
      // new UserCache().clear();
      
      // Recargar para aplicar cambios
      window.location.reload();
    }
  } catch (error) {
    console.error('Error setting language:', error);
  }
}
```

### Desde React (cliente) - Método Legacy

```tsx
import { setLangCookie } from '@/i18n';

function LanguageSwitcher() {
  const handleChange = (newLang: 'en' | 'es') => {
    // Guardar en cookie (solo cliente)
    setLangCookie(newLang);
    
    // Recargar para aplicar cambios
    window.location.reload();
  };
  
  return (
    <button onClick={() => handleChange('es')}>
      Cambiar a Español
    </button>
  );
}
```

### Desde Astro (servidor)

```astro
---
import { setLangInAstro } from '@/i18n';

// Ejemplo: establecer idioma desde query param
const langParam = Astro.url.searchParams.get('lang');
if (langParam === 'en' || langParam === 'es') {
  setLangInAstro(Astro.cookies, langParam);
}
---
```

## API Reference

### API Endpoints

#### `POST /api/set-language`

Establece el idioma en la cookie del servidor. Método más confiable para cambiar el idioma.

**Request Body:**
```json
{
  "lang": "en" | "es"
}
```

**Response:**
```json
{
  "success": true,
  "lang": "en"
}
```

**Ejemplo de uso:**
```typescript
const response = await fetch('/api/set-language', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ lang: 'es' }),
});
```

### Funciones para Astro

#### `getLangFromAstro(cookies: AstroCookies): 'en' | 'es'`

Obtiene el idioma desde las cookies de Astro. Retorna el idioma almacenado o `defaultLang` si no existe.

**Ejemplo:**
```typescript
const lang = getLangFromAstro(Astro.cookies);
```

#### `setLangInAstro(cookies: AstroCookies, lang: 'en' | 'es'): void`

Guarda el idioma en las cookies de Astro con configuración apropiada (path: '/', maxAge: 1 año).

**Ejemplo:**
```typescript
setLangInAstro(Astro.cookies, 'es');
```

### Funciones para React

#### `setLangCookie(lang: 'en' | 'es'): void`

Guarda el idioma en la cookie del navegador (cliente).

**Ejemplo:**
```typescript
setLangCookie('en');
window.location.reload(); // Aplicar cambios
```

#### `useTranslations({ lang?: 'en' | 'es' }): (key: string, params?) => string`

Hook para obtener traducciones. Si no se pasa `lang`, usa el contexto o la cookie.

**Ejemplo:**
```typescript
const t = useTranslations();
const message = t('common.welcome', { name: 'Juan' });
```

### Funciones Legacy (aún funcionan)

#### `getLangFromUrl(url: URL, cookieString?: string): 'en' | 'es'`

⚠️ **Deprecated**: Usa `getLangFromAstro(Astro.cookies)` en su lugar.

#### `getLangFromRequest(request: Request, url: URL): 'en' | 'es'`

⚠️ **Deprecated**: Usa `getLangFromAstro(Astro.cookies)` en su lugar.

#### `getCurrentLang(cookiesOrString?: AstroCookies | string): 'en' | 'es'`

Obtiene el idioma actual. Funciona en cliente y servidor.

**Parámetros:**
- `cookiesOrString` (opcional): Puede ser `Astro.cookies` en Astro SSR, o un string de cookies para compatibilidad legacy

**Ejemplos:**
```typescript
// En Astro SSR
const lang = getCurrentLang(Astro.cookies);

// En el cliente
const lang = getCurrentLang();

// Legacy (con cookie string)
const cookieHeader = request.headers.get('cookie');
const lang = getCurrentLang(cookieHeader || undefined);
```

#### `getLangFromCookie(cookiesOrString?: AstroCookies | string): 'en' | 'es' | undefined`

Obtiene el idioma desde cookies. Versión de bajo nivel, normalmente usa `getLangFromAstro` o `getCurrentLang` en su lugar.

**Parámetros:**
- `cookiesOrString` (opcional): Puede ser `Astro.cookies`, un string de cookies, o nada (lee desde document.cookie en el cliente)

## Configuración

### Cookie Name
```typescript
const LANG_COOKIE_NAME = 'app_lang';
```

### Idiomas Disponibles
```typescript
export const languages = {
    en: 'English',
    es: 'Español',
};
```

### Idioma por Defecto
```typescript
export const defaultLang = 'en';
```

## Notas Importantes

1. **No se guarda en base de datos**: El idioma solo se almacena en cookies
2. **Cookie compartida**: Astro y React leen la misma cookie `app_lang`
3. **Persistencia**: La cookie dura 1 año
4. **Hydration safe**: El sistema previene errores de hidratación usando `defaultLang` en el renderizado inicial
5. **Fallback**: Si no hay cookie, se usa `defaultLang` ('en')
6. **Endpoint API recomendado**: Usar `POST /api/set-language` es más confiable que `setLangCookie()` porque:
   - Establece la cookie directamente en el servidor
   - Evita problemas de sincronización entre cliente y servidor
   - Garantiza que la cookie esté disponible en el siguiente request SSR
   - Es más compatible con diferentes configuraciones de navegador

## Migración desde el Sistema Anterior

### Antes (con API)
```tsx
// ❌ Ya no se usa
const lang = await getLangFromApi({ token });
```

### Ahora (con cookies)
```astro
---
// ✅ Nuevo método
const lang = getLangFromAstro(Astro.cookies);
---
```

## Troubleshooting

### El idioma no cambia después de seleccionarlo

Asegúrate de recargar la página después de cambiar la cookie:

```typescript
setLangCookie('es');
window.location.reload(); // Necesario para aplicar
```

### Error de hidratación en React

Usa `LanguageProvider` para pasar el idioma desde Astro:

```astro
<LanguageProvider lang={lang} client:load>
  <MiComponente />
</LanguageProvider>
```

### Cookie no persiste

Verifica que el dominio y path sean correctos:

```typescript
// La cookie se establece con path: '/'
// Debería funcionar en todo el sitio
```
