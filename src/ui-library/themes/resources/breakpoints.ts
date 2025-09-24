export interface Screens {
	screenS: string;
	screenM: string;
	screenL: string;
}

const size = {
	mobileMin: 360,
	tabletMin: 768,
	desktopMin: 1280
};

const screens = {
	screenS: `only screen and (max-width: ${size.tabletMin - 1}px)`,
	screenGTS: `only screen and (min-width: ${size.tabletMin}px)`,
	screenM: `only screen and (min-width: ${size.tabletMin}px) and (max-width: ${size.desktopMin - 1}px)`,
	screenL: `only screen and (min-width: ${size.desktopMin}px)`
};

const percentageDeviceHeight = (percent: number) => window.innerHeight * (percent / 100);

const isMobile = () => window.matchMedia(`(max-width: ${size.tabletMin - 1}px)`).matches;
const isTablet = () => window.matchMedia(`(max-width: ${size.desktopMin - 1}px)`).matches;
const isDesktop = () => window.matchMedia(`(min-width: ${size.desktopMin}px)`).matches;
const isMobileOrTablet = () => isMobile() || isTablet();

export {
	isDesktop,
	isMobile,
	isMobileOrTablet,
	isTablet,
	percentageDeviceHeight,
	size,
	screens,
};
