import { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
	AutocompleteContainer,
	AutocompleteLabel,
	AutocompleteSelect,
	AutocompleteWithErrorContainer,
	ErrorMessage,
	LeftIconWrapper,
	RightIconWrapper
} from './style.ts';
import type { AutocompleteProps } from './types.ts';
import { XIcon } from '@phosphor-icons/react';

export function Autocomplete({ 
	ref,
	disabled, 
	value, 
	label, 
	error,
	errorMessage,
	noErrorMessage,
	required,
	variant = 'big',
	fullWidth = true,
	leftIcon,
	rightIcon,
	optionLeftIcon,
	valueKey = 'value',
	labelKey = 'label',
	delay = 0,
	initialValue,
	onSearch,
	'data-testid': dataTestId,
	...props
}: AutocompleteProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	const [inputValue, setInputValue] = useState(initialValue);
	const [debouncedInputValue, setDebouncedInputValue] = useState(initialValue);

	const [typing, setTyping] = useState(false);
	
	const handleClick = useCallback(() => {
		if (disabled || !ref) return;
		ref.current?.focus();
		ref.current?.select();
	}, [ref, disabled, inputValue]);

	const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setTyping(true);
		setInputValue(event.target.value);
	}, []);

	const onHandleSearch = useCallback(async (value: string) => {
		onSearch?.(value);
	}, [onSearch]);

	useEffect(() => {
		if (!typing) return;
		const timeoutId = setTimeout(() => {
		  setDebouncedInputValue(inputValue);
		}, delay);
		return () => clearTimeout(timeoutId);
	}, [inputValue, delay]);

	useEffect(() => {
		if (!typing || !debouncedInputValue) return;
		const syntheticEvent = {
			target: { value: debouncedInputValue }
		} as ChangeEvent<HTMLInputElement>;
		props.onChange?.(syntheticEvent);
		onHandleSearch(debouncedInputValue);
	}, [debouncedInputValue, typing]);

	return (
		<AutocompleteWithErrorContainer ref={containerRef} onClick={handleClick} $fullWidth={fullWidth}>
			<AutocompleteContainer 
				className="autocomplete__container" 
				data-testid={`${dataTestId}-container`} 
				$filled={!!inputValue} 
				$variant={variant} 
				$error={error}
				$label={label}
				$hasLeftIcon={!!leftIcon}>
				{leftIcon && (
					<LeftIconWrapper $disabled={disabled} data-testid={`${dataTestId}-left-icon`}>
						{leftIcon}
					</LeftIconWrapper>
				)}
				
				{label && (
					<AutocompleteLabel
						className="autocomplete__label"
						$filled={!!inputValue}
						$variant={variant}
						$required={required}
						$disabled={disabled}
					>
						{label}
					</AutocompleteLabel>
				)}
			
				<AutocompleteSelect
					{...props} 
					ref={ref}
					className="autocomplete__select"
					disabled={disabled}
					data-testid={dataTestId}
					value={inputValue} 
					onChange={handleInputChange}
					$variant={variant}
				/>

				{!rightIcon && inputValue && inputValue.length > 0 && (
					<RightIconWrapper $disabled={disabled} data-testid={`${dataTestId}-clear-icon`}>
						<XIcon size={24} onClick={() => setInputValue('')} />
					</RightIconWrapper>
				)}

			   {rightIcon && (
					<RightIconWrapper $disabled={disabled} data-testid={`${dataTestId}-right-icon`}>
						{rightIcon}
					</RightIconWrapper>
				)}
			</AutocompleteContainer>
			{error && errorMessage && !noErrorMessage && (
				<ErrorMessage data-testid={`${dataTestId}-error-message`}>
					{errorMessage}
				</ErrorMessage>
			)}
		</AutocompleteWithErrorContainer>
	);
};