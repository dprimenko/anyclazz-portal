import { useState, useEffect } from 'react';
import type { Story } from '../domain/types';
import type { StoryRepository } from '../domain/repository';

interface UseFeedParams {
	storyRepository: StoryRepository;
	accessToken: string;
	page?: number;
	size?: number;
	countryISO2?: string;
	cityISO2?: string;
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
	countryISO2,
	cityISO2,
	initialStoryId,
}: UseFeedParams): UseFeedResult => {
	const [stories, setStories] = useState<Story[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [currentPage, setCurrentPage] = useState(page);
	const [lastPage, setLastPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [filters, setFilters] = useState({ countryISO2, cityISO2 });

	const fetchStories = async () => {
		try {
			setLoading(true);
			setError(null);

			// Si hay un initialStoryId, primero obtener ese story para extraer su ciudad
			let finalCountryISO2 = filters.countryISO2;
			let finalCityISO2 = filters.cityISO2;

			if (initialStoryId && !finalCityISO2) {
				const initialStory = await storyRepository.getStory({
					storyId: initialStoryId,
					token: accessToken,
				});

				// Usar la primera ciudad del story inicial como filtro
				if (initialStory.cities.length > 0) {
					finalCountryISO2 = initialStory.cities[0].countryISO2;
					finalCityISO2 = initialStory.cities[0].cityISO2;
					setFilters({
						countryISO2: finalCountryISO2,
						cityISO2: finalCityISO2,
					});
				}
			}

			const response = await storyRepository.listStories({
				token: accessToken,
				page: currentPage,
				size,
				countryISO2: finalCountryISO2,
				cityISO2: finalCityISO2,
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
	}, [currentPage, filters.countryISO2, filters.cityISO2, initialStoryId]);

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
