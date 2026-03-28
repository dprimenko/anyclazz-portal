// Custom message input using stream-chat-react context hook
import { type FC } from 'react';
import {
	TextareaComposer,
	useMessageInputContext,
	useMessageComposerHasSendableData,
} from 'stream-chat-react';

export const CustomMessageInput: FC = () => {
	const { handleSubmit } = useMessageInputContext();
	const hasSendableData = useMessageComposerHasSendableData();

	return (
		<div className="border-t border-[var(--color-neutral-200)] p-4 shrink-0">
			<div className="border border-[var(--color-neutral-200)] rounded-xl px-4 py-3 flex items-end gap-3 focus-within:border-[var(--color-primary-700)] transition-colors">
				<TextareaComposer
					placeholder="Message"
					className="flex-1 resize-none outline-none text-sm leading-6 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
					containerClassName="flex-1 min-w-0"
					minRows={1}
					maxRows={5}
				/>
				<button
					type="button"
					onClick={handleSubmit}
					disabled={!hasSendableData}
					className="text-sm font-semibold text-[var(--color-primary-700)] disabled:opacity-40 transition-opacity shrink-0 pb-px"
				>
					Send
				</button>
			</div>
		</div>
	);
};
