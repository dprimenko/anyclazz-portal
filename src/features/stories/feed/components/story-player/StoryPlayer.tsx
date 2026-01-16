export interface StoryPlayerProps {
    ref: React.RefObject<HTMLVideoElement|null>;
    story: {
        id: string;
        title: string;
        description: string;
        url: URL;
    };
}

export function StoryPlayer({ ref, story }: StoryPlayerProps) {
    return (
        <div className="relative h-full">
			<video ref={ref} className="w-full h-full object-cover" preload="auto" playsInline loop muted>
                <source src={`${story.url.toString()}#t=0.001`} type="video/mp4" />
            </video>
		</div>
    );
}