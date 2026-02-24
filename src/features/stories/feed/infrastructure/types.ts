export interface ApiStoryCity {
	country: string;
	city: string;
}

export interface ApiStory {
	id: string;
	videoUrl: string;
	thumbnailUrl: string;
	processingStatus: 'processing' | 'ready' | 'failed';
	title?: string;
	description?: string;
	cities: ApiStoryCity[];
	createdAt: string;
	updatedAt: string;
	teacher?: {
		id: string;
		name: string;
		surname: string;
		avatar?: string;
	};
	likeCount: number;
	isLikedByCurrentUser: boolean;
}
