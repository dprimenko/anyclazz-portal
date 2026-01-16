import { useCallback, useEffect, useRef, useState } from "react";
import { StoryPlayer } from "../story-player/StoryPlayer";
import { publish, subscribe, unsubscribe } from "@/features/shared/services/domainEventsBus";
import { FeedEvents } from "../../domain/events";


export interface StoryViewProps {
    story: {
        id: string;
        title: string;
        description: string;
        url: URL;
    };
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
        <div className="relative snap-center w-full h-full" ref={containerRef}>
			<StoryPlayer ref={videoRef} story={story} />
			<div className="absolute inset-0 z-[1] grid grid-cols-[1fr_max-content]">
				{/* <div className="video-view__info">
					{geoPoint && !noDistance && <div><span className="video-view__distance">{calculateDistance}</span></div>}
					<div className="video-view__title">{geoStory.title}</div>
					{geoStory.startDate && <div className="video-view__title">finaliza {formatDate.long(geoStory.startDate.toISOString())}</div>}
					<div className="video-view__username">{geoStory.influencer?.id ? `@${geoStory.influencer?.name}` : geoStory.business?.name}</div>
					{geoStory.description && <div className="video-view__description">{geoStory.description}</div>}
				</div> */}
				{/* <div className="video-view__actions">
					<img className="video-view__avatar" src={geoStory.avatar?.toString() || ''} alt={`${geoStory.influencer?.name || geoStory.business?.name || ''} avatar`} onClick={() => publish(AppEvents.OPEN_DOWNLOAD_APP_MODAL)}/>
					<div className="video-view__action" onClick={whereGeoStory}>
						<img src={LogoPlayWhiteIcon.src} width="48" />
						<span>{t('common.where')}</span>
					</div>
					<div className="video-view__action" onClick={() => publish(AppEvents.OPEN_DOWNLOAD_APP_MODAL)}>
						<HeartIcon color="#fff" size={32} />
						<span>{geoStory.likes}</span>
					</div>
					<div className="video-view__action" onClick={shareGeoStory}>
						<ShareFatIcon color="#fff" size={32} />
						<span>{t('common.share')}</span>
					</div>
				</div> */}
			</div>
			{/* <div className="video-view__play" onClick={togglePlay}>
				{!isPlaying && <img src={PlayIcon.src} width="240" />}
			</div>
			<div className="video-view__sound">
				<PressableIcon 
					backgroundColor="rgba(84, 84, 84, 0.5)" 
					icon={isMuted ? <SpeakerSimpleSlashIcon size={24} color="#fff" weight='fill'/> : <SpeakerSimpleHighIcon size={24} color="#fff" weight='fill'/>}
					onClick={toggleSound}
				/>
			</div> */}
		</div>
    );
}