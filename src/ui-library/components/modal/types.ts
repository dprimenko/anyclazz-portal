import type { HTMLAttributes, ReactNode } from "react";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    title?: string;
    subtitle?: string;
    onClose?: () => void;
    actions?: ReactNode;
    persistent?: boolean;
    width?: number;
    'data-testid'?: string;
}