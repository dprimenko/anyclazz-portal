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
			console.log("FETCHING");
			console.log(teacherRepository.listTeachers);
			const teachers = await teacherRepository.listTeachers({ 
				page,
				size: DEFAULT_PAGE_SIZE,
				query: search || undefined,
			});
			console.log(teachers);
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

    // useEffect(() => {
	// 	console.log("INIT");
	// 	if (!previousPage || previousPage === page) return;
	// 	console.log("INIT inside");
	// 	fetchTeachers();
	// }, [previousPage, page]);

	// useEffect(() => {
	// 	refreshTeachers();
	// }, [search]);

	useEffect(() => {
		console.log("INIT");
		refreshTeachers();
	}, []);

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