import { useMemo } from 'react';
import type { BreadcrumbProps } from './types';
import styles from './Breadcrumb.module.css';
import { Icon } from '../ssr/icon/Icon';
import { Text } from '../ssr/text/Text';

export function Breadcrumb({ items }: BreadcrumbProps) {
	const breadcrumbItems = useMemo(() => {
		return items?.map((item, index) => {
			const isLast = index === items.length - 1;
			
			return (
				<div key={item.label} className="flex flex-row items-center gap-[0.25rem]">
					<div className={isLast ? `${styles.itemLast} px-2 py-1` : ''}>
						<a 
							className={styles.link} 
							href={item.href}
							role="button"
							tabIndex={0}
						>
							<Text size="text-sm" weight="semibold" colorType={isLast ? 'primary' : 'quaternary'}>{item.label}</Text>
						</a>
					</div>
					{!isLast && <Icon icon="chevron-right" iconWidth={16} iconHeight={16} />}
				</div>
			);
		});
	}, [items]);

	return (
		<nav className="flex gap-[0.25rem]">
			{breadcrumbItems}
		</nav>
	);
}