import { EmptyState } from '@/ui-library/components/ssr/empty-state/EmptyState';
import { useTranslations } from '@/i18n';

export const CustomEmptyStateIndicator = () => {
	const t = useTranslations();
	return (
		<div className="flex flex-1 items-center justify-center h-full">
			<EmptyState
				title={t('chat.empty_title')}
				description={t('chat.empty_description')}
			/>
		</div>
	);
};
