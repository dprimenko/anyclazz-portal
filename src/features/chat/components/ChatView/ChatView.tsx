// Chat view component (active conversation)
import { type FC, useEffect } from 'react';
import {
	Chat,
	Channel,
	ChannelHeader,
	MessageInput,
	MessageList,
	Window,
} from 'stream-chat-react';
import type { Channel as StreamChannel, StreamChat } from 'stream-chat';

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
		<div className={styles.chatView}>
			<Chat client={streamClient} theme="str-chat__theme-light">
				<Channel channel={channel}>
					<Window>
						<ChannelHeader />
						<MessageList />
						<MessageInput />
					</Window>
				</Channel>
			</Chat>
		</div>
	);
};
