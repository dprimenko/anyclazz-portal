import type { MenuItem, MenuRepository } from "../domain/types";

export class LocalMenuRepository implements MenuRepository {
    getTeacherMenuItems(): MenuItem[] {
        return [
            {
                id: 'dashboard',
                label: 'menu.dashboard',
                icon: 'dashboard',
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
                        id: 'dashboard.my-agenda',
                        label: 'menu.dashboard.my-agenda',  
                        href: '/me/my-agenda',
                    },
                ]
            },
            {
                id: 'profile',
                label: 'menu.profile',
                icon: 'user-edit',
                href: '/profile',
            },
            {
                id: 'messages',
                label: 'menu.messages',
                icon: 'chat',
                href: '/messages',
            },
            {
                id: 'feed',
                label: 'menu.feed',
                icon: 'feed',
                href: '/feed',
            },
            {
                id: 'payments',
                label: 'menu.payments',
                icon: 'wallet',
                href: '/payments',
            }
        ];
    }

    getStudentMenuItems(): MenuItem[] {
        return [
            {
                id: 'dashboard',
                label: 'menu.dashboard',
                icon: 'dashboard',
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
                icon: 'people',
                href: '/teachers',
            },
            {
                id: 'messages',
                label: 'menu.messages',
                icon: 'chat',
                href: '/messages',
            },
            {
                id: 'feed',
                label: 'menu.feed',
                icon: 'feed',
                href: '/feed',
            }
        ];
    }

    getCommonMenuItems(): MenuItem[] {
        return [
            {
                id: 'settings',
                label: 'menu.settings',
                icon: 'settings',
                href: '/me/settings',
            },
            {
                id: 'support',
                label: 'menu.support',
                icon: 'support',
                href: 'javascript:void(0);',
            },
        ];
    }
}