import { useState, useEffect, useCallback } from 'react';
import type { StripeConnectStatusResponse } from '../domain/types';
import { StripeConnectRepository } from '../infrastructure/StripeConnectService';

/**
 * Hook para gestionar el estado de Stripe Connect
 */
export function useStripeConnectStatus(
  accessToken: string, 
  autoFetch: boolean = true,
  initialStatus?: StripeConnectStatusResponse | null
) {
  const [status, setStatus] = useState<StripeConnectStatusResponse | null>(initialStatus ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialStatus);
  const [error, setError] = useState<string | null>(null);
  
  const repository = new StripeConnectRepository();

  const fetchStatus = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await repository.getStatus(accessToken);
      setStatus(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener el estado de Stripe';
      setError(message);
      console.error('Error fetching Stripe status:', err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    // Solo hacer autoFetch si no hay initialStatus proporcionado
    if (autoFetch && !initialStatus) {
      fetchStatus();
    }
  }, [autoFetch, fetchStatus, initialStatus]);

  const refetch = useCallback(() => {
    return fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook para gestionar las acciones de Stripe Connect
 */
export function useStripeConnectActions(accessToken: string) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const repository = new StripeConnectRepository();

  const startOnboarding = useCallback(
    async (country: string = 'US') => {
      if (!accessToken) {
        setError('No access token available');
        return null;
      }

      try {
        setIsProcessing(true);
        setError(null);
        const response = await repository.createOnboardingLink(accessToken, { country });
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al iniciar el onboarding';
        setError(message);
        console.error('Error starting onboarding:', err);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [accessToken]
  );

  const openDashboard = useCallback(async () => {
    if (!accessToken) {
      setError('No access token available');
      return null;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const response = await repository.createDashboardLink(accessToken);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al abrir el dashboard';
      setError(message);
      console.error('Error opening dashboard:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [accessToken]);

  const completeOAuth = useCallback(
    async (code: string, state: string) => {
      if (!accessToken) {
        setError('No access token available');
        return null;
      }

      try {
        setIsProcessing(true);
        setError(null);
        const response = await repository.completeOAuth(accessToken, { code, state });
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al completar la conexión';
        setError(message);
        console.error('Error completing OAuth:', err);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [accessToken]
  );

  const disconnect = useCallback(async () => {
    if (!accessToken) {
      setError('No access token available');
      return null;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const response = await repository.disconnect(accessToken);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al desconectar la cuenta';
      setError(message);
      console.error('Error disconnecting:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [accessToken]);

  return {
    startOnboarding,
    openDashboard,
    completeOAuth,
    disconnect,
    isProcessing,
    error,
  };
}
