import { Tabs } from "@/ui-library/components/tabs";
import { useState, useEffect } from "react";
import type { Teacher } from "../domain/types";
import { useTranslations } from "@/i18n";
import { AvailabilityAndModalitiesManager } from "../availability_and_modalities/AvailabilityAndModalitiesManager";
import { MyStoriesTab } from "../stories/MyStoriesTab";

export interface TeacherProfileProps {
    teacher: Teacher;
    accessToken: string;
    teacherId?: string;
    initialTab?: string;
}

export function TeacherProfile({ teacher, accessToken, teacherId, initialTab = 'availability_and_modalities' }: TeacherProfileProps) {
    const t = useTranslations();

    const tabs = [
        {
            key: "availability_and_modalities",
            label: t('teacher-profile.availability_and_modalities'),
            onClick: () => {
                console.log("information");
            },
        },
        {
            key: "videos",
            label: t('teacher-profile.videos'),
            onClick: () => {
                console.log("videos");
            },
        },
        // {
        //     key: "reviews",
        //     label: "Reviews",
        //     onClick: () => {
        //         console.log("reviews");
        //     },
        // },
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
        <div>
            <Tabs tabs={tabs} defaultTab={initialTab} onChange={onTabChange} />
            
            {selectedTab === "availability_and_modalities" && (
                <AvailabilityAndModalitiesManager teacher={teacher} accessToken={accessToken} />
            )}
            
            {selectedTab === "videos" && teacherId && (
                <MyStoriesTab 
                    teacherId={teacherId} 
                    accessToken={accessToken}
                    countryIso2={teacher.teacherAddress?.countryISO2 || ''}
                    cityIso2={teacher.teacherAddress?.cityISO2}
                />
            )}
        </div>
    );
}