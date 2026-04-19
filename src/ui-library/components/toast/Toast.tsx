import type { ToastProps } from './types.ts';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../ssr/icon/Icon';

const variantIconMap = {
	success: 'check-rounded',
	error: 'close',
	warning: 'alert-circle',
	info: 'alert-circle',
} as const;

const variantStyles = {
	success: {
		container: 'bg-[#E6F9ED] border-[var(--color-success-100)]',
		iconColor: '#00C951',
	},
	error: {
		container: 'bg-[#FEF2F2] border-[var(--color-error-100)]',
		iconColor: '#FB2C36',
	},
	warning: {
		container: 'bg-[#FFFBEB] border-[var(--color-warning-100)]',
		iconColor: '#E17100',
	},
	info: {
		container: 'bg-[var(--color-primary-100)] border-[var(--color-primary-100)] text-[var(--color-neutral-600)]',
		iconColor: '#A4A7AE',
	},
} as const;

export function Toast({ variant = 'info', message, onClose, autoCloseInterval, 'data-testid': dataTestId }: Readonly<ToastProps>) {
	useEffect(() => {
		if (autoCloseInterval && onClose) {
			setTimeout(onClose, autoCloseInterval);
		}
	}, [autoCloseInterval, onClose]);

	const icon = variantIconMap[variant];
	const styles = variantStyles[variant];

	return (
		<div 
			className={cn(
				'flex items-center gap-3 px-4 py-3.5 w-full border-l-4 text-[var(--color-neutral-900)]',
				styles.container
			)}
			data-testid={dataTestId}
		>
			<div className="flex items-center flex-shrink-0">
				<Icon icon={icon} iconWidth={20} iconHeight={20} iconColor={styles.iconColor} />
			</div>
			<div className="flex-1 text-sm font-medium">
				{message}
			</div>
			<div 
				className="grid place-content-center cursor-pointer flex-shrink-0 text-[var(--color-neutral-500)]" 
				onClick={onClose}
			>
				<Icon icon="x" iconWidth={18} iconHeight={18} data-testid={`${dataTestId}-close`} />
			</div>
		</div>
	);
}