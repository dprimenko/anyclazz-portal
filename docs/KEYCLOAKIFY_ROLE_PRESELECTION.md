# Implementación de Pre-selección de Rol en Registro

## Contexto

Desde nuestra aplicación AnyClazz Portal estamos redirigiendo usuarios al registro de Keycloak con información sobre el rol que desean (estudiante o profesor). Necesitamos que la plantilla de registro lea este parámetro y pre-seleccione el campo de rol correspondiente.

## Parámetros OAuth que Recibirán

Cuando un usuario hace clic en "Get Started" o "Become a Teacher", redirigimos a Keycloak con estos parámetros:

```
GET /realms/anyclazz/protocol/openid-connect/auth?
  client_id=anyclazz-app
  &redirect_uri=http://localhost:4321/api/auth/callback/keycloak
  &response_type=code
  &scope=openid+profile+email+roles
  &kc_action=REGISTER
  &login_hint=register:student   // o register:teacher
```

**Parámetro clave**: `login_hint`
- Formato: `register:{role}`
- Valores posibles:
  - `register:student` → Usuario quiere registrarse como estudiante
  - `register:teacher` → Usuario quiere registrarse como profesor

## Implementación Requerida en Keycloakify

### 1. En el componente de Registro (Register.tsx o equivalente)

```tsx
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useEffect } from "react";

export default function Register(props: PageProps<Extract<KcContext, { pageId: "register.ftl" }>>) {
  const { kcContext } = props;
  const { url, messagesPerField } = kcContext;
  
  // Extraer el rol del login_hint
  useEffect(() => {
    // Parsear el parámetro login_hint de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const loginHint = urlParams.get('login_hint') || '';
    
    // Si el formato es "register:student" o "register:teacher"
    if (loginHint.startsWith('register:')) {
      const role = loginHint.substring(9); // Extraer "student" o "teacher"
      
      // Pre-seleccionar el campo de rol
      const roleField = document.querySelector<HTMLSelectElement>('[name="user.attributes.role"]');
      if (roleField && (role === 'student' || role === 'teacher')) {
        roleField.value = role;
        
        // Disparar evento change si hay lógica que depende de él
        roleField.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('✅ Rol pre-seleccionado:', role);
      }
    }
  }, []);
  
  // ... resto del componente
}
```

### 2. Si usan Template FreeMarker directo

En `register.ftl`:

```ftl
<script>
(function() {
  // Parsear login_hint de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const loginHint = urlParams.get('login_hint') || '';
  
  if (loginHint.startsWith('register:')) {
    const role = loginHint.substring(9); // student o teacher
    
    // Esperar a que el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
      const roleField = document.querySelector('[name="user.attributes.role"]');
      
      if (roleField && (role === 'student' || role === 'teacher')) {
        roleField.value = role;
        roleField.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ Rol pre-seleccionado:', role);
      }
    });
  }
})();
</script>
```

### 3. Campo de Rol en el Formulario

Asegúrense de que el formulario tenga el campo con el name correcto:

```tsx
<select 
  name="user.attributes.role" 
  id="user.attributes.role"
  required
>
  <option value="">Select your role...</option>
  <option value="student">Student</option>
  <option value="teacher">Teacher</option>
</select>
```

## Testing

Para probar, pueden usar estas URLs directamente:

**Registro como estudiante:**
```
http://localhost:8081/realms/anyclazz/protocol/openid-connect/auth?client_id=anyclazz-app&redirect_uri=http://localhost:4321/api/auth/callback/keycloak&response_type=code&scope=openid+profile+email+roles&kc_action=REGISTER&login_hint=register:student
```

**Registro como profesor:**
```
http://localhost:8081/realms/anyclazz/protocol/openid-connect/auth?client_id=anyclazz-app&redirect_uri=http://localhost:4321/api/auth/callback/keycloak&response_type=code&scope=openid+profile+email+roles&kc_action=REGISTER&login_hint=register:teacher
```

## Verificación

1. ✅ El campo de rol debe estar pre-seleccionado con el valor correcto
2. ✅ El usuario puede cambiar la selección si lo desea
3. ✅ No debe romper el flujo si `login_hint` no está presente o tiene otro formato

## Notas Adicionales

- El parámetro `kc_action=REGISTER` ya fuerza que se muestre el formulario de registro, no login
- `login_hint` es un parámetro estándar OAuth 2.0, así que es compatible con Keycloak
- La implementación debe ser defensiva: si no hay `login_hint` o tiene formato incorrecto, simplemente no pre-seleccionar nada

## Flujo Completo desde AnyClazz Portal

1. Usuario hace clic en "Get Started" o "Become a Teacher"
2. Se redirige a `/api/auth/keycloak-register?role=student` (o `role=teacher`)
3. Nuestro endpoint construye la URL OAuth con `login_hint=register:{role}`
4. Keycloak recibe la petición y muestra el formulario de registro
5. El JavaScript de la plantilla lee el `login_hint` y pre-selecciona el rol
6. Usuario completa el registro
7. Keycloak redirige a `/api/auth/callback/keycloak`
8. Usuario queda autenticado y redirigido a `/dashboard`

---

**Versión**: 1.0.0  
**Fecha**: Marzo 2026  
**Proyecto**: AnyClazz Portal + Keycloakify Theme
