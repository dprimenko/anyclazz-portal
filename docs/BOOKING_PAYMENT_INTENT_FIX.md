# Fix: Booking Payment — SetupIntent + $0 en el banco

## Problema

El flujo actual del checkout de booking crea **dos intents de Stripe**:

1. Un **SetupIntent** (para capturar y opcionalmente guardar el método de pago)
2. Un **PaymentIntent** (para cobrar)

Esto causa dos problemas:

### 1. El banco/wallet muestra $0
Cuando el usuario llega a la pantalla de autenticación 3DS (banco, Apple Pay, etc.), ve un cobro de **$0** porque Stripe le muestra la autorización del `SetupIntent`, que no tiene importe. El cobro real llega después con el `PaymentIntent`, generando confusión.

### 2. El PaymentIntent a veces falla
Tras confirmar el `SetupIntent`, el frontend intenta confirmar el `PaymentIntent` pasando el `payment_method_id` obtenido del setup. Esto falla en ciertos escenarios donde el PaymentIntent no fue creado con ese método de pago en mente, o cuando hay race conditions con webhooks.

---

## Solución

Usar el parámetro `setup_future_usage` del **PaymentIntent** directamente. Stripe gestiona internamente el guardado del método de pago si se le indica, sin necesidad de un SetupIntent previo. Así solo hay **una confirmación**, con el importe correcto visible al usuario.

Referencia Stripe: https://stripe.com/docs/payments/save-during-payment

---

## Cambios en Backend

### Endpoint: `POST /payment-intents`

#### Request actual
```json
{
  "booking_id": "uuid",
  "setup_intent_id": "seti_xxx"
}
```

#### Request nuevo (propuesto)
```json
{
  "booking_id": "uuid",
  "save_payment_method": true
}
```

El campo `setup_intent_id` queda **deprecated**. El campo `save_payment_method` es opcional (default `false`).

#### Lógica de cambio en BE al crear el PaymentIntent con Stripe

```python
# Pseudocódigo — adaptar al lenguaje del backend

params = {
    "amount": booking.price_in_cents,
    "currency": booking.currency,
    "customer": student.stripe_customer_id,
    "metadata": { "booking_id": booking.id },
    "automatic_payment_methods": { "enabled": True },
}

# Solo añadir setup_future_usage si el alumno quiere guardar la tarjeta
if request.save_payment_method:
    params["setup_future_usage"] = "off_session"

payment_intent = stripe.PaymentIntent.create(**params)
```

#### Response (sin cambios)
```json
{
  "payment_intent_id": "pi_xxx",
  "client_secret": "pi_xxx_secret_xxx",
  "amount": "25.00",
  "currency": "eur",
  "status": "requires_payment_method"
}
```

---

### Endpoint: `POST /setup-intents` (para el checkout de booking)

Este endpoint **ya no debe ser llamado** desde el flujo de pago de booking. 

El endpoint puede mantenerse para otros casos (suscripciones, añadir método de pago desde perfil), pero el frontend del booking checkout dejará de llamarlo.

---

## Cambios en Frontend (una vez el BE esté listo)

### `BookingCheckoutWrapper.tsx`

Eliminar el `useEffect` que creaba el SetupIntent:

```diff
- useEffect(() => {
-   createSetupIntent(accessToken, 'payment_method')
-     .then(({ client_secret }) => setSetupClientSecret(client_secret))
-     .catch(() => {})
-     .finally(() => setSetupIntentReady(true));
- }, [accessToken]);
```

El estado `setupIntentReady` pasa a ser `true` por defecto, eliminando el spinner de espera del SetupIntent.

### `BookingCheckout.tsx` — `handleSubmit`

El flujo de nueva tarjeta queda simplificado:

```diff
- if (useSetupFlow) {
-   // confirmSetup → luego confirmCardPayment
- } else {
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });
    if (confirmError) throw new Error(getStripeErrorMessage(confirmError));
- }
```

El `saveForFuture` del usuario se enviará al crear el PaymentIntent (en la página Astro o en un endpoint de creación), no durante la confirmación.

### Cómo pasar `save_payment_method` al crear el PaymentIntent

El `clientSecret` se obtiene en la página Astro (`[id].astro`) al cargar el booking. El problema es que `saveForFuture` es una decisión del usuario en el formulario, no disponible en SSR.

**Opción A (recomendada)**: Nuevo endpoint `POST /api/booking/create-payment-intent` en el frontend que el wrapper llama al montar, pasando `save_payment_method: false` por defecto. Si el usuario cambia `saveForFuture`, se recrea el PaymentIntent antes de confirmar.

**Opción B (simple)**: Siempre crear el PaymentIntent con `setup_future_usage: "off_session"`. Stripe guarda el PM siempre, pero el alumno puede no quererlo. No recomendado.

**Opción C**: Pasar el `clientSecret` desde SSR sin `setup_future_usage`, y sí el usuario marca "guardar tarjeta", la confirmación incluye `{ setup_future_usage: 'off_session' }` en `confirmParams`. Esto SOLO funciona si el PaymentIntent fue creado con ese parámetro desde el principio en Stripe (no se puede añadir después). **No aplicable**.

**→ Opción A es la vía correcta.**

---

## Flujo nuevo (diagrama)

```
Usuario llega al checkout
        │
        ▼
BookingCheckoutWrapper monta
├── Carga saved payment methods
└── Llama a POST /api/booking/[id]/payment-intent
            { save_payment_method: false }
            → recibe { client_secret: "pi_xxx..." }
        │
        ▼
Usuario rellena tarjeta
├── Opcionalmente marca "Guardar para el futuro"
└── Pulsa "Confirmar pago"
        │
        ▼
        ¿save_payment_method cambió a true?
        ├── Sí → Rellamar POST /payment-intent con save_payment_method: true
        │         → nuevo client_secret
        └── No → Usar client_secret existente
        │
        ▼
stripe.confirmPayment({ elements, redirect: 'if_required' })
        │
        ▼
        ✅ Una sola confirmación, importe correcto visible en banco/3DS
```

---

## Casos especiales que mantener

### Pago con método guardado (tarjeta/PayPal)
No cambia. Se sigue usando el `clientSecret` del PaymentIntent existente y `stripe.confirmCardPayment(clientSecret, { payment_method: pmId })`.

### 3DS requerido por backend (`requiresAction: true`)
No cambia. Se sigue usando `stripe.confirmCardPayment(clientSecret)`.

### Suscripciones
No cambia. Siguen usando SetupIntent (flujo completamente separado).

---

## Resumen de endpoints afectados

| Endpoint | Cambio |
|---|---|
| `POST /payment-intents` | Añadir soporte para `save_payment_method: boolean`. Deprecar `setup_intent_id`. |
| `POST /setup-intents` | Sin cambios (sigue siendo usado por suscripciones y perfil) |
