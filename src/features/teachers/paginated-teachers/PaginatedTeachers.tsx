import { useEffect, useMemo, useState, useRef } from "react";
import { EmptyState } from "@/ui-library/components/ssr/empty-state/EmptyState";
import { useTranslations } from "@/i18n";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import type { ui } from "@/i18n/ui";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { PageSelector } from "@/ui-library/components/page-selector";
import type { ListTeachersResponse } from "../domain/types";
import { TeachersTable } from "../components/teachers-table/TeachersTable";
import { ApiTeacherRepository } from "../infrastructure/ApiTeacherRepository";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";

const ITEMS_PER_PAGE = 10;

export interface PaginatedTeachersProps {
    initialTeachers: ListTeachersResponse;
    token: string;
    mode?: 'all' | 'saved';
    lang?: keyof typeof ui;
}

export function PaginatedTeachers({initialTeachers, token, mode = 'all', lang = 'en'}: PaginatedTeachersProps) {
    const t = useTranslations({ lang });

    // Crear repositorio en el cliente
    const repository = useMemo(() => new ApiTeacherRepository(), []);

    const [teachers, setTeachers] = useState(initialTeachers);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const isFirstRender = useRef(true);

    const pages = teachers.meta.lastPage;

    const fetchTeachers = async (currentPage: number, query?: string) => {
        setLoading(true);
        try {
            const data = mode === 'saved' 
                ? await repository.listSavedTeachers({
                    token,
                    page: currentPage,
                    size: ITEMS_PER_PAGE,
                    query: query || undefined
                })
                : await repository.listTeachers({
                    token,
                    page: currentPage,
                    size: ITEMS_PER_PAGE,
                    query: query || undefined
                });
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce para búsqueda automática
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            setPage(1);
            fetchTeachers(1, search || undefined);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Fetch cuando cambia la página
    useEffect(() => {
        if (isFirstRender.current) return;
        fetchTeachers(page, search || undefined);
    }, [page]);

    const hasTeachers = teachers.teachers.length > 0;
    const showSearchBar = hasTeachers || search !== "";

    return (
        <LanguageProvider lang={lang}>
        <div className="flex flex-col gap-6">
            {/* Search bar - solo mostrar si hay teachers o hay búsqueda activa */}
            {showSearchBar && (
                <div className="relative w-full max-w-xl">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('common.search')}
                        className="w-full px-4 py-2.5 pl-10 border border-[var(--color-neutral-200)] rounded-lg focus:outline focus:outline-2 focus:outline-[var(--color-primary-700)]"
                    />
                    <Icon 
                        icon="search" 
                        iconWidth={20} 
                        iconHeight={20} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" 
                    />
                </div>
            )}

            <TeachersTable 
                teachers={teachers.teachers} 
                repository={repository}
                token={token}
                mode={mode}
                emptyState={mode === 'saved' ? (
                    <EmptyState
                        title={t('dashboard.no_saved_teachers')}
                        description={t('dashboard.no_saved_teachers_description')}
                        buttonLabel={t('dashboard.explore_teachers')}
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
        </LanguageProvider>
    );
}