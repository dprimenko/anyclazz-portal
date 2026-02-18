import type { HTMLAttributes } from "react";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    onClose?: () => void;
    persistent?: boolean;
    width?: number;
    height?: number;
    fitContent?: boolean;
}