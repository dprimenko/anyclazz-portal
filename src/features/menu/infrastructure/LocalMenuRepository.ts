import type { MenuItem, MenuRepository } from "../domain/types";

export class LocalMenuRepository implements MenuRepository {
    getStudentMenuItems(): MenuItem[] {
        return [
            {
                id: 'dashboard',
                label: 'menu.dashboard',
                icon: 'menu/dashboard',
                href: '/dashboard',
                subItems: [
                    {
                        id: 'dashboard.upcoming-lessons',
                        label: 'menu.dashboard.upcoming-lessons',  
                        href: '/me/upcoming-lessons',
                    },
                    {
                        id: 'dashboard.last-lessons',
                        label: 'menu.dashboard.last-lessons',  
                        href: '/me/last-lessons',
                    },
                    {
                        id: 'dashboard.saved-teachers',
                        label: 'menu.dashboard.saved-teachers',  
                        href: '/me/saved-teachers',
                    },
                    {
                        id: 'dashboard.my-agenda',
                        label: 'menu.dashboard.my-agenda',  
                        href: '/me/my-agenda',
                    },
                    {
                        id: 'dashboard.clazzmate',
                        label: 'menu.dashboard.clazzmate',  
                        href: '/me/clazzmate',
                    },
                ]
            },
            {
                id: 'teachers',
                label: 'menu.teachers',
                icon: 'menu/people',
                href: '/teachers',
            },
            {
                id: 'messages',
                label: 'menu.messages',
                icon: 'menu/chat',
                href: '/messages',
            },
            {
                id: 'feed',
                label: 'menu.feed',
                icon: 'menu/feed',
                href: '/feed',
            }
        ];
    }

    getCommonMenuItems(): MenuItem[] {
        return [
            {
                id: 'settings',
                label: 'menu.settings',
                icon: 'common/settings',
                href: '/me/settings',
            },
            {
                id: 'support',
                label: 'menu.support',
                icon: 'common/support',
                href: 'javascript:void(0);',
            },
        ];
    }
}