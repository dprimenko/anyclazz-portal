import type { InputHTMLAttributes } from 'react';
import type { DoclineUiIcon } from '../../types/doclineUi';

export type InputVariant = 'big' | 'small';

export interface BaseInputProps {
	label?: string;
	error?: boolean;
	errorMessage?: string;
	noErrorMessage?: boolean;
	required?: boolean;
	variant?: InputVariant;
	delay?: number;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps {
	leftIcon?: DoclineUiIcon;
	rightIcon?: DoclineUiIcon;
	fullWidth?: boolean;
	'data-testid'?: string;
}

export interface StyledLabelProps {
	$required?: boolean;
	$variant?: InputVariant;
	$filled?: boolean;
	$disabled?: boolean;
}

export interface StyledInputProps {
	$hasIcon?: boolean;
}

export interface InputContainerProps {
	$variant?: InputVariant;
	$error?: boolean;
	$filled?: boolean;
	$label?: string;
	$hasLeftIcon?: boolean;
}
