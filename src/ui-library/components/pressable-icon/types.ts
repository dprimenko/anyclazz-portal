import type { IconProps } from "@phosphor-icons/react";
import type { ReactElement } from "react";

export interface PressableIconProps extends React.HTMLAttributes<HTMLDivElement> {
    icon: IconProps & ReactElement;
    backgroundColor?: string;
    fullRadius?: boolean;
    vPadding?: number;
    hPadding?: number;
    size?: string;
    pressed?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    'data-testid'?: string;
}