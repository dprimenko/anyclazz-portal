import { Overlay } from "@/ui-library/components/overlay";
import { StoryView } from "./StoryView";
import type { Story } from "../../domain/types";
import type { StoryRepository } from "../../domain/repository";
import ReactDOM from "react-dom";
import { IconButton } from "@/ui-library/shared";
import { useCallback } from "react";
import { useTranslations } from "@/i18n";
import { useStoryLike } from "../../hooks/useStoryLike";

export interface ModalStoryProps {
    story: Story;
    storyRepository: StoryRepository;
    accessToken: string;
    onClose?: () => void;
}

export function ModalStory({ story, storyRepository, accessToken, onClose }: ModalStoryProps) {
    const t = useTranslations();
    const modalRoot = document.getElementById('portal-root');

    // Use the like hook for the story in modal
    const { likeCount, isLiked, isLoading: isLikeLoading, toggleLike } = useStoryLike({
        storyId: story.id,
        initialCount: story.likeCount,
        initialIsLiked: story.isLikedByCurrentUser,
        storyRepository,
        accessToken,
    });

    if (!modalRoot) {
		return null;
	}

    const onOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof HTMLElement && e.target.classList.value !== e.currentTarget.classList.value) return;
        onClose?.();
    }, []);

    return ReactDOM.createPortal(
        <Overlay className="flex items-center justify-center" onClick={onOverlayClick}>
             <div className="relative flex flex-col self-center h-full w-full md:aspect-[9/16] md:w-auto md:px-5 py-10">
                <StoryView 
                    story={story} 
                    index={0} 
                    playing={true}  
                    onVisibilityChange={() => {}} 
                    onVideoUpload={() => {}}
                    storyRepository={storyRepository}
                    accessToken={accessToken}
                />
                {/* Desktop action buttons - centered */}
                <div className="hidden md:flex absolute top-1/2 right-[-84px] -translate-y-1/2 flex-col gap-6 z-10">
                    <IconButton 
                        icon="thumbs-up"
                        label={t('common.likes', { count: likeCount })}
                        highlighted={isLiked}
                        onClick={toggleLike}
                    />
                    <IconButton icon="message-text-square-01" label="Send message" />
                    <IconButton icon="share-03" label="Share" />
                </div>
             </div>
        </Overlay>,
        modalRoot
    );
}