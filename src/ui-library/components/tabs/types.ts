export interface Tab {
    key: string;
    label: string;
    disabled?: boolean;
    onClick?: () => void;
}

export interface TabsProps {
    defaultTab?: string;
    tabs: Tab[];
    onChange?: (tabKey: string) => void;
    "data-testid"?: string;
}