import { Overlay } from "@/ui-library/components/overlay";
import { StoryView } from "./StoryView";
import type { Story } from "../../domain/types";
import ReactDOM from "react-dom";
import { IconButton } from "@/ui-library/shared";
import { useCallback } from "react";

export function ModalStory({ story, onClose }: {story: Story, onClose?: () => void}) {
    const modalRoot = document.getElementById('portal-root');

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
                <StoryView story={story} index={0} playing={true}  onVisibilityChange={() => {}} />
                {/* Desktop action buttons - centered */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ml-[280px] flex-col gap-6 z-10">
                    <IconButton icon="thumbs-up" label="234 likes" />
                    <IconButton icon="message-text-square-01" label="Send message" />
                    <IconButton icon="share-03" label="Share" />
                </div>
             </div>
        </Overlay>,
        modalRoot
    );
}