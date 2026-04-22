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

        const src = getSvgByName(`icons/${icon}`, { color: iconColor });

        if (!src) {
            return (
                <span
                    style={{ display: 'inline-block', width: iconWidth, height: iconHeight }}
                    className={classNames}
                />
            );
        }

        return (
            <img
                src={src}
                width={iconWidth}
                height={iconHeight}
                alt={`${icon} icon`}
                className={classNames}
                {...props}
            />
        );
    };