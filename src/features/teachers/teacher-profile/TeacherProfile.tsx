import { Tabs } from "@/ui-library/components/tabs";
import { useMemo, useState, useEffect } from "react";
import type { Teacher } from "../domain/types";
import { useTranslations } from "@/i18n";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import type { ui } from "@/i18n/ui";
import { AvailabilityAndModalitiesManager } from "../availability_and_modalities/AvailabilityAndModalitiesManager";
import { MyStoriesTab } from "../stories/MyStoriesTab";
import { PublicInformation } from "./public-information/PublicInformation";
import { Location } from "./location/Location";
import { Information } from "./information/Information";
import { ApiTeacherRepository } from "../infrastructure/ApiTeacherRepository";
import { SuperTutorMembership } from "./super-tutor-membership/SuperTutorMembership";
import { Payments } from "./payments/Payments";

export interface TeacherProfileProps {
    teacher: Teacher;
    accessToken: string;
    teacherId?: string;
    initialTab?: string;
    lang?: keyof typeof ui;
}

export function TeacherProfile({ teacher: initialTeacher, accessToken, teacherId, initialTab = 'availability_and_modalities', lang = 'en' }: TeacherProfileProps) {
    const t = useTranslations({ lang });
    const repository = useMemo(() => new ApiTeacherRepository(), []);
    const [teacher, setTeacher] = useState<Teacher>(initialTeacher);

    // Sincronizar con cambios del teacher inicial
    useEffect(() => {
        setTeacher(initialTeacher);
    }, [initialTeacher]);

    // Polling para actualizar cuando el video está procesándose
    useEffect(() => {
        if (teacher.videoPresentationStatus !== 'processing' || !teacherId) return;

        const intervalId = window.setInterval(async () => {
            try {
                const updatedTeacher = await repository.getTeacher({
                    token: accessToken,
                    teacherId: teacherId,
                });
                setTeacher(updatedTeacher);
            } catch (error) {
                console.error('Error fetching teacher:', error);
            }
        }, 5000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [teacher.videoPresentationStatus, teacherId, accessToken, repository]);

    const tabs = [
        {
            key: "public_information",
            label: t('teacher-profile.public_information'),
            onClick: () => {
            },
        },
        {
            key: "location",
            label: t('teacher-profile.location'),
            onClick: () => {
            },
        },
        {
            key: "information",
            label: t('teacher-profile.information'),
            onClick: () => {
            },
        },
        {
            key: "availability_and_modalities",
            label: t('teacher-profile.availability_and_modalities'),
            onClick: () => {
            },
        },
        {
            key: "videos",
            label: t('teacher-profile.videos'),
            onClick: () => {
            },
        },
        {
            key: "payments",
            label: t('teacher-profile.payments'),
            onClick: () => {
            },
        },
        {
            key: "super_tutor",
            label: t('teacher-profile.super_tutor'),
            onClick: () => {
            },
        },
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

            {selectedTab === "public_information" && (
                <PublicInformation teacher={teacher} accessToken={accessToken} repository={repository} />
            )}
            
            {selectedTab === "location" && (
                <Location teacher={teacher} accessToken={accessToken} repository={repository} />
            )}
            
            {selectedTab === "information" && (
                <Information teacher={teacher} accessToken={accessToken} repository={repository} />
            )}

            {selectedTab === "super_tutor" && (
                <SuperTutorMembership teacher={teacher} accessToken={accessToken} repository={repository} />
            )}
            
            {selectedTab === "availability_and_modalities" && (
                <AvailabilityAndModalitiesManager teacher={teacher} accessToken={accessToken} />
            )}
            
            {selectedTab === "payments" && (
                <Payments teacher={teacher} accessToken={accessToken} />
            )}
            
            {selectedTab === "videos" && teacherId && (
                <MyStoriesTab 
                    teacherId={teacherId} 
                    accessToken={accessToken}
                    country={teacher.teacherAddress?.country || ''}
                    city={teacher.teacherAddress?.city}
                />
            )}
        </div>
        </LanguageProvider>
    );
}