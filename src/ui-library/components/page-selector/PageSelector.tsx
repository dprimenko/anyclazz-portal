import { Fragment, useEffect, useMemo, useState } from 'react';
import type { PageSelectorProps } from './types.ts';
import styles from './PageSelector.module.css';
import cn from 'classnames';
import { Icon } from '../ssr/icon/Icon.tsx';
import { Text } from '../ssr/text/Text.tsx';
import { useTranslations } from '@/i18n/index.ts';

export function PageSelector({ pages, currentPage, maxPages = 3, disabled, onChangedPage }: PageSelectorProps) {
	const t = useTranslations();
	const [page, setPage] = useState(currentPage);
	const items = useMemo(() => {
		return Array.from({ length: pages }, (_, index) => ({
			label: `${index + 1}`,
			value: `${index + 1}`,
		}));
	}, [pages]);

	const itemsToShow = useMemo(() => {
		return [
			...(page > pages - maxPages ? items.slice(pages - (maxPages + 1), pages - 1) : items.slice(page - 1, page + maxPages - 1)),
			...(items.slice(pages - 1, pages)),
		];
	}, [page, maxPages, items]);

	useEffect(() => {
		onChangedPage(page);
	}, [page])

	return (
		<div className={styles["page-selector"]}>
			<div className={cn(styles["page-selector__fixed-control"], { [styles["page-selector__fixed-control--disabled"]]: page === 1 || disabled })} onClick={() => { setPage(prev => prev - 1) }}>
				<Icon icon="arrow-left" iconWidth={20} iconHeight={20} />
				<Text colorType="tertiary" size="text-sm" weight="semibold">{t('common.previous')}</Text>
			</div>
			<div className={styles["page-selector__dynamic-controls"]}>
				{itemsToShow.map(({value, label}, index) => (
					<Fragment key={value}>
						{index === itemsToShow.length - maxPages && (
							<div className={cn(styles["page-selector__dynamic-control"], 'font-medium')}>
								...
							</div>
						)}
						<div className={cn(
							styles["page-selector__dynamic-control"],
							'font-medium', 
							{ 
								[styles["page-selector__dynamic-control--active"]]: page === parseInt(value), 
								[styles["page-selector__dynamic-control--disabled"]]: disabled 
							})} onClick={() => {setPage(parseInt(value))}}>
							{label}
						</div>
					</Fragment>
				))}
			</div>
			<div className={cn(styles["page-selector__fixed-control"], { [styles["page-selector__fixed-control--disabled"]]: page === pages || disabled })} onClick={() => { setPage(prev => prev + 1) }}>
				<Text colorType="tertiary" size="text-sm" weight="semibold">{t('common.next')}</Text>
				<Icon icon="arrow-right" iconWidth={20} iconHeight={20} />
			</div>
		</div>
	);
}