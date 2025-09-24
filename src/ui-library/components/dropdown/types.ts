import type { InputHTMLAttributes } from 'react';

export type DropdownVariant = 'big' | 'small';

export interface BaseDropdownProps {
	label?: string;
	error?: boolean;
	errorMessage?: string;
	noErrorMessage?: boolean;
	required?: boolean;
	variant?: DropdownVariant;
}

export interface DropdownOptionProps {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface DropdownProps extends InputHTMLAttributes<HTMLInputElement>, BaseDropdownProps {
    items: DropdownOptionProps[];
	fullWidth?: boolean;
	'data-testid'?: string;
}

export interface StyledLabelProps {
	$required?: boolean;
	$variant?: DropdownVariant;
	$filled?: boolean;
	$disabled?: boolean;
}

export interface DropdownSelectProps {
	$hasIcon?: boolean;
	$variant?: DropdownVariant;
}

export interface DropdownContainerProps {
	$filled?: boolean;
	$variant?: DropdownVariant;
	$error?: boolean;
}
