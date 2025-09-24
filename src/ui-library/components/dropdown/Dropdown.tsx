import type { ChangeEvent } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
	DropdownContainer,
	DropdownIconWrapper,
	DropdownLabel,
	DropdownOption,
	DropdownOptionsContainer,
	DropdownSelect,
	DropdownWithErrorContainer,
	ErrorMessage
} from './style.ts';
import type { DropdownProps } from './types.ts';
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react';
import { useClickOutside } from '../../hooks/useClickOutside.ts';

export function Dropdown({ 
	items, 
	disabled, 
	value, 
	onChange, 
	label, 
	error,
	errorMessage,
	noErrorMessage,
	required,
	variant = 'big',
	fullWidth = true,
	'data-testid': dataTestId,
	...props
}: DropdownProps) {
	const selectRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	
	const [isOpen, setIsOpen] = useState(false);
	
	const handleClick = useCallback(() => {
		if (disabled) return;
		setIsOpen(!isOpen);
		selectRef.current?.focus();
	}, [isOpen]);

	const closeDropdown = useCallback(() => {
		setIsOpen(false);
	}, []);

	const handleOptionClick = useCallback((option: string) => {
		setIsOpen(false);
		if (selectRef.current) {
			selectRef.current.value = option;
		}
		onChange?.({ target: { value: option } } as ChangeEvent<HTMLInputElement>);
	}, []);

	const selectValue = useMemo(() => {
		return items.find((item) => item.value.toString() === value)?.label ?? '';
	}, [value, items]);

	useClickOutside(containerRef, closeDropdown);

	return (
		<DropdownWithErrorContainer ref={containerRef} onClick={handleClick} $fullWidth={fullWidth}>
			<DropdownContainer className="dropdown__container" data-testid={`${dataTestId}-container`} $filled={!!value} $variant={variant} $error={error}>
				{label && (
					<DropdownLabel
						className="dropdown__label"
						$filled={!!value}
						$variant={variant}
						$required={required}
						$disabled={disabled}
					>
						{label}
					</DropdownLabel>
				)}
			
				<DropdownSelect
					ref={selectRef}
					className="dropdown__select"
					value={selectValue}
					disabled={disabled}
					data-testid={dataTestId}
					onChange={onChange}
					readOnly
					$variant={variant}
					{...props} 
				/>

				<DropdownIconWrapper $disabled={disabled} data-testid={`${dataTestId}-caret-icon`}>
					{isOpen ? <CaretUpIcon weight="fill" size={12} /> : <CaretDownIcon weight="fill" size={12} />}
				</DropdownIconWrapper>
			</DropdownContainer>

			{isOpen && (
				<DropdownOptionsContainer>
					{items.map((item) => (
						<DropdownOption $variant={variant} $disabled={item?.disabled ?? false} key={item.value} onClick={() => handleOptionClick(item.value)}>{item.label}</DropdownOption>
					))}
				</DropdownOptionsContainer>
			)}
			{error && errorMessage && !noErrorMessage && (
				<ErrorMessage data-testid={`${dataTestId}-error-message`}>
					{errorMessage}
				</ErrorMessage>
			)}
		</DropdownWithErrorContainer>
	);
};