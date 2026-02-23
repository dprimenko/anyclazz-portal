import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/ui-library/components/ssr/empty-state/EmptyState";
import { useTranslations } from "@/i18n";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { PageSelector } from "@/ui-library/components/page-selector";
import type { ListTeachersResponse } from "../domain/types";
import { TeachersTable } from "../components/teachers-table/TeachersTable";
import { ApiTeacherRepository } from "../infrastructure/ApiTeacherRepository";

const ITEMS_PER_PAGE = 10;

export interface PaginatedTeachersProps {
    initialTeachers: ListTeachersResponse;
    token: string;
}   

export function PaginatedTeachers({initialTeachers, token}: PaginatedTeachersProps) {
    const t = useTranslations();

    // Crear repositorio en el cliente
    const repository = useMemo(() => new ApiTeacherRepository(), []);

    const [teachers, setTeachers] = useState(initialTeachers);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const pages = teachers.meta.lastPage;

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const data = await repository.listTeachers({
                token,
                page,
                size: ITEMS_PER_PAGE
            });
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (page === 1) return; // Ya tenemos los datos iniciales para la página 1
        fetchTeachers();
    }, [page, token]);

    return (
        <div className="flex flex-col gap-6">
            <TeachersTable 
                teachers={teachers.teachers} 
                repository={repository}
                token={token}
                emptyState={(
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