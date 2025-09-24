import { Tag } from '../../user/domain/Tag';
import type { StoryFeed } from './StoryFeed'

export interface RetrieveStoryParams {
    id: string;
}

export interface RetrieveStoriesParams {
    ignore?: string;
    page?: number;
    size?: number;
    lat?: number;
    long?: number;
    maxDist?: number;
    tags?: Tag[];
}

export interface ResponseRetrieveStories {
    items: StoryFeed[];
    total: number;
}

export interface FeedRepository {
    retrieveStory(params?: RetrieveStoryParams): Promise<StoryFeed>
    retrieveStories(params?: RetrieveStoriesParams): Promise<ResponseRetrieveStories>
}
