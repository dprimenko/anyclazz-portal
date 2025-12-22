import { PopMenu } from '@/ui-library/components/pop-menu/PopMenu';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import type { AuthUser } from '@/features/auth/domain/types';
import { Card } from '@/ui-library/components/ssr/card/Card';
import { UserCache } from '@/features/auth/infrastructure/userCache';

interface LoggedUserClientProps {
    user: AuthUser;
}

export function LoggedUserClient({ user }: LoggedUserClientProps) {
    const handleLogout = () => {
        console.log('🚪 Logout button clicked');
        
        // Limpiar caché del usuario
        const userCache = new UserCache();
        userCache.clear();
        console.log('🗑️  User cache cleared');
        
        console.log('📍 Current location:', window.location.href);
        console.log('🍪 Current cookies:', document.cookie);
        console.log('➡️  Redirecting to: /api/auth/keycloak-logout');
        
        // Redirigir GET al endpoint
        window.location.href = '/api/auth/keycloak-logout';
        
        console.log('✅ Redirect initiated');
    };

    const handleSettings = () => {
        window.location.href = '/me/settings';
    };

    const menuItems = [
        {
            icon: <Icon icon="settings" iconWidth={16} iconHeight={16} />,
            label: 'Settings',
            onClick: handleSettings
        },
        {
            icon: <Icon icon="sign-out" iconWidth={16} iconHeight={16} />,
            label: 'Sign out',
            onClick: handleLogout
        }
    ];

    return (
        <PopMenu
            align="right"
            direction="up"
            items={menuItems}
            trigger={
                <Card className="p-3 w-full">
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity w-full">
                        <div className="relative flex-shrink-0">
                            <Avatar 
                                src={user.avatarUrl} 
                                alt={user.name}
                                size={40} 
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex flex-col items-start flex-1 min-w-0">
                            <Text size="text-sm" weight="semibold" colorType="primary" className="truncate w-full">
                                {user.name}
                            </Text>
                            <Text size="text-sm" colorType="tertiary" className="truncate w-full">
                                {user.email}
                            </Text>
                        </div>
                    </div>
                </Card>
            }
        />
    );
}
