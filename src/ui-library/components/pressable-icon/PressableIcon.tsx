import type { FC } from 'react';
import './styles.scss';
import type { PressableIconProps } from './types.ts';

export const PressableIcon: FC<PressableIconProps> = ({ icon, size, backgroundColor, disabled, fullRadius = false, 'data-testid': dataTestId, onClick, vPadding, hPadding, style }) => {
	return (
		<div className={`pressable-icon ${disabled ? 'pressable-icon--disabled' : ''}`}
			style={{
				...style,
				...(size && { width: size, height: size }),
				...(backgroundColor && { backgroundColor }),
				...(fullRadius && { borderRadius: '100%' }),
				...(vPadding && { paddingTop: `${vPadding}px`, paddingBottom: `${vPadding}px` }),
				...(hPadding && { paddingLeft: `${hPadding}px`, paddingRight: `${hPadding}px` }),
			}} onClick={onClick}>
			{icon}
		</div>
	);
}