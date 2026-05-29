import { useEffect, useMemo, useRef, useState } from 'react';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { useTranslations } from '@/i18n';
import type { ui } from '@/i18n/ui';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { Space } from '@/ui-library/components/ssr/space/Space';
import { PageSelector } from '@/ui-library/components/page-selector';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { TeacherDirectoryTable } from './components/TeacherDirectoryTable';
import { ApiAdminTeacherRepository } from './infrastructure/ApiAdminTeacherRepository';
import type { ListAdminTeachersResponse } from './domain/types';

const ITEMS_PER_PAGE = 20;

export interface PaginatedTeacherDirectoryProps {
    initialTeachers: ListAdminTeachersResponse;
    token: string;
    lang?: keyof typeof ui;
}

export function PaginatedTeacherDirectory({ initialTeachers, token, lang = 'en' }: PaginatedTeacherDirectoryProps) {
    const t = useTranslations({ lang });

    const repository = useMemo(() => new ApiAdminTeacherRepository(), []);

    const [teachers, setTeachers] = useState(initialTeachers);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const isFirstRender = useRef(true);

    const pages = teachers.meta.lastPage;

    const fetchTeachers = async (currentPage: number, query?: string) => {
        setLoading(true);
        try {
            const data = await repository.listTeachers({
                token,
                page: currentPage,
                size: ITEMS_PER_PAGE,
                query: query || undefined,
            });
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchTeachers(newPage, search || undefined);
    };

    return (
        <LanguageProvider lang={lang}>
            <div className="flex flex-col gap-6">
                <Text textLevel="h3" size="display-xs" colorType="primary" weight="semibold">
                    {t('teachers.list.title_global', { count: teachers.meta.total })}
                </Text>
                <div className="relative w-full max-w-xl">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('admin.teacher_directory.search_placeholder')}
                        className="w-full px-4 py-2.5 pl-10 border border-[var(--color-neutral-200)] rounded-lg focus:outline focus:outline-2 focus:outline-[var(--color-primary-700)]"
                    />
                    <Icon
                        icon="search"
                        iconWidth={20}
                        iconHeight={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                </div>

                <TeacherDirectoryTable teachers={teachers.teachers} loading={loading} token={token} />

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
                                onChangedPage={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </LanguageProvider>
    );
}
