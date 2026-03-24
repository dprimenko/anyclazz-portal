// Chat API service using FetchClient following project patterns
import type { StreamChatCredentials, ChatChannel } from '../domain/types';
import { CHAT_API_ENDPOINTS, CHAT_ERRORS } from '../domain/constants';
import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';

class ChatApiRepository {
	private readonly httpClient: FetchClient;

	constructor() {
		this.httpClient = new FetchClient(getApiUrl());
	}

	/**
	 * Get Stream Chat credentials from the backend
	 * @param token - Authentication token from Keycloak
	 * @returns Stream Chat credentials (token, apiKey, userId)
	 */
	async getChatToken(token: string): Promise<StreamChatCredentials> {
		try {
			const response = await this.httpClient.post({
				url: CHAT_API_ENDPOINTS.TOKEN,
				token,
				data: {},
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error(CHAT_ERRORS.UNAUTHORIZED);
				}
				throw new Error(CHAT_ERRORS.NO_TOKEN);
			}

			return response.json();
		} catch (error) {
			throw new Error((error as Error).message || CHAT_ERRORS.NO_TOKEN);
		}
	}

	/**
	 * Create or get a 1:1 chat channel with another user
	 * @param token - Authentication token from Keycloak
	 * @param otherUserId - ID of the user to chat with
	 * @returns Channel information
	 */
	async createOrGetChannel(token: string, otherUserId: string): Promise<ChatChannel> {
		try {
			const response = await this.httpClient.post({
				url: CHAT_API_ENDPOINTS.CHANNELS,
				token,
				data: { otherUserId },
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error(CHAT_ERRORS.UNAUTHORIZED);
				}
				throw new Error(CHAT_ERRORS.NO_CHANNEL);
			}

			return response.json();
		} catch (error) {
			throw new Error((error as Error).message || CHAT_ERRORS.NO_CHANNEL);
		}
	}
}

// Export singleton instance
const chatApiRepository = new ChatApiRepository();

export const getChatToken = (token: string) => chatApiRepository.getChatToken(token);
export const createOrGetChannel = (token: string, otherUserId: string) =>
	chatApiRepository.createOrGetChannel(token, otherUserId);

