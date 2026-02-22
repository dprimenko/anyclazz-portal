import { useState, useRef, type ReactNode } from "react";
import { useClickOutside } from "@/ui-library/hooks/useClickOutside";
import classNames from "classnames";
import { Text } from "@/ui-library/components/ssr/text/Text";

export interface PopMenuItem {
    icon?: ReactNode;
    label: string;
    onClick: () => void;
}

export interface PopMenuProps {
    trigger: ReactNode;
    items?: PopMenuItem[];
    children?: ReactNode;
    align?: "left" | "right";
    direction?: "up" | "down";
    isOpen?: boolean;
    spaceBetweenTriggerAndMenu?: number; // in pixels
    onClose?: () => void;
    contentClassName?: string;
}

export function PopMenu({ trigger, items, children, align = "right", direction = "down", isOpen: controlledIsOpen, onClose, contentClassName, spaceBetweenTriggerAndMenu = 8 }: PopMenuProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Use controlled or uncontrolled state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = onClose ? (value: boolean) => {
        if (!value) onClose();
        else setInternalIsOpen(value);
    } : setInternalIsOpen;

    useClickOutside(menuRef, () => {
        if (isOpen) {
            setIsOpen(false);
        }
    });

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (onClick: () => void) => {
        onClick();
        setIsOpen(false);
    };

    const dropdownClasses = classNames(
        "absolute bg-white border border-neutral-200 rounded-lg shadow-md z-50 min-w-[160px] w-[max-content] py-1",
        {
            "right-0": align === "right",
            "left-0": align === "left",
        },
        contentClassName
    );

    const dropdownStyle = direction === "down" 
        ? { top: `calc(100% + ${spaceBetweenTriggerAndMenu}px)` }
        : { bottom: `calc(100% + ${spaceBetweenTriggerAndMenu}px)`, top: 'auto' };

    return (
        <div className="relative inline-block w-full" ref={menuRef}>
            <div 
                className="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center w-full hover:opacity-80" 
                onClick={handleToggle}
            >
                {trigger}
            </div>
            {isOpen && (
                <div 
                    className={dropdownClasses}
                    style={dropdownStyle}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children ? children : items?.map((item, index) => (
                        <button
                            key={index}
                            className="w-full flex items-center gap-3 px-4 py-2.5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-neutral-50"
                            onClick={() => handleItemClick(item.onClick)}
                            type="button"
                        >
                            {item.icon && <span className="flex items-center justify-center flex-shrink-0">{item.icon}</span>}
                            <Text colorType="secondary" weight="semibold" size="text-sm">{item.label}</Text>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
