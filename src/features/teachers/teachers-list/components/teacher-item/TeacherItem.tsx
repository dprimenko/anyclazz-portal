import type { Teacher } from "../../../domain/types";
import { Text } from "../../../../../ui-library/components/ssr/text/Text";
import { TextWithIcon } from "../../../../../ui-library/components/ssr/text-with-icon/TextWithIcon.tsx";
import styles from "./TeachersItem.module.css";
import { getLangFromUrl, useTranslations } from "../../../../../i18n";
import { Chip } from "../../../../../ui-library/components/ssr/chip/Chip.tsx";
import { Icon } from "../../../../../ui-library/components/ssr/icon/Icon.tsx";
import { Space } from "../../../../../ui-library/components/ssr/space/Space.tsx";
import { Button } from "../../../../../ui-library/components/ssr/button/Button.tsx";
import classNames from "classnames";
import { Modal } from "@/ui-library/components/modal/Modal.tsx";
import { BookingCreator } from "@/features/bookings/components/booking-creator/BookingCreator.tsx";
import { useIsMobile } from "@/ui-library/hooks/useIsMobile.ts";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar.tsx";
import { ClassTypes } from "../../../components/class-types/ClassTypes.tsx";
import { useState } from "react";

export interface TeacherProps {
    teacher: Teacher;
}

export function TeacherItem({ teacher }: TeacherProps) {
    const t = useTranslations();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const isMobile = useIsMobile();

    return (
        <div className={classNames('card', styles["teacher-item__container"])}>
            {!isMobile && (
                <div className={styles["teacher-item__avatar-container"]}>
                    <img className={styles["teacher-item__avatar"]} src={teacher.avatar} alt={`${teacher.name} ${teacher.surname}`} onError={e => e.currentTarget.style.display='none'}/>
                    {teacher.isSuperTeacher && (
                        <div className={styles["teacher-item__super-tutor-badge"]}>
                            <Icon icon="verified" iconWidth={32} iconHeight={32} />
                        </div>
                    )}
                </div>
            )}
            {isMobile && (
                <Avatar
                    src={`${teacher.avatar}`}
                    alt={`${teacher.name} ${teacher.surname}`}
                    hasVerifiedBadge={teacher.isSuperTeacher}
                    size={64}
                />
            )}
            <div className={styles["teacher-item__content"]}>
                <div className={styles["teacher-item__content-info"]}>
                    <div className={styles["teacher-item__content-row"]}>
                        <a href={`/teacher/${teacher.id}`} className="no-underline">
                            <Text textLevel="h3" size="text-lg" weight="semibold" colorType="primary" underline>{teacher.name} {teacher.surname}</Text>
                        </a>
                        {teacher.isSuperTeacher && (
                            <Chip colorType="primary" rounded>
                                <Icon icon="verified" iconWidth={16} iconHeight={16} />
                                <Text size="inherit" textLevel="span" weight="medium" colorType="accent">{t('teachers.super-tutor')}</Text>
                            </Chip>
                        )}
                    </div>
                    <Space size={10} direction="vertical"/>
                    <div className={styles["teacher-item__content-row"]}>
                        <TextWithIcon icon="star" textLevel="span" weight="medium" colorType="primary">{teacher.rating?.toFixed(1)??0}</TextWithIcon>
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
                <div className="flex flex-col">
                    <div className="flex flex-col-reverse gap-4 md:flex-col">
                        <div className="flex flex-row gap-3 w-full">
                            <Button colorType="secondary" size="lg" icon="heart-outline" />
                            <Button colorType="secondary" size="lg" icon="chat" />
                            <Button colorType="primary" size="lg" label={t('teachers.book-lesson')} fullWidth onClick={() => setIsBookingModalOpen(true)} />
                        </div>
                        <ClassTypes classTypes={teacher.classTypes} />
                    </div>
                </div>
            </div>
            {isBookingModalOpen && (
                <Modal width={700} height={700}>
                    <BookingCreator teacher={teacher} onClose={() => setIsBookingModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}