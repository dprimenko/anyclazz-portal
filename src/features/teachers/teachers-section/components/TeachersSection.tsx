import { useEffect, useMemo } from "react";
import { useTranslations } from "../../../../i18n";
import { Text } from "../../../../ui-library/components/ssr/text/Text";
import styles from "./TeachersSection.module.css";
import { Divider } from "../../../../ui-library/components/ssr/divider/Divider";
import { Space } from "../../../../ui-library/components/ssr/space/Space";
import { TeachersList } from "../../teachers-list/components/teachers-list/TeachersList";
import { MockTeacherRepository } from "../../infrastructure/MockTeacherRepository";

const teacherRepository = new MockTeacherRepository();

export function TeachersSection() {
  const t = useTranslations();

  const countTeachers = useMemo(() => {
    return 232;
  }, []);

  const teachersLocation = useMemo(() => {
    return "Madrid";
  }, []);

  return (
    <div className={styles["teachers-section__container"]}>
      <Text size="display-xs" colorType="primary" weight="semibold">{t('teachers.list.title', {count: countTeachers, location: teachersLocation})}</Text>
      <Text colorType="tertiary">{t('teachers.list.subtitle')}</Text>
      <Divider margin={16} />
      <Space size={16} direction="vertical" />
      <TeachersList teacherRepository={teacherRepository} />
    </div>
  );
}