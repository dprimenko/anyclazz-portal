import { useMemo } from "react";
import { useTranslations } from "../../../../../i18n";
import { Text } from "../../../../../ui-library/components/text/Text";

export function TeachersList() {
  const t = useTranslations();

  const countTeachers = useMemo(() => {
    return 232;
  }, []);

  const teachersLocation = useMemo(() => {
    return "Madrid";
  }, []);

  return (
    <div>
      <Text size="display-xs" color="primary">{t('teachers.list.title', {count: countTeachers, location: teachersLocation})}</Text>
      <div>
          Teachers List Component
      </div>
    </div>
  );
}