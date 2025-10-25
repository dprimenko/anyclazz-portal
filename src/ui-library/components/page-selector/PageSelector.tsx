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
	
	const itemsToShow = useMemo(() => {
		const items: { label: string; value: string; isEllipsis?: boolean }[] = [];
		
		const addPages = (start: number, end: number) => {
			for (let i = start; i <= end; i++) {
				items.push({ label: `${i}`, value: `${i}` });
			}
		};
		
		// Si el total de páginas cabe en maxPages, mostrar todas
		if (pages <= maxPages) {
			addPages(1, pages);
			return items;
		}
		
		const isEllipsisNeeded = (page + maxPages * 2 - 1) < pages;
		
		// Si estamos cerca del final, mostrar últimas páginas
		if (!isEllipsisNeeded) {
			addPages(pages - (maxPages * 2 - 1), pages);
			return items;
		}
		
		// Mostrar desde página actual
		const endPage = Math.min(page + maxPages - 1, pages);
		addPages(page, endPage);
		
		// Si no llegamos al final, añadir puntos suspensivos y últimas maxPages páginas
		if (endPage < pages) {
			items.push({ label: '...', value: 'ellipsis', isEllipsis: true });
			addPages(pages - maxPages + 1, pages);
		}
		
		return items;
	}, [pages, maxPages, page]);

	const previousPage = () => {
		if (page > 1) {
			setPage(page - 1);
		}
	};
	
	const nextPage = () => {	
		if (page < pages) {
			setPage(page + 1);
		}
	};

	useEffect(() => {
		onChangedPage(page);
	}, [page])

	return (
		<div className={styles["page-selector"]}>
			<div className={cn(styles["page-selector__fixed-control"], { [styles["page-selector__fixed-control--disabled"]]: page === 1 || disabled })} onClick={previousPage}>
				<Icon icon="arrow-left" iconWidth={20} iconHeight={20} />
				<Text colorType="tertiary" size="text-sm" weight="semibold">{t('common.previous')}</Text>
			</div>
			<div className={styles["page-selector__dynamic-controls"]}>
				{itemsToShow.map(({value, label, isEllipsis}, index) => (
					<div 
						key={`${value}-${index}`}
						className={cn(
							styles["page-selector__dynamic-control"],
							'font-medium', 
							{ 
								[styles["page-selector__dynamic-control--active"]]: !isEllipsis && page === parseInt(value), 
								[styles["page-selector__dynamic-control--disabled"]]: disabled || isEllipsis 
							}
						)} 
						onClick={() => {
							if (!isEllipsis) {
								setPage(parseInt(value));
							}
						}}
					>
						{label}
					</div>
				))}
			</div>
			<div className={cn(styles["page-selector__fixed-control"], { [styles["page-selector__fixed-control--disabled"]]: page === pages || disabled })} onClick={nextPage}>
				<Text colorType="tertiary" size="text-sm" weight="semibold">{t('common.next')}</Text>
				<Icon icon="arrow-right" iconWidth={20} iconHeight={20} />
			</div>
		</div>
	);
}