import { OverlayContainer } from './style.ts';
import type { OverlayProps } from './types.ts';

export function Overlay({ children, className, onClick }: OverlayProps) {
	return (
		<OverlayContainer className={className} onClick={onClick}>
			{children}
		</OverlayContainer>
	);
}