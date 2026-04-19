import { HTMLAttributes } from "react";

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
    message?: string;
    variant?: 'success' | 'warning' | 'info' | 'error';
    autoCloseInterval?: number;
    onClose?: () => void;
    'data-testid'?: string;
}