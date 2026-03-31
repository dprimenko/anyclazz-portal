// Chat view component (active conversation)
import { type FC, useEffect } from 'react';
import {
	Chat,
	Channel,
	MessageInput,
	MessageList,
	Window,
} from 'stream-chat-react';
import type { Channel as StreamChannel, StreamChat } from 'stream-chat';
import { ChatHeader } from './ChatHeader';
import { CustomMessageInput } from './CustomMessageInput';
import { ChatMessage } from './ChatMessage';
import { CustomDateSeparator } from './chatDateFormatters';
import { CustomEmptyStateIndicator } from './CustomEmptyStateIndicator';

// Import Stream Chat React styles
import 'stream-chat-react/dist/css/v2/index.css';
import styles from './ChatView.module.css';

interface ChatViewProps {
	streamClient: StreamChat;
	channel: StreamChannel;
	accessToken: string;
	onBack?: () => void;
}

export const ChatView: FC<ChatViewProps> = ({ streamClient, channel, accessToken, onBack }) => {
	// Mark channel as read when opened
	useEffect(() => {
		if (channel) {
			channel.markRead();
		}
	}, [channel]);

	return (
		<div className={`h-full w-full flex flex-col bg-[var(--color-background)] ${styles.streamOverrides}`}>
			<Chat client={streamClient} theme="str-chat__theme-light">
				<Channel channel={channel} DateSeparator={CustomDateSeparator} Message={ChatMessage} EmptyStateIndicator={CustomEmptyStateIndicator}>
					<Window>
						<ChatHeader accessToken={accessToken} onBack={onBack} />
						<MessageList />
						<MessageInput Input={CustomMessageInput} />
					</Window>
				</Channel>
			</Chat>
		</div>
	);
};
