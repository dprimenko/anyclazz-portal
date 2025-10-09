import type { Teacher } from "../../../domain/types";
import { Text } from "../../../../../ui-library/components/ssr/text/Text";
import { TextWithIcon } from "../../../../../ui-library/components/ssr/text-with-icon/TextWithIcon.tsx";
import styles from "./TeachersItem.module.css";
import { useTranslations } from "../../../../../i18n";

export interface TeacherProps {
    teacher: Teacher;
}

export function TeacherItem({ teacher }: TeacherProps) {
    const t = useTranslations();

    return (
        <div className={styles["teacher-item__container"]}>
            <div>
                <div>
                    <img className={styles["teacher-item__avatar"]} src={teacher.avatar} alt={`${teacher.name} ${teacher.surname}`} />
                </div>
            </div>
            <div>
                <div>
                    <Text textLevel="h3" size="text-lg" weight="semibold" underline>{teacher.name} {teacher.surname}</Text>
                </div>
                <div className={styles["teacher-item__content-row"]}>
                    <Text color="tertiary" underline>{teacher.reviewsNumber} {t('common.reviews')}</Text>
                    <TextWithIcon icon="common/people" color="tertiary">{teacher.studentsNumber} {t('common.students')}</TextWithIcon>
                    <TextWithIcon icon="common/book" color="tertiary">{teacher.lessonsNumber} {t('common.lessons')}</TextWithIcon>
                </div>
            </div>
            <div></div>
            
        </div>
    );
}