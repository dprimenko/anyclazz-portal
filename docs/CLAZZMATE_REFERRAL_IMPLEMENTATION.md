# Clazzmate (Referral) – Guía de integración Backend → Frontend

## Qué necesita el frontend

### 1. `GET /bookings/{id}` — añadir `referral_discount` en `payment`

El frontend ya llama a este endpoint para cargar el checkout. Únicamente necesita que el campo `payment` incluya `referral_discount` cuando aplique un descuento.

**Respuesta sin descuento** (sin cambios):
```json
{
  "payment": {
    "client_secret": "pi_xxx_secret_yyy",
    "payment_intent_id": "pi_xxx",
    "amount": 10.00,
    "currency": "EUR",
    "status": "pending",
    "requires_action": false
  }
}
```

**Respuesta con descuento Clazzmate:**
```json
{
  "payment": {
    "client_secret": "pi_xxx_secret_yyy",
    "payment_intent_id": "pi_xxx",
    "amount": 9.00,
    "currency": "EUR",
    "status": "pending",
    "requires_action": false,
    "referral_discount": {
      "discount_amount": 1.00,
      "discount_percent": 10.0,
      "original_amount": 10.00,
      "charged_amount": 9.00,
      "currency": "EUR",
      "credit_type": "referred_first_booking"
    }
  }
}
```

> `amount` ya debe reflejar el precio **con descuento aplicado** (9.00, no 10.00).  
> Si no hay descuento, omitir `referral_discount` o devolver `null`.

---

### 2. `GET /me/referral` — añadir `available_credit_amount`

El frontend usa este endpoint para el dashboard y la página `/me/clazzmate`.

**Respuesta actualizada:**
```json
{
  "referral_code": "ABCD1234",
  "invite_link": "https://anyclazz.com/register?ref=ABCD1234",
  "friends_invited": 3,
  "first_booking_conversions": 1,
  "available_credits": 1,
  "available_credit_amount": 8.00
}
```

| Campo nuevo | Tipo | Descripción |
|---|---|---|
| `available_credit_amount` | `float` | Importe total en euros de créditos monetarios disponibles |

> El campo antiguo `available_credits` (entero) sigue siendo necesario.

---

## Qué muestra el frontend

### Checkout — Order summary con descuento

```
1:1 Online                      €10.00
Clazzmate discount (-10%)        -€1.00
──────────────────────────────────────
Total                            €9.00
```

### Dashboard / `/me/clazzmate` — Crédito disponible

```
Available credit
€8.00
```

---

## Tipos de crédito

| `credit_type` | Quién lo recibe | Cuándo |
|---|---|---|
| `referred_first_booking` | Estudiante nuevo (referido) | 10% en su primera reserva |
| `referrer_reward` | Estudiante que compartió el link | Importe = ahorro del referido, en cualquier reserva futura |

---

## Endpoints no utilizados

El frontend **no llama** a `GET /api/v1/payments/booking/{bookingId}/preview`. El descuento se lee directamente del `GET /bookings/{id}`.
