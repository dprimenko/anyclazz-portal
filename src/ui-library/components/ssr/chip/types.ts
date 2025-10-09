import type { ColorType } from "../../../shared/constants";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
	colorType?: ColorType;
	rounded?: boolean;
}
