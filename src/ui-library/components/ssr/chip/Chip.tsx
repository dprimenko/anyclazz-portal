import classNames from 'classnames';
import type { ChipProps } from './types.ts';
import styles from './Chip.module.css';

export const Chip = ({
	colorType,
	children,
	className,
	rounded = false,
	...props
}: ChipProps) => {
	const classes = classNames(
		className,
		'py-1 px-1.5',
		styles.chip,
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
