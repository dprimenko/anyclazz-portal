export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    href?: string;
    onClick?: () => void;
    subItems?: MenuItem[];
}

export interface MenuRepository {
    getTeacherMenuItems: () => MenuItem[];
    getStudentMenuItems: () => MenuItem[];
    getCommonMenuItems: () => MenuItem[];
}