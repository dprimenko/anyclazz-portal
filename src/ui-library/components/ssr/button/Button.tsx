import { useMemo, type ButtonHTMLAttributes } from 'react';
import type { ColorType } from '../../../shared/constants';
import classNames from 'classnames';
import styles from './Button.module.css';
import { Icon } from '../icon/Icon';
import { Spinner } from '@/ui-library/shared';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: string;
	iconColor?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    label?: string;
	colorType?: ColorType;
	onlyText?: boolean;
	highlighted?: boolean;
	isLoading?: boolean;
}

export const Button = ({
	icon,
	iconColor,
    label,
	size = 'md',
	colorType = 'secondary',
    className,
    fullWidth = false,
    onlyText = false,
	highlighted = false,
	isLoading = false,
	disabled,
	onClick,
	...props
}: ButtonProps) => {
    const isIconOnly = Boolean((icon && !label));
    
    const classes = classNames(
		'cursor-pointer rounded-md',
		styles.btn,
		styles[`btn--${size}`],
		{ [styles['btn--icon-only']]: isIconOnly },
		{ 'w-full': fullWidth },
		{ [styles['btn--secondary']]: colorType === 'secondary' && !highlighted },
		{ [styles['btn--primary']]: colorType === 'primary' },
		{ [styles['btn--text']]: onlyText },
		{ [styles['btn--highlighted']]: highlighted },
		{ 'bg-[var(--color-primary-200)]': highlighted },
		{ 'pointer-events-none': isLoading },
		className
	);

	const textClasess = classNames(
		'font-semibold',
		{'text-sm': size === 'sm' || size === 'md' },
		{'text-md': size !== 'sm' && size !== 'md' },
	);

	const iconSize = useMemo(() => {
		switch (size) {
			case 'sm':
				return 14;
			case 'md':
				return 16;
			case 'lg':
				return 20;
			case 'xl':
				return 20;
			default:
				return 14;
		}
	}, [size]);

	const spinnerSize = useMemo(() => {
		switch (size) {
			case 'xs':
			case 'sm':
				return 'w-3.5 h-3.5';
			case 'md':
				return 'w-4 h-4';
			case 'lg':
			case 'xl':
				return 'w-5 h-5';
			default:
				return 'w-4 h-4';
		}
	}, [size]);

	const spinnerVariant = useMemo(() => {
		if (colorType === 'secondary') return 'secondary';
		return 'default';
	}, [colorType]);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (isLoading) {
			e.preventDefault();
			return;
		}
		onClick?.(e);
	};

	return (
		<button
			className={classes}
			disabled={disabled}
			onClick={handleClick}
			{...props}
		>
            {isLoading ? (
				<Spinner variant={spinnerVariant} className={spinnerSize} />
			) : (
				icon && <Icon icon={icon} iconWidth={iconSize} iconHeight={iconSize} iconColor={highlighted ? '#F4A43A' : iconColor} />
			)}
			{label && <span className={textClasess}>{label}</span>}
		</button>
	);
};
