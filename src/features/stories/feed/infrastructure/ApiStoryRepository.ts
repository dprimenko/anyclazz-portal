import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';
import type { StoryRepository } from '../domain/repository';
import type { CreateStoryParams, GetMyStoriesParams, GetStoryParams, LikeStoryParams, LikeStoryResponse, ListStoriesParams, ListStoriesResponse, Story, UnlikeStoryParams } from '../domain/types';
import type { ApiStory } from './types';

export class ApiStoryRepository implements StoryRepository {
	private readonly httpClient: FetchClient;

	constructor() {
		this.httpClient = new FetchClient(getApiUrl());
	}

	private toStory(apiStory: ApiStory): Story {
		return {
			id: apiStory.id,
			videoUrl: apiStory.videoUrl,
			thumbnailUrl: apiStory.thumbnailUrl,
			processingStatus: apiStory.processingStatus,
			title: apiStory.title,
			description: apiStory.description,
			cities: apiStory.cities,
			createdAt: apiStory.createdAt,
			teacher: apiStory.teacher,
			likeCount: apiStory.likeCount,
			isLikedByCurrentUser: apiStory.isLikedByCurrentUser,
		};
	}

	async listStories({ token, page, size, teacherId, country, city }: ListStoriesParams): Promise<ListStoriesResponse> {
		const data: Record<string, string | number> = {
			page,
			size,
			...(teacherId ? { teacherId } : {}),
			...(country ? { country } : {}),
			...(city ? { city } : {}),
		};

		const apiStoriesResponse = await this.httpClient.get({
			url: '/stories',
			token,
			data,
		});

		const stories = await apiStoriesResponse.json();
		return {
			stories: stories.stories?.map((s: ApiStory) => this.toStory(s)) || [],
			meta: stories.meta || {
				currentPage: page,
				lastPage: 1,
				size,
				total: 0,
			},
		};
	}

	async getStory({ token, storyId }: GetStoryParams): Promise<Story> {
		const apiStoryResponse = await this.httpClient.get({
			url: `/stories/${storyId}`,
			token,
		});

		const apiStory: ApiStory = await apiStoryResponse.json();
		return this.toStory(apiStory);
	}

	async getMyStories({ token, teacherId, page = 1, size = 20 }: GetMyStoriesParams): Promise<ListStoriesResponse> {
		const data: Record<string, string | number> = {
			page,
			size,
		};

		const apiStoriesResponse = await this.httpClient.get({
			url: '/stories/me',
			token,
			data,
		});

		const stories = await apiStoriesResponse.json();
		return {
			stories: stories.stories?.map((s: ApiStory) => this.toStory(s)) || [],
			meta: stories.meta || {
				currentPage: page,
				lastPage: 1,
				size,
				total: 0,
			},
		};
	}

	async createStory(
		{ token, teacherId, video, description, title, thumbnail, locations }: CreateStoryParams,
		onProgress?: (progress: number) => void
	): Promise<Story> {
		const data: Record<string, any> = {
			video,
			description,
		};
		
		if (title) {
			data.title = title;
		}
		
		if (thumbnail) {
			data.thumbnail = thumbnail;
		}
		
		if (locations && locations.length > 0) {
			data.locations = JSON.stringify(locations);
		}

		const apiStoryResponse = await this.httpClient.postFormData({
			url: '/stories',
			token,
			data,
		});

		const apiStory: ApiStory = await apiStoryResponse.json();
		return this.toStory(apiStory);
	}

	async deleteStory({ token, storyId, teacherId }: import('../domain/types').DeleteStoryParams): Promise<void> {
		await this.httpClient.delete({
			url: `/stories/${storyId}`,
			token,
		});
	}

	async updateStory(
		{ token, storyId, teacherId, video, description, title, thumbnail }: import('../domain/types').UpdateStoryParams,
		onProgress?: (progress: number) => void
	): Promise<Story> {
		const data: Record<string, string | number | Blob | Record<string, string>> = {};
		
		if (video) data.video = video;
		if (description) data.description = description;
		if (title) data.title = title;
		if (thumbnail) data.thumbnail = thumbnail;

		const response = await this.httpClient.postFormData({
			url: `/stories/${storyId}`,
			token,
			data,
		});

		const apiStory: ApiStory = await response.json();
		return this.toStory(apiStory);
	}

	async likeStory({ token, storyId }: LikeStoryParams): Promise<LikeStoryResponse> {
		const response = await this.httpClient.post({
			url: `/stories/${storyId}/like`,
			token,
		});

		return await response.json();
	}

	async unlikeStory({ token, storyId }: UnlikeStoryParams): Promise<LikeStoryResponse> {
		const response = await this.httpClient.delete({
			url: `/stories/${storyId}/unlike`,
			token,
		});

		return await response.json();
	}
}