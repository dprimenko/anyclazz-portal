// Hook for initializing and managing Stream Chat client connection
import { useState, useEffect } from 'react';
import type { StreamChat } from 'stream-chat';
import { initStreamChatClient, disconnectStreamChatClient } from '../infrastructure/streamClient';

interface UseStreamChatOptions {
	keycloakToken: string | null;
}

interface UseStreamChatReturn {
	client: StreamChat | null;
	isConnected: boolean;
	isLoading: boolean;
	error: string | null;
}

/**
 * Hook to initialize and manage Stream Chat client connection
 * @param options - Options including Keycloak token
 * @returns Stream Chat client state
 */
export function useStreamChat({ keycloakToken }: UseStreamChatOptions): UseStreamChatReturn {
	const [client, setClient] = useState<StreamChat | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!keycloakToken) return;

		let isMounted = true;

		const connect = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const streamClient = await initStreamChatClient(keycloakToken);

				if (isMounted) {
					setClient(streamClient);
					setIsConnected(true);
				}
			} catch (err) {
				if (isMounted) {
					setError((err as Error).message);
					setIsConnected(false);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		connect();

		return () => {
			isMounted = false;
			// Cleanup: disconnect on unmount
			disconnectStreamChatClient().catch(() => {
				// Ignore cleanup errors
			});
		};
	}, [keycloakToken]);

	return { client, isConnected, isLoading, error };
}
