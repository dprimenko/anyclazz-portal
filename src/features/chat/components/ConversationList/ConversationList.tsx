// Conversation list component (left sidebar)
import { type FC, useState } from 'react';
import type { Channel, StreamChat } from 'stream-chat';
import { useConversationList } from '../../hooks/useConversationList';
import { ConversationItem } from './ConversationItem';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import styles from './ConversationList.module.css';

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
		<div className={styles.conversationList}>
			{/* Header */}
			<div className={styles.conversationList__header}>
				<h1 className={styles.conversationList__title}>
					Messages
					{unreadCount > 0 && (
						<span className={styles.conversationList__badge}>{unreadCount}</span>
					)}
				</h1>
			</div>

			{/* Search */}
			<div className={styles.conversationList__search}>
				<Icon icon="search" iconWidth={20} iconHeight={20} />
				<input
					type="text"
					placeholder="Search"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className={styles.conversationList__searchInput}
				/>
			</div>

			{/* Conversations */}
			<div className={styles.conversationList__items}>
				{isLoading && (
					<div className={styles.conversationList__loading}>
						<p>Cargando conversaciones…</p>
					</div>
				)}

				{error && (
					<div className={styles.conversationList__error}>
						<p>Error: {error}</p>
					</div>
				)}

				{!isLoading && !error && filteredConversations.length === 0 && (
					<div className={styles.conversationList__empty}>
						<p>No hay conversaciones</p>
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
