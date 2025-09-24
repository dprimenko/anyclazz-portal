import { css, styled } from 'styled-components';
import { typography } from '../../themes';
import type { DropdownContainerProps, DropdownSelectProps, DropdownVariant, StyledLabelProps } from './types';

export const DropdownWithErrorContainer = styled.div<{ $fullWidth?: boolean }>`
  ${({ theme, $fullWidth }) => `
    position: relative;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacings[8]};
    width: ${$fullWidth ? '100%' : 'fit-content'};
  `}
`;

export const DropdownContainer = styled.div<DropdownContainerProps>`
    ${({ $filled, $variant, $error, theme }) => css`
      box-sizing: border-box;
      position: relative;
      width: 100%;
      border-radius: ${$variant === 'big' ? theme.radii[16] : theme.radii[8]};
      background-color: ${theme.colors.neutral[100]};
      padding: 0 ${theme.spacings[16]};
      border: 1px solid transparent;
      transition: all 0.2s ease;
      height: ${$variant === 'big' ? '56px' : '40px'};

      ${!$filled && `
        display: flex;
        flex-direction: row;
        align-items: center; 
      `}

      ${$filled && `
        display: grid;
        grid-template-areas:
          "label icon"
          "select icon";
        grid-template-columns: 1fr 24px;
        place-content: center;
      `}

      ${!$error && `
        &:has(.dropdown__select:focus:not(:disabled)), &:has(.dropdown__select:active:not(:disabled)) {
          border-color: ${theme.colors.neutral[400]};
        }

        &:hover {
          border-color: ${theme.colors.neutral[300]};
        }

        &:has(.dropdown__select:disabled) {
          background-color: ${theme.colors.neutral[200]};
          border-color: ${theme.colors.neutral[300]};
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}

      ${$error && css`
        border-color: ${theme.colors.error[200]};
        background-color: ${theme.colors.basic.white};
      `}
    `}
`;

export const DropdownLabel = styled.label<StyledLabelProps>`
  ${({ $variant, $disabled, $filled, $required, theme }) => css`
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

export const DropdownSelect = styled.input<DropdownSelectProps>`
    grid-area: select;

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

    &:disabled {
      color: ${({ theme }) => theme.colors.neutral[400]};
      cursor: not-allowed;
    }

    ${({ theme, $variant }) => `
        ${typography(theme, $variant === 'big' ? 'body' : 'bodySmall', 'regular')}
        color: ${theme.colors.neutral[900]};
    `
  }
`;

export const DropdownIconWrapper = styled.div<{ $disabled?: boolean }>`
  ${({ theme, $disabled }) => `
    grid-area: icon;
    display: grid;
    place-content: center;
    color: ${theme.colors.neutral[900]};
    transition: color 0.2s ease;

    ${$disabled && `
      color: ${theme.colors.neutral[400]};
    `}
  `}
`;

export const DropdownOptionsContainer = styled.div`
  ${({ theme }) => `
    position: absolute;
    z-index: 2;
    top: calc(100% + ${theme.spacings[8]});
    left: 0;
    width: 100%;
    padding: ${theme.spacings[8]} 0;
    background-color: ${theme.colors.basic.white};
    border-radius: ${theme.radii[8]};
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.25);
    max-height: 349px;
    overflow-y: auto;
  `}
`;

export const DropdownOption = styled.div<{ $disabled?: boolean, $variant?: DropdownVariant }>`
  ${({ theme, $disabled, $variant }) => css`
      display: flex;
      ${typography(theme, $variant === 'big' ? 'body' : 'bodySmall', 'regular')}
      color: ${theme.colors.neutral[900]};
      background-color: ${theme.colors.basic.white};

      cursor: pointer;
      padding: ${theme.spacings[16]};
      
      ${$variant === 'small' && `
        padding: ${theme.spacings[8]} ${theme.spacings[16]};
      `}

      ${!$disabled && `
        &:hover {
          background-color: ${theme.colors.primary[200]};
        }
      `}

      ${$disabled && `
        cursor: not-allowed;
        color: ${theme.colors.neutral[400]};
      `}  

      &:last-child {
        border-bottom: none;
      }
    `
  }
`;

export const ErrorMessage = styled.div`
  ${({ theme }) => `
    ${typography(theme, 'bodySmall', 'regular')}
    color: ${theme.colors.error[200]};
  `}
`;