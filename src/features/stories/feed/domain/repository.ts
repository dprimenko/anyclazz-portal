import type { GetStoryParams, ListStoriesParams, ListStoriesResponse, Story } from './types';

export interface StoryRepository {
	listStories(params: ListStoriesParams): Promise<ListStoriesResponse>;
	getStory(params: GetStoryParams): Promise<Story>;
}
