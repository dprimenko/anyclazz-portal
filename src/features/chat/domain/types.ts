// Types and interfaces for Stream Chat integration

export interface StreamChatCredentials {
	token: string;
	apiKey: string;
	userId: string;
}

export interface ChatChannel {
	channelType: string; // 'messaging'
	channelId: string; // 'dm_<md5hash>'
	cid: string; // 'messaging:dm_<md5hash>'
}

export interface ChatUser {
	id: string;
	name: string;
	image?: string;
	anyclazz_role?: 'teacher' | 'student';
}

// Estado de un mensaje (lo gestiona Stream nativamente)
export type MessageStatus = 'sending' | 'sent' | 'received' | 'read' | 'failed';
