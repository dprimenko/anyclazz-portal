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
    items: PopMenuItem[];
    align?: "left" | "right";
    direction?: "up" | "down";
}

export function PopMenu({ trigger, items, align = "right", direction = "down" }: PopMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
            <button 
                className={styles.trigger} 
                onClick={handleToggle}
                type="button"
            >
                {trigger}
            </button>
            {isOpen && (
                <div className={classNames(styles.dropdown, styles[align], styles[direction])}>
                    {items.map((item, index) => (
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
