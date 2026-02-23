import type { CreateStoryParams, DeleteStoryParams, GetMyStoriesParams, GetStoryParams, LikeStoryParams, LikeStoryResponse, ListStoriesParams, ListStoriesResponse, Story, UnlikeStoryParams, UpdateStoryParams } from './types';

export interface StoryRepository {
	listStories(params: ListStoriesParams): Promise<ListStoriesResponse>;
	getStory(params: GetStoryParams): Promise<Story>;
	createStory(params: CreateStoryParams, onProgress?: (progress: number) => void): Promise<Story>;
	getMyStories(params: GetMyStoriesParams): Promise<ListStoriesResponse>;
	deleteStory(params: DeleteStoryParams): Promise<void>;
	updateStory(params: UpdateStoryParams, onProgress?: (progress: number) => void): Promise<Story>;
	likeStory(params: LikeStoryParams): Promise<LikeStoryResponse>;
	unlikeStory(params: UnlikeStoryParams): Promise<LikeStoryResponse>;
}
