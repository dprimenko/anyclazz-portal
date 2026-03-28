// Custom date separator and message timestamp using Luxon
import { type FC } from 'react';
import { DateTime } from 'luxon';
import type { DateSeparatorProps } from 'stream-chat-react';
import { Text } from '@/ui-library/components/ssr/text/Text';

/**
 * Returns true if the date is within the current calendar week (Mon–Sun).
 * i.e. same ISO week number and same year.
 */
function isCurrentWeek(dt: DateTime): boolean {
	const now = DateTime.now();
	return dt.weekYear === now.weekYear && dt.weekNumber === now.weekNumber;
}

/**
 * Formats a date for the separator between message groups.
 * - Today → "Today"
 * - Yesterday → "Yesterday"
 * - Same week → day name, e.g. "Thursday"
 * - Older → basic date, e.g. "28/03/2026"
 */
export function formatSeparatorDate(date: Date): string {
	const dt = DateTime.fromJSDate(date);
	const now = DateTime.now();

	if (dt.hasSame(now, 'day')) return 'Today';
	if (dt.hasSame(now.minus({ days: 1 }), 'day')) return 'Yesterday';
	if (isCurrentWeek(dt)) return dt.toFormat('cccc'); // e.g. "Thursday"
	return dt.toFormat('dd/MM/yyyy');
}

/**
 * Formats a message timestamp shown next to each message.
 * - Same week → day name + 24hr time, e.g. "Thursday 14:30"
 * - Older → basic date + 24hr time, e.g. "28/03/2026 14:30"
 */
export function formatMessageTimestamp(date: Date): string {
	const dt = DateTime.fromJSDate(date);
	const now = DateTime.now();

	if (dt.hasSame(now, 'day')) return dt.toFormat('HH:mm');
	if (dt.hasSame(now.minus({ days: 1 }), 'day')) return `Yesterday ${dt.toFormat('HH:mm')}`;
	if (isCurrentWeek(dt)) return dt.toFormat("cccc HH:mm"); // e.g. "Thursday 14:30"
	return dt.toFormat('dd/MM/yyyy HH:mm');
}

export const CustomDateSeparator: FC<DateSeparatorProps> = ({ date }) => {
	return (
		<div className="flex items-center gap-3 py-3 px-4">
			<div className="flex-1 h-px bg-[var(--color-neutral-200)]" />
			<Text colorType="tertiary" size="text-sm" weight="medium">
				{formatSeparatorDate(date)}
			</Text>
			<div className="flex-1 h-px bg-[var(--color-neutral-200)]" />
		</div>
	);
};
