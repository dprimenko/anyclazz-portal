import type { CommonParams } from '@/features/shared/domain/types';

export interface StoryCity {
	countryISO2: string;
	cityISO2: string;
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
}

export interface GetStoryParams extends CommonParams {
	storyId: string;
}

export interface ListStoriesParams extends CommonParams {
	page: number;
	size: number;
	teacherId?: string;
	countryISO2?: string;
	cityISO2?: string;
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
		countryIso2: string;
		cityIso2?: string;
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
