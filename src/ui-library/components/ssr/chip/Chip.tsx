import classNames from 'classnames';
import type { ChipProps } from './types.ts';
import styles from './Chip.module.css';

export const Chip = ({
	colorType,
	children,
	className,
	size = 'sm',
	rounded = false,
	...props
}: ChipProps) => {
	const classes = classNames(
		className,
		styles.chip,
		styles[`chip--${size}`],
		{ 'text-xs': size === 'sm' },
		{ 'text-sm': size === 'md' || size === 'lg' },
		{ 'rounded-md': !rounded },
		{ 'rounded-full': rounded },
		{ [styles['chip--primary']]: colorType === 'primary' },
		{ [styles['chip--secondary']]: colorType === 'secondary' },
	);

	return (
		<div className={classes} {...props}>
			{children}
		</div>
	);
};
