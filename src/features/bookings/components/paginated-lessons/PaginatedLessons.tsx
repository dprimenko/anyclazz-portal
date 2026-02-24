import { useState, useEffect, useMemo } from "react";
import type { GetBookingsResponse } from "../../domain/types";
import type { AuthUser } from "@/features/auth/domain/types";
import { LessonsTable } from "../lessons-table/LessonsTable";
import { EmptyState } from "@/ui-library/components/ssr/empty-state/EmptyState";
import { useTranslations } from "@/i18n";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { PageSelector } from "@/ui-library/components/page-selector";
import { AnyclazzMyBookingsRepository } from "../../infrastructure/AnyclazzMyBookingsRepository";

const ITEMS_PER_PAGE = 10;

export interface PaginatedLessonsProps {
    initialLessons: GetBookingsResponse;
    user: AuthUser | null;
    token: string;
    lang?: string;
}   

export function PaginatedLessons({initialLessons, user, token, lang}: PaginatedLessonsProps) {
    const t = useTranslations({ lang: lang as 'en' | 'es' | undefined });
    
    // Crear repositorio en el cliente
    const repository = useMemo(() => new AnyclazzMyBookingsRepository(), []);

    const [lessons, setLessons] = useState(initialLessons);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const pages = lessons.meta.lastPage;

    const fetchLessons = async () => {
        setLoading(true);
        try {
            const data = await repository.getBookings({
                filter: 'upcoming',
                sort: 'desc',
                token,
                page,
                size: ITEMS_PER_PAGE
            });
            setLessons(data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (page === 1) return; // Ya tenemos los datos iniciales para la página 1
        fetchLessons();
    }, [page, token]);

    return (
        <div className="flex flex-col gap-6 md:px-6">
            <LessonsTable 
                lessons={lessons.bookings} 
                user={user}
                token={token}
                onLessonCancelled={fetchLessons}
                lang={lang}
                emptyState={user?.role === 'student' ? (
                    <EmptyState
                        title={t('dashboard.no_upcoming_lessons')}
                        description={t('dashboard.no_upcoming_lessons_description')}
                        buttonLabel={t('dashboard.find_teacher')}
                        buttonIcon="search"
                        onClickAction={() => window.location.href = '/teachers'}
                        buttonColorType="primary"
                    />
                ) : (
                    <EmptyState
                        title={t('dashboard.no_upcoming_lessons.teacher')}
                        description={t('dashboard.no_upcoming_lessons_description.teacher')}
                    />
                )}
                loading={loading}
            />
            {pages > 1 && (
                <>
                    <Divider />
                    <Space size={20} direction="vertical" />
                    <div>
                        <PageSelector
                            pages={pages}
                            currentPage={page}
                            maxPages={3}
                            disabled={loading}
                            onChangedPage={setPage}
                        />
                    </div>
                </>
            )}
        </div>
    );
}