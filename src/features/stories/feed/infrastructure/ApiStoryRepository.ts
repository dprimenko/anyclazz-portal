import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';
import type { StoryRepository } from '../domain/repository';
import type { GetStoryParams, ListStoriesParams, ListStoriesResponse, Story } from '../domain/types';
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
			title: apiStory.title,
			description: apiStory.description,
			cities: apiStory.cities,
			createdAt: apiStory.createdAt,
		};
	}

	async listStories({ token, page, size, countryISO2, cityISO2 }: ListStoriesParams): Promise<ListStoriesResponse> {
		const data: Record<string, string | number> = {
			page,
			size,
			...(countryISO2 ? { countryISO2 } : {}),
			...(cityISO2 ? { cityISO2 } : {}),
		};

		const apiStoriesResponse = await this.httpClient.get({
			url: '/stories',
			token,
			data,
		});

		const stories = await apiStoriesResponse.json();
		return {
			stories: stories.stories.map((s: ApiStory) => this.toStory(s)),
			meta: stories.meta,
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
}
