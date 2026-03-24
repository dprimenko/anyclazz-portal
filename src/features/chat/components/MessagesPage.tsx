// Main messages page component
import { type FC, useState, useCallback } from 'react';
import type { Channel } from 'stream-chat';
import { useStreamChat } from '../hooks/useStreamChat';
import { useAutoOpenChannel } from '../hooks/useAutoOpenChannel';
import { ConversationList } from './ConversationList/ConversationList';
import { ChatView } from './ChatView/ChatView';
import styles from './MessagesPage.module.css';

interface MessagesPageProps {
	keycloakToken: string;
	currentUserId: string;
	initialUserId?: string;
}

export const MessagesPage: FC<MessagesPageProps> = ({ 
	keycloakToken, 
	currentUserId, 
	initialUserId 
}) => {
	const { client, isLoading, error } = useStreamChat({ keycloakToken });
	const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

	// Auto-open channel if initialUserId is provided (deep linking)
	const handleChannelReady = useCallback((channel: Channel) => {
		setActiveChannel(channel);
	}, []);

	const { isLoading: isLoadingInitialChannel, error: initialChannelError } = useAutoOpenChannel({
		streamClient: client,
		keycloakToken,
		userId: initialUserId,
		onChannelReady: handleChannelReady,
	});

	if (isLoading || isLoadingInitialChannel) {
		return (
			<div className={styles.messagesPage__loading}>
				<p>Conectando al chat…</p>
			</div>
		);
	}

	if (error || initialChannelError) {
		return (
			<div className={styles.messagesPage__error}>
				<p>Error al conectar con el chat</p>
				<p className={styles.messagesPage__errorMessage}>{error || initialChannelError}</p>
			</div>
		);
	}

	if (!client) {
		return null;
	}

	return (
		<div className={styles.messagesPage}>
			{/* Left sidebar: Conversation list */}
			<div className={styles.messagesPage__sidebar}>
				<ConversationList
					streamClient={client}
					currentUserId={currentUserId}
					activeChannelId={activeChannel?.id}
					onSelectChannel={setActiveChannel}
				/>
			</div>

			{/* Right pane: Active chat */}
			<div className={styles.messagesPage__main}>
				{activeChannel ? (
					<ChatView streamClient={client} channel={activeChannel} />
				) : (
					<div className={styles.messagesPage__emptyState}>
						<p>Selecciona una conversación para empezar</p>
					</div>
				)}
			</div>
		</div>
	);
};
