import styled from 'styled-components';
import type { ChipProps } from './types';
import { typography } from '../../themes/resources/typography';

export const ChipContainer = styled.div<ChipProps>`
  background-color: ${({ theme, $bgColor }) => $bgColor ?? theme.colors.primary[200]};
  color: ${({ theme, $color }) => $color ?? theme.colors.neutral[900]};
  padding: ${({ theme, $variant }) => $variant === 'big' ? `${theme.spacings[8]} ${theme.spacings[8]}` : `${theme.spacings[4]} ${theme.spacings[8]}`};
  border-radius: ${({ theme }) => theme.radii[8]};
  ${({ theme }) => typography(theme, 'caption', 'semibold')};
  text-transform: uppercase;
  border: ${({ theme, $hasBorder }) => $hasBorder ? `1px solid ${theme.colors.neutral[300]}` : 'none'};

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme, $variant }) => $variant === 'big' ? theme.spacings[8] : theme.spacings[4]};
`;