import type { HTMLAttributes } from "react";

export interface PageSelectorProps extends HTMLAttributes<HTMLDivElement> {
    pages: number;
    currentPage: number;
    maxPages?: number;
    disabled?: boolean;
    onChangedPage: (page: number) => void;
}