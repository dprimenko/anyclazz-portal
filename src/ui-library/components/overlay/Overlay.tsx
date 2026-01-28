import classNames from 'classnames';
import type { OverlayProps } from './types.ts';
import { useEffect } from 'react';
import styles from './Overlay.module.css';

export function Overlay({ children, className, onClick }: OverlayProps) {
	const classes = classNames(
		'absolute top-0 left-0 w-[100dvw] h-[100dvh] overflow-hidden z-[11]', 
		styles.overlay,
		className
	);

	useEffect(() => {
		document.body.classList.add('overflow-hidden');

		return () => {
			document.body.classList.remove('overflow-hidden');
		};
	}, []);

	return (
		<div className={classes} onClick={onClick}>
			{children}
		</div>
	);
}