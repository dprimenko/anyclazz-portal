import './styles.scss';
import { useEffect, useState } from "react";
import { Drawer } from "../../ui-library/components/drawer";
import { AppEvents } from "../../features/shared/domain/events";
import { subscribe, unsubscribe } from "../../services/domain-events-bus";
import { ThemeContextProvider } from "../../ui-library/themes";
import { ListIcon } from '@phosphor-icons/react';

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        function onOpenMobileSidebar() {
            setIsOpen(true);
        }

        function onCloseMobileSidebar() {
            setIsOpen(false);
        }

        subscribe(AppEvents.OPEN_MOBILE_SIDEBAR, onOpenMobileSidebar);
        subscribe(AppEvents.CLOSE_MOBILE_SIDEBAR, onCloseMobileSidebar);

        return () => {
            unsubscribe(AppEvents.OPEN_MOBILE_SIDEBAR, onOpenMobileSidebar);
            unsubscribe(AppEvents.CLOSE_MOBILE_SIDEBAR, onCloseMobileSidebar);
        };
    }, []);

    if (!isOpen) {
        return <></>;
    }

    return (
        <ThemeContextProvider>
            <Drawer width={60} noCloseButton onClose={() => setIsOpen(false)}>
                <nav className="mobile-left-sidebar__container">
                    <div className="mobile-left-sidebar__logo">
                        <ListIcon color="#292c32" size={32} />
                        <img src={logo} alt="Anyclazz Logo" />
                    </div>
                    <div className="mobile-menu__container">
                        <ul className="mobile-menu__content">
                            <li className="mobile-menu__item">
                                <a href="https://anyclazz.com/" target="_blank">
                                    <span className="mobile-menu__item-text">¿Qué es Anyclazz?</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="mobile-menu_footer">
                        © 2025 Anyclazz
                    </div>
                </nav>
            </Drawer>
        </ThemeContextProvider>
    );
}