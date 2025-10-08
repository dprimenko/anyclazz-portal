import { useMemo } from "react";
import { useTranslations } from "../../../../../i18n";
import styles from "./TeachersList.module.css";
import { useTeacherList } from "../../../hooks/useTeacherList";
import type { TeacherRepository } from "../../../domain/types";

export interface TeachersListProps {
  teacherRepository: TeacherRepository;
}

export function TeachersList({ teacherRepository }: TeachersListProps) {
  const t = useTranslations();

  const { 
		teachers, 
		fetchingTeachers, 
		page,
		setPage,
		pages,
		search,
		setSearch,
	} = useTeacherList({ teacherRepository });

  const countTeachers = useMemo(() => {
    return 232;
  }, []);

  const teachersLocation = useMemo(() => {
    return "Madrid";
  }, []);

  return (
    <div className={styles["teachers-list__container"]}>
      <div className={styles["teachers-list__content"]}>
          {teachers.map(teacher => (
            <div key={teacher.id}>
              {teacher.name} {teacher.surname}
            </div>
          ))}
      </div>
    </div>
  );
}