import { Text } from "@/ui-library/components/ssr/text/Text";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import classNames from "classnames";
import styles from "./DashboardLayout.module.css";
import type { ReactNode } from "react";
import { useState } from "react";

export interface DashboardLayoutProps {
    children: ReactNode;
    currentPath?: string;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
}

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    href: string;
    badge?: number;
}

export function DashboardLayout({ children, currentPath = '/dashboard', userName = 'Olivia Rhye', userEmail = 'olivia@gmail.com', userAvatar }: DashboardLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const menuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/dashboard' },
        { id: 'upcoming-lessons', label: 'Upcoming Lessons', icon: 'calendar', href: '/me/upcoming-lessons', badge: 2 },
        { id: 'last-lessons', label: 'Last Lessons', icon: 'clock', href: '/me/last-lessons' },
        { id: 'saved-teachers', label: 'Saved Teachers', icon: 'heart', href: '/me/saved-teachers' },
        { id: 'my-agenda', label: 'My Agenda', icon: 'calendar-check', href: '/me/my-agenda' },
        { id: 'clazzmate', label: 'Clazzmate', icon: 'users', href: '/me/clazzmate' },
    ];

    const secondaryMenuItems: MenuItem[] = [
        { id: 'teachers', label: 'Teachers', icon: 'user-search', href: '/teachers' },
        { id: 'messages', label: 'Messages', icon: 'message-circle', href: '/messages' },
        { id: 'feed', label: 'For You Page', icon: 'bookmark', href: '/feed' },
    ];

    const MenuItem = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => {
        const menuItemClasses = classNames(
            "flex flex-row items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all",
            {
                [styles.menuItemActive]: isActive,
                [styles.menuItemInactive]: !isActive,
            }
        );

        return (
            <a href={item.href} className={menuItemClasses}>
                <Icon icon={item.icon} iconWidth={20} iconHeight={20} />
                <Text size="text-sm" weight="medium" colorType={isActive ? "primary" : "secondary"} className="flex-1">
                    {item.label}
                </Text>
                {item.badge && item.badge > 0 && (
                    <span className={styles.badge}>{item.badge}</span>
                )}
            </a>
        );
    };

    const sidebarClasses = classNames(
        styles.sidebar,
        {
            [styles.sidebarOpen]: isMobileMenuOpen
        }
    );

    return (
        <div className={styles.dashboardContainer}>
            {/* Mobile Header */}
            <div className={styles.mobileHeader}>
                <div className="flex items-center gap-2">
                    <Icon icon="logo" iconWidth={24} iconHeight={24} />
                    <Text size="text-lg" weight="semibold" colorType="primary">Anyclazz</Text>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={styles.menuButton}
                >
                    <Icon icon="menu" iconWidth={24} iconHeight={24} />
                </button>
            </div>

            {/* Sidebar */}
            <aside className={sidebarClasses}>
                <div className={styles.sidebarContent}>
                    {/* Logo */}
                    <div className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Icon icon="logo" iconWidth={32} iconHeight={32} />
                            <Text size="text-xl" weight="semibold" colorType="primary">Anyclazz</Text>
                        </div>
                    </div>

                    {/* Main Menu */}
                    <nav className="flex-1 px-3">
                        <div className="mb-6">
                            <div className="px-3 mb-2">
                                <Text size="text-xs" weight="medium" colorType="tertiary" uppercase>
                                    Dashboard
                                </Text>
                            </div>
                            <div className="flex flex-col gap-1">
                                {menuItems.map((item) => (
                                    <MenuItem 
                                        key={item.id} 
                                        item={item} 
                                        isActive={currentPath === item.href} 
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex flex-col gap-1">
                                {secondaryMenuItems.map((item) => (
                                    <MenuItem 
                                        key={item.id} 
                                        item={item} 
                                        isActive={currentPath === item.href} 
                                    />
                                ))}
                            </div>
                        </div>
                    </nav>

                    {/* User Profile */}
                    <div className={styles.userProfile}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar src={userAvatar} alt={userName} size={40} />
                            <div className="flex flex-col flex-1 min-w-0">
                                <Text size="text-sm" weight="semibold" colorType="primary" className="truncate">
                                    {userName}
                                </Text>
                                <Text size="text-xs" colorType="tertiary" className="truncate">
                                    {userEmail}
                                </Text>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <button className={styles.iconButton}>
                                <Icon icon="settings" iconWidth={20} iconHeight={20} />
                            </button>
                            <button className={styles.iconButton}>
                                <Icon icon="log-out" iconWidth={20} iconHeight={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {children}
            </main>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className={styles.overlay} 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
