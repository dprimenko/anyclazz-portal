import type { CreateStoryParams, GetStoryParams, ListStoriesParams, ListStoriesResponse, Story } from './types';

export interface StoryRepository {
	listStories(params: ListStoriesParams): Promise<ListStoriesResponse>;
	getStory(params: GetStoryParams): Promise<Story>;
	createStory(params: CreateStoryParams, onProgress?: (progress: number) => void): Promise<Story>;
}
