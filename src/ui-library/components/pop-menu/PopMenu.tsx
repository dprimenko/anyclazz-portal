import { useState, useRef, type ReactNode } from "react";
import { useClickOutside } from "@/ui-library/hooks/useClickOutside";
import classNames from "classnames";
import styles from "./PopMenu.module.css";

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
    onClose?: () => void;
    contentClassName?: string;
}

export function PopMenu({ trigger, items, children, align = "right", direction = "down", isOpen: controlledIsOpen, onClose, contentClassName }: PopMenuProps) {
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

    return (
        <div className={styles.menuWrapper} ref={menuRef}>
            <div 
                className={styles.trigger} 
                onClick={handleToggle}
            >
                {trigger}
            </div>
            {isOpen && (
                <div 
                    className={classNames(styles.dropdown, styles[align], styles[direction], contentClassName)}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children ? children : items?.map((item, index) => (
                        <button
                            key={index}
                            className={styles.dropdownItem}
                            onClick={() => handleItemClick(item.onClick)}
                            type="button"
                        >
                            {item.icon && <span className={styles.icon}>{item.icon}</span>}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
