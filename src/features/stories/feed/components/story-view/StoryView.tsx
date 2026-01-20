import { useCallback, useEffect, useRef, useState } from "react";
import { StoryPlayer } from "../story-player/StoryPlayer";
import { publish, subscribe, unsubscribe } from "@/features/shared/services/domainEventsBus";
import { FeedEvents } from "../../domain/events";
import { IconButton } from "@/ui-library/shared";
import { useIsMobile } from "@/ui-library/hooks/useIsMobile";
import type { Story } from "../../domain/types";


export interface StoryViewProps {
    story: Story;
    index: number;
    playing: boolean;
    onVisibilityChange: (index: number, isVisible: boolean) => void;
}

export function StoryView({ story, index, playing, onVisibilityChange }: StoryViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
	const isMobile = useIsMobile();

    const togglePlay = useCallback(() => {
		setIsPlaying(!isPlaying);
	}, [isPlaying]);

    const toggleSound = useCallback(() => {
		setIsMuted(!isMuted);
		publish(isMuted ? FeedEvents.MUTED_VIDEO : FeedEvents.UNMUTED_VIDEO);
	}, [isMuted]);

    // IntersectionObserver for iOS compatibility - auto play/pause videos based on visibility
	useEffect(() => {
		if (!containerRef.current) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				const isIntersecting = entry.isIntersecting;
				setIsVisible(isIntersecting);
				onVisibilityChange(index, isIntersecting);
				
				// Auto play/pause based on visibility
				if (isIntersecting) {
					setIsPlaying(true);
				} else {
					setIsPlaying(false);
				}
			},
			{
				threshold: 0.6, // Video is considered visible when 60% is in view
				rootMargin: '-10% 0px -10% 0px' // Add some margin to avoid edge cases
			}
		);

		observer.observe(containerRef.current);

		return () => {
			observer.disconnect();
		};
	}, [index, onVisibilityChange]);

	useEffect(() => {
		if (isPlaying) {
			videoRef.current?.play();
		} else {
			videoRef.current?.pause();	
		}
	}, [isPlaying]);

	useEffect(() => {
		if (!videoRef.current) return;
		videoRef.current.muted = isMuted;
	}, [isMuted]);

	useEffect(() => {
		setIsPlaying(playing);
	}, [playing]);

	useEffect(() => {
		function onUnmutedVideo() {
			if (!videoRef.current) return;
			videoRef.current.muted = false;
		}

		function onMuttedVideo() {
			if (!videoRef.current) return;
			videoRef.current.muted = true;
		}

		subscribe(FeedEvents.UNMUTED_VIDEO, onUnmutedVideo);

		subscribe(FeedEvents.MUTED_VIDEO, onMuttedVideo);

		return () => {
			unsubscribe(FeedEvents.UNMUTED_VIDEO, onUnmutedVideo);
			unsubscribe(FeedEvents.MUTED_VIDEO, onMuttedVideo);
		};
	}, []);

    return (
        <div className="relative snap-center w-full h-full sm:rounded-[20px]" ref={containerRef}>
			<StoryPlayer ref={videoRef} story={story} isMuted={isMuted} onToggleSound={toggleSound} isPlaying={isPlaying} onTogglePlay={togglePlay} />
			<div className="absolute inset-0 z-[1] grid grid-cols-[1fr_max-content] md:grid-cols-1 bg-gradient-to-b from-transparent from-85% to-black/75 sm:rounded-[20px]">
				{/* Info section - left column */}
				<div className="flex flex-col justify-end gap-2 p-4 pb-6">
					<div className="text-white text-sm font-medium">{story.title}</div>
					<div className="text-white/90 text-xs">{story.description}</div>
				</div>

				{/* Actions - right column (solo mobile) */}
				<div className="flex md:hidden flex-col items-center justify-end gap-6 p-4 pb-6">
					<IconButton icon="thumbs-up" label="234k" variant="ghost" />
					<IconButton icon="message-text-square-01" label="Chat" variant="ghost" />
					<IconButton icon="share-03" label="Share" variant="ghost" />
				</div>
			</div>
		</div>
    );
}