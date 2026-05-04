# Apple Pay & Google Pay — Backend Integration Guide

## Contexto

El frontend usa el `PaymentElement` de Stripe, que muestra Apple Pay y Google Pay automáticamente **si el PaymentIntent fue creado correctamente**. El dominio `anyclazz.com` ya está verificado en el dashboard de Stripe.

Hay un único cambio necesario en el backend: asegurarse de que los PaymentIntents se crean con `automatic_payment_methods` en lugar de restringir los métodos explícitamente.

---

## Endpoint afectado: `POST /payment-intents`

### Request actual (desde el FE)

```json
{
  "booking_id": "uuid",
  "save_payment_method": false
}
```

### Cambio requerido

Al crear el PaymentIntent en Stripe, reemplazar `payment_method_types` por `automatic_payment_methods`:

```python
# ❌ Antes — bloquea Apple Pay y Google Pay
stripe.PaymentIntent.create(
    amount=booking.price_in_cents,
    currency=booking.currency,
    customer=student.stripe_customer_id,
    payment_method_types=["card"],  # <- eliminar
    metadata={"booking_id": str(booking.id)},
)

# ✅ Después — Stripe decide qué métodos mostrar según el contexto del usuario
stripe.PaymentIntent.create(
    amount=booking.price_in_cents,
    currency=booking.currency,
    customer=student.stripe_customer_id,
    automatic_payment_methods={"enabled": True},
    metadata={"booking_id": str(booking.id)},
)
```

Si además el usuario quiere guardar el método de pago (`save_payment_method: true`):

```python
stripe.PaymentIntent.create(
    amount=booking.price_in_cents,
    currency=booking.currency,
    customer=student.stripe_customer_id,
    automatic_payment_methods={"enabled": True},
    setup_future_usage="off_session",   # solo si save_payment_method == True
    metadata={"booking_id": str(booking.id)},
)
```

---

## Stripe Connect — `on_behalf_of`

La plataforma usa Stripe Connect con cuentas Express/Standard para los profesores.

### ¿Se puede activar `on_behalf_of`?

**Sí, y es recomendable** si los cargos se crean en la cuenta de la plataforma y se transfieren al profesor. Añadirlo tiene dos ventajas:

1. Apple Pay / Google Pay también funciona para los profesores en sus propios checkouts (si los tuvieran).
2. El statement descriptor y el nombre que ve el alumno en su banco corresponde al profesor, no a AnyClazz.

### Cómo añadirlo

```python
stripe.PaymentIntent.create(
    amount=booking.price_in_cents,
    currency=booking.currency,
    customer=student.stripe_customer_id,
    automatic_payment_methods={"enabled": True},
    on_behalf_of=teacher.stripe_account_id,          # cuenta Express del profesor
    transfer_data={
        "destination": teacher.stripe_account_id,    # a quién se transfiere
        "amount": net_amount_in_cents,               # importe tras la comisión de la plataforma (opcional, si se omite se transfiere el total)
    },
    metadata={"booking_id": str(booking.id)},
)
```

> **Nota**: `on_behalf_of` y `transfer_data.destination` deben apuntar a la misma cuenta. Si el modelo de negocio usa **destination charges** (la plataforma cobra y transfiere), este es el patrón correcto.

### ¿Qué pasa con el dominio de Apple Pay en cuentas Connect?

Cuando se usa `on_behalf_of`, Stripe registra automáticamente el dominio en la cuenta conectada del profesor. **No es necesario hacer nada adicional** — la verificación en la cuenta principal (`anyclazz.com`) es suficiente.

---

## Suscripciones (`POST /setup-intents`)

**Apple Pay y Google Pay no son compatibles con SetupIntents** — es una limitación de Stripe, independiente de la configuración del backend. Los wallets solo funcionan en pagos inmediatos (PaymentIntent). No hay cambio posible aquí.

---

## Cómo verificar que el cambio funcionó

1. Realizar una reserva de prueba.
2. En el dashboard de Stripe → **Payments** → abrir el PaymentIntent creado.
3. En el detalle, buscar **"Payment method types"**:
   - ✅ Debe mostrar `automatic` o listar `apple_pay`, `google_pay`, `card`.
   - ❌ Si solo muestra `card`, el cambio no se ha aplicado.

En el frontend, Apple Pay aparece únicamente en:
- Safari (macOS / iOS) con una tarjeta configurada en Apple Wallet.
- Chrome / Edge con Google Pay configurado en la cuenta de Google.
