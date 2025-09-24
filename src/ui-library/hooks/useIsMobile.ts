import { useEffect, useState } from 'react';

export const TABLET_SIZE = 768;

const mql = window.matchMedia(`(max-width: ${TABLET_SIZE - 1}px)`);

export function useIsMobile() {

	const [isMobile, setIsMobile] = useState(window.innerWidth < TABLET_SIZE);

	useEffect(() => {

		const onChange = () => {
			setIsMobile(window.innerWidth < TABLET_SIZE);
		};

		mql.addEventListener('change', onChange);

		return () => {
			mql.removeEventListener('change', onChange);
		};
	}, [isMobile]);

	return isMobile;
}