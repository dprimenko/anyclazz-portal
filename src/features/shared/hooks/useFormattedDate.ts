/**
 * React hooks para formateo de fechas con timezone
 */
import { useMemo } from 'react';
import { formatInTimezone, toTimezone, getUserTimezone } from '../utils/dateConfig';
import { DateTime } from 'luxon';

/**
 * Hook para formatear una fecha ISO UTC en un timezone específico
 * Memoriza el resultado para evitar re-cálculos innecesarios
 * 
 * @param isoDate - Fecha en formato ISO UTC
 * @param timezone - Timezone para mostrar la fecha
 * @param format - Formato de Luxon (ej: "cccc dd HH:mm")
 * @param locale - Locale para el formato (default: 'en')
 * @returns Fecha formateada
 * 
 * @example
 * const formatted = useFormattedDate(
 *   booking.startAt, 
 *   booking.timezone, 
 *   'cccc dd HH:mm'
 * );
 */
export function useFormattedDate(
  isoDate: string,
  timezone: string,
  format: string,
  locale: string = 'en'
): string {
  return useMemo(() => {
    return formatInTimezone(isoDate, timezone, format, locale);
  }, [isoDate, timezone, format, locale]);
}

/**
 * Hook para obtener un DateTime de Luxon en el timezone especificado
 * Útil cuando necesitas hacer operaciones con la fecha (diff, comparaciones, etc.)
 * 
 * @param isoDate - Fecha en formato ISO UTC
 * @param timezone - Timezone para la fecha
 * @returns DateTime de Luxon
 * 
 * @example
 * const startTime = useDateTime(booking.startAt, booking.timezone);
 * const endTime = useDateTime(booking.endAt, booking.timezone);
 * const duration = endTime.diff(startTime, 'minutes').minutes;
 */
export function useDateTime(
  isoDate: string,
  timezone: string
): DateTime {
  return useMemo(() => {
    return toTimezone(isoDate, timezone);
  }, [isoDate, timezone]);
}

/**
 * Hook para formatear una fecha en el timezone del usuario actual
 * 
 * @param isoDate - Fecha en formato ISO UTC
 * @param format - Formato de Luxon
 * @param locale - Locale para el formato (default: 'en')
 * @returns Fecha formateada en el timezone local del usuario
 */
export function useFormattedDateLocal(
  isoDate: string,
  format: string,
  locale: string = 'en'
): string {
  const userTimezone = useMemo(() => getUserTimezone(), []);
  
  return useMemo(() => {
    return formatInTimezone(isoDate, userTimezone, format, locale);
  }, [isoDate, userTimezone, format, locale]);
}

/**
 * Hook que retorna ambas versiones: hora del profesor y hora local del usuario
 * Útil para mostrar ambos horarios en la UI
 * 
 * @param isoDate - Fecha en formato ISO UTC
 * @param timezone - Timezone del profesor/booking
 * @param format - Formato de Luxon
 * @param locale - Locale (default: 'en')
 * @returns Objeto con teacherTime y localTime formateadas
 * 
 * @example
 * const { teacherTime, localTime } = useDualTimezone(
 *   booking.startAt,
 *   booking.timezone,
 *   'h:mm a'
 * );
 */
export function useDualTimezone(
  isoDate: string,
  timezone: string,
  format: string,
  locale: string = 'en'
): {
  teacherTime: string;
  localTime: string;
  userTimezone: string;
} {
  const userTimezone = useMemo(() => getUserTimezone(), []);
  
  const teacherTime = useMemo(() => {
    return formatInTimezone(isoDate, timezone, format, locale);
  }, [isoDate, timezone, format, locale]);
  
  const localTime = useMemo(() => {
    return formatInTimezone(isoDate, userTimezone, format, locale);
  }, [isoDate, userTimezone, format, locale]);
  
  return {
    teacherTime,
    localTime,
    userTimezone
  };
}
