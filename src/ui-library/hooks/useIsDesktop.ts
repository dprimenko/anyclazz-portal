import { useEffect, useState } from 'react';

export function useIsDesktop() {
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia(`(min-width: ${1280}px)`);

		const onChange = () => {
			setIsDesktop(window.innerWidth >= 1280);
		};

		mql.addEventListener('change', onChange);

		setIsDesktop(window.innerWidth >= 1280);

		return () => {
			mql.removeEventListener('change', onChange);
		};
	}, [isDesktop]);

	return isDesktop;
}