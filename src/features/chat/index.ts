// Main exports for chat feature

// Components
export { MessagesPage } from './components/MessagesPage';
export { ConversationList } from './components/ConversationList/ConversationList';
export { ConversationItem } from './components/ConversationList/ConversationItem';
export { ChatView } from './components/ChatView/ChatView';
export { ChatNotificationBadge } from './components/ChatNotificationBadge';
export { ChatWithTeacherButton } from './components/ChatWithTeacherButton';

// Hooks
export { useStreamChat } from './hooks/useStreamChat';
export { useChatChannel } from './hooks/useChatChannel';
export { useUnreadCount } from './hooks/useUnreadCount';
export { useConversationList } from './hooks/useConversationList';
export { useAutoOpenChannel } from './hooks/useAutoOpenChannel';

// Infrastructure
export { initStreamChatClient, getStreamChatClient, disconnectStreamChatClient } from './infrastructure/streamClient';
export { getChatToken, createOrGetChannel } from './infrastructure/chatApi';

// Types
export type { StreamChatCredentials, ChatChannel, ChatUser, MessageStatus } from './domain/types';

// Constants
export { CHAT_API_ENDPOINTS, CHAT_CHANNEL_TYPE, CHAT_QUERY_LIMITS, CHAT_ERRORS } from './domain/constants';
