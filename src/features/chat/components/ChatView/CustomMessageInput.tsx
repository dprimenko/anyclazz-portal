// Custom message input using stream-chat-react context hook
import { type FC, useCallback, useEffect } from 'react';
import {
	useMessageInputContext,
	useMessageComposerHasSendableData,
	useChannelStateContext,
} from 'stream-chat-react';
import { useTranslations } from '@/i18n';

const MAX_ROWS = 6;
const LINE_HEIGHT = 24; // px, matches leading-6 (1.5rem at 16px base)

export const CustomMessageInput: FC = () => {
	const { handleSubmit, textareaRef, onPaste } = useMessageInputContext();
	const { channel } = useChannelStateContext();
	const hasSendableData = useMessageComposerHasSendableData();
	const t = useTranslations();

	// Auto-resize the textarea up to MAX_ROWS
	const autoResize = useCallback(() => {
		const el = textareaRef?.current;
		if (!el) return;
		el.style.height = 'auto';
		const maxHeight = LINE_HEIGHT * MAX_ROWS;
		el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
		el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
	}, [textareaRef]);

	// Resize on mount
	useEffect(() => {
		autoResize();
	}, [autoResize]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
			clearTextarea();
		}
	};

	const clearTextarea = useCallback(() => {
		const el = textareaRef?.current;
		if (!el) return;
		el.value = '';
		el.style.height = `${LINE_HEIGHT}px`;
		el.style.overflowY = 'hidden';
	}, [textareaRef]);

	const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
		handleSubmit(e);
		clearTextarea();
	};

	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const textarea = textareaRef?.current;
		if (textarea) {
			channel.messageComposer.textComposer.handleChange({
				selection: { start: textarea.selectionStart, end: textarea.selectionEnd },
				text: e.target.value,
			});
		}
		autoResize();
	};

	return (
		<div className="p-6 shrink-0">
			<div className="border border-[var(--color-neutral-200)] rounded-lg px-3.5 py-3 flex items-end gap-3 focus-within:border-[var(--color-primary-700)] transition-colors">
				<textarea
					ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
					rows={1}
					placeholder={t('chat.message_placeholder')}
					className="flex-1 resize-none outline-none text-sm leading-6 text-[#181D27] placeholder:text-[#717680] bg-transparent overflow-hidden"
					style={{ height: `${LINE_HEIGHT}px` }}
					onChange={handleInput}
					onKeyDown={handleKeyDown}
					onPaste={onPaste}
				/>
				<button
					type="button"
					onClick={handleSend}
					disabled={!hasSendableData}
					className="text-sm font-semibold text-[var(--color-primary-700)] disabled:opacity-40 transition-opacity shrink-0 pb-px"
				>
					{t('chat.send')}
				</button>
			</div>
		</div>
	);
};
