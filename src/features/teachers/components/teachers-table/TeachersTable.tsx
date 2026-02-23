import { useTranslations } from "@/i18n";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Text } from "@/ui-library/components/ssr/text/Text";
import type React from "react";
import { ProgressIndicator } from "@/ui-library/components/progress-indicator";
import { useState } from "react";
import type { Teacher, TeacherRepository } from "../../domain/types";
import { TeacherItem } from "../teacher-item/TeacherItem";
import { TeacherItemCard } from "../teacher-item/TeacherItemCard";
import { Modal } from "@/ui-library/components/modal";
import { BookingCreator } from "@/features/bookings/components/booking-creator/BookingCreator";
import { TeachersProvider } from "../../providers/TeachersProvider";

export interface TeachersTableProps {
    teachers: Teacher[];
    repository: TeacherRepository;
    token?: string;
    emptyState?: React.ReactNode;
    loading?: boolean;
}

export function TeachersTable({teachers, repository, token, emptyState, loading = false} : TeachersTableProps) {
    const t = useTranslations();

    const [teacherToBook, setTeacherToBook] = useState<Teacher | null>(null);
    
    return (
        <>
            {teachers.length > 0 && (
                <>
                    {/* Mobile Swiper - solo visible en móvil */}
                    <div className="md:hidden -mx-6 px-6">
                        <Swiper
                            slidesPerView="auto"
                            spaceBetween={12}
                            className="!overflow-visible"
                        >
                            {teachers.map((teacher) => (
                                <SwiperSlide key={teacher.id} className="!w-auto">
                                    <TeacherItemCard
                                        teacher={teacher} 
                                        onBook={() => setTeacherToBook(teacher)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Desktop Table - solo visible en desktop */}
                    <div className="hidden md:block w-full">
                        <div className="grid grid-cols-[2fr_2fr_2fr_1.5fr] gap-4 py-3 border-b border-[var(--color-neutral-200)]">
                            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.teacher')}</Text>
                            <Text size="text-xs" colorType="tertiary" weight="semibold">Rate</Text>
                            <Text size="text-xs" colorType="tertiary" weight="semibold">Subject</Text>
                            <div></div>
                        </div>
                        {teachers.map((teacher) => (
                            <div key={teacher.id}  className="border-b border-[var(--color-neutral-200)] last:border-b-0">
                                <TeacherItem 
                                    teacher={teacher} 
                                    onBook={() => setTeacherToBook(teacher)}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {teachers.length === 0 && !loading && (
                emptyState
            )}

            {loading && (
                <div className="w-full flex items-center justify-center py-10">
                    <ProgressIndicator size="lg" />
                </div>
            )}

            {teacherToBook && (
                <Modal width={700} height={700}>
                    <TeachersProvider teacherRepository={repository} accessToken={token}>
                        <BookingCreator teacher={teacherToBook} onClose={() => setTeacherToBook(null)} />
                    </TeachersProvider>
                </Modal>
            )}
        </>
    );
}