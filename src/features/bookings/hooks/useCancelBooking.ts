import { useState } from 'react';
import type { BookingsRepository, CancelBookingResponse } from '../domain/types';

interface UseCancelBookingOptions {
    repository: BookingsRepository;
    token: string;
    onSuccess?: (response: CancelBookingResponse) => void;
    onError?: (error: string) => void;
}

export function useCancelBooking({ repository, token, onSuccess, onError }: UseCancelBookingOptions) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancel = async (bookingId: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await repository.cancelBooking({
                bookingId,
                token
            });

            if (!response.success) {
                throw new Error(response.message || 'Error al cancelar la clase');
            }

            onSuccess?.(response);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cancelar la clase';
            setError(errorMessage);
            onError?.(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { cancel, loading, error };
}
