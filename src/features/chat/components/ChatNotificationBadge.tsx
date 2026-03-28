// Badge component to show unread message count in navigation
import { type FC } from 'react';
import type { StreamChat } from 'stream-chat';
import { useUnreadCount } from '../hooks/useUnreadCount';

interface ChatNotificationBadgeProps {
	streamClient: StreamChat | null;
}

export const ChatNotificationBadge: FC<ChatNotificationBadgeProps> = ({ streamClient }) => {
	const unreadCount = useUnreadCount(streamClient);

	if (unreadCount === 0) return null;

	return (
		<span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-[var(--color-error)] text-white rounded-[10px] text-xs font-semibold absolute -top-2 -right-2" aria-label={`${unreadCount} mensajes sin leer`}>
			{unreadCount > 99 ? '99+' : unreadCount}
		</span>
	);
};
