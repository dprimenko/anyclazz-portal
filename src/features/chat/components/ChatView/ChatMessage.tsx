// Custom message bubble component
import { useMemo, type FC } from 'react';
import { useMessageContext, useChatContext, useChannelStateContext } from 'stream-chat-react';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { formatMessageTimestamp } from './chatDateFormatters';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { useTranslations } from '@/i18n';

export const ChatMessage: FC = () => {
	const { message, isMyMessage, readBy } = useMessageContext();
	const { client } = useChatContext();
	const { messages, channel } = useChannelStateContext();
	const t = useTranslations();

	const isMine = isMyMessage();
	const sender = message.user;
	const senderName = isMine ? t('chat.user_you') : sender?.name || t('chat.user_fallback');
	const senderImage = sender?.image as string | undefined;
	const createdAt = message.created_at ? new Date(message.created_at) : undefined;
	const formattedTime = createdAt ? formatMessageTimestamp(createdAt, t) : '';
	const messageText = message.text || '';

	// Check if the last own message has been read by someone else
	// Uses channel.state.read: map of userId -> { last_read: Date }
	const isLastOwnMessageRead = useMemo(() => {
		const lastOwn = [...(messages ?? [])].reverse().find((m) => m.user?.id === client.userID);
		if (!lastOwn?.created_at) return false;
		const lastOwnDate = new Date(lastOwn.created_at);
		const reads = channel.state.read;
		return Object.entries(reads).some(([userId, readState]) => {
			if (userId === client.userID) return false;
			return new Date(readState.last_read) >= lastOwnDate;
		});
	}, [messages, channel.state.read, client.userID]);

	// This message is the last one sent by current user
	const isLastOwnMessage = useMemo(() => {
		const lastOwn = [...(messages ?? [])].reverse().find((m) => m.user?.id === client.userID);
		return lastOwn?.id === message.id;
	}, [messages, message.id, client.userID]);

	// Show orange if last own message is read (applies to all own messages)
	// Show grey on last own message only if not yet read
	const isRead = isLastOwnMessageRead;
	const isDelivered = message.status === 'received' || message.status === 'sending';
	const userConnectionStatusClass = sender?.online ? 'bg-[#17B26A]' : 'bg-[#D5D7DA]';

	if (isMine) {
		return (
			<div className="flex justify-end px-4 py-1">
				{/* Wrapper: constrains header + bubble to max 70%, sized to content */}
				<div className="max-w-[70%] flex flex-col items-end gap-1">
					{/* Header: name + timestamp + indicator */}
				<div className="flex items-center justify-between w-full gap-2">
						<Text textLevel='span' colorType='tertiary' size='text-sm' weight='medium'>
                            {senderName}
                        </Text>
                        <div className='flex gap-1 items-center'>
                            <Text textLevel='span' colorType='tertiary' size='text-xs' className="shrink-0">{formattedTime}</Text>
                            {/* Read/Delivered indicator:
                                - Orange double-check on ALL own messages if last one was read
                                - Grey check/double-check only on last own message if not yet read */}
                            {isRead ? (
                                <Icon icon='double-check' iconColor='#F4A43A'/>
                            ) : isLastOwnMessage ? (
                                message.status === 'sending'
                                    ? <Icon icon='check' iconColor='#717680'/>
                                    : <Icon icon='double-check' iconColor='#717680'/>
                            ) : null}
                        </div>
					</div>
					{/* Bubble: content-sized, wraps at wrapper boundary */}
					<div className="w-fit max-w-full bg-white border border-[var(--color-neutral-200)] rounded-lg rounded-tr-none px-3 py-2">
						<Text colorType='primary' className="leading-relaxed whitespace-pre-wrap break-words m-0">
							{messageText}
						</Text>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-start gap-3 px-4 py-1">
			{/* Avatar */}
			<div className="relative shrink-0">
				<Avatar src={senderImage} alt={senderName} size={40} />
				<div className={`absolute bottom-0 right-0 w-3 h-3 ${userConnectionStatusClass} border-2 border-white rounded-full`} />
			</div>

			{/* Content: max 70%, sized to content */}
			<div className="flex flex-col items-start gap-1 max-w-[70%]">
				{/* Header: name + timestamp */}
				<div className="flex items-center justify-between w-full gap-3">
					<Text textLevel='span' colorType='tertiary' size='text-sm' weight='medium'>
						{senderName}
					</Text>
					<Text textLevel='span' colorType='tertiary' size='text-xs' className="shrink-0">{formattedTime}</Text>
				</div>
				{/* Bubble: content-sized, wraps at wrapper boundary */}
				<div className="w-fit max-w-full bg-[#F9F9F9] border border-[var(--color-neutral-200)] rounded-lg rounded-tl-none px-3 py-2">
					<Text colorType='primary' className="leading-relaxed whitespace-pre-wrap break-words m-0">
						{messageText}
					</Text>
				</div>
			</div>
		</div>
	);
};
