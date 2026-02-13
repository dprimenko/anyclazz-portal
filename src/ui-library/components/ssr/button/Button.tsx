import { useMemo, type ButtonHTMLAttributes } from 'react';
import type { ColorType } from '../../../shared/constants';
import classNames from 'classnames';
import styles from './Button.module.css';
import { Icon } from '../icon/Icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: string;
	iconColor?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    label?: string;
	colorType?: ColorType;
	onlyText?: boolean;
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
	...props
}: ButtonProps) => {
    const isIconOnly = Boolean((icon && !label));
    const classes = classNames(
		'cursor-pointer rounded-md',
		styles.btn,
		styles[`btn--${size}`],
		{ [styles['btn--icon-only']]: isIconOnly },
		{ 'w-full': fullWidth },
		{ [styles['btn--text']]: onlyText },
		{ [styles['btn--secondary']]: colorType === 'secondary' },
		{ [styles['btn--primary']]: colorType === 'primary' },
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
				return 14;
			case 'lg':
				return 16;
			case 'xl':
				return 16;
			default:
				return 14;
		}
	}, [size]);

	return (
		<button
			className={classes}
			{...props}
		>
            {icon && <Icon icon={icon} iconWidth={iconSize} iconHeight={iconSize} iconColor={iconColor} />}
			{label && <span className={textClasess}>{label}</span>}
		</button>
	);
};
