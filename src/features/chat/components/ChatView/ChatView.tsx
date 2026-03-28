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
import { CustomDateSeparator, formatMessageTimestamp } from './chatDateFormatters';

// Import Stream Chat React styles
import 'stream-chat-react/dist/css/v2/index.css';
import styles from './ChatView.module.css';

interface ChatViewProps {
	streamClient: StreamChat;
	channel: StreamChannel;
}

export const ChatView: FC<ChatViewProps> = ({ streamClient, channel }) => {
	// Mark channel as read when opened
	useEffect(() => {
		if (channel) {
			channel.markRead();
		}
	}, [channel]);

	return (
		<div className={`h-full w-full flex flex-col bg-[var(--color-background)] ${styles.streamOverrides}`}>
			<Chat client={streamClient} theme="str-chat__theme-light">
				<Channel channel={channel} DateSeparator={CustomDateSeparator}>
					<Window>
						<ChatHeader />
						<MessageList formatDate={formatMessageTimestamp} />
						<MessageInput Input={CustomMessageInput} />
					</Window>
				</Channel>
			</Chat>
		</div>
	);
};
