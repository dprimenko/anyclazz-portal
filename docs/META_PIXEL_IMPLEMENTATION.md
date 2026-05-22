# Meta Pixel — Implementación completa

**Pixel ID**: `1260620476234864`

## Resumen de eventos

| Evento | Cuándo | Quién dispara |
|---|---|---|
| `PageView` | Cada carga de página | Portal (browser) |
| `ViewContent` | Click en cualquier CTA de registro | Portal (browser) |
| `Lead` | Usuario completa el registro | Portal (browser) + BE (CAPI) — deduplicados |

---

## Portal (ya implementado)

### PageView
Se dispara automáticamente en cada página. El pixel está en:
- `src/layout/Base.astro` → todas las páginas de app
- `src/layout/Landing.astro` → todas las páginas de marketing/landing

### ViewContent — clicks en CTA de registro
Listener global en `Landing.astro` captura todos los `<a href*="keycloak-register">`.
El "Get Started" del menú mobile (que usa `window.location.href`) tiene el fbq directo en su `onClick` (`src/features/landing/mobile-menu/MobileMenu.tsx`).

### Lead — registro completado
Implementado en `src/layout/Base.astro`:
1. `keycloak-register.ts` setea la cookie `anyclazz_reg_pending=student|teacher`
2. Al volver del callback, `Base.astro` lee la cookie server-side
3. Obtiene el `userId` (Keycloak `sub`) de la sesión activa
4. Emite script inline: `fbq('track','Lead',{content_category:'student|teacher'},{eventID:'lead_<userId>'})`
5. Borra la cookie para que solo se dispare una vez

El `eventID` coincide con el que manda el BE en el CAPI → Meta deduplica automáticamente.

---

## Keycloakify — instrucciones de integración

### 1. Añadir el pixel base en el layout principal

En `Template.tsx` (o el componente que envuelve todas las páginas), añadir en el `<head>`:

```tsx
<head>
  {/* ... resto del head ... */}

  {/* Meta Pixel */}
  <script dangerouslySetInnerHTML={{ __html: `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1260620476234864');
    fbq('track', 'PageView');
  ` }} />
  <noscript>
    <img height="1" width="1" style={{ display: 'none' }}
      src="https://www.facebook.com/tr?id=1260620476234864&ev=PageView&noscript=1"
    />
  </noscript>
</head>
```

### 2. Disparar `Lead` al completar el registro

El evento debe dispararse **una sola vez**, en la pantalla que KC muestra tras un registro exitoso. Según la configuración del realm puede ser:
- La pantalla de verificación de email (`login-verify-email.ftl`)
- La pantalla de login tras registro directo (sin verificación)

```tsx
// En el componente que corresponde a la pantalla post-registro:
import { useEffect } from "react";

// Dentro del componente, accediendo al kcContext:
const userId = kcContext.user?.id ?? '';    // Keycloak sub
const role = /* leer del login_hint o del atributo de usuario */;

useEffect(() => {
  (window as any).fbq?.(
    'track',
    'Lead',
    { content_category: role },
    { eventID: `lead_${userId}` }
  );
}, []);
```

#### Obtener el `role`
El portal envía el rol como `login_hint` en la URL de autorización (`register:student` / `register:teacher`). En Keycloakify se puede leer así:

```tsx
const urlParams = new URLSearchParams(window.location.search);
const loginHint = urlParams.get('login_hint') || '';
const role = loginHint.startsWith('register:') ? loginHint.substring(9) : 'student';
```

O si el rol se almacena como atributo de usuario en Keycloak, leerlo de `kcContext.user.attributes?.role`.

### 3. Deduplicación con el CAPI del BE

El `eventID` debe ser **idéntico** al que manda el BE en la Conversions API:

```
eventID = 'lead_' + userId
```

Donde `userId` es el `sub` de Keycloak (disponible en `kcContext.user.id` y en el portal como `session.platformId`).

Si ambas fuentes (KC template pixel + CAPI) mandan el mismo `eventID` para el mismo evento, Meta cuenta **uno solo**.

### 4. Pantallas donde NO disparar `Lead`
- Página de login
- Página de registro mientras el usuario llena el formulario
- Cualquier pantalla de error

Solo en la **confirmación exitosa** del registro.

---

## Formato del eventID

```
lead_<keycloak-sub>
```

Ejemplo: `lead_a1b2c3d4-e5f6-7890-abcd-ef1234567890`

El `sub` de Keycloak es un UUID v4.

---

## Testing

### Con Meta Pixel Helper (Chrome)
1. Instalar la extensión [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Abrir en Chrome con escudos/adblockers desactivados
3. Navegar a la landing → verificar `PageView`
4. Hacer click en un CTA → verificar `ViewContent` (nota: la navegación puede hacer que el helper no lo muestre; usar Meta Events Manager → "Test Events")
5. Completar un registro → verificar `Lead`

### Con Meta Events Manager
1. Ir a [Meta Events Manager](https://business.facebook.com/events_manager) → pixel `1260620476234864`
2. Tab "Test Events" → introducir la URL del portal
3. Realizar las acciones y verificar que los eventos llegan en tiempo real

### Verificar deduplicación
En Meta Events Manager → "Diagnósticos", buscar eventos con `event_id` duplicado para confirmar que se está deduplicando correctamente.
