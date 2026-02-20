# PayPal Return Handler - Suscripciones

Componentes y hooks para manejar el retorno de PayPal después de confirmar pagos.

## Problema

Cuando un usuario elige PayPal como método de pago:
1. Stripe redirige al usuario a PayPal
2. El usuario aprueba el pago
3. Stripe redirige de vuelta a la aplicación con parámetros en la URL
4. **PERO** la suscripción/payment aún no se ha creado

## Solución

### Para Suscripciones

#### 1. Actualizar el return_url en SubscriptionCheckout

```typescript
const { error, setupIntent } = await stripe.confirmSetup({
  elements,
  confirmParams: {
    return_url: `${window.location.origin}/profile?tab=super_tutor&subscription=pending&interval=${plan.interval}`
  }
});
```

#### 2. Añadir PayPalReturnHandler en la página de destino

En `/profile` (o donde vayas después del pago):

```tsx
import { PayPalReturnHandler } from '@/features/subscription';

function ProfilePage({ accessToken, lang }) {
  return (
    <>
      <PayPalReturnHandler 
        token={accessToken}
        lang={lang}
        onSuccess={() => {
          // Recargar datos, mostrar notificación, etc.
          window.location.reload();
        }}
        onError={(error) => {
          alert(error);
        }}
      />
      
      {/* Resto del contenido */}
    </>
  );
}
```

#### 3. Cómo funciona

Cuando el usuario regresa de PayPal, la URL contiene:
- `subscription=pending` - Indica que viene de PayPal
- `setup_intent=seti_xxx` - El SetupIntent confirmado
- `interval=month` - El intervalo seleccionado

El hook `usePayPalReturnHandler`:
1. Detecta estos parámetros
2. Crea la suscripción con el `setup_intent_id`
3. Muestra un spinner mientras procesa
4. Redirige a `subscription=success` cuando termina
5. Llama al callback `onSuccess`

### Para Bookings

El flujo es exactamente igual pero con los componentes de bookings:

```tsx
import { PayPalBookingReturnHandler } from '@/features/bookings/components/paypal-return-handler';

function MyAgenda({ accessToken, lang }) {
  return (
    <>
      <PayPalBookingReturnHandler 
        token={accessToken}
        lang={lang}
        onSuccess={() => {
          // Recargar bookings
          window.location.reload();
        }}
      />
      
      {/* Resto del contenido */}
    </>
  );
}
```

## Archivos creados

### Suscripciones
- `src/features/subscription/hooks/usePayPalReturnHandler.ts` - Hook principal
- `src/features/subscription/components/PayPalReturnHandler.tsx` - Componente UI

### Bookings
- `src/features/bookings/hooks/usePayPalBookingReturnHandler.ts` - Hook principal
- `src/features/bookings/components/paypal-return-handler/PayPalBookingReturnHandler.tsx` - Componente UI

## Traducciones

Añadidas:
- `subscription.processing_paypal_payment` - "Processing PayPal payment..." / "Procesando pago de PayPal..."
- `booking.processing_paypal_payment` - "Processing PayPal payment..." / "Procesando pago de PayPal..."

## Flujo completo

```
1. Usuario elige PayPal
   ↓
2. stripe.confirmSetup() redirige a PayPal
   ↓
3. Usuario aprueba en PayPal
   ↓
4. Stripe redirige a: /profile?subscription=pending&setup_intent=seti_xxx&interval=month
   ↓
5. PayPalReturnHandler detecta parámetros
   ↓
6. Muestra spinner "Processing PayPal payment..."
   ↓
7. Crea suscripción con setup_intent_id
   ↓
8. Limpia URL → /profile?subscription=success
   ↓
9. Llama onSuccess() callback
   ↓
10. ✅ Suscripción activa
```

## Debugging

Para debug, revisar consola del navegador:
```
Processing PayPal return with SetupIntent: seti_xxx
Subscription created successfully: {...}
```

O errores:
```
Error processing PayPal return: [error message]
```

## Ventajas

✅ UX mejorada - El usuario no ve errores después de aprobar en PayPal  
✅ Automático - No requiere acción manual del usuario  
✅ Feedback visual - Muestra spinner mientras procesa  
✅ Robusto - Maneja errores y limpia la URL  
✅ Reutilizable - Mismo patrón para suscripciones y bookings  
