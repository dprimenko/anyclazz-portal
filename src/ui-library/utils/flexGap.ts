import { css } from 'styled-components';

export const flexGap = (gapSize: string, isRow: boolean) => {
	return css`
		@supports (gap: ${gapSize}) {
			gap: ${gapSize};
		}
		@supports not (gap: ${gapSize}) {
			& > * + * {
				${isRow ? 'margin-left' : 'margin-top'}: ${gapSize};
			}
		}
	`;
};
