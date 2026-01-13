import { useTranslations } from "../../../../../i18n";
import styles from "./TeachersList.module.css";
import { useTeachers } from "../../../providers/TeachersProvider";
import { TeacherItem } from "../teacher-item/TeacherItem";
import { PageSelector } from "@/ui-library/components/page-selector";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { TeachersFilters } from "../../../teachers-section/components/TeachersFilters";

export function TeachersList() {
  const t = useTranslations();
  const { 
    teachers,
    fetchingTeachers, 
    page,
    setPage,
    pages,
    noResults,
    updateFilters,
    clearFilters,
  } = useTeachers();

  return (
    <div className={styles["teachers-list__container"]}>
      {/* Filters */}
      <TeachersFilters 
        onFiltersChange={updateFilters}
        onClear={clearFilters}
      />
      
      <Space size={24} direction="vertical" />
      
      <div className={styles["teachers-list__content"]}>
          <>
            {noResults && (
              <div className="flex flex-col items-center justify-center self-center md:w-[45ch]">
                <Text colorType="primary" size="text-md" weight="semibold">{t("common.no_results")}</Text>
                <Space size={4} direction="vertical" />
                <Text colorType="tertiary" size="text-sm" textalign="center">{t("teachers.no_results")}</Text>
                <Space size={24} direction="vertical" />
                <Button colorType="primary" label={t("common.reset_filters")} onClick={clearFilters} />
              </div>
            )}
            {teachers.map(teacher => (
              <TeacherItem key={teacher.id} teacher={teacher} />  
            ))}
          </>
      </div>
      <Space size={24} direction="vertical" />
      {pages > 0 && (
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