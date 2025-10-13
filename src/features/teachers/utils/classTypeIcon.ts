import type { ClassType } from "../domain/types";

export const getClassTypeIcon = (type: ClassType) => {
    switch (type) {
        case 'online_single':
            return 'laptop';
        case 'online_group':
            return 'laptop';
        case 'onsite_single':
            return 'home';
        case 'onsite_group':
            return 'group';
        default:
            return 'laptop';
    }
}