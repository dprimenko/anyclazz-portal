// Main messages page component
import { type FC, useState, useCallback } from 'react';
import type { Channel } from 'stream-chat';
import { useStreamChat } from '../hooks/useStreamChat';
import { useAutoOpenChannel } from '../hooks/useAutoOpenChannel';
import { ConversationList } from './ConversationList/ConversationList';
import { ChatView } from './ChatView/ChatView';
import { ProgressIndicator } from '@/ui-library/components/progress-indicator/ProgressIndicator';
import { useTranslations } from '@/i18n';
import type { ui } from '@/i18n/ui';

interface MessagesPageProps {
	keycloakToken: string;
	currentUserId: string;
	initialUserId?: string;
	initialUserRole?: 'teacher' | 'student';
	lang?: keyof typeof ui;
}

export const MessagesPage: FC<MessagesPageProps> = ({ 
	keycloakToken, 
	currentUserId, 
	initialUserId,
	initialUserRole,
	lang = 'en',
}) => {
	const { client, isLoading, error } = useStreamChat({ keycloakToken });
	const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
	// Mobile: show chat panel when a conversation is active
	const [showChatOnMobile, setShowChatOnMobile] = useState(!!initialUserId);
	const t = useTranslations();

	const handleChannelReady = useCallback((channel: Channel) => {
		setActiveChannel(channel);
		setShowChatOnMobile(true);
	}, []);

	const handleSelectChannel = useCallback((channel: Channel) => {
		setActiveChannel(channel);
		setShowChatOnMobile(true);
	}, []);

	const handleBackToList = useCallback(() => {
		setShowChatOnMobile(false);
	}, []);;

	const { isLoading: isLoadingInitialChannel, error: initialChannelError } = useAutoOpenChannel({
		streamClient: client,
		keycloakToken,
		userId: initialUserId,
		otherUserRole: initialUserRole,
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
				<p>{t('chat.connection_error')}</p>
				<p className="mt-2 text-sm text-[var(--color-text-secondary)]">{error || initialChannelError}</p>
			</div>
		);
	}

	if (!client) {
		return null;
	}

	return (
		<div className="flex flex-col md:flex-row h-dvh bg-[var(--color-background)]">
			{/* Left sidebar: Conversation list — hidden on mobile when chat is active */}
			<div className={`w-full md:w-[360px] md:border-r md:border-r-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shrink-0 h-full ${showChatOnMobile ? 'hidden md:block' : 'block'}`}>
				<ConversationList
					streamClient={client}
					currentUserId={currentUserId}
					activeChannelId={activeChannel?.id}
					onSelectChannel={handleSelectChannel}
				/>
			</div>

			{/* Right pane: Active chat — full screen on mobile */}
			<div className={`flex-1 flex flex-col overflow-hidden h-full ${showChatOnMobile ? 'flex' : 'hidden md:flex'}`}>
				{activeChannel ? (
					<ChatView streamClient={client} channel={activeChannel} accessToken={keycloakToken} onBack={handleBackToList} lang={lang} />
				) : (
					<div className="flex items-center justify-center h-full text-lg text-[var(--color-text-secondary)]">
						<p>{t('chat.select_conversation')}</p>
					</div>
				)}
			</div>
		</div>
	);
};
