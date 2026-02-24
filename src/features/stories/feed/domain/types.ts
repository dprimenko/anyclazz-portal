import type { CommonParams } from '@/features/shared/domain/types';

export interface StoryCity {
	country: string;
	city: string;
}

export interface Story {
	id: string;
	videoUrl: string;
	thumbnailUrl: string;
	processingStatus: 'processing' | 'ready' | 'failed';
	title?: string;
	description?: string;
	cities: StoryCity[];
	createdAt: string;
	teacher?: {
		id: string;
		name: string;
		surname: string;
		avatar?: string;
	};
	likeCount: number;
	isLikedByCurrentUser: boolean;
}

export interface GetStoryParams extends CommonParams {
	storyId: string;
}

export interface ListStoriesParams extends CommonParams {
	page: number;
	size: number;
	teacherId?: string;
	country?: string;
	city?: string;
}

export interface ListStoriesResponse {
	stories: Story[];
	meta: {
		currentPage: number;
		lastPage: number;
		size: number;
		total: number;
	};
}

export interface CreateStoryParams extends CommonParams {
	teacherId: string;
	video: File;
	description: string;
	title?: string;
	thumbnail?: File;
	locations?: Array<{
		country: string;
		city?: string;
	}>;
}

export interface GetMyStoriesParams extends CommonParams {
	teacherId: string;
	page?: number;
	size?: number;
}

export interface DeleteStoryParams extends CommonParams {
	storyId: string;
	teacherId: string;
}

export interface UpdateStoryParams extends CommonParams {
	storyId: string;
	teacherId: string;
	video?: File;
	description?: string;
	title?: string;
	thumbnail?: File;
}

export interface LikeStoryParams extends CommonParams {
	storyId: string;
}

export interface UnlikeStoryParams extends CommonParams {
	storyId: string;
}

export interface LikeStoryResponse {
	message: string;
	storyId: string;
	liked: boolean;
	likeCount: number;
}
