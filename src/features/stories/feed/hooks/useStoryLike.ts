import { useState, useCallback, useEffect } from 'react';
import type { StoryRepository } from '../domain/repository';

interface UseStoryLikeParams {
	storyId: string;
	initialCount: number;
	initialIsLiked: boolean;
	storyRepository: StoryRepository;
	accessToken: string;
	onLikeChange?: (liked: boolean, count: number) => void;
}

interface UseStoryLikeResult {
	likeCount: number;
	isLiked: boolean;
	isLoading: boolean;
	toggleLike: () => Promise<{ success: boolean; data?: any; error?: any }>;
}

export function useStoryLike({
	storyId,
	initialCount,
	initialIsLiked,
	storyRepository,
	accessToken,
	onLikeChange,
}: UseStoryLikeParams): UseStoryLikeResult {
	const [likeCount, setLikeCount] = useState(initialCount);
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const [isLoading, setIsLoading] = useState(false);

	// Sync state when storyId or initial values change (e.g., when scrolling to a different story)
	useEffect(() => {
		setLikeCount(initialCount);
		setIsLiked(initialIsLiked);
	}, [storyId, initialCount, initialIsLiked]);

	const toggleLike = useCallback(async () => {
		setIsLoading(true);

		try {
			const response = isLiked
				? await storyRepository.unlikeStory({ token: accessToken, storyId })
				: await storyRepository.likeStory({ token: accessToken, storyId });

			const newIsLiked = !isLiked;
			setIsLiked(newIsLiked);
			setLikeCount(response.likeCount);

			onLikeChange?.(newIsLiked, response.likeCount);

			return { success: true, data: response };
		} catch (error) {
			console.error('Error toggling like:', error);
			return { success: false, error };
		} finally {
			setIsLoading(false);
		}
	}, [storyId, isLiked, storyRepository, accessToken, onLikeChange]);

    useEffect(() => {
        console.log(`Story ${storyId} like status changed: isLiked=${isLiked}, likeCount=${likeCount}`);
    }, [storyId, isLiked, likeCount]);

	return {
		likeCount,
		isLiked,
		isLoading,
		toggleLike,
	};
}
