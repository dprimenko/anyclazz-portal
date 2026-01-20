import type { CommonParams } from '@/features/shared/domain/types';

export interface StoryCity {
	countryISO2: string;
	cityISO2: string;
}

export interface Story {
	id: string;
	videoUrl: string;
	title?: string;
	description?: string;
	cities: StoryCity[];
	createdAt: string;
}

export interface GetStoryParams extends CommonParams {
	storyId: string;
}

export interface ListStoriesParams extends CommonParams {
	page: number;
	size: number;
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
