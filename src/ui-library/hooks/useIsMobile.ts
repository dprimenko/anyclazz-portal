import { useEffect, useState } from 'react';

const mql = window.matchMedia(`(max-width: ${768 - 1}px)`);

export function useIsMobile() {

	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {

		const onChange = () => {
			setIsMobile(window.innerWidth < 768);
		};

		mql.addEventListener('change', onChange);

		return () => {
			mql.removeEventListener('change', onChange);
		};
	}, [isMobile]);

	return isMobile;
}