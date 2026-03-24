// Hook for tracking unread message count
import { useState, useEffect } from 'react';
import type { StreamChat, Event } from 'stream-chat';

/**
 * Hook to track total unread message count across all channels
 * @param client - Stream Chat client instance
 * @returns Total unread count
 */
export function useUnreadCount(client: StreamChat | null): number {
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		if (!client) return;

		// Set initial value from connection state
		setUnreadCount(client.user?.total_unread_count ?? 0);

		// Update in real-time with relevant events
		const handleEvent = (event: Event) => {
			if (event.total_unread_count !== undefined) {
				setUnreadCount(event.total_unread_count);
			}
		};

		client.on('notification.message_new', handleEvent);
		client.on('notification.mark_read', handleEvent);
		client.on('message.new', handleEvent);

		return () => {
			client.off('notification.message_new', handleEvent);
			client.off('notification.mark_read', handleEvent);
			client.off('message.new', handleEvent);
		};
	}, [client]);

	return unreadCount;
}
