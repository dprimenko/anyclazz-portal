import type { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
	export interface DefaultTheme {
		name: string;
		assets: {
			logo: {
				primary: string;
				negative: string;
				icon: {
					primary: string;
				};
			}
		};
		colors: {
			basic: {
				white: string;
				black: string;
			},
			neutral: {
				100: string;
				200: string;
				300: string;
				400: string;
				500: string;
				600: string;
				700: string;
				800: string;
				900: string;
				1000: string;
			},
			primary: {
				100: string;
				200: string;
				300: string;
				400: string;
				500: string;
				600: string;
				700: string;
				800: string;
				900: string;
				1000: string;
			};
			success: {
				100: string;
				200: string;
				300: string;
			},
			error: {
				100: string;
				200: string;
				300: string;
			},
			warning: {
				100: string;
			},
			brand: {
				mapfre: {
					primary: string;
					secondary: string;
				},
				idoktor: {
					primary: string;
					secondary: string;
				},
				vithas: {
					primary: string;
					secondary: string;
				},
				savia: {
					primary: string;
					secondary: string;
				}
			}
		};
		radii: {
			4: string;
			8: string;
			16: string;
			24: string;
			'100%': string;
		};
		border: {
			1: string;
			2: string;
		};
		sizes: {
			8: string;
			16: string;
			24: string;
			32: string;
			40: string;
			48: string;
			56: string;
			64: string;
		};
		spacings: {
			4: string;
			8: string;
			12: string;
			16: string;
			24: string;
			32: string;
			40: string;
			48: string;
			56: string;
			64: string;
		};
		mobile: {
			fontSizes: {
				display1: string;
				display2: string;
				display3: string;
				heading: string;
				body: string;
				bodySmall: string;
				caption: string;
			};
			lineHeights: {
				display1: string;
				display2: string;
				display3: string;
				heading: string;
				body: string;
				bodySmall: string;
				caption: string;
				label: string;
				labelSmall: string;
			};
		},
		desktop: {
			fontSizes: {
				display1: string;
				display2: string;
				display3: string;
				heading: string;
				body: string;
				bodySmall: string;
				caption: string;
				label: string;
				labelSmall: string;
			};
			lineHeights: {
				display1: string;
				display2: string;
				display3: string;
				heading: string;
				body: string;
				bodySmall: string;
				caption: string;
				label: string;
				labelSmall: string;
			};
		},
		fontWeights: {
			regular: number;
			medium: number;
			semibold: number;
		};
		zIndex: {
			1: number;
			2: number;
			3: number;
			4: number;
			5: number;
			6: number;
			7: number;
			8: number;
			9: number;
			10: number;
		};
	}
}

export interface ThemeContextProps {
    theme: DefaultTheme;
    themeName: string;
    switchTheme: (themeName: string) => void;
}
export interface ThemeProps {
    anyclazz: DefaultTheme
}


