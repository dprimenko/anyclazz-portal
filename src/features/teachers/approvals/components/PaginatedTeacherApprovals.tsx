import { useEffect, useMemo, useState, useRef } from "react";
import { EmptyState } from "@/ui-library/components/ssr/empty-state/EmptyState";
import { useTranslations } from "@/i18n";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { PageSelector } from "@/ui-library/components/page-selector";
import type { ListTeacherApprovalsResponse, TeacherApprovalFilter, TeacherApproval } from "../domain/types";
import { TeacherApprovalsTable } from "./TeacherApprovalsTable";
import { ApiTeacherApprovalRepository } from "../infrastructure/ApiTeacherApprovalRepository";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { RadioGroup, RadioGroupItem } from "@/ui-library/shared/radio-group";
import { Label } from "@/ui-library/shared/label";

const ITEMS_PER_PAGE = 10;

export interface PaginatedTeacherApprovalsProps {
    initialData: ListTeacherApprovalsResponse;
    token: string;
}

export function PaginatedTeacherApprovals({initialData, token}: PaginatedTeacherApprovalsProps) {
    const t = useTranslations();

    // Crear repositorio en el cliente
    const repository = useMemo(() => new ApiTeacherApprovalRepository(), []);

    const [data, setData] = useState(initialData);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<TeacherApprovalFilter>('pending');
    const isFirstRender = useRef(true);

    const pages = data.meta.lastPage;

    const fetchTeacherApprovals = async (currentPage: number, query?: string, currentFilter?: TeacherApprovalFilter) => {
        setLoading(true);
        try {
            const result = await repository.listTeacherApprovals({
                token,
                page: currentPage,
                size: ITEMS_PER_PAGE,
                query: query || undefined,
                statuses: [currentFilter || filter],
            });
            setData(result);
        } catch (error) {
            console.error('Error fetching teacher approvals:', error);
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
            fetchTeacherApprovals(1, search || undefined);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Fetch cuando cambia la página
    useEffect(() => {
        if (isFirstRender.current) return;
        fetchTeacherApprovals(page, search || undefined);
    }, [page]);

    // Fetch cuando cambia el filtro
    useEffect(() => {
        if (isFirstRender.current) return;
        setPage(1);
        fetchTeacherApprovals(1, search || undefined, filter);
    }, [filter]);

    const handleApprove = async (teacher: TeacherApproval) => {
        try {
            await repository.approveTeacher({ token, teacherId: teacher.id });
            console.log('Teacher approved successfully');
            // Refrescar la lista actual
            await fetchTeacherApprovals(page, search || undefined);
        } catch (error: any) {
            console.error('Failed to approve teacher:', error);
            alert(error.message || 'Failed to approve teacher');
        }
    };

    const handleReject = async (teacher: TeacherApproval) => {
        try {
            await repository.rejectTeacher({ token, teacherId: teacher.id });
            console.log('Teacher rejected successfully');
            // Refrescar la lista actual
            await fetchTeacherApprovals(page, search || undefined);
        } catch (error: any) {
            console.error('Failed to reject teacher:', error);
            alert(error.message || 'Failed to reject teacher');
        }
    };

    const hasTeachers = data.teachers.length > 0;
    const showSearchBar = hasTeachers || search !== "";

    return (
        <div className="flex flex-col gap-6">
            {/* Filtros con Radio Buttons */}
            <div className="flex gap-6">
                <RadioGroup 
                    value={filter} 
                    onValueChange={(value) => setFilter(value as TeacherApprovalFilter)}
                    className="flex gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pending" id="pending" />
                        <Label htmlFor="pending" className="cursor-pointer">
                            {t('admin.show_pending')}
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rejected" id="rejected" />
                        <Label htmlFor="rejected" className="cursor-pointer">
                            {t('admin.show_rejected')}
                        </Label>
                    </div>
                </RadioGroup>
            </div>

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

            <TeacherApprovalsTable 
                teachers={data.teachers} 
                onApprove={handleApprove}
                onReject={handleReject}
                mode={filter}
                emptyState={
                    filter === 'pending' ? (
                        <EmptyState
                            title={t('admin.no_pending_teachers')}
                            description={t('admin.no_pending_teachers_description')}
                        />
                    ) : (
                        <EmptyState
                            title={t('admin.no_rejected_teachers')}
                            description={t('admin.no_rejected_teachers_description')}
                        />
                    )
                }
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
