import type { DefaultTheme } from 'styled-components';

export const anyclazzTheme: DefaultTheme = {
	name: 'anyclazz',
	assets: {
		logo: {
			primary: '',
			negative: '',
			icon: {
				primary: '../../assets/images/logo_icon.svg',
			}
		}
	},
	colors: {
		basic: {
			white: '#ffffff',
			black: '#000000',
		},
		neutral: {
			100: '#f5f7f9',
			200: '#e9e9eb',
			300: '#c8cbce',
			400: '#acaeb3',
			500: '#8a8f94',
			600: '#797c82',
			700: '#585b61',
			800: '#3b3f48',
			900: '#292c32',
			1000: '#111214',
		},
		primary: {
			100: '#fff3f0',
			200: '#ffc8bb',
			300: '#ffa38e',
			400: '#ff7d5e',
			500: '#f96a3f',
			600: '#f26134',
			700: '#eb5a2c',
			800: '#d44d23',
			900: '#b33d1a',
			1000: '#7c2610',
		},
		success: {
			100: '#D9F6EF',
			200: '#068466',
			300: '#109D54',
		},
		error: {
			100: '#FFB1B2',
			200: '#CD3F41',
			300: '#8F0508',
		},
		warning: {
			100: '#FFEBAA',
		},
		brand: {
			mapfre: {
				primary: '#D81F04',
				secondary: '#FBE9E6',
			},
			idoktor: {
				primary: '#49998C',
				secondary: '#EDF5F3',
			},
			vithas: {
				primary: '#0027C2',
				secondary: '#E5E9F9',
			},
			savia: {
				primary: '#FF3975',
				secondary: '#FFEBF1',
			},
		}
	},
	radii: {
		4: '0.25rem',
		8: '0.5rem',
		16: '1rem',
		24: '1.5rem',
		'100%': '100%',
	},
	border: {
		1: 'solid 1px',
		2: 'solid 2px',
	},
	sizes: {
		8: '0.5rem',
		16: '1rem',
		24: '1.5rem',
		32: '2rem',
		40: '2.5rem',
		48: '3rem',
		56: '3.5rem',
		64: '4rem',
	},
	spacings: {
		4: '0.25rem',
		8: '0.5rem',
		12: '0.75rem',
		16: '1rem',
		24: '1.5rem',
		32: '2rem',
		40: '2.5rem',
		48: '3rem',
		56: '3.5rem',
		64: '4rem',
	},
	mobile: {
		fontSizes: {
			display1: '2rem',
			display2: '1.5rem',
			display3: '1.25rem',
			heading: '1rem',
			body: '1rem',
			bodySmall: '0.875rem',
			caption: '0.75rem',
		},
		lineHeights: {
			display1: '2.5rem',
			display2: '2rem',
			display3: '1.5rem',
			heading: '1.5rem',
			body: '1.5rem',
			bodySmall: '1.25rem',
			caption: '0.875rem',
			label: '1rem',
			labelSmall: '0.875rem',
		},
	},
	desktop: {
		fontSizes: {
			display1: '2.5rem',
			display2: '2rem',
			display3: '1.5rem',
			heading: '1.25rem',
			body: '1rem',
			bodySmall: '0.875rem',
			caption: '0.75rem',
			label: '1rem',
			labelSmall: '0.875rem',
		},
		lineHeights: {
			display1: '3rem',
			display2: '2.5rem',
			display3: '2rem',
			heading: '1.5rem',
			body: '1.5rem',
			bodySmall: '1rem',
			caption: '1rem',
			label: '1rem',
			labelSmall: '0.875rem',
		},
	},
	fontWeights: {
		regular: 400,
		medium: 500,
		semibold: 600,
	},
	zIndex: {
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
		10: 10,
	}
};
