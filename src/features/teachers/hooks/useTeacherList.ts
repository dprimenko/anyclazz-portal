import { useCallback, useEffect, useMemo, useState } from "react";
import type { Teacher, TeacherRepository } from "../domain/types";
import { usePrevious } from "../../shared/hooks/usePrevious";
import { useTranslations } from "../../../i18n";

export interface TeachersPageProps {
    teacherRepository: TeacherRepository;
    accessToken: string;
}

export interface TeacherFilters {
    search?: string;
    countryISO2?: string;
    cityISO2?: string;
    classTypeId?: string;
    minPrice?: number;
    maxPrice?: number;
    subjectCategoryId?: string;
    subjectId?: string;
    speakLanguage?: string;
    studentLevelId?: string;
}

export const DEFAULT_PAGE_SIZE = 10;

export function useTeacherList({ teacherRepository, accessToken }: TeachersPageProps) {
    const t = useTranslations();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [alreadyFetched, setAlreadyFetched] = useState(false);
	const [fetchingTeachers, setFetchingTeachers] = useState(false);
    const [errorFetchingTeachers, setErrorFetchingTeachers] = useState<string | undefined>(undefined);

    const [filters, setFilters] = useState<TeacherFilters>({
        cityISO2: 'm', // Madrid por defecto
        countryISO2: 'es', // España por defecto
    });
    const [page, setPage] = useState(1);
    const previousPage = usePrevious(page);
	const [pages, setPages] = useState(1);
	const [totalTeachers, setTotalTeachers] = useState(0);

    const fetchTeachers = useCallback(async () => {
		if (alreadyFetched || fetchingTeachers) return;
		

		setAlreadyFetched(true);
		setFetchingTeachers(true);

		async function fetch() {
			const teachers = await teacherRepository.listTeachers({ 
				token: accessToken,
				page,
				size: DEFAULT_PAGE_SIZE,
				query: filters.search || undefined,
				countryISO2: filters.countryISO2,
				cityISO2: filters.cityISO2,
				classTypeId: filters.classTypeId,
				minPrice: filters.minPrice,
				maxPrice: filters.maxPrice,
				subjectCategoryId: filters.subjectCategoryId,
				subjectId: filters.subjectId,
				speakLanguage: filters.speakLanguage,
				studentLevelId: filters.studentLevelId,
			});
			setTeachers(teachers.teachers);
			setPages(teachers.meta.lastPage);
			setTotalTeachers(teachers.meta.total);
		}
    
		Promise.allSettled([
			fetch()
		]).then(() => {
		}).catch(() => {
			setErrorFetchingTeachers(t('teachers.error_fetching_teachers'));
		}).finally(() => {
			setFetchingTeachers(false);
			setAlreadyFetched(false);
		});
	}, [teachers, page, teacherRepository, filters]);

    const refreshTeachers = useCallback(() => {
		setTeachers([]);
		setAlreadyFetched(false); // Reset flag to allow fetching
		fetchTeachers();
	}, [fetchTeachers]);

	const noResults = useMemo(() => {
		return !fetchingTeachers && teachers.length === 0;
	}, [fetchingTeachers, teachers]);

	const updateFilters = useCallback((newFilters: Partial<TeacherFilters>) => {
		console.log('useTeacherList - updateFilters called with:', newFilters);
		setFilters(prev => {
			const updated = { ...prev, ...newFilters };
			console.log('useTeacherList - New filters state:', updated);
			return updated;
		});
		setPage(1); // Reset to page 1 when filters change
	}, []);

	const clearFilters = useCallback(() => {
		setFilters(prev => ({
			cityISO2: prev.cityISO2, // Mantener ciudad actual
			countryISO2: prev.countryISO2, // Mantener país actual
		}));
		setPage(1);
	}, []);

    useEffect(() => {
		if (!previousPage || previousPage === page) return;
		fetchTeachers();
	}, [previousPage, page]);

	useEffect(() => {
		console.log('useTeacherList - filters changed, calling refreshTeachers. New filters:', filters);
		refreshTeachers();
	}, [filters]);

    return {
		accessToken,
        teachers,
		totalTeachers,
		fetchingTeachers,
		errorFetchingTeachers,
		page,
		setPage,
		pages,
		refreshTeachers,
		filters,
		updateFilters,
		clearFilters,
		noResults,
    };
}