/**
 * Utilidades para migración de datos de Teacher
 * Maneja la compatibilidad entre formato antiguo y nuevo de la API
 */

import type { TeacherAddress } from '../domain/types';

/**
 * Normaliza teacherAddress de formato antiguo a nuevo
 * Soporta ambos formatos para retrocompatibilidad
 */
export function normalizeTeacherAddress(address: any): TeacherAddress {
  if (!address) {
    return {
      street: null,
      city: 'unk',
      state: null,
      country: 'es',
      fullAddress: ''
    };
  }

  // Si ya tiene el formato nuevo, retornar tal cual
  if (address.country && address.city) {
    return {
      street: address.street || null,
      city: address.city.toLowerCase(),
      state: address.state || null,
      country: address.country.toLowerCase(),
      fullAddress: address.fullAddress || ''
    };
  }

  // Convertir formato antiguo a nuevo (y normalizar a minúsculas)
  return {
    street: address.street || null,
    city: (address.cityISO2 || address.city || 'unk').toLowerCase(),
    state: address.state || null,
    country: (address.countryISO2 || address.country || 'es').toLowerCase(),
    fullAddress: address.fullAddress || ''
  };
}

/**
 * Construye el string de ubicación para mostrar en UI
 * Prioriza fullAddress, construye manualmente como fallback
 */
export function formatTeacherLocation(address: TeacherAddress | null | undefined): string {
  if (!address) {
    return 'Ubicación no especificada';
  }

  // Opción 1: Usar fullAddress directamente (recomendado)
  if (address.fullAddress && address.fullAddress.trim()) {
    return address.fullAddress;
  }

  // Opción 2: Construir manualmente
  const parts = [
    address.city && address.city !== 'unk' ? address.city : null,
    address.state,
    address.country
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : 'Ubicación no especificada';
}

/**
 * Construye fullAddress a partir de los componentes individuales
 */
export function buildFullAddress(
  street?: string | null,
  city?: string | null,
  state?: string | null,
  country?: string | null
): string {
  const parts = [
    street?.trim(),
    city?.trim(),
    state?.trim(),
    country?.trim()
  ].filter(Boolean);

  return parts.join(', ');
}
