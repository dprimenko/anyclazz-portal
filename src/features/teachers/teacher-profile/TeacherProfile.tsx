import { Tabs } from "@/ui-library/components/tabs";
import { useState } from "react";
import { Text } from "@/ui-library/components/ssr/text/Text";
import type { Teacher } from "../domain/types";
import { useTranslations } from "@/i18n";
import { AvailabilityAndModalitiesManager } from "../availability_and_modalities/AvailabilityAndModalitiesManager";

export interface TeacherProfileProps {
    teacher: Teacher;
    accessToken: string;
}

export function TeacherProfile({ teacher, accessToken }: TeacherProfileProps) {
    const t = useTranslations();

    const tabs = [
        {
            key: "availability_and_modalities",
            label: t('teacher-profile.availability_and_modalities'),
            onClick: () => {
                console.log("information");
            },
        },
        // {
        //     key: "videos",
        //     label: "Videos",
        //     onClick: () => {
        //         console.log("videos");
        //     },
        // },
        // {
        //     key: "reviews",
        //     label: "Reviews",
        //     onClick: () => {
        //         console.log("reviews");
        //     },
        // },
    ];

    const [selectedTab, setSelectedTab] = useState("availability_and_modalities");

    const onTabChange = (key: string) => {
        setSelectedTab(key);
    };

    return (
        <div>
            <Tabs tabs={tabs} onChange={onTabChange} />
            
            {selectedTab === "availability_and_modalities" && (
                <AvailabilityAndModalitiesManager teacher={teacher} accessToken={accessToken} />
            )}
        </div>
    );
}