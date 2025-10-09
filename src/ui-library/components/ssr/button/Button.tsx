import type { ButtonHTMLAttributes } from 'react';
import type { ColorType } from '../../../shared/constants';
import classNames from 'classnames';
import styles from './Button.module.css';
import { Icon } from '../icon/Icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: string;
    fullWidth?: boolean;
    label?: string;
	colorType?: ColorType;
}

export const Button = ({
	icon,
    label,
	colorType = 'secondary',
    className,
    fullWidth = false,
	...props
}: ButtonProps) => {
    const isIconOnly = Boolean((icon && !label));
    const classes = classNames(
        'rounded-lg control',
		styles.btn,
		{ 'px-4 py-2.5': !isIconOnly },
		{ 'p-3': isIconOnly },
		{ [styles['w-full']]: fullWidth },
		{ [styles['btn--primary']]: colorType === 'primary' },
		className
	);

	return (
		<button
			className={classes}
			{...props}
		>
			{/* {icon && <ButtonIcon data-testid={`${dataTestId}-icon`}>{icon}</ButtonIcon>}
			{label && <ButtonLabel data-testid={`${dataTestId}-label`}>{label}</ButtonLabel>} */}
            {icon && <Icon icon={icon} iconWidth={20} iconHeight={20} />}
			{label && <span className="text-base font-semibold">{label}</span>}
		</button>
	);
};
