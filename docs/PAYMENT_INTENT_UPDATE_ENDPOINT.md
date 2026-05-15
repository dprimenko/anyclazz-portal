# BE Requirement: PATCH /payment-intents/{id}

## Contexto

El frontend tiene un checkbox en el checkout de booking que permite al usuario elegir si guardar su método de pago para futuros pagos ("Guardar tarjeta para el futuro").

### Problema con el flujo anterior

El flujo anterior llamaba a `POST /payment-intents` cada vez que el usuario hacía toggle del checkbox. Esto **creaba un PaymentIntent nuevo** en Stripe con `setup_future_usage` distinto, devolviendo un `client_secret` diferente. El PaymentIntent anterior quedaba **huérfano** en Stripe (en estado `requires_payment_method`, nunca confirmado, nunca cancelado).

Consecuencias:
- PaymentIntents huérfanos acumulados en Stripe por cada toggle del checkbox.
- El formulario de pago de Stripe (`<Elements>`) se reinicializaba completamente al recibir un nuevo `client_secret`, causando una recarga visible del componente.

---

## Solución requerida

Añadir un endpoint `PATCH /payment-intents/{payment_intent_id}` que actualice el PaymentIntent **existente** en Stripe usando `stripe.PaymentIntent.modify()`. El `client_secret` **no cambia** al modificar un PI, por lo que el frontend no necesita reinicializar Stripe Elements.

---

## Endpoint

### `PATCH /payment-intents/{payment_intent_id}`

#### Auth
Bearer token requerido (mismo que el resto de endpoints de payment).

#### Path params
| Param | Tipo | Descripción |
|---|---|---|
| `payment_intent_id` | `string` | ID del PaymentIntent de Stripe (`pi_xxx`) |

#### Request body
```json
{
  "save_payment_method": true
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `save_payment_method` | `boolean` | Sí | `true` → añade `setup_future_usage: "off_session"` al PI. `false` → elimina `setup_future_usage` (o lo setea a `null`) |

#### Response `200 OK`
```json
{
  "payment_intent_id": "pi_xxx",
  "client_secret": "pi_xxx_secret_xxx"
}
```

> ⚠️ El `client_secret` devuelto debe ser el **mismo** que el del PI existente, no uno nuevo. Stripe no cambia el `client_secret` al modificar un PI.

#### Response `400 Bad Request`
```json
{
  "message": "Cannot update payment intent in status succeeded"
}
```
Solo se puede modificar un PI en estado `requires_payment_method` o `requires_confirmation`. Rechazar actualizaciones si el PI ya fue confirmado, cancelado o capturado.

#### Response `403 Forbidden`
```json
{
  "message": "Unauthorized"
}
```
Validar que el PI pertenece a un booking del usuario autenticado.

---

## Implementación en BE (pseudocódigo)

```python
# PATCH /payment-intents/{payment_intent_id}

@router.patch("/payment-intents/{payment_intent_id}")
async def update_payment_intent(
    payment_intent_id: str,
    body: UpdatePaymentIntentRequest,
    current_user: User = Depends(get_current_user),
    stripe_account_id: str = None,  # del booking
):
    # 1. Recuperar el PI de la base de datos (para validar ownership)
    pi_record = db.get_payment_intent(payment_intent_id)
    if not pi_record:
        raise HTTPException(404)

    # 2. Validar que el booking pertenece al usuario autenticado
    booking = db.get_booking(pi_record.booking_id)
    if booking.student_id != current_user.id:
        raise HTTPException(403)

    # 3. Validar que el PI aún se puede modificar
    if pi_record.status not in ("requires_payment_method", "requires_confirmation"):
        raise HTTPException(400, "Cannot update payment intent in status " + pi_record.status)

    # 4. Actualizar en Stripe
    update_params = {}
    if body.save_payment_method:
        update_params["setup_future_usage"] = "off_session"
    else:
        # Stripe acepta setup_future_usage="" para eliminar el valor
        update_params["setup_future_usage"] = ""

    stripe_pi = stripe.PaymentIntent.modify(
        payment_intent_id,
        **update_params,
        stripe_account=stripe_account_id,  # si es Connect
    )

    # 5. Actualizar en base de datos si es necesario
    db.update_payment_intent(payment_intent_id, save_payment_method=body.save_payment_method)

    # 6. Devolver el mismo client_secret (no cambia)
    return {
        "payment_intent_id": stripe_pi.id,
        "client_secret": stripe_pi.client_secret,
    }
```

### Nota sobre Stripe Connect

Si el proyecto usa Stripe Connect (el PI fue creado con `stripe_account=xxx`), el `modify` también debe pasar ese `stripe_account`:

```python
stripe.PaymentIntent.modify(
    payment_intent_id,
    setup_future_usage="off_session",
    stripe_account=connected_account_id,
)
```

---

## Flujo completo actualizado

```
Usuario llega al checkout
        │
        ▼
BookingCheckoutWrapper monta
└── POST /payment-intents  { booking_id, save_payment_method: false }
    → { payment_intent_id: "pi_xxx", client_secret: "pi_xxx_secret_xxx" }
        │
        ▼
Stripe Elements se inicializa con client_secret (UNA vez)
        │
        ▼
Usuario marca/desmarca "Guardar tarjeta para el futuro"
└── PATCH /payment-intents/pi_xxx  { save_payment_method: true/false }
    → { payment_intent_id: "pi_xxx", client_secret: "pi_xxx_secret_xxx" }
    ✅ Mismo client_secret → Stripe Elements NO se reinicializa
        │
        ▼
Usuario pulsa "Confirmar pago"
└── stripe.confirmPayment() sobre el PI actualizado
        │
        ▼
✅ Pago completado. Si save_payment_method=true,
   Stripe guarda el PM automáticamente via setup_future_usage.
```

---

## Qué hace el FE con este endpoint

Archivo: `src/services/stripe.ts`

```typescript
export async function updatePaymentIntent(
  token: string,
  paymentIntentId: string,
  savePaymentMethod: boolean
): Promise<void> {
  const response = await fetch(`${API_URL}/payment-intents/${paymentIntentId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ save_payment_method: savePaymentMethod }),
  });

  if (!response.ok) {
    console.warn('Failed to update payment intent');
    // best-effort: el pago continúa aunque falle el update
  }
}
```

Esta llamada es **best-effort**: si el endpoint falla (o no existe aún), el pago continúa normalmente. La única consecuencia es que el método de pago no se guardará aunque el usuario haya marcado el checkbox.

---

## Referencia Stripe

- [`PaymentIntent.modify()`](https://stripe.com/docs/api/payment_intents/update) — Stripe no genera un nuevo `client_secret` al actualizar un PI.
- [`setup_future_usage`](https://stripe.com/docs/api/payment_intents/object#payment_intent_object-setup_future_usage) — Valores: `"on_session"`, `"off_session"`, o `null`/`""` para limpiar.
