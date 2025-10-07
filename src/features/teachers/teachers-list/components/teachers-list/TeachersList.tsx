import { Text } from "@anyclazz/ui";
import { StyledList, TeachersListContainer } from "./styles";
import { useMemo } from "react";
import { useTranslations } from "../../../../../i18n";

export function TeachersList() {
  const t = useTranslations();

  const countTeachers = useMemo(() => {
    return 232;
  }, []);

  const teachersLocation = useMemo(() => {
    return "Madrid";
  }, []);

  return (
    <TeachersListContainer>
        <Text>{t('teachers.list.title', {count: countTeachers, location: teachersLocation})}</Text>
        <StyledList>
            Teachers List Component
        </StyledList>
    </TeachersListContainer>
  );
}