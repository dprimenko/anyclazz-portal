import type { Teacher } from "../../../domain/types";
import { Text } from "../../../../../ui-library/components/ssr/text/Text";
import { TextWithIcon } from "../../../../../ui-library/components/ssr/text-with-icon/TextWithIcon.tsx";
import styles from "./TeachersItem.module.css";
import { useTranslations } from "../../../../../i18n";
import { Chip } from "../../../../../ui-library/components/ssr/chip/Chip.tsx";
import { Icon } from "../../../../../ui-library/components/ssr/icon/Icon.tsx";
import { Space } from "../../../../../ui-library/components/ssr/space/Space.tsx";

export interface TeacherProps {
    teacher: Teacher;
}

export function TeacherItem({ teacher }: TeacherProps) {
    const t = useTranslations();

    return (
        <div className={styles["teacher-item__container"]}>
            <div>
                <div className="relative">
                    <img className={styles["teacher-item__avatar"]} src={teacher.avatar} alt={`${teacher.name} ${teacher.surname}`} />
                    <div className={styles["teacher-item__super-tutor-badge"]}>
                        <Icon icon="common/verified" iconWidth={32} iconHeight={32} />
                    </div>
                </div>
            </div>
            <div className={styles["teacher-item__content"]}>
                <div className={styles["teacher-item__content-info"]}>
                    <div className={styles["teacher-item__content-row"]}>
                        <Text textLevel="h3" size="text-lg" weight="semibold" underline>{teacher.name} {teacher.surname}</Text>
                        <Chip colorType="primary">
                            <Icon icon="common/verified" iconWidth={16} iconHeight={16} />
                            <Text size="text-xs" weight="medium" color="#F4A43A">{t('teachers.super-tutor')}</Text>
                        </Chip>
                    </div>
                    <Space size={10} direction="vertical"/>
                    <div className={styles["teacher-item__content-row"]}>
                        <Text colorType="tertiary" underline>{teacher.reviewsNumber} {t('common.reviews')}</Text>
                        <TextWithIcon icon="common/people" colorType="tertiary">{teacher.studentsNumber} {t('common.students')}</TextWithIcon>
                        <TextWithIcon icon="common/book" colorType="tertiary">{teacher.lessonsNumber} {t('common.lessons')}</TextWithIcon>
                    </div>
                    <Space size={16} direction="vertical"/>
                    <div className={styles["teacher-item__content-row"]}>
                        <Text colorType="tertiary" size="text-sm">{teacher.shortPresentation}</Text>
                    </div>
                </div>
                <div className={styles["teacher-item__actions"]}>
                    <div className={styles["teacher-item__class-types"]}>
                        <Text colorType="tertiary">Clases</Text>
                    </div>
                </div>
            </div>
        </div>
    );
}