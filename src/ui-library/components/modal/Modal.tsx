import { XIcon } from '@phosphor-icons/react';
import { ModalActions, ModalCloseButton, ModalContainer, ModalContent, ModalHeader, ModalHeaderSubtitle, ModalHeaderTitle, ModalOverlay, ModalTitle } from './style.ts';
import type { ModalProps } from './types.ts';
import { useCallback } from 'react';

export function Modal({ children, title, subtitle, onClose, actions, persistent = false, width = 480, 'data-testid': dataTestId } : ModalProps) {

	const onOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target instanceof HTMLElement && e.target.classList.value !== e.currentTarget.classList.value) return;
		onClose?.();
	}, []);

	const handleClose = useCallback(() => {
		onClose?.();
	}, []);

	return (
		<ModalOverlay onClick={persistent ? undefined : onOverlayClick} data-testid={dataTestId}>
			<ModalContainer $width={width}>
				<ModalHeader>
					<ModalHeaderTitle>
						<ModalTitle data-testid={`${dataTestId}-title`}>{title}</ModalTitle>
						<ModalCloseButton onClick={handleClose} data-testid={`${dataTestId}-close`}>
							<XIcon size={24} />
						</ModalCloseButton>
					</ModalHeaderTitle>
					{subtitle && <ModalHeaderSubtitle>{subtitle}</ModalHeaderSubtitle>}
				</ModalHeader>
				<ModalContent data-testid={`${dataTestId}-content`}>
					{children}
				</ModalContent>
				{actions && <ModalActions data-testid={`${dataTestId}-actions`}>{actions}</ModalActions>}
			</ModalContainer>
		</ModalOverlay>
	);
}