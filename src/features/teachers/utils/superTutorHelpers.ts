/**
 * Verifica si un profesor tiene una suscripción activa de Super Tutor
 * @param superTutorTo - Timestamp ISO 8601 de cuando expira la suscripción
 * @returns true si la suscripción está activa (no ha expirado), false en caso contrario
 */
export function isSuperTutor(superTutorTo: string | null | undefined): boolean {
  if (!superTutorTo) {
    return false;
  }

  try {
    const expirationDate = new Date(superTutorTo);
    const now = new Date();
    return expirationDate > now;
  } catch (error) {
    console.error('Invalid superTutorTo timestamp:', superTutorTo);
    return false;
  }
}

/**
 * Obtiene información completa del estado de Super Tutor
 * @param superTutorTo - Timestamp ISO 8601 de cuando expira la suscripción
 * @returns Información del estado de la suscripción
 */
export function getSuperTutorStatus(superTutorTo: string | null | undefined): {
  isActive: boolean;
  expirationDate: Date | null;
  daysRemaining: number | null;
} {
  if (!superTutorTo) {
    return {
      isActive: false,
      expirationDate: null,
      daysRemaining: null,
    };
  }

  try {
    const expirationDate = new Date(superTutorTo);
    const now = new Date();
    const isActive = expirationDate > now;
    const daysRemaining = isActive
      ? Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      isActive,
      expirationDate,
      daysRemaining,
    };
  } catch (error) {
    console.error('Invalid superTutorTo timestamp:', superTutorTo);
    return {
      isActive: false,
      expirationDate: null,
      daysRemaining: null,
    };
  }
}
