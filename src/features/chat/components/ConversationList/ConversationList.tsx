// Conversation list component (left sidebar)
import { type FC, useState } from 'react';
import type { Channel, StreamChat } from 'stream-chat';
import { useConversationList } from '../../hooks/useConversationList';
import { ConversationItem } from './ConversationItem';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Chip } from '@/ui-library/components/ssr/chip/Chip';
import { useTranslations } from '@/i18n';

interface ConversationListProps {
	streamClient: StreamChat;
	currentUserId: string;
	activeChannelId?: string;
	onSelectChannel: (channel: Channel) => void;
}

export const ConversationList: FC<ConversationListProps> = ({
	streamClient,
	currentUserId,
	activeChannelId,
	onSelectChannel,
}) => {
	const t = useTranslations();
	const { conversations, isLoading, error } = useConversationList({
		streamClient,
		currentUserId,
	});

	const [searchQuery, setSearchQuery] = useState('');

	// Filter conversations by search query
	const filteredConversations = conversations.filter((channel) => {
		const otherMember = Object.values(channel.state.members).find(
			(m) => m.user?.id !== currentUserId
		);
		const name = otherMember?.user?.name?.toLowerCase() || '';
		return name.includes(searchQuery.toLowerCase());
	});

	const unreadCount = conversations.reduce(
		(count, ch) => count + (ch.state.unreadCount ?? 0),
		0
	);

	return (
		<div className="flex flex-col h-full bg-[var(--color-surface)]">
			{/* Header */}
			<div className="flex flex-row items-center px-6 py-5">
				{/* <h1 className="m-0 text-2xl font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
					Messages
					
				</h1> */}

				<Text textLevel='h2' size='text-lg' colorType='primary' weight='semibold' className='flex items-center gap-2'>
					{t('chat.messages_title')}
					<Chip size="sm" colorType="secondary">
						{unreadCount}
					</Chip>
				</Text>
			</div>

			{/* Search */}
			<div className="px-4 pb-4">
				<div className="relative w-full">
					<input
						type="text"
						placeholder={t('chat.search_placeholder')}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full px-4 py-2.5 pl-10 border border-[var(--color-neutral-200)] rounded-lg focus:outline focus:outline-2 focus:outline-[var(--color-primary-700)]"
					/>
					<Icon
						icon="search"
						iconWidth={20}
						iconHeight={20}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
					/>
				</div>
			</div>

			{/* Conversations */}
			<div className="flex-1 overflow-y-auto">
				{isLoading && (
					<div className="p-6 text-center text-[var(--color-text-secondary)]">
						<p>{t('chat.loading_conversations')}</p>
					</div>
				)}

				{error && (
					<div className="p-6 text-center text-[var(--color-error)]">
						<p>Error: {error}</p>
					</div>
				)}

				{!isLoading && !error && filteredConversations.length === 0 && (
					<div className="p-6 text-center text-[var(--color-text-secondary)]">
						<p>{t('chat.no_conversations')}</p>
					</div>
				)}

				{!isLoading &&
					!error &&
					filteredConversations.map((channel) => (
						<ConversationItem
							key={channel.id}
							channel={channel}
							currentUserId={currentUserId}
							isActive={channel.id === activeChannelId}
							onClick={() => onSelectChannel(channel)}
						/>
					))}
			</div>
		</div>
	);
};
