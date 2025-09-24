import { css, styled } from 'styled-components';
import { typography } from '../../themes';
import type { AutocompleteContainerProps, AutocompleteSelectProps, AutocompleteVariant, StyledLabelProps } from './types';

export const AutocompleteWithErrorContainer = styled.div<{ $fullWidth?: boolean }>`
  ${({ theme, $fullWidth }) => `
    position: relative;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacings[8]};
    width: ${$fullWidth ? '100%' : 'fit-content'};
    height: fit-content;
  `}
`;

export const AutocompleteContainer = styled.div<AutocompleteContainerProps>`
    ${({ $filled, $variant, $error, $label, $hasLeftIcon, theme }) => css`
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

export const AutocompleteLabel = styled.label<StyledLabelProps>`
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

export const AutocompleteSelect = styled.input<AutocompleteSelectProps>`
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
    `}

    ${({ $hasIcon, theme }) => $hasIcon && css`
      padding-right: ${theme.spacings[32]};
    `}
  }
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

export const AutocompleteOptionsContainer = styled.div`
  ${({ theme }) => `
    position: absolute;
    z-index: 2;
    top: calc(100% + ${theme.spacings[4]});
    left: 0;
    width: 100%;
    padding: ${theme.spacings[8]} 0;
    background-color: ${theme.colors.basic.white};
    border-radius: ${theme.radii[8]};
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.25);
    max-height: 349px;
    overflow-y: auto;
    margin-top: ${theme.spacings[8]};
  `}
`;

export const AutocompleteOption = styled.div<{ $disabled?: boolean, $variant?: AutocompleteVariant }>`
  ${({ theme, $disabled, $variant }) => css`
      display: flex;
      flex-direction: row;
      align-items: center;
      ${typography(theme, $variant === 'big' ? 'body' : 'bodySmall', 'regular')}
      color: ${theme.colors.neutral[900]};
      background-color: ${theme.colors.basic.white};
      border-bottom: 1px solid ${theme.colors.neutral[300]};
      cursor: pointer;
      padding: ${theme.spacings[16]};
      gap: ${theme.spacings[16]};

      ${!$disabled && `
        &:hover {
          background-color: ${theme.colors.primary[100]};
        }
      `}

      ${$disabled && `
        cursor: not-allowed;
        color: ${theme.colors.neutral[400]};
      `}  

      &:last-child {
        border-bottom: none;
      }

      & mark {
        background-color: transparent;
        ${typography(theme, 'body', 'semibold')}
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