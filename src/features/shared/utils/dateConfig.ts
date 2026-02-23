/**
 * Configuración global para fechas en español usando Luxon
 */
import { DateTime, Settings } from 'luxon';

// Configurar Luxon para usar español por defecto
Settings.defaultLocale = 'en';

// También podemos configurar la zona horaria por defecto si es necesario
// Settings.defaultZone = 'Europe/Madrid';

// Re-exportar DateTime con la configuración aplicada
export { DateTime };

// Función helper para formatear fechas comunes en español
export const formatDate = {
  // Formato: "21 de septiembre de 2024"
  long: (date: Date | string) => {
    const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
    return dt.setLocale('en').toFormat('dd \'of\' MMMM \'of\' yyyy');
  },
  
  // Formato: "21 sep 2024"
  medium: (date: Date | string) => {
    const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
    return dt.setLocale('en').toFormat('dd MMM yyyy');
  },
  
  // Formato: "21/09/2024"
  short: (date: Date | string) => {
    const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
    return dt.setLocale('en').toFormat('dd/MM/yyyy');
  },
  
  // Formato relativo: "hace 2 días", "en 3 horas"
  relative: (date: Date | string) => {
    const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
    return dt.setLocale('en').toRelative() || '';
  },
  
  // Formato personalizable
  custom: (date: Date | string, format: string) => {
    const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
    return dt.setLocale('en').toFormat(format);
  }
};

/**
 * 🌍 Timezone Helpers
 * 
 * Estas funciones ayudan a trabajar con fechas en diferentes zonas horarias.
 * El backend siempre envía fechas en formato ISO 8601 UTC + un campo timezone separado.
 */

/**
 * Valida si un timezone es válido según IANA timezone database
 * @param timezone - Nombre del timezone (ej: 'America/New_York', 'Europe/Madrid')
 * @returns true si es válido, false si no lo es
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    DateTime.now().setZone(timezone);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convierte una fecha ISO UTC a un DateTime de Luxon en el timezone especificado
 * @param isoDate - Fecha en formato ISO 8601 UTC (ej: "2026-02-25T14:00:00+00:00")
 * @param timezone - Timezone destino (ej: "America/New_York")
 * @returns DateTime de Luxon configurado en el timezone especificado
 */
export function toTimezone(isoDate: string, timezone: string): DateTime {
  if (!isValidTimezone(timezone)) {
    console.warn(`Invalid timezone: ${timezone}, using America/New_York as fallback`);
    return DateTime.fromISO(isoDate, { zone: 'America/New_York' });
  }
  
  return DateTime.fromISO(isoDate, { zone: 'UTC' }).setZone(timezone);
}

/**
 * Formatea una fecha ISO UTC en el timezone especificado usando un formato de Luxon
 * @param isoDate - Fecha en formato ISO 8601 UTC (ej: "2026-02-25T14:00:00+00:00")
 * @param timezone - Timezone para mostrar (ej: "America/New_York")
 * @param format - Formato de Luxon (ej: "cccc dd HH:mm", "MMM dd, yyyy h:mm a")
 * @param locale - Locale para el formato (default: 'en')
 * @returns Fecha formateada en el timezone especificado
 * 
 * @example
 * formatInTimezone("2026-02-25T14:00:00+00:00", "America/New_York", "cccc dd HH:mm")
 * // => "Tuesday 25 09:00" (EST es UTC-5)
 */
export function formatInTimezone(
  isoDate: string,
  timezone: string,
  format: string,
  locale: string = 'en'
): string {
  return toTimezone(isoDate, timezone).setLocale(locale).toFormat(format);
}

/**
 * Formatea una fecha ISO UTC usando Intl.DateTimeFormat en el timezone especificado
 * Útil para formatos más complejos o localizados
 * @param isoDate - Fecha en formato ISO 8601 UTC
 * @param timezone - Timezone para mostrar
 * @param options - Opciones de Intl.DateTimeFormatOptions
 * @param locale - Locale para el formato (default: 'es-ES')
 * @returns Fecha formateada
 * 
 * @example
 * formatInTimezoneIntl("2026-02-25T14:00:00+00:00", "America/New_York", {
 *   dateStyle: 'medium',
 *   timeStyle: 'short'
 * })
 * // => "25 feb 2026, 9:00"
 */
export function formatInTimezoneIntl(
  isoDate: string,
  timezone: string,
  options: Intl.DateTimeFormatOptions = {},
  locale: string = 'es-ES'
): string {
  const date = new Date(isoDate);
  return date.toLocaleString(locale, {
    timeZone: timezone,
    ...options
  });
}

/**
 * Obtiene el timezone del navegador del usuario
 * @returns Timezone del usuario (ej: "Europe/Madrid")
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Parsea un string ISO 8601 manteniendo la zona horaria del offset original
 * sin convertir a la zona local del navegador
 * 
 * @param isoString - Fecha en formato ISO 8601 con offset incluido (ej: "2026-02-18T14:00:00-05:00")
 * @param timezone - Timezone IANA opcional para mostrar (ej: "America/New_York").
 *                   Si se proporciona, convierte al timezone especificado manteniendo el momento absoluto.
 * @returns DateTime de Luxon en la zona horaria del offset original o la especificada
 * 
 * @example
 * // Mantiene la zona del offset original
 * fromISOKeepZone("2026-02-18T14:00:00-05:00")
 * // => DateTime en UTC-5, muestra 14:00
 * 
 * @example
 * // Convierte a timezone específico
 * fromISOKeepZone("2026-02-18T14:00:00-05:00", "America/New_York")
 * // => DateTime en America/New_York, muestra 14:00 EST
 */
export function fromISOKeepZone(isoString: string, timezone?: string): DateTime {
  if (timezone) {
    // Si tenemos el timezone IANA, usarlo explícitamente
    return DateTime.fromISO(isoString).setZone(timezone, { keepLocalTime: false });
  }
  // Si no, mantener la zona del offset original sin convertir a zona local
  return DateTime.fromISO(isoString, { setZone: true });
}

/**
 * Helper para obtener el timezone de un booking, con fallbacks
 * @deprecated El campo timezone ya no existe en bookings (v2.0). Las fechas ahora vienen con timezone incluido en formato ISO8601.
 * @param booking - Objeto booking que puede tener timezone
 * @param teacherTimezone - Timezone del profesor como fallback
 * @returns Timezone a usar, o 'America/New_York' como último fallback
 */
export function getBookingTimezone(
  booking: { timezone?: string },
  teacherTimezone?: string
): string {
  return booking.timezone || teacherTimezone || 'America/New_York';
}

