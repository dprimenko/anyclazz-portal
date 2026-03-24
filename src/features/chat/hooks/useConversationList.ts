// Hook for fetching and managing conversation list
import { useState, useEffect } from 'react';
import type { Channel, StreamChat, Event } from 'stream-chat';
import { CHAT_CHANNEL_TYPE, CHAT_QUERY_LIMITS } from '../domain/constants';

interface UseConversationListOptions {
	streamClient: StreamChat | null;
	currentUserId: string | null;
}

interface UseConversationListReturn {
	conversations: Channel[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage the list of conversations for the current user
 * @param options - Stream client and current user ID
 * @returns Conversations state and refetch function
 */
export function useConversationList({
	streamClient,
	currentUserId,
}: UseConversationListOptions): UseConversationListReturn {
	const [conversations, setConversations] = useState<Channel[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadConversations = async () => {
		if (!streamClient || !currentUserId) return;

		setIsLoading(true);
		setError(null);

		try {
			// Query all channels where the current user is a member
			const filter = {
				type: CHAT_CHANNEL_TYPE,
				members: { $in: [currentUserId] },
			};

			const sort = [{ last_message_at: -1 as const }];

			const options = {
				watch: true,
				state: true,
				limit: CHAT_QUERY_LIMITS.CONVERSATIONS,
			};

			const channels = await streamClient.queryChannels(filter, sort, options);
			setConversations(channels);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!streamClient || !currentUserId) return;

		let isMounted = true;

		const initialize = async () => {
			await loadConversations();
		};

		initialize();

		// Update conversation list when new messages arrive
		const handleNewMessage = (event: Event) => {
			if (isMounted && event.cid) {
				// Refetch to update order
				loadConversations();
			}
		};

		streamClient.on('notification.message_new', handleNewMessage);
		streamClient.on('message.new', handleNewMessage);

		return () => {
			isMounted = false;
			streamClient.off('notification.message_new', handleNewMessage);
			streamClient.off('message.new', handleNewMessage);
		};
	}, [streamClient, currentUserId]);

	return {
		conversations,
		isLoading,
		error,
		refetch: loadConversations,
	};
}
