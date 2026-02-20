import { usePayPalBookingReturnHandler } from '@/features/bookings/hooks/usePayPalBookingReturnHandler';
import { ProgressIndicator } from '@/ui-library/components/progress-indicator';
import { useTranslations } from '@/i18n';

interface PayPalBookingReturnHandlerProps {
  token: string;
  lang?: 'en' | 'es';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Componente que maneja el retorno de PayPal después de confirmar el pago de un booking.
 * Debe incluirse en la página destino (ej: /me/my-agenda) para procesar automáticamente
 * el pago cuando el usuario regresa de PayPal.
 * 
 * Uso:
 * ```tsx
 * <PayPalBookingReturnHandler 
 *   token={accessToken} 
 *   lang="en"
 *   onSuccess={() => {
 *     // Mostrar mensaje de éxito, recargar bookings, etc.
 *   }}
 * />
 * ```
 */
export function PayPalBookingReturnHandler({ token, lang = 'en', onSuccess, onError }: PayPalBookingReturnHandlerProps) {
  const t = useTranslations({ lang });
  const { isProcessing, error } = usePayPalBookingReturnHandler({
    token,
    onSuccess,
    onError,
  });

  // No mostrar nada si no está procesando
  if (!isProcessing && !error) {
    return null;
  }

  // Mostrar indicador de procesamiento
  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <ProgressIndicator 
            message={t('booking.processing_paypal_payment')}
            size="lg"
          />
        </div>
      </div>
    );
  }

  // Mostrar error si hubo alguno
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
