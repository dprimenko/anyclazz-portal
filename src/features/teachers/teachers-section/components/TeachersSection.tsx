import { useMemo } from "react";
import { useTranslations } from "../../../../i18n";
import { Text } from "../../../../ui-library/components/ssr/text/Text";
import styles from "./TeachersSection.module.css";
import { Divider } from "../../../../ui-library/components/ssr/divider/Divider";
import { Space } from "../../../../ui-library/components/ssr/space/Space";
import { TeachersList } from "../../teachers-list/components/teachers-list/TeachersList";
import { ApiTeacherRepository } from "../../infrastructure/ApiTeacherRepository";
import { TeachersProvider, useTeachers } from "../../providers/TeachersProvider";

const teacherRepository = new ApiTeacherRepository();

export interface TeachersSectionProps {
  accessToken: string;
}

export function TeachersSection({ accessToken }: TeachersSectionProps) {
  return (
    <TeachersProvider teacherRepository={teacherRepository} accessToken={accessToken}>
      <TeachersSectionContent />
    </TeachersProvider>
  );
}

function TeachersSectionContent() {
  const t = useTranslations();
  const { totalTeachers } = useTeachers();

  const countTeachers = useMemo(() => {
    return totalTeachers || 0;
  }, [totalTeachers]);

  const teachersLocation = useMemo(() => {
    return "Madrid";
  }, []);

  return (
    <div className={styles["teachers-section__container"]}>
      <Text textLevel="h3" size="display-xs" colorType="primary" weight="semibold">{t('teachers.list.title', {count: countTeachers, location: teachersLocation})}</Text>
      <Text textLevel="h4" colorType="tertiary">{t('teachers.list.subtitle')}</Text>
      <Divider margin={16} />
      <Space size={16} direction="vertical" />
      <TeachersList />
    </div>
  );
}