import type { DefaultTheme } from 'styled-components';
import { screens } from './breakpoints';

export type Typography =
    | 'display1'
    | 'display2'
    | 'display3'
    | 'heading'
    | 'body'
    | 'bodySmall'
    | 'caption';

export type Weight =
	| 'regular'
	| 'medium'
	| 'semibold';

export const typography = (theme: DefaultTheme, variant: Typography = 'body', weight: Weight = 'regular') => ({
	display1: `
		font-size: ${theme.mobile.fontSizes.display1};
		line-height: ${theme.mobile.lineHeights.display1};
		font-weight: ${theme.fontWeights[`${weight}`]};

		@media ${screens.screenGTS} {
			font-size: ${theme.desktop.fontSizes.display1};
			line-height: ${theme.desktop.lineHeights.display1};
			font-weight: ${theme.fontWeights[`${weight}`]};
		}
	`,
	display2: `
		font-size: ${theme.mobile.fontSizes.display2};
		line-height: ${theme.mobile.lineHeights.display2};
		font-weight: ${theme.fontWeights[`${weight}`]};

		@media ${screens.screenGTS} {
			font-size: ${theme.desktop.fontSizes.display2};
			line-height: ${theme.desktop.lineHeights.display2};
			font-weight: ${theme.fontWeights[`${weight}`]};
		}
	`,
	display3: `
		font-size: ${theme.mobile.fontSizes.display3};
		line-height: ${theme.mobile.lineHeights.display3};
		font-weight: ${theme.fontWeights[`${weight}`]};

		@media ${screens.screenGTS} {
			font-size: ${theme.desktop.fontSizes.display3};
			line-height: ${theme.desktop.lineHeights.display3};
			font-weight: ${theme.fontWeights[`${weight}`]};
		}
	`,
	heading: `
		font-size: ${theme.mobile.fontSizes.heading};
		line-height: ${theme.mobile.lineHeights.heading};
		font-weight: ${theme.fontWeights[`${weight}`]};

		@media ${screens.screenGTS} {
			font-size: ${theme.desktop.fontSizes.heading};
			line-height: ${theme.desktop.lineHeights.heading};
			font-weight: ${theme.fontWeights[`${weight}`]};
		}
	`,
	body: `
		font-size: ${theme.mobile.fontSizes.body};
		line-height: ${theme.mobile.lineHeights.body};
		font-weight: ${theme.fontWeights[`${weight}`]};

		@media ${screens.screenGTS} {
			font-size: ${theme.desktop.fontSizes.body};
			line-height: ${theme.desktop.lineHeights.body};
			font-weight: ${theme.fontWeights[`${weight}`]};
		}
	`,
	bodySmall: `
		font-size: ${theme.mobile.fontSizes.bodySmall};
		line-height: ${theme.mobile.lineHeights.bodySmall};
		font-weight: ${theme.fontWeights[`${weight}`]};

		@media ${screens.screenGTS} {
			font-size: ${theme.desktop.fontSizes.bodySmall};
			line-height: ${theme.desktop.lineHeights.bodySmall};
			font-weight: ${theme.fontWeights[`${weight}`]};
		}
	`,
	caption: `
		font-size: ${theme.mobile.fontSizes.caption};
		line-height: ${theme.mobile.lineHeights.caption};
		font-weight: ${theme.fontWeights[`${weight}`]};

		@media ${screens.screenGTS} {
			font-size: ${theme.desktop.fontSizes.caption};
			line-height: ${theme.desktop.lineHeights.caption};
			font-weight: ${theme.fontWeights[`${weight}`]};
		}
	`
}[variant]);

export default typography;
