import { useEffect, useState } from 'react';

export const DESKTOP_SIZE = 1280;

export function useIsDesktop() {
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia(`(min-width: ${DESKTOP_SIZE}px)`);

		const onChange = () => {
			setIsDesktop(window.innerWidth >= DESKTOP_SIZE);
		};

		mql.addEventListener('change', onChange);

		setIsDesktop(window.innerWidth >= DESKTOP_SIZE);

		return () => {
			mql.removeEventListener('change', onChange);
		};
	}, [isDesktop]);

	return isDesktop;
}