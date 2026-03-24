// Badge component to show unread message count in navigation
import { type FC } from 'react';
import type { StreamChat } from 'stream-chat';
import { useUnreadCount } from '../hooks/useUnreadCount';
import styles from './ChatNotificationBadge.module.css';

interface ChatNotificationBadgeProps {
	streamClient: StreamChat | null;
}

export const ChatNotificationBadge: FC<ChatNotificationBadgeProps> = ({ streamClient }) => {
	const unreadCount = useUnreadCount(streamClient);

	if (unreadCount === 0) return null;

	return (
		<span className={styles.badge} aria-label={`${unreadCount} mensajes sin leer`}>
			{unreadCount > 99 ? '99+' : unreadCount}
		</span>
	);
};
