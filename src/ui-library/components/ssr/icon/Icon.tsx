import { getSvgByName } from "../../../../utils/getSvgByName.ts";

export interface IconProps {
    icon: string;
    color?: string;
    width?: number;
    height?: number;
}

export const Icon = (
    {
        icon,
        color,
        width,
        height,
    }: IconProps) => {

        return (
            getSvgByName(icon)
        );
    };