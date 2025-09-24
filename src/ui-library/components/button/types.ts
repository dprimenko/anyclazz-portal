import type { ButtonHTMLAttributes, ReactElement } from 'react';
import type { IconProps } from '@phosphor-icons/react';

export type ButtonSize =
  | 'big'
  | 'small';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'action';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: IconProps & ReactElement;
	variant?: ButtonVariant;
	size?: ButtonSize;
	fullWidth?: boolean;
	iconOnly?: boolean;
	href?: string;
	target?: string;
	label?: string;
	noHorizontalPadding?: boolean;
	'data-testid'?: string;
}

export interface BaseButtonProps {
	$variant?: ButtonVariant;
	$size?: ButtonSize;
	$fullWidth?: boolean;
	$iconOnly?: boolean;
	$href?: string;
	$noHorizontalPadding?: boolean;
}
