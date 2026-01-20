import { useEffect, useState } from 'react';

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${768 - 1}px)`);
		
		// Set initial value
		setIsMobile(mql.matches);

		const onChange = (e: MediaQueryListEvent) => {
			setIsMobile(e.matches);
		};

		mql.addEventListener('change', onChange);

		return () => {
			mql.removeEventListener('change', onChange);
		};
	}, []);

	return isMobile;
}