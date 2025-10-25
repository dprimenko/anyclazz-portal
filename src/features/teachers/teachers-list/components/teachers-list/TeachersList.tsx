import { useMemo } from "react";
import { useTranslations } from "../../../../../i18n";
import styles from "./TeachersList.module.css";
import { useTeacherList } from "../../../hooks/useTeacherList";
import type { TeacherRepository } from "../../../domain/types";
import { TeacherItem } from "../teacher-item/TeacherItem";
import { Dropdown } from "../../../../../ui-library/components/form/dropdown/Dropdown";
import { PageSelector } from "@/ui-library/components/page-selector";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";

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
      {/* <div>
        <Dropdown fullWidth />
      </div> */}
      <div className={styles["teachers-list__content"]}>
          {teachers.map(teacher => (
            <TeacherItem key={teacher.id} teacher={teacher} />  
          ))}
      </div>
      <Space size={24} direction="vertical" />
      {pages > 1 && (
        <>
          <Divider />
          <Space size={20} direction="vertical" />
          <div className={styles["teachers-list__footer"]}>
            <PageSelector
              pages={pages}
              currentPage={page}
              maxPages={3}
              disabled={fetchingTeachers}
              onChangedPage={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}