import { useCallback, useState, useRef } from "react";
import { StoryView } from "../story-view/StoryView";
import { IconButton } from "@/ui-library/shared";
import { VideoUploadButton } from "../video-upload-button";
import { useFeed } from "../../hooks/useFeed";
import { ApiStoryRepository } from "../../infrastructure/ApiStoryRepository";
import styles from "./Feed.module.css";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { useTranslations } from "@/i18n";

const repository = new ApiStoryRepository();

interface FeedProps {
	storyId?: string;
	accessToken: string;
	userRole?: string;
	teacherId?: string;
	countryIso2?: string;
	cityIso2?: string;
}

export function Feed({ storyId, accessToken, userRole, teacherId, countryIso2, cityIso2 }: FeedProps) {
	const t = useTranslations();

	const { stories, loading, error } = useFeed({
		storyRepository: repository,
		accessToken,
		initialStoryId: storyId,
		size: 20,
	});

	const listRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(1);

    // iOS compatible video management - using intersection observer instead of scroll snap events
	const [visibleVideoIndex, setVisibleVideoIndex] = useState<number>(0);

	const handleVideoVisibilityChange = useCallback((index: number, isVisible: boolean) => {
		if (isVisible) {
			setVisibleVideoIndex(index);
			setCurrentIndex(index + 1); // currentIndex is 1-based
		}
	}, []);

	const scrollToNext = useCallback(() => {
		if (currentIndex < stories.length) {
			const nextIndex = currentIndex + 1;
			setCurrentIndex(nextIndex);
			
			// Scroll to next story
			const nextElement = listRef.current?.children[currentIndex] as HTMLElement;
			if (nextElement) {
				nextElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}
		}
	}, [currentIndex, stories.length]);

	const scrollToPrev = useCallback(() => {
		if (currentIndex > 1) {
			const prevIndex = currentIndex - 1;
			setCurrentIndex(prevIndex);
			
			// Scroll to previous story
			const prevElement = listRef.current?.children[prevIndex - 1] as HTMLElement;
			if (prevElement) {
				prevElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}
		}
	}, [currentIndex]);

	if (loading) {
		return (
			<div className={styles.feed}>
				<div className="flex items-center justify-center h-screen">
					<p>Cargando stories...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.feed}>
				<div className="flex items-center justify-center h-screen">
					<p>Error: {error.message}</p>
				</div>
			</div>
		);
	}

	if (stories.length === 0) {
		return (
			<div className={styles.feed}>
				<div className="flex flex-col items-center justify-center h-screen gap-6">
					<p className="text-neutral-600">No hay stories disponibles</p>
					{userRole === 'teacher' && teacherId && countryIso2 && (
						<VideoUploadButton
							onVideoUploaded={() => {
								window.location.href = '/profile?tab=videos';
							}}
							accessToken={accessToken}
							teacherId={teacherId}
							countryIso2={countryIso2}
							cityIso2={cityIso2}
						/>
					)}
				</div>
			</div>
		);
	}
    
    return (
        <div className={styles.feed}>
            <div className={styles.feed__list} ref={listRef}>
                <>
                    {stories.map((story, index) => (
                        <StoryView key={story.id} story={story} index={index} playing={(currentIndex - 1) === index}  onVisibilityChange={handleVideoVisibilityChange} />
                    ))}
                </>
            </div>

			{/* Desktop action buttons - centered */}
			<div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ml-[280px] flex-col gap-6 z-10">
				<IconButton icon="thumbs-up" label="234 likes" />
				<IconButton icon="message-text-square-01" label="Send message" />
				<IconButton icon="share-03" label="Share" />
			</div>

			{/* Desktop navigation buttons - far right, fixed to viewport */}
			<div className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-6 z-10">
				<IconButton 
					icon="chevron-up"
					onClick={scrollToPrev}
					disabled={currentIndex === 1}
				/>
				<IconButton 
					icon="chevron-down"
					onClick={scrollToNext}
					disabled={currentIndex === stories.length}
				/>
			</div>

			{/* Upload button for teachers - top right */}
			{userRole === 'teacher' && teacherId && countryIso2 && (
				<div className="fixed top-8 right-10 z-20 flex flex-col gap-2">
					<VideoUploadButton
						onVideoUploaded={(story) => {
							console.log('Story uploaded from feed:', story);
							window.location.href = '/profile?tab=videos';
						}}
						accessToken={accessToken}
						teacherId={teacherId}
						countryIso2={countryIso2}
						cityIso2={cityIso2}
					/>
					<Button colorType="secondary" size='lg' label={t('teacher-profile.allvideos')} onClick={() => window.location.href = '/profile?tab=videos'} />
				</div>
			)}
        </div>
    );
}