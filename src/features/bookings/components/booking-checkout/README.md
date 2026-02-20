# Booking Checkout Component

Componente de pago para bookings usando Stripe SetupIntent y PaymentElement.

## Flujo

1. **Crear SetupIntent**: Se crea un SetupIntent en el backend para capturar el payment method de forma segura
2. **Mostrar PaymentElement**: El usuario selecciona su método de pago (tarjeta, PayPal, etc.)
3. **Confirmar SetupIntent**: Se confirma el setup intent con `stripe.confirmSetup()`
4. **Crear PaymentIntent**: Se crea el payment intent con el `setup_intent_id`
5. **Confirmar pago**: Si requiere 3DS u otra confirmación, se maneja automáticamente

## Componentes

### BookingCheckout

Componente principal que maneja el flujo de pago.

**Props:**
```typescript
{
  bookingId: string;       // ID del booking
  amount: number;          // Monto a pagar
  currency: string;        // Moneda (EUR, USD, etc.)
  token: string;           // Access token del usuario
  onSuccess: () => void;   // Callback de éxito
  onError: (error: string) => void; // Callback de error
  lang?: 'en' | 'es';      // Idioma (opcional)
}
```

### BookingCheckoutWrapper

Wrapper que incluye el modal de éxito.

**Props:** Mismas que BookingCheckout (sin onSuccess/onError)

## Uso

```tsx
import { BookingCheckoutWrapper } from '@/features/bookings/components/booking-checkout';

<BookingCheckoutWrapper 
  bookingId={bookingId}
  amount={25.00}
  currency="EUR"
  token={accessToken}
  lang="en"
  client:load
/>
```

## Endpoints del backend

- `POST /setup-intent` - Crea el SetupIntent
- `POST /payment-intents` - Crea el PaymentIntent con setup_intent_id

**Request a payment-intents:**
```json
{
  "booking_id": "uuid",
  "setup_intent_id": "seti_xxx"
}
```

## Características

✅ Soporta múltiples métodos de pago (tarjeta, PayPal)  
✅ 3D Secure automático  
✅ Interfaz unificada con tabs  
✅ Totalmente i18n  
✅ Manejo de errores robusto  
✅ Modal de éxito integrado  

## Diferencias con el flujo anterior

**Antes (PaymentForm - INSEGURO):**
- Capturaba datos de tarjeta directamente en el frontend
- Enviaba información sensible al backend
- No soportaba PayPal
- PCI compliance comprometida

**Ahora (BookingCheckout - SEGURO):**
- Usa Stripe SetupIntent + PaymentElement
- No maneja datos sensibles en el código
- Soporta múltiples métodos de pago
- Cumple con PCI DSS
- Misma UX que suscripciones
