import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
	InputContainer,
	InputLabel,
	StyledInput,
	ErrorMessage,
	InputWithErrorContainer,
	LeftIconWrapper,
	RightIconWrapper,
} from './styles';
import type { InputProps } from './types';
import { CalendarBlankIcon, TimerIcon } from '@phosphor-icons/react';

export const Input = ({
	label,
	error,
	errorMessage,
	required,
	leftIcon,
	rightIcon,
	variant = 'big',
	disabled,
	value,
	readOnly,
	noErrorMessage = false,
	type,
	delay = 0,
	fullWidth = false,
	'data-testid': dataTestId = 'input',
	...props
}: InputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [inputValue, setInputValue] = useState(value || '');
    const [debouncedInputValue, setDebouncedInputValue] = useState(value || '');

	const handleFocus = useCallback(() => {
		if (disabled) return;
		inputRef.current?.focus();
	}, [disabled]);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	const filled = useMemo(() => {
		if (type === 'date') return true;
		if (type === 'time') return true;
		return !!inputValue;
	}, [type, inputValue]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
		  setDebouncedInputValue(inputValue);
		}, delay);
		return () => clearTimeout(timeoutId);
	  }, [inputValue, delay]);

	useEffect(() => {
		const syntheticEvent = {
			target: { value: debouncedInputValue }
		} as ChangeEvent<HTMLInputElement>;
		
		props.onChange?.(syntheticEvent);
	}, [debouncedInputValue, props.onChange]);
	
	return (
		<InputWithErrorContainer ref={containerRef} $fullWidth={fullWidth} onClick={handleFocus}>
			<InputContainer
				className={'input__container'}
				$variant={variant}
				$error={error}
				$filled={filled}
				$label={label}
				$hasLeftIcon={!!leftIcon}
				data-testid={`${dataTestId}-container`}
			>
				{leftIcon && (
					<LeftIconWrapper $disabled={disabled} data-testid={`${dataTestId}-left-icon`}>
						{leftIcon}
					</LeftIconWrapper>
				)}
				{label && (
					<InputLabel
						className={'input__label'}
						$variant={variant}	
						$filled={filled}
						$required={required}
						$disabled={disabled}
					>
						{label}
					</InputLabel>
				)}
				<StyledInput
					{...props}
					ref={inputRef}
					className={'input__input'}
					$hasIcon={!!rightIcon}
					readOnly={readOnly}
					type={type}
					value={inputValue} 
					onChange={handleInputChange}
					disabled={disabled}
					data-testid={dataTestId}
				/>
				{rightIcon && (
					<RightIconWrapper $disabled={disabled} data-testid={`${dataTestId}-right-icon`}>
						{rightIcon}
					</RightIconWrapper>
				)}
				{type === 'date' && !rightIcon && (
					<RightIconWrapper $disabled={disabled} data-testid={`${dataTestId}-right-icon`}>
						<CalendarBlankIcon size={24} />
					</RightIconWrapper>
				)}
				{type === 'time' && !rightIcon && (
					<RightIconWrapper $disabled={disabled} data-testid={`${dataTestId}-right-icon`}>
						<TimerIcon size={24} />
					</RightIconWrapper>
				)}
			</InputContainer>
			{error && errorMessage && !noErrorMessage && (
				<ErrorMessage data-testid={`${dataTestId}-error-message`}>
					{errorMessage}
				</ErrorMessage>
			)}
		</InputWithErrorContainer>
	);
};

Input.displayName = 'Input';

export default Input;
