import { getSvgByName } from "../../../../utils/getSvgByName.ts";

export interface IconProps {
    icon: string;
    iconColor?: string;
    iconWidth?: number;
    iconHeight?: number;
}

export const Icon = (
    {
        icon,
        iconColor,
        iconWidth,
        iconHeight,
    }: IconProps) => {

        return (
            <img 
                src={getSvgByName(`icons/${icon}`, { color: iconColor })}
                width={iconWidth}
                height={iconHeight}
                alt={`${icon} icon`}
            />
        );
    };