// Individual conversation item in the list
import { useMemo, type FC } from 'react';
import type { Channel } from 'stream-chat';
import { DateTime } from 'luxon';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { useTranslations } from '@/i18n';

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
	const t = useTranslations();

	// Get the other participant (not current user)
	const otherMember = Object.values(channel.state.members).find(
		(m) => m.user?.id !== currentUserId
	);

	const otherUser = otherMember?.user;
	const userName = otherUser?.name || t('chat.user_fallback');
	const userImage = otherUser?.image || '/images/default-avatar.png';
	const isOnline = otherUser?.online || false;

	// Get last message
	const lastMessage = channel.state.messages.at(-1);
	const lastMessageText = lastMessage?.text || '';
	const lastMessageTime = lastMessage?.created_at;

	// Unread count
	const unreadCount = channel.state.unreadCount ?? 0;

	// Format time using locale-aware translations
	const formatTime = (date: Date | string | undefined) => {
		if (!date) return '';

		const dt = DateTime.fromJSDate(new Date(date));
		const now = DateTime.now();

		if (dt.hasSame(now, 'day')) {
			return dt.toFormat(t('chat.date.format_time'));
		} else if (dt.hasSame(now.minus({ days: 1 }), 'day')) {
			return t('chat.date.yesterday');
		} else if (dt > now.minus({ days: 7 })) {
			return dt.setLocale(t('chat.date.locale')).toFormat('cccc');
		} else {
			return dt.toFormat(t('chat.date.format_date_short'));
		}
	};

	const userConnectionStatusClass = useMemo(() => {
		return isOnline ? 'bg-[#17B26A]' : 'bg-[#D5D7DA]';
	}, [isOnline]);

	return (
		<div
			className={`flex items-start gap-2 py-3 px-4 border-b border-b-[var(--color-neutral-200)] cursor-pointer transition-colors duration-200 hover:bg-[#FFF9F3] ${isActive ? 'bg-[#FFF9F3]' : ''}`}
			onClick={onClick}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onClick();
				}
			}}
		>
			{/* Unread indicator */}
			<div className="flex items-center justify-center w-3 shrink-0 mt-4">
				{unreadCount > 0 && <div className="w-2 h-2 bg-[var(--color-primary-700)] rounded-full" />}
			</div>

			{/* Avatar with online dot */}
			<div className="relative shrink-0">
				<Avatar src={userImage} alt={userName} size={44} />
				<div className={`absolute bottom-0 right-0 w-3 h-3 ${userConnectionStatusClass} border-2 border-white rounded-full`} />
			</div>

			{/* Content */}
			<div className="flex flex-col flex-1 min-w-0 gap-0.5">
				<div className="flex items-center justify-between gap-2">
					<Text size="text-sm" weight="semibold" colorType="primary" className="truncate">
						{userName}
					</Text>
					{lastMessageTime && (
						<span className="text-xs text-[var(--color-text-secondary)] shrink-0">
							{formatTime(lastMessageTime)}
						</span>
					)}
				</div>
				<Text colorType="tertiary" size="text-sm" className="line-clamp-2 break-words leading-snug">
					{lastMessage && <span className='font-medium'>{`${lastMessage?.user?.id === currentUserId ? `${t('chat.you')}: ` : ''}`}</span>}{lastMessageText || t('chat.no_messages')}
				</Text>
			</div>
		</div>
	);
};
