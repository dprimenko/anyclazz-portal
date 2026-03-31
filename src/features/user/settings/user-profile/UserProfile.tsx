import { useEffect, useMemo, useState } from "react";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import type { ui } from "@/i18n/ui";
import type { UserProfile as UserProfileType } from "../../domain/types";
import { ApiUserRepository } from "../../infrastructure/ApiUserRepository";
import { MyDetails } from "../my-details/MyDetails";
import { ChangePassword } from "../change-password/ChangePassword";
import { useTranslations } from "@/i18n";
import { Tabs } from "@/ui-library/components/tabs";
import { PaginatedStudentPayments } from "@/features/students/components/billing/PaginatedStudentPayments";
import type { GetStudentPaymentsResponse } from "@/features/students/domain/paymentTypes";

export interface UserProfileProps {
    user: UserProfileType;
    accessToken: string;
    initialTab?: string;
    role?: string;
    initialPayments?: GetStudentPaymentsResponse;
    lang?: keyof typeof ui;
}

export function UserProfile({ user: initialUser, accessToken, initialTab, role, initialPayments, lang = 'en' }: UserProfileProps) {
    const t = useTranslations({ lang });
    const isStudent = role === 'student';
    
    const [user] = useState<UserProfileType>(initialUser);
    const repository = useMemo(() => new ApiUserRepository(), []);

    const tabs = [
        {
            key: "my_details",
            label: t('user-settings.my_details'),
            onClick: () => {
            },
        },
        {
            key: "password",
            label: t('user-settings.password'),
            onClick: () => {
            },
        },
        ...(isStudent ? [{
            key: "billing",
            label: t('user-settings.billing'),
            onClick: () => {
            },
        }] : []),
    ];

    const [selectedTab, setSelectedTab] = useState(initialTab);

    const onTabChange = (key: string) => {
        setSelectedTab(key);
        
        // Actualizar URL con el tab seleccionado
        const url = new URL(window.location.href);
        url.searchParams.set('tab', key);
        window.history.pushState({}, '', url.toString());
    };

    // Sincronizar con cambios en el initialTab si cambia externamente
    useEffect(() => {
        setSelectedTab(initialTab);
    }, [initialTab]);

    return (
        <LanguageProvider lang={lang}>
        <div>
            <Tabs tabs={tabs} defaultTab={initialTab} onChange={onTabChange} />
            {selectedTab === "my_details" && (
                <MyDetails user={user} accessToken={accessToken} repository={repository} lang={lang} />
            )}
            {selectedTab === "password" && (
                <ChangePassword accessToken={accessToken} repository={repository} lang={lang} />
            )}
            {selectedTab === "billing" && initialPayments && (
                <PaginatedStudentPayments
                    initialPayments={initialPayments}
                    accessToken={accessToken}
                />
            )}
        </div>
        </LanguageProvider>
    );
}