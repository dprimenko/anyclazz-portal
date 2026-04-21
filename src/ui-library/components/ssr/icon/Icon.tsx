import { useState, useEffect } from 'react';
import { getSvgUrl, getSvgByNameAsync } from "../../../../utils/getSvgByName.ts";

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

        const iconPath = `icons/${icon}`;
        // Initial value: plain URL — works synchronously in SSR and avoids layout shift.
        const [src, setSrc] = useState(() => getSvgUrl(iconPath));

        useEffect(() => {
            if (iconColor) {
                getSvgByNameAsync(iconPath, { color: iconColor }).then(setSrc);
            } else {
                setSrc(getSvgUrl(iconPath));
            }
        }, [icon, iconColor]);

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