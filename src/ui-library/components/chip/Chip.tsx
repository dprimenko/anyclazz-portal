import { ChipContainer } from './styles';
import type { ChipProps } from './types';

export const Chip = ({
	label,
	icon,
	$color,
	$bgColor,
	$hasBorder,
	$variant,
	onClick,
	'data-testid': dataTestId = 'chip'
}: ChipProps) => {
	return (
		<ChipContainer $variant={$variant} $bgColor={$bgColor} $color={$color} $hasBorder={$hasBorder} label={label} data-testid={dataTestId} onClick={onClick}>
			{icon && icon}
			{label}
		</ChipContainer>
	);
};
