// Individual conversation item in the list
import { type FC } from 'react';
import type { Channel } from 'stream-chat';
import { DateTime } from 'luxon';
import styles from './ConversationItem.module.css';

interface ConversationItemProps {
	channel: Channel;
	currentUserId: string;
	isActive: boolean;
	onClick: () => void;
}

export const ConversationItem: FC<ConversationItemProps> = ({
	channel,
	currentUserId,
	isActive,
	onClick,
}) => {
	// Get the other participant (not current user)
	const otherMember = Object.values(channel.state.members).find(
		(m) => m.user?.id !== currentUserId
	);

	const otherUser = otherMember?.user;
	const userName = otherUser?.name || 'Usuario';
	const userImage = otherUser?.image || '/images/default-avatar.png';
	const isOnline = otherUser?.online || false;

	// Get last message
	const lastMessage = channel.state.messages.at(-1);
	const lastMessageText = lastMessage?.text || '';
	const lastMessageTime = lastMessage?.created_at;

	// Unread count
	const unreadCount = channel.state.unreadCount ?? 0;

	// Format time
	const formatTime = (date: Date | string | undefined) => {
		if (!date) return '';

		const dt = DateTime.fromJSDate(new Date(date));
		const now = DateTime.now();

		if (dt.hasSame(now, 'day')) {
			return dt.toFormat('HH:mm'); // Today: show time
		} else if (dt.hasSame(now.minus({ days: 1 }), 'day')) {
			return 'Yesterday';
		} else if (dt > now.minus({ days: 7 })) {
			return dt.toFormat('cccc'); // This week: show day name
		} else {
			return dt.toFormat('dd/MM/yy'); // Older: show date
		}
	};

	return (
		<div
			className={`${styles.conversationItem} ${isActive ? styles.conversationItem__active : ''}`}
			onClick={onClick}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onClick();
				}
			}}
		>
			{/* Avatar */}
			<div className={styles.conversationItem__avatar}>
				<img src={userImage} alt={userName} />
				{isOnline && <span className={styles.conversationItem__onlineIndicator} />}
			</div>

			{/* Content */}
			<div className={styles.conversationItem__content}>
				<div className={styles.conversationItem__header}>
					<span className={styles.conversationItem__name}>{userName}</span>
					{lastMessageTime && (
						<span className={styles.conversationItem__time}>
							{formatTime(lastMessageTime)}
						</span>
					)}
				</div>

				<div className={styles.conversationItem__footer}>
					<p className={styles.conversationItem__message}>
						{lastMessageText || 'Sin mensajes'}
					</p>
					{unreadCount > 0 && (
						<span className={styles.conversationItem__badge}>{unreadCount}</span>
					)}
				</div>
			</div>

			{/* Unread indicator dot (only if unread) */}
			{unreadCount > 0 && <div className={styles.conversationItem__unreadDot} />}
		</div>
	);
};
