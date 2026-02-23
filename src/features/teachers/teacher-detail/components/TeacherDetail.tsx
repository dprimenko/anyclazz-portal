import { Tabs } from "@/ui-library/components/tabs";
import { useState } from "react";
import type { Teacher } from "../../domain/types";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { TeacherVideosDisplay } from "./TeacherVideosDisplay";
import styles from "./TeacherDetail.module.css";
import { PaginatedTeacherReviews } from "./PaginatedTeacherReviews";
import { ApiTeacherRepository } from "../../infrastructure/ApiTeacherRepository";

export interface TeacherDetailProps {
    teacher: Teacher;
    accessToken?: string;
}

export function TeacherDetail({ teacher, accessToken }: TeacherDetailProps) {
    const repository = new ApiTeacherRepository();
    
    const tabs = [
        {
            key: "information",
            label: "Information",
            onClick: () => {
                console.log("information");
            },
        },
        {
            key: "videos",
            label: "Videos",
            onClick: () => {
                console.log("videos");
            },
        },
        {
            key: "reviews",
            label: "Reviews",
            onClick: () => {
                console.log("reviews");
            },
        },
    ];

    const [selectedTab, setSelectedTab] = useState("information");

    const onTabChange = (key: string) => {
        setSelectedTab(key);
    };

    return (
        <div>
            <Tabs tabs={tabs} onChange={onTabChange} />
            
            {selectedTab === "information" && (
                <div className="mt-6">
                    {/* About Me Section */}
                    {teacher.about && (
                        <div className="mb-8">
                            <Text 
                                textLevel="h4" 
                                size="text-md" 
                                weight="semibold" 
                                colorType="primary"
                                className="mb-4"
                            >
                                About me
                            </Text>
                            <Text 
                                textLevel="div"
                                colorType="tertiary"
                            >
                                <div className={styles.proseContent} dangerouslySetInnerHTML={{ __html: teacher.about }}></div>
                            </Text>
                        </div>
                    )}

                    {/* Video Presentation Section */}
                    {teacher.videoPresentation && teacher.videoPresentationStatus === 'ready' && (
                        <div className="mb-8">
                            <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                                <video 
                                    controls 
                                    className="w-full h-full"
                                    src={teacher.videoPresentation}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    )}

                    {/* Academic Background Section */}
                    {teacher.academicBackground && (
                        <div className="mb-8">
                            <Text 
                                textLevel="h4" 
                                size="text-md" 
                                weight="semibold" 
                                colorType="primary"
                                className="mb-4"
                            >
                                Academic Background
                            </Text>
                            <Text 
                                textLevel="div"
                                colorType="tertiary"
                            >
                                <div className={styles.proseContent} dangerouslySetInnerHTML={{ __html: teacher.academicBackground }}></div>
                            </Text>
                        </div>
                    )}

                    {/* Certifications Section */}
                    {teacher.certifications && (
                        <div className="mb-8">
                            <Text 
                                textLevel="h4" 
                                size="text-md" 
                                weight="semibold" 
                                colorType="primary"
                                className="mb-4"
                            >
                                Certifications
                            </Text>
                            <Text 
                                textLevel="div"
                                colorType="tertiary"
                            >
                                <div className={styles.proseContent} dangerouslySetInnerHTML={{ __html: teacher.certifications }}></div>
                            </Text>
                        </div>
                    )}

                    {/* Skills & Specialties Section */}
                    {teacher.skills && (
                        <div className="mb-8">
                            <Text 
                                textLevel="h4" 
                                size="text-md" 
                                weight="semibold" 
                                colorType="primary"
                                className="mb-4"
                            >
                                Skills & Specialties
                            </Text>
                            <Text 
                                textLevel="div"
                                colorType="tertiary"
                            >
                                <div className={styles.proseContent} dangerouslySetInnerHTML={{ __html: teacher.skills }}></div>
                            </Text>
                        </div>
                    )}
                </div>
            )}

            {selectedTab === "videos" && (
                <div className="mt-6">
                    <TeacherVideosDisplay 
                        teacherId={teacher.id} 
                        accessToken={accessToken}
                    />
                </div>
            )}

            {selectedTab === "reviews" && (
                <div className="mt-6">
                    <PaginatedTeacherReviews teacherId={teacher.id} repository={repository} token={accessToken} />
                </div>
            )}
        </div>
    );
}