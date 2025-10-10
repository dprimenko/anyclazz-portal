import type { ClassType, Teacher } from "../../../domain/types";
import { Text } from "../../../../../ui-library/components/ssr/text/Text";
import { TextWithIcon } from "../../../../../ui-library/components/ssr/text-with-icon/TextWithIcon.tsx";
import styles from "./TeachersItem.module.css";
import { getLangFromUrl, useTranslations } from "../../../../../i18n";
import { Chip } from "../../../../../ui-library/components/ssr/chip/Chip.tsx";
import { Icon } from "../../../../../ui-library/components/ssr/icon/Icon.tsx";
import { Space } from "../../../../../ui-library/components/ssr/space/Space.tsx";
import { Button } from "../../../../../ui-library/components/ssr/button/Button.tsx";
import classNames from "classnames";
import { Divider } from "../../../../../ui-library/components/ssr/divider/Divider.tsx";
import { Fragment } from "react";

export interface TeacherProps {
    teacher: Teacher;
}

export function TeacherItem({ teacher }: TeacherProps) {
    const t = useTranslations();

    const classTypeIcon = (type: ClassType) => {
        switch (type) {
            case 'online_single':
                return 'laptop';
            case 'online_group':
                return 'laptop';
            case 'onsite_single':
                return 'home';
            case 'onsite_group':
                return 'group';
            default:
                return 'laptop';
        }
    };

    const classTypeName = (type: ClassType) => {
        switch (type) {
            case 'online_single':
                return 'laptop';
            case 'online_group':
                return 'laptop';
            case 'onsite_single':
                return 'home';
            case 'onsite_group':
                return 'group';
            default:
                return 'laptop';
        }
    };

    return (
        <div className={classNames('card', styles["teacher-item__container"])}>
            <div>
                <div className={styles["teacher-item__avatar-container"]}>
                    <img className={styles["teacher-item__avatar"]} src={teacher.avatar} alt={`${teacher.name} ${teacher.surname}`} />
                    <div className={styles["teacher-item__super-tutor-badge"]}>
                        <Icon icon="verified" iconWidth={32} iconHeight={32} />
                    </div>
                </div>
            </div>
            <div className={styles["teacher-item__content"]}>
                <div className={styles["teacher-item__content-info"]}>
                    <div className={styles["teacher-item__content-row"]}>
                        <Text textLevel="h3" size="text-lg" weight="semibold" underline>{teacher.name} {teacher.surname}</Text>
                        <Chip colorType="primary" rounded>
                            <Icon icon="verified" iconWidth={16} iconHeight={16} />
                            <Text size="text-xs" textLevel="span" weight="medium" colorType="accent">{t('teachers.super-tutor')}</Text>
                        </Chip>
                    </div>
                    <Space size={10} direction="vertical"/>
                    <div className={styles["teacher-item__content-row"]}>
                        <Text colorType="tertiary" textLevel="span" underline>{teacher.reviewsNumber} {t('common.reviews')}</Text>
                        <TextWithIcon icon="people" textLevel="span" colorType="tertiary">{teacher.studentsNumber} {t('common.students')}</TextWithIcon>
                        <TextWithIcon icon="book" textLevel="span" colorType="tertiary">{teacher.lessonsNumber} {t('common.lessons')}</TextWithIcon>
                    </div>
                    <Space size={16} direction="vertical"/>
                    <div className={styles["teacher-item__content-row"]}>
                        <Text className={styles["teacher-item__content-presentation"]} colorType="secondary" size="text-sm">{teacher.shortPresentation}</Text>
                    </div>
                    <Space size={16} direction="vertical"/>
                    <div className={styles["teacher-item__content-row"]}>
                        {teacher.subjects.map((subject) => (
                            <Chip key={subject.id} colorType="secondary">
                                <Text colorType="secondary" textLevel="span" size="text-xs" weight="medium">{subject.name[getLangFromUrl(new URL(window.location.href))]}</Text>
                            </Chip>
                        ))}
                    </div>
                    <Space size={16} direction="vertical"/>
                    <div className={styles["teacher-item__content-row"]}>
                        <Text colorType="tertiary" size="text-sm">
                            {t('teachers.speaks')}{' '}
                            {teacher.speaksLanguages.map((language) => (
                                `${t(`common.language.${language.language}`)} (${t(`common.language.level.${language.proficiencyLevel}`)})`
                            )).join(', ')}
                        </Text>
                    </div>
                </div>
                <div className={styles["teacher-item__actions"]}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-3">
                            <Button colorType="secondary" icon="heart-outline" />
                            <Button colorType="secondary" icon="chat" />
                            <Button colorType="primary" label={t('teachers.book-lesson')} />
                        </div>
                        <div className="flex flex-column">
                            <div className={classNames('flex flex-col w-full card p-3 rounded-lg gap-[0.625rem]',styles["teacher-item__class-types"])}>
                                <Text colorType="primary" size="text-sm" weight="semibold">{t('teachers.class-types-pricing')}</Text>
                                {teacher.classTypes.map((classType, index) => (
                                    <Fragment key={classType.type}>
                                        <div className="flex flex-row gap-1.5">
                                            <Icon icon={classTypeIcon(classType.type)} />
                                            <Text className="flex-1" textLevel="span" colorType="primary" size="text-sm">{t(`classtype.${classType.type}`)}</Text>
                                            <div className="flex flex-row gap-0.5 items-baseline">
                                                <Text colorType="primary" textLevel="span" size="text-sm" weight="semibold">{classType.price?.amount}</Text>
                                                <Text colorType="primary" textLevel="span" size="text-xs">{classType.price?.currency.toUpperCase()}</Text>
                                            </div>
                                        </div>
                                        {teacher.classTypes.length > 1 && index < teacher.classTypes.length - 1 && <Divider dotted />}
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}