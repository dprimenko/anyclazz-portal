# Sistema de Toasts

El sistema de toasts permite mostrar notificaciones temporales en la aplicación usando el patrón de eventos de dominio.

## Uso

Para mostrar un toast desde cualquier componente React:

```tsx
import { publish } from '@/features/shared/services/domainEventsBus';
import { SharedDomainEvents } from '@/features/shared/domain/events';
import type { ToastProps } from '@/ui-library/components/toast/types';

// Mostrar un toast de éxito
publish<ToastProps>(SharedDomainEvents.showToast, {
  message: 'Operación realizada con éxito',
  variant: 'success',
  autoCloseInterval: 5000 // opcional, por defecto 5000ms
});

// Mostrar un toast de error
publish<ToastProps>(SharedDomainEvents.showToast, {
  message: 'Ha ocurrido un error',
  variant: 'error'
});

// Mostrar un toast de advertencia
publish<ToastProps>(SharedDomainEvents.showToast, {
  message: 'Atención: revisa los datos',
  variant: 'warning'
});

// Mostrar un toast informativo
publish<ToastProps>(SharedDomainEvents.showToast, {
  message: 'Información importante',
  variant: 'info'
});
```

## Variantes disponibles

- **success**: Verde - Para operaciones exitosas
- **error**: Rojo - Para errores
- **warning**: Amarillo/Naranja - Para advertencias
- **info**: Primario - Para información general

## Configuración

El ToastContainer ya está integrado en el layout `Main.astro` y se mostrará automáticamente cuando se publique un evento `showToast`.

El toast se cierra automáticamente después de 5 segundos (configurable) o manualmente haciendo clic en el botón de cerrar.
