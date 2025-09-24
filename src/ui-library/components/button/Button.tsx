import React, { useCallback } from 'react';
import type { ButtonProps } from './types';
import { BaseButton, ButtonIcon, ButtonLabel } from './styles';

export const Button = ({
	icon,
	variant = 'primary',
	size = 'big',
	fullWidth = false,
	iconOnly = false,
	href,
	target,
	label,
	noHorizontalPadding = false,
	onClick,
	'data-testid': dataTestId = 'button',
	...props
}: ButtonProps) => {
	const isIconOnly = Boolean(iconOnly || (icon && !label));

	const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		if (href !== undefined) {
			e.preventDefault();
			target === '_blank' ? window.open(href, '_blank') : window.location.href = href;
		} else if (onClick) {
			onClick(e);
		}
	}, [href, target, onClick]);

	return (
		<BaseButton
			onClick={handleClick}
			data-testid={dataTestId}
			$variant={variant}
			$size={size}
			$fullWidth={fullWidth}
			$iconOnly={isIconOnly}
			$href={href}
			$noHorizontalPadding={noHorizontalPadding}
			{...props}
		>
			{icon && <ButtonIcon data-testid={`${dataTestId}-icon`}>{icon}</ButtonIcon>}
			{label && <ButtonLabel data-testid={`${dataTestId}-label`}>{label}</ButtonLabel>}
		</BaseButton>
	);
};
