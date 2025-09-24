import type {
    ResponseRetrieveStories,
    FeedRepository,
    RetrieveStoriesParams,
    RetrieveStoryParams,
} from '../domain/FeedRepository'
import { StoryFeed } from '../domain/StoryFeed'

export class ApiFeedRepository implements FeedRepository
{
    async retrieveStory(params?: RetrieveStoryParams): Promise<StoryFeed> {
        return {
            id: '1',
            title: 'Test',
            description: 'Test',
            tags: [],
            url: new URL('https://www.google.com'),
            likes: 0,
        }
    }

    async retrieveStories(params?: RetrieveStoriesParams): Promise<ResponseRetrieveStories> {
        return {
            items: [],
            total: 0,
        }
    }
}
