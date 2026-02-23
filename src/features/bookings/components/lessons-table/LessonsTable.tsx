import { useTranslations } from "@/i18n";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import type { AuthUser } from "@/features/auth/domain/types";
import type { BookingWithTeacher } from "../../domain/types";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { LessonItem } from "../lesson-item/LessonItem";
import { LessonItemCard } from "../lesson-item/LessonItemCard";
import type React from "react";
import { ProgressIndicator } from "@/ui-library/components/progress-indicator";
import { useMemo } from "react";
import { AnyclazzMyBookingsRepository } from "../../infrastructure/AnyclazzMyBookingsRepository";

export interface LessonsTableProps {
    lessons: BookingWithTeacher[];
    user: AuthUser | null;
    token?: string;
    emptyState?: React.ReactNode;
    loading?: boolean;
    onLessonCancelled?: () => void;
}

export function LessonsTable({lessons, user, token, emptyState, loading = false, onLessonCancelled} : LessonsTableProps) {
    const t = useTranslations();
    
    // Crear repositorio en el cliente
    const repository = useMemo(() => new AnyclazzMyBookingsRepository(), []);
    
    return (
        <>
            {lessons.length > 0 && (
                <>
                    {/* Mobile Swiper - solo visible en móvil */}
                    <div className="md:hidden -mx-6 px-6">
                        <Swiper
                            slidesPerView="auto"
                            spaceBetween={12}
                            className="!overflow-visible"
                        >
                            {lessons.map((lesson) => (
                                <SwiperSlide key={lesson.id} className="!w-auto">
                                    <LessonItemCard 
                                        lesson={lesson} 
                                        user={user}
                                        repository={repository}
                                        token={token}
                                        onLessonCancelled={onLessonCancelled}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Desktop Table - solo visible en desktop */}
                    <div className="hidden md:block w-full">
                        <div className="grid grid-cols-[2fr_2fr_1.5fr_1.5fr_1fr_1.5fr] gap-4 py-3 border-b border-[var(--color-neutral-200)]">
                            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.teacher')}</Text>
                            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.date')}</Text>
                            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.duration')}</Text>
                            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.price')}</Text>
                            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.lesson_type')}</Text>
                            <div></div>
                        </div>
                        {lessons.map((lesson) => (
                            <div className="border-b border-[var(--color-neutral-200)] last:border-b-0">
                                <LessonItem 
                                    key={lesson.id} 
                                    lesson={lesson} 
                                    user={user} 
                                    repository={repository}
                                    token={token}
                                    onLessonCancelled={onLessonCancelled}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {lessons.length === 0 && !loading && (
                emptyState
            )}

            {loading && (
                <div className="w-full flex items-center justify-center py-10">
                    <ProgressIndicator size="lg" />
                </div>
            )}
        </>
    );
}