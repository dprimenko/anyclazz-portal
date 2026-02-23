import { useCallback, useEffect, useState } from 'react';
import { ApiStoryRepository } from '@/features/stories/feed/infrastructure/ApiStoryRepository';
import { Space } from '@/ui-library/components/ssr/space/Space';
import { PageSelector } from '@/ui-library/components/page-selector';
import type { Story } from '@/features/stories/feed/domain/types';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { useTranslations } from '@/i18n';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { ModalStory } from '@/features/stories/feed/components/story-view/ModalStory';
import { ProgressIndicator } from '@/ui-library/components/progress-indicator';
import { EmptyState } from '@/ui-library/components/ssr/empty-state/EmptyState';

const repository = new ApiStoryRepository();
const PAGE_SIZE = 12;

export interface TeacherVideosDisplayProps {
    teacherId: string;
    accessToken: string;
}

export function TeacherVideosDisplay({ teacherId, accessToken }: TeacherVideosDisplayProps) {
    const t = useTranslations();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    const fetchStories = async (page: number, options?: { silent?: boolean }) => {
        try {
            if (!options?.silent) {
                setLoading(true);
            }
            const response = await repository.listStories({
                token: accessToken,
                teacherId,
                page,
                size: PAGE_SIZE,
            });
            setStories(response.stories);
            setTotalPages(response.meta.lastPage);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading videos');
        } finally {
            if (!options?.silent) {
                setLoading(false);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const openStory = useCallback((story: Story) => {
        setSelectedStory(story);
    }, []);

    useEffect(() => {
        fetchStories(currentPage);
    }, [teacherId, accessToken, currentPage]);

    // Polling para videos en procesamiento
    useEffect(() => {
        const hasProcessing = stories.some((story) => story.processingStatus === 'processing');
        if (!hasProcessing) return;

        const intervalId = window.setInterval(() => {
            fetchStories(currentPage, { silent: true });
        }, 5000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [stories, currentPage, teacherId, accessToken]);

    return (
        <>
            {selectedStory && (
                <ModalStory story={selectedStory} onClose={() => setSelectedStory(null)} />
            )}
            
            <div className="mt-6">
                {/* Loading state */}
                {loading && <ProgressIndicator />}

                {/* Error state */}
                {error && !loading && (
                    <EmptyState
                        title={t('common.error')}
                        description={error}
                    />
                )}

                {/* Empty state */}
                {!loading && !error && stories.length === 0 && (
                    <EmptyState
                        title={t('teacher-profile.no_videos_yet')}
                        description={t('teacher-profile.no_videos_description')}
                    />
                )}

                {/* Videos grid */}
                {!loading && !error && stories.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stories.map((story) => (
                                <div 
                                    key={story.id} 
                                    className="relative flex-shrink-0 w-full aspect-[9/16] bg-neutral-100 rounded-lg overflow-hidden cursor-pointer group"
                                    onClick={() => story.processingStatus === 'ready' && openStory(story)}
                                >
                                    {/* Processing state */}
                                    {story.processingStatus === 'processing' && (
                                        <div className='absolute inset-0 z-10 bg-black/80 text-white flex items-center justify-center'>
                                            <div className="flex flex-col items-center gap-2">
                                                <Icon icon="loader" iconWidth={24} iconHeight={24} />
                                                <Text colorType="accent" size="text-sm">
                                                    {t('common.processing')}...
                                                </Text>
                                            </div>
                                        </div>
                                    )}

                                    {/* Thumbnail */}
                                    {story.processingStatus === 'ready' && (
                                        <>
                                            <img 
                                                className='w-full h-full object-cover' 
                                                src={story.thumbnailUrl}
                                                alt={story.description || 'Video'}
                                            />
                                            
                                            {/* Play button overlay */}
                                            <div className='absolute inset-0 z-10 flex flex-col justify-center items-center bg-black/0 group-hover:bg-black/20 transition-colors'>
                                                <div className='w-16 h-16 grid place-content-center rounded-full bg-white/30 backdrop-blur-2xl group-hover:bg-white/40 transition-colors'>
                                                    <Icon icon='play' iconWidth={24} iconHeight={24} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Space size={24} direction="vertical" />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <>
                                <Divider />
                                <Space size={20} direction="vertical" />
                                <div className="flex justify-center">
                                    <PageSelector
                                        pages={totalPages}
                                        currentPage={currentPage}
                                        maxPages={5}
                                        disabled={loading}
                                        onChangedPage={handlePageChange}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
