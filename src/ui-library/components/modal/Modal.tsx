import classNames from 'classnames';
import { Overlay } from '../overlay/Overlay.tsx';
import { Icon } from '../ssr/icon/Icon.tsx';
import type { ModalProps } from './types.ts';
import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useIsMobile } from '@/ui-library/hooks/useIsMobile';
import styles from './Modal.module.css';

export function Modal({ children, onClose, persistent = false, width, height, fitContent = false, withCloseIcon = false } : ModalProps) {
	const modalRoot = document.getElementById('portal-root');
	const isMobile = useIsMobile();
	const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    
	if (!modalRoot) {
		return null;
	}

	// Actualizar altura del viewport en cambios (Safari iOS)
	useEffect(() => {
		if (isMobile) {
			const updateHeight = () => {
				setViewportHeight(window.innerHeight);
			};
			
			updateHeight();
			window.addEventListener('resize', updateHeight);
			window.addEventListener('orientationchange', updateHeight);
			
			// Forzar actualización inicial
			setTimeout(updateHeight, 100);
			
			return () => {
				window.removeEventListener('resize', updateHeight);
				window.removeEventListener('orientationchange', updateHeight);
			};
		}
	}, [isMobile]);

	const onOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target instanceof HTMLElement && e.target.classList.value !== e.currentTarget.classList.value) return;
		onClose?.();
	}, []);

	const modalContainerClasses = classNames(
		'flex rounded-2xl overflow-hidden',
		styles['modal-container']
	);

	// Bottom sheet para móvil
	if (isMobile) {
		return ReactDOM.createPortal((
			<div 
				style={{
					position: 'fixed',
					inset: 0,
					zIndex: 9999,
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					display: 'flex',
					alignItems: 'flex-end'
				}}
				onClick={persistent ? undefined : onClose}
			>
				<div 
					style={{
						width: '100%',
						height: fitContent ? 'auto' : `${viewportHeight * 0.95}px`,
						backgroundColor: 'white',
						borderTopLeftRadius: '1rem',
						borderTopRightRadius: '1rem',
						overflow: 'auto',
						WebkitOverflowScrolling: 'touch',
						position: 'relative'
					}}
					onClick={(e) => e.stopPropagation()}
				>
					{withCloseIcon && onClose && (
						<button 
							onClick={onClose} 
							className="absolute top-4 right-4 p-2 bg-transparent border-none cursor-pointer rounded-md transition-all duration-200 flex items-center justify-center hover:bg-gray-100 z-1"
						>
							<Icon icon="close" iconWidth={24} iconHeight={24} iconColor="#A4A7AE" />
						</button>
					)}
					{children}
				</div>
			</div>
		), modalRoot);
	}

	// Modal tradicional para desktop
	return ReactDOM.createPortal((
		<Overlay className="flex items-center justify-center" onClick={persistent ? undefined : onOverlayClick}>
			<div className={modalContainerClasses} style={{ width, ...(height ? { height } : {}), position: 'relative' }}>
				{withCloseIcon && onClose && (
					<button 
						onClick={onClose} 
						className="absolute top-4 right-4 p-2 bg-transparent border-none cursor-pointer rounded-md transition-all duration-200 flex items-center justify-center hover:bg-gray-100 z-10"
					>
						<Icon icon="close" iconWidth={24} iconHeight={24} iconColor="#A4A7AE" />
					</button>
				)}
				{children}
			</div>
		</Overlay>
	), modalRoot);
}