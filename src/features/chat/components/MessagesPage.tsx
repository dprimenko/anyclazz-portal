// Main messages page component
import { type FC, useState, useCallback } from 'react';
import type { Channel } from 'stream-chat';
import { useStreamChat } from '../hooks/useStreamChat';
import { useAutoOpenChannel } from '../hooks/useAutoOpenChannel';
import { ConversationList } from './ConversationList/ConversationList';
import { ChatView } from './ChatView/ChatView';
import { ProgressIndicator } from '@/ui-library/components/progress-indicator/ProgressIndicator';

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
			<div className="flex flex-col items-center justify-center h-full p-6 text-center">
				<ProgressIndicator size="lg" />
			</div>
			
		);
	}

	if (error || initialChannelError) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-6 text-center text-[var(--color-error)]">
				<p>Error al conectar con el chat</p>
				<p className="mt-2 text-sm text-[var(--color-text-secondary)]">{error || initialChannelError}</p>
			</div>
		);
	}

	if (!client) {
		return null;
	}

	return (
		<div className="flex flex-col md:flex-row h-screen bg-[var(--color-background)]">
			{/* Left sidebar: Conversation list */}
			<div className="w-full md:w-[360px] border-b border-b-[var(--color-border)] md:border-b-0 md:border-r md:border-r-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shrink-0 h-1/2 md:h-full">
				<ConversationList
					streamClient={client}
					currentUserId={currentUserId}
					activeChannelId={activeChannel?.id}
					onSelectChannel={setActiveChannel}
				/>
			</div>

			{/* Right pane: Active chat */}
			<div className="flex-1 flex flex-col overflow-hidden h-1/2 md:h-full">
				{activeChannel ? (
					<ChatView streamClient={client} channel={activeChannel} />
				) : (
					<div className="flex items-center justify-center h-full text-lg text-[var(--color-text-secondary)]">
						<p>Selecciona una conversación para empezar</p>
					</div>
				)}
			</div>
		</div>
	);
};
