import { useCallback, useEffect, useState } from 'react';
import { ApiStoryRepository } from '@/features/stories/feed/infrastructure/ApiStoryRepository';
import { Space } from '@/ui-library/components/ssr/space/Space';
import { PageSelector } from '@/ui-library/components/page-selector';
import type { Story } from '@/features/stories/feed/domain/types';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { useTranslations } from '@/i18n';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { ModalStory } from '@/features/stories/feed/components/story-view/ModalStory';
import { VideoEditModal } from '@/features/stories/feed/components/video-edit-modal/VideoEditModal';
import { subscribe, unsubscribe } from '@/features/shared/services/domainEventsBus';
import { VideoUploadEvents } from '@/features/stories/feed/components/video-upload-modal/domain/events';

const repository = new ApiStoryRepository();
const PAGE_SIZE = 10;

export interface MyStoriesTabProps {
    teacherId: string;
    accessToken: string;
}

export function TeacherStoriesList({ teacherId, accessToken }: MyStoriesTabProps) {

    const t = useTranslations();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [editingStory, setEditingStory] = useState<Story | null>(null);
    const [deletingStoryId, setDeletingStoryId] = useState<string | null>(null);

    const fetchMyStories = async (page: number, options?: { silent?: boolean }) => {
        try {
            if (!options?.silent) {
                setLoading(true);
            }
            const response = await repository.getMyStories({
                token: accessToken,
                teacherId,
                page,
                size: PAGE_SIZE,
            });
            setStories(response.stories);
            setTotalPages(response.meta.lastPage);
            setTotal(response.meta.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading stories');
        } finally {
            if (!options?.silent) {
                setLoading(false);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDelete = async (storyId: string) => {
        if (!confirm(t('video.delete.confirm'))) return;
        
        try {
            setDeletingStoryId(storyId);
            await repository.deleteStory({
                token: accessToken,
                storyId,
                teacherId,
            });
            // Refresh list
            await fetchMyStories(currentPage);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error deleting story');
        } finally {
            setDeletingStoryId(null);
        }
    };

    const handleEdit = (story: Story) => {
        setEditingStory(story);
    };

    const handleEditSuccess = async () => {
        await fetchMyStories(currentPage);
    };

    const itsMe = true;

    const openStory = useCallback((story: Story) => {
        setSelectedStory(story);
    }, []);

    useEffect(() => {
        fetchMyStories(currentPage);
    }, [teacherId, accessToken, currentPage]);

    useEffect(() => {
        const hasProcessing = stories.some((story) => story.processingStatus === 'processing');
        if (!hasProcessing) return;

        const intervalId = window.setInterval(() => {
            fetchMyStories(currentPage, { silent: true });
        }, 5000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [stories, currentPage, teacherId, accessToken]);

    useEffect(() => {
        function onRefresh() {
            fetchMyStories(1, { silent: false });
        }

        subscribe(VideoUploadEvents.SUCCESS_UPLOAD_VIDEO, onRefresh);
        return () => {
            unsubscribe(VideoUploadEvents.SUCCESS_UPLOAD_VIDEO, onRefresh);
        };
    }, []);

    return (
        <>
            {selectedStory && (
                <ModalStory 
                    story={selectedStory} 
                    storyRepository={repository}
                    accessToken={accessToken}
                    onClose={() => setSelectedStory(null)} 
                />
            )}
            {editingStory && (
                <VideoEditModal 
                    story={editingStory} 
                    onClose={() => setEditingStory(null)} 
                    onSuccess={handleEditSuccess}
                    accessToken={accessToken}
                    teacherId={teacherId}
                />
            )}
            
            {/* Loading state */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Text colorType="tertiary">{t('common.loading')}...</Text>
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Text colorType="primary" size="text-md" weight="semibold">Error</Text>
                    <Space size={4} direction="vertical" />
                    <Text colorType="tertiary" size="text-sm">{error}</Text>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && stories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Text colorType="primary" size="text-md" weight="semibold">
                        {t('teacher-profile.no_stories_yet')}
                    </Text>
                    <Space size={4} direction="vertical" />
                    <Text colorType="tertiary" size="text-sm" textalign="center">
                        {t('teacher-profile.upload_first_story')}
                    </Text>
                </div>
            )}

            {/* Stories list */}
            {!loading && !error && stories.length > 0 && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stories.map((story) => (
                            <div key={story.id} className="relative flex-shrink-0 w-48 md:w-64 aspect-[9/16] bg-neutral-100 rounded-lg overflow-hidden">
                                {story.processingStatus === 'processing' && (
                                    <div className='absolute top-0 left-0 w-[100%] h-[100%] overflow-hidden z-[1] bg-black opacity-80 text-white flex items-center justify-center'>
                                        Processing...
                                    </div>
                                )}

                                {story.processingStatus === 'ready' && (
                                    <img className='w-[100%] h-[100%]' src={story.thumbnailUrl}/>
                                )}

                                 {itsMe && (
                                    <div className='absolute top-0 left-0 w-[100%] h-[100%] overflow-hidden z-[2]'>
                                        <div className='absolute top-0 left-0 w-[100%] z-[2] flex flex-row-reverse w-full gap-1 p-2'>
                                            {story.processingStatus === 'ready' && (
                                                <Button 
                                                    color='secondary' 
                                                    icon="edit-01" 
                                                    iconColor='#717680' 
                                                    size='xs' 
                                                    onClick={() => handleEdit(story)}
                                                    disabled={deletingStoryId === story.id}
                                                />
                                            )}
                                            <Button 
                                                color='secondary' 
                                                icon="trash" 
                                                iconColor='#717680' 
                                                size='xs' 
                                                onClick={() => handleDelete(story.id)}
                                                disabled={deletingStoryId === story.id}
                                            />
                                        </div>
                                        {story.processingStatus === 'ready' && (
                                            <div className='absolute top-0 left-0 w-[100%] h-[100%] z-[1] flex flex-col justify-center items-center'>
                                                <div className='w-16 h-16 grid place-content-center rounded-full bg-white/30 backdrop-blur-2xl cursor-pointer' onClick={() => openStory(story)}>
                                                    <Icon icon='play'/>
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
        </>
    );
}