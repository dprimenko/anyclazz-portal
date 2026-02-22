# Cancelación de Bookings - Implementación Frontend

## ✅ Implementación Completa

Se ha implementado la funcionalidad completa de cancelación de bookings en el frontend.

## 📦 Componentes y Utilidades

### 1. Hook: `useCancelBooking`
**Ubicación:** `src/features/bookings/hooks/useCancelBooking.ts`

Hook personalizado para manejar la cancelación de bookings con estados de carga y error.

```tsx
import { useCancelBooking } from '@/features/bookings/hooks/useCancelBooking';

const { cancel, loading, error } = useCancelBooking({
    repository,
    token,
    onSuccess: (response) => {
        console.log(response.message);
        if (response.refunded) {
            console.log(`Reembolso: €${response.refundAmount}`);
        }
    },
    onError: (errorMsg) => {
        console.error('Error:', errorMsg);
    }
});

// Cancelar una booking
await cancel(bookingId);
```

### 2. Componente: `LessonCancelModal`
**Ubicación:** `src/features/bookings/components/lesson-cancel-modal/LessonCancelModal.tsx`

Modal completo para cancelar lecciones con confirmación y manejo de reembolsos.

```tsx
import { LessonCancelModal } from '@/features/bookings/components/lesson-cancel-modal/LessonCancelModal';

<LessonCancelModal
    lesson={booking}
    repository={repository}
    token={accessToken}
    onClose={() => setShowModal(false)}
    onSuccess={() => {
        // Actualizar la lista de bookings
        refreshBookings();
    }}
/>
```

### 3. Utilidades Helper
**Ubicación:** `src/features/bookings/utils/bookingHelpers.ts`

Funciones helper para validar si una booking se puede cancelar.

```tsx
import { canCancelBooking, isPaidBooking, canUserCancelBooking } from '@/features/bookings/utils/bookingHelpers';

// Verificar si se puede cancelar
if (canCancelBooking(booking)) {
    // Mostrar botón de cancelar
}

// Verificar si está pagada (tendrá reembolso)
if (isPaidBooking(booking)) {
    // Mostrar aviso de reembolso
}

// Verificar permisos del usuario
if (canUserCancelBooking(booking, userId, userRole)) {
    // Usuario puede cancelar
}
```

### 4. Repositorio Actualizado
**Ubicación:** `src/features/bookings/infrastructure/AnyclazzMyBookingsRepository.ts`

El repositorio ahora incluye el método `cancelBooking`:

```tsx
async cancelBooking({bookingId, token}: CancelBookingParams): Promise<CancelBookingResponse>
```

### 5. Tipos Actualizados
**Ubicación:** `src/features/bookings/domain/types.ts`

Nuevos tipos agregados:
- `CancelBookingParams`
- `CancelBookingResponse`

## 🎨 Ejemplo de Uso Completo

```tsx
import { useState } from 'react';
import { LessonCancelModal } from '@/features/bookings/components/lesson-cancel-modal/LessonCancelModal';
import { canCancelBooking } from '@/features/bookings/utils/bookingHelpers';
import { AnyclazzMyBookingsRepository } from '@/features/bookings/infrastructure/AnyclazzMyBookingsRepository';

interface BookingCardProps {
    booking: BookingWithTeacher;
    token: string;
    onUpdate: () => void;
}

export function BookingCard({ booking, token, onUpdate }: BookingCardProps) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const repository = new AnyclazzMyBookingsRepository();

    return (
        <div>
            <h3>{booking.classType.name}</h3>
            
            {/* Mostrar botón solo si se puede cancelar */}
            {canCancelBooking(booking) && (
                <button onClick={() => setShowCancelModal(true)}>
                    Cancelar Clase
                </button>
            )}

            {/* Modal de cancelación */}
            {showCancelModal && (
                <LessonCancelModal
                    lesson={booking}
                    repository={repository}
                    token={token}
                    onClose={() => setShowCancelModal(false)}
                    onSuccess={() => {
                        setShowCancelModal(false);
                        onUpdate(); // Recargar lista
                    }}
                />
            )}
        </div>
    );
}
```

## 🌐 Traducciones

Las traducciones se han agregado tanto en español como en inglés:

**Español (`es.ts`):**
- `bookings.cancel_lesson`
- `bookings.confirm_cancellation`
- `bookings.cannot_cancel_status`
- `bookings.cancel_with_refund_message`
- `bookings.refund_info`
- `bookings.refund_time`
- `bookings.cancel_no_refund_message`

**Inglés (`en.ts`):**
- Mismas keys con traducciones en inglés

## ✨ Características Implementadas

### ✅ Estados Manejados
- **pending**: Booking no pagada - se puede cancelar sin reembolso
- **confirmed**: Booking pagada - se cancela con reembolso automático
- **completed/cancelled/refunded**: No se pueden cancelar

### ✅ UX Implementada
- ✅ Confirmación antes de cancelar
- ✅ Mensaje diferente para bookings pagadas vs no pagadas
- ✅ Información sobre tiempo de reembolso (5-10 días)
- ✅ Estados de carga durante la cancelación
- ✅ Manejo de errores con mensajes claros
- ✅ Modal de éxito con mensaje del servidor
- ✅ Validación de permisos en el frontend

### ✅ Seguridad
- Token de autenticación requerido
- Validación de estados antes de mostrar opciones
- El backend valida ownership (estudiante o profesor)

## 🔧 Integración con Páginas Existentes

Para integrar en páginas como el dashboard o lista de bookings:

```tsx
// En tu componente de página
import { LessonCancelModal } from '@/features/bookings/components/lesson-cancel-modal/LessonCancelModal';

function MyBookingsPage({ bookings, token }: Props) {
    const [selectedBooking, setSelectedBooking] = useState<BookingWithTeacher | null>(null);
    const repository = new AnyclazzMyBookingsRepository();

    return (
        <>
            {bookings.map(booking => (
                <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={() => setSelectedBooking(booking)}
                />
            ))}

            {selectedBooking && (
                <LessonCancelModal
                    lesson={selectedBooking}
                    repository={repository}
                    token={token}
                    onClose={() => setSelectedBooking(null)}
                    onSuccess={() => {
                        setSelectedBooking(null);
                        // Recargar bookings
                    }}
                />
            )}
        </>
    );
}
```

## 📚 API Endpoint

**Endpoint:** `DELETE /api/v1/bookings/{id}/cancel`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Respuesta exitosa con reembolso:**
```json
{
  "success": true,
  "refunded": true,
  "refundAmount": 30.00,
  "message": "Booking cancelled successfully. Refund of 30.00 EUR processed."
}
```

**Respuesta exitosa sin reembolso:**
```json
{
  "success": true,
  "refunded": false,
  "message": "Booking cancelled successfully."
}
```

## 🧪 Testing

Para probar la funcionalidad:

1. Crear una booking con estado `pending`
2. Intentar cancelar → debería cancelar sin reembolso
3. Crear una booking y pagarla (estado `confirmed`)
4. Intentar cancelar → debería cancelar con reembolso automático
5. Verificar mensajes y estados de carga

## ⚠️ Notas Importantes

- El reembolso es **automático** para bookings con estado `confirmed`
- Los reembolsos tardan 5-10 días hábiles en aparecer en la cuenta del cliente
- Solo se pueden cancelar bookings con estado `pending` o `confirmed`
- El backend valida que solo el owner (estudiante o profesor) pueda cancelar
- Si hay error en Stripe, la booking NO se cancela

## 📞 Soporte

Si necesitas ayuda o encuentras algún problema con la implementación, revisa:
- Documentación del backend: `BOOKING_CANCELLATION_GUIDE.md`
- Logs del navegador para errores de frontend
- Network tab para ver respuestas del API
