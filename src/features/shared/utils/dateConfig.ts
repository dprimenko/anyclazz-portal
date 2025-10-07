/**
 * Configuración global para fechas en español usando Luxon
 */
import { DateTime, Settings } from 'luxon';

// Configurar Luxon para usar español por defecto
Settings.defaultLocale = 'es';

// También podemos configurar la zona horaria por defecto si es necesario
// Settings.defaultZone = 'Europe/Madrid';

// Re-exportar DateTime con la configuración aplicada
export { DateTime };

// Función helper para formatear fechas comunes en español
export const formatDate = {
  // Formato: "21 de septiembre de 2024"
  long: (date: Date | string) => {
    const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
    return dt.setLocale('es').toFormat('dd \'de\' MMMM \'de\' yyyy');
  },
  
  // Formato: "21 sep 2024"
  medium: (date: Date | string) => {
    const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
    return dt.setLocale('es').toFormat('dd MMM yyyy');
  },
  
  // Formato: "21/09/2024"
  short: (date: Date | string) => {
    const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
    return dt.setLocale('es').toFormat('dd/MM/yyyy');
  },
  
  // Formato relativo: "hace 2 días", "en 3 horas"
  relative: (date: Date | string) => {
    const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
    return dt.setLocale('es').toRelative() || '';
  },
  
  // Formato personalizable
  custom: (date: Date | string, format: string) => {
    const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
    return dt.setLocale('es').toFormat(format);
  }
};
