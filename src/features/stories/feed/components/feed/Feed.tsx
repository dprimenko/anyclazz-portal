import { useCallback, useState } from "react";
import { StoryView } from "../story-view/StoryView";
import styles from "./Feed.module.css";

const stories = [
    {
        id: 'story1',
        title: 'Sample Story',
        description: 'This is a sample story description.',
        url: new URL('https://videos.pexels.com/video-files/32332929/13792523_1440_2560_30fps.mp4')
    }
];

export function Feed() {
    const [currentIndex, setCurrentIndex] = useState(1);

    // iOS compatible video management - using intersection observer instead of scroll snap events
	const [visibleVideoIndex, setVisibleVideoIndex] = useState<number>(0);

	const handleVideoVisibilityChange = useCallback((index: number, isVisible: boolean) => {
		if (isVisible) {
			setVisibleVideoIndex(index);
			setCurrentIndex(index + 1); // currentIndex is 1-based
		}
	}, []);
    
    return (
        <div className={styles.feed}>
            <div className={styles.feed__list}>
                <>
                    {stories.map((story, index) => (
                        <StoryView story={story} index={index} playing={(currentIndex - 1) === index}  onVisibilityChange={handleVideoVisibilityChange} />
                    ))}
                </>
            </div>
        </div>
    );
}