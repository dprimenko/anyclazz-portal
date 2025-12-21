import type { ColorType } from "../../../shared/constants";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
	colorType?: ColorType;
	textColor?: string;
	borderColor?: string;
	bgColor?: string;
	rounded?: boolean;
	size?: 'sm' | 'md' | 'lg';
}
