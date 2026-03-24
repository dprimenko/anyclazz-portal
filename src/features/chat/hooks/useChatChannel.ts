// Hook for opening and managing a 1:1 chat channel
import { useState, useEffect } from 'react';
import type { Channel, StreamChat } from 'stream-chat';
import { createOrGetChannel } from '../infrastructure/chatApi';
import { CHAT_CHANNEL_TYPE } from '../domain/constants';

interface UseChatChannelOptions {
	streamClient: StreamChat | null;
	keycloakToken: string | null;
	otherUserId: string | null;
}

interface UseChatChannelReturn {
	channel: Channel | null;
	isLoading: boolean;
	error: string | null;
}

/**
 * Hook to open and manage a 1:1 chat channel with another user
 * @param options - Stream client, Keycloak token, and other user ID
 * @returns Channel state
 */
export function useChatChannel({
	streamClient,
	keycloakToken,
	otherUserId,
}: UseChatChannelOptions): UseChatChannelReturn {
	const [channel, setChannel] = useState<Channel | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!streamClient || !keycloakToken || !otherUserId) return;

		let isMounted = true;

		const openChannel = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// Request backend to create/get the channel
				const { channelType, channelId } = await createOrGetChannel(keycloakToken, otherUserId);

				// Get channel instance from Stream SDK
				const ch = streamClient.channel(channelType || CHAT_CHANNEL_TYPE, channelId);
				await ch.watch();

				if (isMounted) {
					setChannel(ch);
				}
			} catch (err) {
				if (isMounted) {
					setError((err as Error).message);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		openChannel();

		return () => {
			isMounted = false;
		};
	}, [streamClient, keycloakToken, otherUserId]);

	return { channel, isLoading, error };
}
