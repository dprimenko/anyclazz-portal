import type { HTMLAttributes, ReactNode } from "react";

export interface OverlayProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}