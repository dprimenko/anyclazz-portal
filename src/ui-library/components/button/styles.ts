import styled, { css } from 'styled-components';

import type { BaseButtonProps } from './types';
import { typography } from '../../themes';

export const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ButtonLabel = styled.span`
  display: flex;
  align-items: center;
  white-space: nowrap;

  ${({ theme }) => typography(theme, 'bodySmall', 'semibold')};
`;

export const BaseButton = styled.button<BaseButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  transition: all 0.2s ease;
  outline: none;
  position: relative;
  text-decoration: none;
  
  ${({ theme, $variant }) => $variant === 'primary' && css`
    background-color: ${theme.colors.primary[700]};
    color: ${theme.colors.basic.white};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary[600]};
    }
    
    &:active:not(:disabled) {
      background-color: ${theme.colors.primary[800]};
    }
    
    &:disabled {
      background-color: ${theme.colors.neutral[200]};
      color: ${theme.colors.neutral[400]};
      cursor: not-allowed;
    }
  `}
  
  ${({ theme, $variant }) => $variant === 'secondary' && css`
    background-color: transparent;
    color: ${theme.colors.primary[700]};
    border-color: ${theme.colors.primary[700]};
    
    &:hover:not(:disabled) {
      color: ${theme.colors.primary[600]};
      border-color: ${theme.colors.primary[600]};
    }
    
    &:active:not(:disabled) {
      color: ${theme.colors.primary[800]};
      border-color: ${theme.colors.primary[800]};
    }
    
    &:disabled {
      color: ${theme.colors.neutral[400]};
      border-color: ${theme.colors.neutral[400]};
      cursor: not-allowed;
    }
  `}

  ${({ theme, $variant }) => $variant === 'text' && css`
    background-color: transparent;
    color: ${theme.colors.primary[700]};
    border-color: transparent;
    
    &:hover:not(:disabled) {
      color: ${theme.colors.primary[600]};
    }
    
    &:active:not(:disabled) {
      color: ${theme.colors.primary[800]};
    }
    
    &:disabled {
      color: ${theme.colors.neutral[400]};
      cursor: not-allowed;
    }
  `}
  
  ${({ theme, $variant, $size }) => $variant === 'action' && css`
    background-color: ${theme.colors.neutral[100]};
    color: ${theme.colors.neutral[900]};
    border: 1px solid transparent;
    border-radius: ${theme.radii[8]};
    padding: 8px;
    width: ${$size === 'small' ? '32px' : '40px'};
    height: ${$size === 'small' ? '32px' : '40px'};
    min-height: ${$size === 'small' ? '32px' : '40px'};
    gap: 0;
    
    &:hover:not(:disabled), &:active:not(:disabled) {
      background-color: ${theme.colors.neutral[200]};
    }
    
    &:disabled {
      background-color: ${theme.colors.neutral[100]};
      color: ${theme.colors.neutral[400]};
      cursor: not-allowed;
    }
  `}
  
  ${({ $size, $iconOnly, $variant }) => $size === 'big' && $variant !== 'action' && css`
    padding: ${$iconOnly ? '12px' : '12px 24px'};
    border-radius: 8px;
    font-size: 16px;
    line-height: 24px;
    height: 48px;
    
    ${$iconOnly && css`
      width: 48px;
      padding: 12px;
    `}
  `}
  
  ${({ $size, $iconOnly, $variant }) => $size === 'small' && $variant !== 'action' && css`
    padding: ${$iconOnly ? '8px' : '8px 16px'};
    border-radius: 6px;
    font-size: 14px;
    line-height: 20px;
    height: 40px;
    
    ${$iconOnly && css`
      width: 40px;
      padding: 8px;
    `}
  `}
  
  ${({ $size, $variant }) => !$size && $variant !== 'action' && css`
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    line-height: 24px;
    min-height: 48px;
  `}

  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}
  
  ${({ $iconOnly }) => $iconOnly && css`
    gap: 0;
  `}

  ${({ $noHorizontalPadding }) => $noHorizontalPadding && css`
    padding-left: 0 !important;
    padding-right: 0 !important;
  `}
`;
