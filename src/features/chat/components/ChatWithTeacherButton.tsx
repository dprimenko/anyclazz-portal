// Button to initiate chat with a teacher
import { type FC, useState, useEffect } from 'react';
import type { StreamChat } from 'stream-chat';
import { useChatChannel } from '../hooks/useChatChannel';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import styles from './ChatWithTeacherButton.module.css';

interface ChatWithTeacherButtonProps {
	teacherId: string;
	teacherName: string;
	streamClient: StreamChat | null;
	keycloakToken: string | null;
	onChannelReady: (channelId: string) => void;
}

export const ChatWithTeacherButton: FC<ChatWithTeacherButtonProps> = ({
	teacherId,
	teacherName,
	streamClient,
	keycloakToken,
	onChannelReady,
}) => {
	const [trigger, setTrigger] = useState<string | null>(null);

	const { channel, isLoading, error } = useChatChannel({
		streamClient,
		keycloakToken,
		otherUserId: trigger,
	});

	// When channel is ready, notify parent
	useEffect(() => {
		if (channel) {
			onChannelReady(channel.id!);
			setTrigger(null); // Reset trigger
		}
	}, [channel, onChannelReady]);

	return (
		<button
			onClick={() => setTrigger(teacherId)}
			disabled={isLoading || !streamClient}
			aria-label={`Iniciar chat con ${teacherName}`}
			className={styles.chatButton}
		>
			<Icon icon="chat" iconWidth={20} iconHeight={20} />
			{isLoading ? 'Abriendo chat…' : `Chatear con ${teacherName}`}
			{error && <span className={styles.chatButton__error}>Error: {error}</span>}
		</button>
	);
};
