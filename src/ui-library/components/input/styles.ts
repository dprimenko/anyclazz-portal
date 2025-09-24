import { styled, css } from 'styled-components';
import { typography } from '../../themes';

import {
	type StyledInputProps,
	type StyledLabelProps,
	type InputContainerProps
} from './types';

export const InputWithErrorContainer = styled.div<{ $fullWidth?: boolean }>`
  ${({ theme, $fullWidth }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacings[8]};
    width: ${$fullWidth ? '100%' : 'fit-content'};
  `}
`;

export const InputContainer = styled.div<InputContainerProps>`
  ${({ $variant, $error, $filled, $label, $hasLeftIcon, theme }) => css`
      box-sizing: border-box;
      position: relative;
      width: 100%;
      border-radius: ${$variant === 'big' ? theme.radii[16] : theme.radii[8]};
      background-color: ${theme.colors.neutral[100]};
      padding: 0 ${theme.spacings[16]};
      border: 1px solid transparent;
      transition: all 0.2s ease;
      height: ${$variant === 'big' ? '56px' : '40px'};
      
      ${(!$filled || !$label) && `
        display: flex;
        flex-direction: row;
        align-items: center; 
      `}

      ${$filled && $label && css`
        display: grid;
        
        ${$hasLeftIcon && `
          grid-template-areas:
            "left-icon label right-icon"
            "left-icon input right-icon";
          grid-template-columns: 24px 1fr 24px;
        `}

        ${!$hasLeftIcon && `
          grid-template-areas:
            "label right-icon"
            "input right-icon";
          grid-template-columns: 1fr 24px;
        `}

        place-content: center;
      `}

      ${!$error && `
        &:has(.input__input:focus:not(:disabled)), &:has(.input__input:active:not(:disabled)) {
          border-color: ${theme.colors.neutral[400]};
        }

        &:hover {
          border-color: ${theme.colors.neutral[300]};
        }

        &:has(.input__input:disabled) {
          background-color: ${theme.colors.neutral[200]};
          border-color: ${theme.colors.neutral[300]};
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}

      ${$error && `
        border-color: ${theme.colors.error[200]};
        background-color: ${theme.colors.basic.white};
      `}
    `}
`;

export const InputLabel = styled.label<StyledLabelProps>`
  ${({ $variant, $filled, $required, $disabled, theme }) => css`
    ${!$filled && `
      position: absolute;
    `}

    grid-area: label;
    
    ${!$filled && `
      ${typography(theme, $variant === 'big' ? 'body' : 'bodySmall', 'regular')}
    `}

    ${$filled && `
      ${typography(theme, 'caption', 'regular')}
    `}


    color: ${theme.colors.neutral[$filled ? 600 : 900]};
    pointer-events: none;
    transition: all 0.2s ease;
    
    ${$required && `
      &::after {
          content: '*';
          margin-left: 2px;
        }
    `}

    ${$disabled && `
      color: ${theme.colors.neutral[400]};
    `}
  `}
`;

export const StyledInput = styled.input<StyledInputProps>`
    grid-area: input;

    ${({ theme }) => css`
      ${typography(theme, 'body', 'regular')}
      color: ${theme.colors.neutral[900]};
    `}

    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    width: 100%;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type=number] {
      -moz-appearance: textfield;
    }

    &[type="date"]::-webkit-inner-spin-button,
    &[type="date"]::-webkit-calendar-picker-indicator {
        display: none;
        -webkit-appearance: none;
    }

    &[type="time"]::-webkit-inner-spin-button,
    &[type="time"]::-webkit-calendar-picker-indicator {
        display: none;
        -webkit-appearance: none;
    }

    &:disabled {
      color: ${({ theme }) => theme.colors.neutral[400]};
      cursor: not-allowed;
    }

    ${({ $hasIcon, theme }) => $hasIcon && css`
      padding-right: ${theme.spacings[32]};
    `}
`;

export const ErrorMessage = styled.div`
  ${({ theme }) => css`
    ${typography(theme, 'bodySmall', 'regular')}
    color: ${theme.colors.error[200]};
  `}
`;

export const IconWrapper = styled.div<{ $disabled?: boolean }>`
  ${({ theme, $disabled }) => `
    display: grid;
    place-content: center;
    color: ${theme.colors.neutral[900]};
    transition: color 0.2s ease;

    ${$disabled && `
      color: ${theme.colors.neutral[400]};
    `}
  `}
`;

export const RightIconWrapper = styled(IconWrapper)`
    grid-area: right-icon;
`;

export const LeftIconWrapper = styled(IconWrapper)`
    grid-area: left-icon;
    margin-right: ${({ theme }) => theme.spacings[16]};
    color: ${({ theme }) => theme.colors.neutral[600]};
`;
