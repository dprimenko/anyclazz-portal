import { XIcon } from '@phosphor-icons/react';
import { DrawerClose, DrawerContainer, DrawerOverlay } from './style';
import type { DrawerProps } from './types.ts';

export function Drawer({ children, onClose, persistent = false, width = 60, className, noCloseButton = false, 'data-testid': dataTestId } : DrawerProps) {
	return (
		<DrawerOverlay onClick={persistent ? undefined : onClose} data-testid={dataTestId}>
			<DrawerContainer className={className} $width={width}>
				{!noCloseButton && (
					<DrawerClose onClick={onClose}>
						<XIcon size={24} />
					</DrawerClose>
				)}
				{children}
			</DrawerContainer>
		</DrawerOverlay>
	);
}