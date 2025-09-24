import type { HTMLAttributes, ReactNode } from "react";

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    width?: number;
    onClose?: () => void;
    noCloseButton?: boolean;
    persistent?: boolean;
    'data-testid'?: string;
}