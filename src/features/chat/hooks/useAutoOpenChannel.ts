// Hook to automatically open a channel with a specific user
import { useEffect } from 'react';
import type { Channel, StreamChat } from 'stream-chat';
import { useChatChannel } from './useChatChannel';

interface UseAutoOpenChannelOptions {
	streamClient: StreamChat | null;
	keycloakToken: string | null;
	userId: string | null | undefined;
	otherUserRole?: 'teacher' | 'student';
	onChannelReady: (channel: Channel) => void;
}

interface UseAutoOpenChannelReturn {
	isLoading: boolean;
	error: string | null;
}

/**
 * Hook to automatically open a channel with a specific user when component mounts
 * Used for deep linking to a specific chat (e.g., /messages/userId)
 * @param options - Stream client, token, user ID, and callback
 * @returns Loading and error states
 */
export function useAutoOpenChannel({
	streamClient,
	keycloakToken,
	userId,
	otherUserRole,
	onChannelReady,
}: UseAutoOpenChannelOptions): UseAutoOpenChannelReturn {
	const { channel, isLoading, error } = useChatChannel({
		streamClient,
		keycloakToken,
		otherUserId: userId || null,
		otherUserRole,
	});

	useEffect(() => {
		if (channel) {
			onChannelReady(channel);
		}
	}, [channel, onChannelReady]);

	return { isLoading, error };
}
