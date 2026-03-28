// Individual conversation item in the list
import { useMemo, type FC } from 'react';
import type { Channel } from 'stream-chat';
import { DateTime } from 'luxon';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';

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
	const userName = otherUser?.name || 'User';
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

	const userConnectionStatusClass = useMemo(() => {
		return isOnline ? 'bg-[#17B26A]' : 'bg-[#D5D7DA]';
	}, [isOnline]);

	return (
		<div
			className={`flex flex-col gap-4 py-4 px-3 border-b border-b-[var(--color-neutral-200)] cursor-pointer transition-colors duration-200 relative hover:bg-[#FFF9F3] ${isActive ? 'bg-[#FFF9F3]' : ''}`}
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
			<div className="grid grid-cols-[20px_1fr_min-content] items-center shrink-0 w-full">
				<div>
					{unreadCount > 0 && <div className="w-2 h-2 bg-[var(--color-primary-700)] rounded-full" />}
				</div>
				<div className="flex items-center gap-3 min-w-0">
					<div className="relative flex-shrink-0">
						<Avatar 
							src={userImage} 
							alt={userName}
							size={40} 
						/>
						<div className={`absolute bottom-0 right-0 w-3 h-3 ${userConnectionStatusClass} border-2 border-white rounded-full`}></div>
					</div>
					<div className="flex flex-col items-start flex-1 min-w-0 overflow-hidden">
						<Text size="text-sm" weight="semibold" colorType="primary" className="truncate w-full">
							{userName}
						</Text>
					</div>
					<div className='self-start'>
						{lastMessageTime && (
							<span className="text-sm text-[var(--color-text-secondary)] shrink-0">
								{formatTime(lastMessageTime)}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex pl-4 w-full">
				<Text colorType='tertiary' size='text-sm'>
					{lastMessageText || 'Sin mensajes'}
				</Text>
			</div>
		</div>
	);
};
