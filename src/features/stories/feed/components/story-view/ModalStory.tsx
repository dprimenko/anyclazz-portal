import { Overlay } from "@/ui-library/components/overlay";
import { StoryView } from "./StoryView";
import type { Story } from "../../domain/types";
import type { StoryRepository } from "../../domain/repository";
import ReactDOM from "react-dom";
import { IconButton } from "@/ui-library/shared";
import { useCallback } from "react";
import { useTranslations } from "@/i18n";
import { useStoryLike } from "../../hooks/useStoryLike";
import { Control } from "../story-player/Control";

export interface ModalStoryProps {
    story: Story;
    storyRepository: StoryRepository;
    accessToken: string;
    onClose?: () => void;
    currentUserId?: string;
}

export function ModalStory({ story, storyRepository, accessToken, onClose, currentUserId }: ModalStoryProps) {
    const t = useTranslations();
    const modalRoot = document.getElementById('portal-root');
    const isOwnVideo = currentUserId && story.teacher?.id === currentUserId;

    // Use the like hook for the story in modal
    const { likeCount, isLiked, isLoading: isLikeLoading, toggleLike } = useStoryLike({
        storyId: story.id,
        initialCount: story.likeCount,
        initialIsLiked: story.isLikedByCurrentUser,
        storyRepository,
        accessToken,
    });

    const shareVideo = useCallback(() => {
		navigator.share({
			title: story.description || '',
			url: `${window.location.origin}/feed/${story.id}`,
		});
	}, [story]);

    const handleSendMessage = useCallback(() => {
        if (story.teacher?.id) {
            window.location.href = `/messages/${story.teacher.id}`;
        }
    }, [story.teacher?.id]);

    if (!modalRoot) {
		return null;
	}

    return ReactDOM.createPortal(
        <Overlay className="flex items-center justify-center">
             <div className="relative flex flex-col self-center h-full w-full md:aspect-[9/16] md:w-auto md:px-5 py-10">
                {/* Close button */}
                <div className="absolute top-[3rem] right-[0.625rem] md:right-[2rem] z-[10]">
                    <Control icon="close" onClick={onClose} />
                </div>
                <StoryView 
                    story={story} 
                    index={0} 
                    playing={true}  
                    onVisibilityChange={() => {}} 
                    onVideoUpload={() => {}}
                    storyRepository={storyRepository}
                    accessToken={accessToken}
                    currentUserId={currentUserId}
                />
                {/* Desktop action buttons - centered */}
                <div className="hidden md:flex absolute top-1/2 right-[-84px] -translate-y-1/2 flex-col gap-6 z-10">
                    <IconButton 
                        icon="thumbs-up"
                        label={t('common.likes', { count: likeCount })}
                        highlighted={isLiked}
                        onClick={toggleLike}
                    />
                    {!isOwnVideo && (
                        <IconButton 
                            icon="message-text-square-01" 
                            label={t('common.send_message')} 
                            onClick={handleSendMessage}
                        />
                    )}
                    <IconButton icon="share-03" label={t('common.share')} onClick={shareVideo}/>
                </div>
             </div>
        </Overlay>,
        modalRoot
    );
}