import classNames from 'classnames';
import type { ChipProps } from './types.ts';
import styles from './Chip.module.css';

export const Chip = ({
	colorType,
	children,
	className,
	...props
}: ChipProps) => {
	const classes = classNames(
		styles.chip,
		{ [styles['chip--primary']]: colorType === 'primary' },
		className
	);

	return (
		<div className={classes} {...props}>
			{children}
		</div>
	);
};
