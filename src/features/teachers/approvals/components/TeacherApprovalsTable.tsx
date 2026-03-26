import { useTranslations } from '@/i18n';
import type { TeacherApproval, TeacherApprovalFilter } from '../domain/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Text } from "@/ui-library/components/ssr/text/Text";
import type React from "react";
import { ProgressIndicator } from "@/ui-library/components/progress-indicator";
import { TeacherApprovalItem } from './TeacherApprovalItem';
import { TeacherApprovalItemCard } from './TeacherApprovalItemCard';

interface TeacherApprovalsTableProps {
    teachers: TeacherApproval[];
    onApprove: (teacher: TeacherApproval) => void;
    onReject: (teacher: TeacherApproval) => void;
    mode: TeacherApprovalFilter;
    emptyState?: React.ReactNode;
    loading?: boolean;
    isLoading?: boolean;
}

export function TeacherApprovalsTable({
    teachers,
    onApprove,
    onReject,
    emptyState,
    mode,
    loading = false,
    isLoading = false,
}: TeacherApprovalsTableProps) {
    const t = useTranslations();
    const actionLoading = loading || isLoading;

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
                                    <TeacherApprovalItemCard
                                        teacher={teacher} 
                                        onApprove={onApprove}
                                        onReject={onReject}
                                        isLoading={actionLoading}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Desktop Table - solo visible en desktop */}
                    <div className="hidden md:block w-full">
                        <div className="grid grid-cols-[3fr_2fr_1fr_1.5fr_2fr] gap-4 py-3 border-b border-[var(--color-neutral-200)]">
                            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.teacher')}</Text>
                            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.registered_at')}</Text>
                            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.location')}</Text>
                            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.teaches')}</Text>
                            <div></div>
                        </div>
                        {teachers.map((teacher) => (
                            <div key={teacher.id} className="border-b border-[var(--color-neutral-200)] last:border-b-0">
                                <TeacherApprovalItem 
                                    teacher={teacher} 
                                    onApprove={onApprove}
                                    onReject={onReject}
                                    mode={mode}
                                    isLoading={actionLoading}
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
        </>
    );
}
