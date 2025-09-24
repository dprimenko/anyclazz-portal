import './styles.scss';
import { GeoStoryView } from './components/feed-view/GeoStoryView';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type StoryFeed } from './domain/StoryFeed';
import { ApiFeedRepository } from './infrastructure/ApiFeedRepository';
import { Loader } from '../../ui-library/components/loader/Loader';
import { CaretDownIcon, CaretUpIcon, FunnelIcon, ListIcon, MapPinIcon } from '@phosphor-icons/react';
import { PressableIcon } from '../../ui-library/components/pressable-icon';
import { MobileLocationSearch } from '../location-search/components/MobileLocationSearch';
import { ThemeContextProvider } from '../../ui-library/themes';
import { Chip } from '../../ui-library/components/chip';
import { MobileGeoStoriesFilter } from './components/feed-filter/MobileGeoStoriesFilter';
import { COOKIES_KEYS } from '../../services/cookies/constants';
import { set as setCookie } from '../../services/cookies';
import { useIsMobile } from '../../ui-library/hooks';
import { AppEvents } from '../shared/domain/events';
import { publish } from '../../services/domain-events-bus';
import { Tag } from '../user/domain/Tag';

const repository = new ApiFeedRepository();

export interface FeedProps {
	preFetchedStory?: StoryFeed;
	predefinedLocation: { place_id: string; lat: number; lng: number; address: string };
	maxDist?: number;
}

export function Feed({ preFetchedStory, predefinedLocation, maxDist }: FeedProps) {
	const isMobile = useIsMobile();
	const [stories, setStories] = useState<StoryFeed[]>([...(preFetchedStory ? [preFetchedStory] : [])]);
	const [currentIndex, setCurrentIndex] = useState(1);
	const [page, setPage] = useState(0);
	const [total, setTotal] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [openedSearchModule, setOpenedSearchModule] = useState(false);
	const [openedFiltersModule, setOpenedFiltersModule] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<{ place_id: string; lat: number; lng: number; address: string }>(predefinedLocation);
	const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
	const [isFirstFetch, setIsFirstFetch] = useState(true);
	const feedListRef = useRef<HTMLDivElement>(null);

	const hasMoreStories = useMemo(() => {
		return stories.length <= total;
	}, [stories, total]);

	const [visibleVideoIndex, setVisibleVideoIndex] = useState<number>(0);

	const handleVideoVisibilityChange = useCallback((index: number, isVisible: boolean) => {
		if (isVisible) {
			setVisibleVideoIndex(index);
			setCurrentIndex(index + 1); // currentIndex is 1-based
		}
	}, []);

	const onChangedIndex = useCallback(() => {
		if (hasMoreStories && currentIndex === stories.length - 4) {
			setPage(prev => prev + 1);
		}
	}, [hasMoreStories, currentIndex, stories]);

	useEffect(() => {
		onChangedIndex();
	}, [currentIndex]);

	const fetchStories = useCallback(async ({page, lat, long}: {page: number, lat?: number, long?: number}) => {
		const geoStories = await repository.retrieveStories({
			page,
			lat,
			long,
			maxDist,
		});
		setStories(prev => [...prev, ...geoStories.items]);
		setTotal(geoStories.total);
	}, [repository]);

	const resetState = useCallback((story?: StoryFeed) => {
		setIsLoading(true);
		setIsError(false);
		setPage(0);
		setTotal(0);

		if (!story) {
			setStories([]);
		}
	}, []);


	useEffect(() => {
		if (page === 0) return;
		fetchStories(
			{...(selectedLocation ? {
				lat: selectedLocation.lat,
				long: selectedLocation.lng,
			} : undefined),
			page
		});
	}, [page]);

	const refreshFeed = useCallback((preFetchedStory?: StoryFeed) => {
		resetState(preFetchedStory);
		fetchStories({
			...(preFetchedStory ? {
				ignore: preFetchedStory.id,
				lat: preFetchedStory.address.geoPoint.latitude,
				long: preFetchedStory.address.geoPoint.longitude,
			} : undefined),
			...(!preFetchedStory && selectedLocation ? {
				lat: selectedLocation.lat,
				long: selectedLocation.lng,
			} : undefined),
			page
		}).then(() => {
			setIsError(false);
		}).catch((error) => {
			console.error(error);
			setIsError(true);
		}).finally(() => {
			setIsLoading(false);
			setIsFirstFetch(false);
		});;
	}, [page, selectedLocation]);

	const scrollToPrevious = useCallback(() => {
		feedListRef.current?.scrollTo({
			top: screen.height * (currentIndex - 2),
			behavior: 'smooth',
		});
	}, [currentIndex]);

	const scrollToNext = useCallback(() => {
		console.log('scrollToNext', currentIndex);
		feedListRef.current?.scrollTo({
			top: screen.height * (currentIndex),
			behavior: 'smooth',
		});
	}, [currentIndex]);

	const onSelectLocation = useCallback((location: { place_id: string; lat: number; lng: number; address: string }) => {
		setSelectedLocation(location);
		setOpenedSearchModule(false);

		setCookie(COOKIES_KEYS.LOCATION, encodeURIComponent(JSON.stringify(location)));
	}, []);

	const onSelectTag = useCallback((tag: Tag) => {
		setSelectedTag(tag);
	}, []);

	useEffect(() => {
		refreshFeed(preFetchedStory);
	}, [preFetchedStory]);

	useEffect(() => {
		if (isFirstFetch) return;
		refreshFeed();
	}, [selectedLocation]);

	useEffect(() => {
		if (!selectedTag) return;
		refreshFeed();
	}, [selectedTag]);

	const geoPoint = useMemo(() => {
		return {
			latitude: selectedLocation.lat,
			longitude: selectedLocation.lng,
		}	
	}, [selectedLocation]);

	const locationLabel = useMemo(() => {
		if (!selectedLocation.address) return '¿Dónde estas?';
		const selectedLocationAddress = selectedLocation.address.length > 30 ? selectedLocation.address.slice(0, 30) + '...' : selectedLocation.address;
		return selectedLocationAddress;
	}, [selectedLocation]);


	const isPrefetchedStory = useCallback((story: StoryFeed) => {
		return preFetchedStory?.id === story?.id;
	}, [preFetchedStory, stories, currentIndex]);

	return (
		<ThemeContextProvider>
			<div ref={feedListRef} className="feed__list">
				<>
					{!isLoading && <div className="feed__header">
						{isMobile && <PressableIcon backgroundColor="rgba(84, 84, 84, 0.5)" icon={<ListIcon color="white" size={24} />} onClick={() => publish(AppEvents.OPEN_MOBILE_SIDEBAR)}/>}
						<Chip 
							$variant="big" 
							label={locationLabel} 
							$color="#fff" 
							$bgColor="rgba(84, 84, 84, 0.5)" 
							icon={<MapPinIcon color="white" size={24} />}
							onClick={() => setOpenedSearchModule(true)}
						/>
						<PressableIcon backgroundColor="rgba(84, 84, 84, 0.5)" icon={<FunnelIcon color="white" size={24} />} onClick={() => setOpenedFiltersModule(true)}/>
					</div>}
					{!isLoading && stories.length > 0 && stories.map((story, index) => (
						<GeoStoryView 
							key={story.id} 
							playing={(currentIndex - 1) === index} 
							story={story} 
							geoPoint={geoPoint} 
							noDistance={isPrefetchedStory(story)}
							index={index}
							onVisibilityChange={handleVideoVisibilityChange}
						/>
					))}
					{isLoading && (
						<div className="feed__loader">
							<Loader color="#FFF" backgroundColor="#000"/>
						</div>
					)}
					{isError && <div className="feed__error">Error loading stories</div>}
					{openedSearchModule && (
						<MobileLocationSearch onSelect={onSelectLocation} onClose={() => setOpenedSearchModule(false)} />
					)}
					{/* {openedFiltersModule && (
						<MobileGeoStoriesFilter items={tags.map((category) => ({
							value: category.id,
							label: category.name,
						}))} onSelected={(item) => onSelectTag({
							id: item.value,
							name: item.label,
						})} onClose={() => setOpenedFiltersModule(false)} />
					)} */}
				</>
			</div>
			<div className="feed__controls not-mobile">
				<PressableIcon vPadding={12} hPadding={12} fullRadius disabled={currentIndex <= 1} icon={<CaretUpIcon color="white" size={24} />} onClick={scrollToPrevious} />
				<PressableIcon vPadding={12} hPadding={12} fullRadius disabled={currentIndex === stories.length - 1} icon={<CaretDownIcon color="white" size={24} />} onClick={scrollToNext} />
			</div>
		</ThemeContextProvider>
	)
}