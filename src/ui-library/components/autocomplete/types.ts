import type { IconProps } from '@phosphor-icons/react';
import type { InputHTMLAttributes, ReactElement } from 'react';

export type AutocompleteVariant = 'big' | 'small';

export interface BaseAutocompleteProps {
	label?: string;
	error?: boolean;
	errorMessage?: string;
	noErrorMessage?: boolean;
	required?: boolean;
	variant?: AutocompleteVariant;
}

export interface AutocompleteOptionProps {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface AutocompleteProps extends InputHTMLAttributes<HTMLInputElement>, BaseAutocompleteProps {
	ref?: React.RefObject<HTMLInputElement | null>;
	fullWidth?: boolean;
	leftIcon?: IconProps & ReactElement;
	rightIcon?: IconProps & ReactElement;
	optionLeftIcon?: IconProps & ReactElement;
	labelKey: string;
	valueKey: string;
	delay?: number;
	initialValue?: string;
	onSearch?: (value: string) => void;
	'data-testid'?: string;
}

export interface StyledLabelProps {
	$required?: boolean;
	$variant?: AutocompleteVariant;
	$filled?: boolean;
	$disabled?: boolean;
}

export interface AutocompleteSelectProps {
	$hasIcon?: boolean;
	$variant?: AutocompleteVariant;
}

export interface AutocompleteContainerProps {
	$filled?: boolean;
	$variant?: AutocompleteVariant;
	$error?: boolean;
	$label?: string;
	$hasLeftIcon?: boolean;
}
