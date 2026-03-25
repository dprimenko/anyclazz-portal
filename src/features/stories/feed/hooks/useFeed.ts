import { useState, useEffect } from 'react';
import type { Story } from '../domain/types';
import type { StoryRepository } from '../domain/repository';

interface UseFeedParams {
	storyRepository: StoryRepository;
	accessToken: string;
	page?: number;
	size?: number;
	country?: string;
	city?: string;
	initialStoryId?: string;
}

interface UseFeedResult {
	stories: Story[];
	loading: boolean;
	error: Error | null;
	currentPage: number;
	lastPage: number;
	total: number;
	refetch: () => void;
}

export const useFeed = ({
	storyRepository,
	accessToken,
	page = 1,
	size = 20,
	country,
	city,
	initialStoryId,
}: UseFeedParams): UseFeedResult => {
	const [stories, setStories] = useState<Story[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [currentPage, setCurrentPage] = useState(page);
	const [lastPage, setLastPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [filters, setFilters] = useState({ country, city });

	const fetchStories = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await storyRepository.listStories({
				token: accessToken,
				page: currentPage,
				size,
				country: country,
				city: city,
				sharedStoryId: initialStoryId,
			});

			setStories(response.stories);
			setCurrentPage(response.meta.currentPage);
			setLastPage(response.meta.lastPage);
			setTotal(response.meta.total);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to fetch stories'));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStories();
	}, [currentPage, filters.country, filters.city, initialStoryId]);

	return {
		stories,
		loading,
		error,
		currentPage,
		lastPage,
		total,
		refetch: fetchStories,
	};
};
