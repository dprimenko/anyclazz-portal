import classNames from 'classnames';
import { Overlay } from '../overlay/Overlay.tsx';
import type { ModalProps } from './types.ts';
import { useCallback } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

export function Modal({ children, onClose, persistent = false, width = 480, height } : ModalProps) {
	const modalRoot = document.getElementById('portal-root');
    
	if (!modalRoot) {
		return null;
	}


	const onOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target instanceof HTMLElement && e.target.classList.value !== e.currentTarget.classList.value) return;
		onClose?.();
	}, []);

	const modalContainerClasses = classNames(
		'flex rounded-2xl overflow-hidden',
		styles['modal-container']
	);

	return ReactDOM.createPortal((
		<Overlay className="flex items-center justify-center" onClick={persistent ? undefined : onOverlayClick}>
			<div className={modalContainerClasses} style={{ width, ...(height ? { height } : {}) }}>
				{children}
			</div>
		</Overlay>
	), modalRoot);
}