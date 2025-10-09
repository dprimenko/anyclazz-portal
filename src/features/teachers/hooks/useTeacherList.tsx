import { useCallback, useEffect, useState } from "react";
import type { Teacher, TeacherRepository } from "../domain/types";
import { usePrevious } from "../../shared/hooks/usePrevious";
import { useTranslations } from "../../../i18n";

export interface TeachersPageProps {
    teacherRepository: TeacherRepository;
}

export const DEFAULT_PAGE_SIZE = 10;

export function useTeacherList({ teacherRepository }: TeachersPageProps) {
    const t = useTranslations();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
	const [alreadyFetched, setAlreadyFetched] = useState(false);
	const [fetchingTeachers, setFetchingTeachers] = useState(false);
    const [errorFetchingTeachers, setErrorFetchingTeachers] = useState<string | undefined>(undefined);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const previousPage = usePrevious(page);
	const [pages, setPages] = useState(1);

    const fetchTeachers = useCallback(async () => {
		if (alreadyFetched || fetchingTeachers) return;
		

		setAlreadyFetched(true);
		setFetchingTeachers(true);

		async function fetch() {
			const teachers = await teacherRepository.listTeachers({ 
				page,
				size: DEFAULT_PAGE_SIZE,
				query: search || undefined,
			});
			setTeachers(teachers.teachers);
			setPages(teachers.meta.lastPage);
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
	}, [teachers, page, teacherRepository, search]) ;

    const refreshTeachers = useCallback(() => {
		setTeachers([]);
		fetchTeachers();
	}, [page, search, teachers]);

    useEffect(() => {
		if (!previousPage || previousPage === page) return;
		fetchTeachers();
	}, [previousPage, page]);

	useEffect(() => {
		refreshTeachers();
	}, [search]);

    return {
        teachers,
		fetchingTeachers,
		errorFetchingTeachers,
		page,
		setPage,
		pages,
		refreshTeachers,
		search,
		setSearch,
    };
}