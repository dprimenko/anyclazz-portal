import type { IconProps } from '@phosphor-icons/react';
import type { ReactElement } from 'react';

export interface ChipProps {
	label: string;
	icon?: IconProps & ReactElement;
	$variant?: 'big' | 'small';
	$color?: string;
	$bgColor?: string;
	$hasBorder?: boolean;
	onClick?: () => void;
	'data-testid'?: string;
}
