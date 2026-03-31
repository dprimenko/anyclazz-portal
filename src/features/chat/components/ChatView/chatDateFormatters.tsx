// Custom date separator and message timestamp using Luxon
import { type FC } from 'react';
import { DateTime } from 'luxon';
import type { DateSeparatorProps } from 'stream-chat-react';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { useTranslations } from '@/i18n';

type TFunction = (key: string, params?: Record<string, string | number>) => string;

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
 * - Today → t('chat.date.today')
 * - Yesterday → t('chat.date.yesterday')
 * - Same week → locale day name, e.g. "Thursday" / "jueves"
 * - Older → locale date format, e.g. "28/03/2026" / "03/28/2026"
 */
export function formatSeparatorDate(date: Date, t: TFunction): string {
	const dt = DateTime.fromJSDate(date);
	const now = DateTime.now();

	if (dt.hasSame(now, 'day')) return t('chat.date.today');
	if (dt.hasSame(now.minus({ days: 1 }), 'day')) return t('chat.date.yesterday');
	if (isCurrentWeek(dt)) return dt.setLocale(t('chat.date.locale')).toFormat('cccc');
	return dt.toFormat(t('chat.date.format_date'));
}

/**
 * Formats a message timestamp shown next to each message.
 * - Today → "14:30" / "14:30"
 * - Yesterday → "Ayer 14:30" / "Yesterday 14:30"
 * - Same week → locale day name + time, e.g. "jueves 14:30" / "Thursday 14:30"
 * - Older → locale date + time, e.g. "28/03/2026 14:30" / "03/28/2026 14:30"
 */
export function formatMessageTimestamp(date: Date, t: TFunction): string {
	const dt = DateTime.fromJSDate(date);
	const now = DateTime.now();
	const time = dt.toFormat(t('chat.date.format_time'));

	if (dt.hasSame(now, 'day')) return time;
	if (dt.hasSame(now.minus({ days: 1 }), 'day')) return t('chat.date.yesterday_at', { time });
	if (isCurrentWeek(dt)) return `${dt.setLocale(t('chat.date.locale')).toFormat('cccc')} ${time}`;
	return dt.toFormat(t('chat.date.format_datetime'));
}

export const CustomDateSeparator: FC<DateSeparatorProps> = ({ date }) => {
	const t = useTranslations();
	return (
		<div className="flex items-center gap-3 py-3 px-4">
			<div className="flex-1 h-px bg-[var(--color-neutral-200)]" />
			<Text colorType="tertiary" size="text-sm" weight="medium">
				{formatSeparatorDate(date, t)}
			</Text>
			<div className="flex-1 h-px bg-[var(--color-neutral-200)]" />
		</div>
	);
};
