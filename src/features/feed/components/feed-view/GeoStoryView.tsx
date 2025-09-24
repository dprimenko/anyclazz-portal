import './styles.scss';

import LogoPlayWhiteIcon from '../../../../assets/images/logo_play_white.png';
import PlayIcon from '../../../../assets/images/play.png';
import { HeartIcon, SpeakerSimpleHighIcon, SpeakerSimpleSlashIcon } from '@phosphor-icons/react';
import { ShareFatIcon } from '@phosphor-icons/react';
import { GeoStoryPlayer } from '../feed-player/GeoStoryPlayer';
import type { StoryFeed } from '../../domain/StoryFeed';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getLangFromUrl, useTranslations } from '../../../../i18n';
import type { GeoPoint } from '../../../shared/geopoint/domain/GeoPoint';
import { PressableIcon } from '../../../../ui-library/components/pressable-icon';
import { publish, subscribe, unsubscribe } from '../../../../services/domain-events-bus';
import { AppEvents } from '../../../shared/domain/events';

const lang = getLangFromUrl(new URL(window.location.href));

export interface StoryViewProps {
	story: StoryFeed;
	geoPoint?: GeoPoint;
	playing: boolean;
	noDistance?: boolean;
	index: number;
	onVisibilityChange: (index: number, isVisible: boolean) => void;
}

export function GeoStoryView({ story, geoPoint, playing, noDistance = false, index, onVisibilityChange }: StoryViewProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const t = useTranslations(lang);

	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [isVisible, setIsVisible] = useState(false);


	const getFormattedDistance = useCallback((distance: number | undefined) => {
		if (!distance) return undefined;
		if (distance >= 1000) {
			return `a ${Math.round(distance / 1000).toFixed(1)}km`;
		}
		
		if (Math.round(distance) === 0) {
			return 'muy cerca de ti';
		}

		return `a ${Math.round(distance)}m`;
	}, []);

	const calculateDistance = useMemo(() => {
		if (!geoPoint) return undefined;
		const distance = story.address.distance;
		return getFormattedDistance(distance);
	}, [story, geoPoint]);

	const togglePlay = useCallback(() => {
		setIsPlaying(!isPlaying);
	}, [isPlaying]);

	const toggleSound = useCallback(() => {
		setIsMuted(!isMuted);
		publish(isMuted ? AppEvents.MUTED_VIDEO : AppEvents.UNMUTED_VIDEO);
	}, [isMuted]);

	const shareGeoStory = useCallback(() => {
		navigator.share({
			title: story.title || '',
			url: `${window.location.origin}/feed/${story.id}`,
		});
	}, [story]);

	const whereGeoStory = useCallback(() => {
		const url = `https://maps.google.com/?q=${encodeURIComponent(story.address.address)}`;
		window.open(url, '_blank');
	}, [story]);

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
		console.log('playing changed', playing);
		setIsPlaying(playing);
	}, [playing]);

	useEffect(() => {
		function onUnmutedVideo() {
			console.log('onUnmutedVideo', videoRef.current);
			if (!videoRef.current) return;
			videoRef.current.muted = false;
		}

		function onMuttedVideo() {
			console.log('onMuttedVideo', videoRef.current);
			if (!videoRef.current) return;
			videoRef.current.muted = true;
		}

		subscribe(AppEvents.UNMUTED_VIDEO, onUnmutedVideo);

		subscribe(AppEvents.MUTED_VIDEO, onMuttedVideo);

		return () => {
			unsubscribe(AppEvents.UNMUTED_VIDEO, onUnmutedVideo);
			unsubscribe(AppEvents.MUTED_VIDEO, onMuttedVideo);
		};
	}, []);

	return (
		<div ref={containerRef} className="video-view__container">
			<GeoStoryPlayer ref={videoRef} story={story} />
			<div className="video-view__overlay">
				<div className="video-view__info">
					{geoPoint && !noDistance && <div><span className="video-view__distance">{calculateDistance}</span></div>}
					<div className="video-view__title">{story.title}</div>
					{/* {story.startDate && <div className="video-view__title">finaliza {formatDate.long(story.startDate.toISOString())}</div>} */}
					<div className="video-view__username">{`${story.user?.name}`}</div>
					{story.description && <div className="video-view__description">{story.description}</div>}
				</div>
				<div className="video-view__actions">
					<img className="video-view__avatar" src={story.user.avatar?.toString() || ''} alt={`${story.user.name} avatar`} onClick={() => publish(AppEvents.OPEN_DOWNLOAD_APP_MODAL)}/>
					<div className="video-view__action" onClick={whereGeoStory}>
						<img src={LogoPlayWhiteIcon.src} width="48" />
						<span>{t('common.where')}</span>
					</div>
					<div className="video-view__action" onClick={() => publish(AppEvents.OPEN_DOWNLOAD_APP_MODAL)}>
						<HeartIcon color="#fff" size={32} />
						<span>{story.likes}</span>
					</div>
					<div className="video-view__action" onClick={shareGeoStory}>
						<ShareFatIcon color="#fff" size={32} />
						<span>{t('common.share')}</span>
					</div>
				</div>
			</div>
			<div className="video-view__play" onClick={togglePlay}>
				{!isPlaying && <img src={PlayIcon.src} width="240" />}
			</div>
			<div className="video-view__sound">
				<PressableIcon 
					backgroundColor="rgba(84, 84, 84, 0.5)" 
					icon={isMuted ? <SpeakerSimpleSlashIcon size={24} color="#fff" weight='fill'/> : <SpeakerSimpleHighIcon size={24} color="#fff" weight='fill'/>}
					onClick={toggleSound}
				/>
			</div>
		</div>
	)
};