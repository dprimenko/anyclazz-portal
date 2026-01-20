import type { Story } from "../../domain/types";
import { Control } from "./Control";

export interface StoryPlayerProps {
    ref: React.RefObject<HTMLVideoElement|null>;
    story: Story;
    isMuted: boolean;
    onToggleSound: () => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
}

export function StoryPlayer({ ref, story, isMuted, onToggleSound, isPlaying, onTogglePlay }: StoryPlayerProps) {
    return (
        <div className="relative h-full sm:rounded-[20px]">
			<video ref={ref} className="w-full h-full object-cover sm:rounded-[20px]" preload="auto" playsInline loop muted>
                <source src={`${story.videoUrl}#t=0.001`} type="video/mp4" />
            </video>
            <div className="absolute inset-0 p-[0.625rem] z-[2]">
                <div className="flex flex-row justify-between gap-[0.625rem] w-full">
                    <div className="flex flex-row gap-[0.625rem]">
                        <Control icon={isPlaying ? "menu-05" : "play"} onClick={onTogglePlay} />
                        <Control icon={isMuted ? "volume-muted" : "volume-max"} onClick={onToggleSound} />
                    </div>
                    <div>
                        {/* <Control icon="user-edit" onClick={() => {}} /> */}
                    </div>
                </div>
            </div>
		</div>
    );
}