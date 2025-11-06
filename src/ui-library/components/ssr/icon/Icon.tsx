import { getSvgByName } from "../../../../utils/getSvgByName.ts";

export interface IconProps extends React.HTMLAttributes<HTMLImageElement> {
    icon: string;
    iconColor?: string;
    iconWidth?: number;
    iconHeight?: number;
    classNames?: string;
}

export const Icon = (
    {
        icon,
        iconColor,
        iconWidth,
        iconHeight,
        classNames,
        ...props
    }: IconProps) => {

        return (
            <img 
                src={getSvgByName(`icons/${icon}`, { color: iconColor })}
                width={iconWidth}
                height={iconHeight}
                alt={`${icon} icon`}
                {...props}
            />
        );
    };