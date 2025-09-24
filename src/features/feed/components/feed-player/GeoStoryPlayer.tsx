import type { StoryFeed } from '../../domain/StoryFeed';
import './styles.css';

export interface GeoStoryPlayerProps {	
    story: StoryFeed;
    ref: React.RefObject<HTMLVideoElement|null>;
}

export function GeoStoryPlayer({ ref, story }: GeoStoryPlayerProps) {
    const optimizedVideoUrl = story.url.toString();
    
    return (
        <div className="video-player__wrapper">
			<video ref={ref} className="video-player__video" preload="auto" playsInline loop muted>
                <source src={`${optimizedVideoUrl}#t=0.001`} type="video/mp4" />
            </video>
		</div>
    )
}