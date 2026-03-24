// Stream Chat client initialization and management
import { StreamChat } from 'stream-chat';
import type { StreamChatCredentials } from '../domain/types';
import { CHAT_ERRORS } from '../domain/constants';
import { getChatToken } from './chatApi';

let client: StreamChat | null = null;

/**
 * Initialize and connect Stream Chat client
 * @param keycloakToken - Authentication token from Keycloak
 * @returns Connected Stream Chat client instance
 */
export async function initStreamChatClient(keycloakToken: string): Promise<StreamChat> {
	// If already connected, return existing client
	if (client && client.userID) {
		return client;
	}

	// Get credentials from backend
	const credentials: StreamChatCredentials = await getChatToken(keycloakToken);

	// Create client instance
	client = StreamChat.getInstance(credentials.apiKey);

	// Connect user
	await client.connectUser(
		{
			id: credentials.userId,
		},
		credentials.token
	);

	return client;
}

/**
 * Get the current Stream Chat client instance
 * @returns Stream Chat client or null if not initialized
 */
export function getStreamChatClient(): StreamChat | null {
	return client;
}

/**
 * Disconnect Stream Chat client and cleanup
 */
export async function disconnectStreamChatClient(): Promise<void> {
	if (client) {
		await client.disconnectUser();
		client = null;
	}
}

/**
 * Check if Stream Chat client is connected
 */
export function isClientConnected(): boolean {
	return client !== null && client.userID !== undefined;
}
