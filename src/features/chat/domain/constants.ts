// Chat feature constants

export const CHAT_API_ENDPOINTS = {
	TOKEN: '/chat/token',
	CHANNELS: '/chat/channels',
} as const;

export const CHAT_CHANNEL_TYPE = 'messaging' as const;

export const CHAT_QUERY_LIMITS = {
	CONVERSATIONS: 30,
	MESSAGES: 50,
} as const;

export const CHAT_ERRORS = {
	NO_TOKEN: 'No se pudo obtener el token de Stream Chat',
	NO_CHANNEL: 'No se pudo crear el canal de chat',
	NOT_CONNECTED: 'El cliente de Stream Chat no está conectado',
	UNAUTHORIZED: 'No autorizado para acceder al chat',
} as const;
