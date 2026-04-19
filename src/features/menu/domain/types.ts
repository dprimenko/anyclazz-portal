export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    href?: string;
    onClick?: () => void;
    subItems?: MenuItem[];
    showBadge?: boolean; // Si debe mostrar un badge dinámico
}

export interface MenuRepository {
    getTeacherMenuItems: () => MenuItem[];
    getStudentMenuItems: () => MenuItem[];
    getCommonMenuItems: () => MenuItem[];
}