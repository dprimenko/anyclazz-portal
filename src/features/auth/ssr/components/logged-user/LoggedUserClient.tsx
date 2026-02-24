import { PopMenu } from '@/ui-library/components/pop-menu/PopMenu';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import type { AuthUser } from '@/features/auth/domain/types';
import { Card } from '@/ui-library/components/ssr/card/Card';
import { UserCache } from '@/features/auth/infrastructure/userCache';
import { Combobox } from '@/ui-library/components/form/combobox/Combobox';
import { Dropdown, type DropdownItem } from '@/ui-library/components/form/dropdown';
import { useMemo, useState } from 'react';
import { getCurrentLang, useTranslations, setLangCookie } from '@/i18n';

interface LoggedUserClientProps {
    user: AuthUser;
}

export function LoggedUserClient({ user }: LoggedUserClientProps) {
    const t = useTranslations();
    
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
            label: t('menu.settings'),
            onClick: handleSettings
        },
        {
            icon: <Icon icon="sign-out" iconWidth={16} iconHeight={16} />,
            label: t('menu.sign_out'),
            onClick: handleLogout
        }
    ];

    const [language, setLanguage] = useState(getCurrentLang());

    const handleLanguageChange = (newLang: string) => {
        if (newLang === language) {
            return;
        }
        
        // Guardar el idioma en las cookies
        setLangCookie(newLang as 'en' | 'es');
        
        // Recargar la página para aplicar el cambio
        window.location.reload();
    };

    const languagesItems: DropdownItem[] = useMemo(() => {
        const currentLang = getCurrentLang();
        const languages = [
            { id: 'en', name: { en: 'English', es: 'Inglés' } },
            { id: 'es', name: { en: 'Spanish', es: 'Español' } },
        ];
        return languages.map(lang => ({
            value: lang.id,
            label: lang.name[currentLang as keyof typeof lang.name],
            renderItem: (item, isSelected) => (
                <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {isSelected && <Icon icon="check" iconWidth={16} iconHeight={16} className="text-[var(--color-primary-700)]" />}
                </div>
            ),
        }));
    }, []);

    return (
        <PopMenu
            align="right"
            direction="up"
            //items={menuItems}
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
        >
            <>
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className="w-full flex items-center gap-3 px-4 py-2.5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-neutral-50"
                        onClick={item.onClick}
                        type="button"
                    >
                        {item.icon && <span className="flex items-center justify-center flex-shrink-0">{item.icon}</span>}
                        <Text colorType="secondary" weight="semibold" size="text-sm">{item.label}</Text>
                    </button>
                ))}
                <div className='mt-2 px-4 pb-2 flex flex-col'>
                    <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                        {t('common.language_selector')}
                    </label>
                    <Dropdown
                        items={languagesItems}
                        value={language}
                        onChange={handleLanguageChange}
                        fullWidth
                        disablePortal={true}
                    />
                </div>
            </>
        </PopMenu>
    );
}
