import type { Booking } from '../domain/types';

/**
 * Verifica si una booking puede ser cancelada
 * Solo se pueden cancelar bookings con estado 'pending' o 'confirmed'
 */
export function canCancelBooking(booking: Booking): boolean {
    return booking.status === 'pending' || booking.status === 'confirmed';
}

/**
 * Verifica si una booking fue pagada (tiene reembolso al cancelar)
 */
export function isPaidBooking(booking: Booking): boolean {
    return booking.status === 'confirmed';
}

/**
 * Verifica si el usuario puede cancelar la booking
 * @param booking - La booking a verificar
 * @param userId - ID del usuario actual
 * @param role - Rol del usuario ('student' | 'teacher')
 */
export function canUserCancelBooking(
    booking: Booking,
    userId: string,
    role: 'student' | 'teacher'
): boolean {
    // Verificar estado
    if (!canCancelBooking(booking)) {
        return false;
    }

    // Verificar ownership
    if (role === 'student' && booking.studentId !== userId) {
        return false;
    }

    if (role === 'teacher' && booking.teacherId !== userId) {
        return false;
    }

    return true;
}
