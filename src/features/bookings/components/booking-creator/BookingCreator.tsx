import classNames from "classnames";
import styles from "./BookingCreator.module.css";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { useTranslations } from "@/i18n";
import { Space } from "@/ui-library/components/ssr/space/Space";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { Chip } from "@/ui-library/components/ssr/chip/Chip";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import type { Teacher, TeacherClassType } from "@/features/teachers/domain/types";
import { TextWithIcon } from "@/ui-library/components/ssr/text-with-icon/TextWithIcon";
import { useCallback, useMemo, useState } from "react";
import { RectangleSelectionGroup } from "@/ui-library/components/form/rectangle-selection-group/RectangleSelectionGroup";
import { getClassTypeIcon } from "@/features/teachers/utils/classTypeIcon";
import { Button } from "@/ui-library/components/ssr/button/Button";

export function BookingCreator({teacher}: {teacher: Teacher}) {
    const [selectedClass, setSelectedClass] = useState<TeacherClassType>(teacher.classTypes[0]);
    const [selectedDuration, setSelectedDuration] = useState<number>(selectedClass.durations[0]);

    const t = useTranslations();
    const classes = classNames(styles["booking-creator__container"]);
    const leftSideClasses = classNames("w-full h-full p-6 flex flex-col", styles["booking-creator__left-side"]);
    const rightSideClasses = classNames("w-full relative p-6", styles["booking-creator__right-side"]);
    const rightSideContentClasses = classNames("flex flex-col w-full overflow-y-auto", styles["booking-creator__right-side-content"]);
    const actionsClasses = classNames("absolute bottom-0 left-0 right-0 flex flex-row w-full justify-between p-6", styles["booking-creator__actions"]);

    const classOptionChildren = (classType: TeacherClassType) => (
        <div className="flex flex-row gap-1.5 w-full items-center">
            <Icon icon={getClassTypeIcon(classType.type)} />
            <Text className="flex-1" textLevel="span" colorType="primary" size="text-sm">{t(`classtype.${classType.type}`)}</Text>
            <div className="flex flex-row gap-0.5 items-baseline">
                <Text colorType="primary" textLevel="span" size="text-sm" weight="semibold">{classType.price?.amount}</Text>
                <Text colorType="primary" textLevel="span" size="text-xs">{classType.price?.currency.toUpperCase()}</Text>
            </div>
        </div>
    );

    const classOptions = useMemo(() => teacher.classTypes.map((classType) => ({
        id: classType.type,
        children: classOptionChildren(classType),
    })), [teacher]);

    const classDurations = useMemo(() => selectedClass.durations.map((duration) => ({
        id: duration.toString(),
        children: (
            <div className="flex flex-row gap-1.5 w-full items-center">
                <Text textLevel="span" colorType="primary" size="text-sm" weight="medium">{duration} {t('common.minutes')}</Text>
            </div>
        ),
    })), [selectedClass, t]);

    const selectClassType = useCallback((classTypeId: string) => {
        const classType = teacher.classTypes.find((ct) => ct.type === classTypeId);
        if (!classType) {
            return;
        }
        setSelectedClass(classType);
        setSelectedDuration(classType.durations[0]);
    }, [teacher]);

    return (
        <div className={classes}>
            <div className={leftSideClasses}>
                <Text weight="semibold" colorType="primary">{t('teachers.book-lesson')}</Text>
                <Space size={10} direction="vertical" />
                <Divider />
                <Space size={10} direction="vertical" />
                <div className="flex flex-row gap-2 items-center">
                    <Text textLevel="h4" size="text-md" weight="medium">{teacher.name} {teacher.surname}</Text>
                    {teacher.isSuperTeacher && (
                        <Chip colorType="primary" rounded>
                            <Icon icon="verified" iconWidth={16} iconHeight={16} />
                            <Text size="text-xs" textLevel="span" weight="medium" colorType="accent">{t('teachers.super-tutor')}</Text>
                        </Chip>
                    )}
                </div>
                <Space size={10} direction="vertical"/>
                <div className="flex flex-row gap-2 items-center">
                    <TextWithIcon icon="star" textLevel="span" weight="medium" colorType="primary" size="text-sm">{teacher.rating?.toFixed(1)}</TextWithIcon>
                    <Text colorType="tertiary" textLevel="span" size="text-sm">{teacher.reviewsNumber} {t('common.reviews')}</Text>
                </div>
                <Space size={16} direction="vertical"/>
                <div className="flex flex-row items-center">
                    <Text colorType="tertiary" size="text-sm">
                        {t('teachers.speaks')}{' '}
                        {teacher.speaksLanguages.map((language) => (
                            `${t(`common.language.${language.language}`)} (${t(`common.language.level.${language.proficiencyLevel}`)})`
                        )).join(', ')}
                    </Text>
                </div>
            </div>
            <div className={rightSideClasses} style={{height: '700px'}}>
                <div className={rightSideContentClasses}>
                    <Text weight="medium" colorType="primary">{t('booking.choose_classtype')}</Text>
                    <Space size={10} direction="vertical"/>
                    <RectangleSelectionGroup items={classOptions} value={selectedClass.type} onValueChange={selectClassType} />
                    <Space size={16} direction="vertical"/>
                    <Text weight="medium" colorType="primary">{t('booking.lesson_duration')}</Text>
                    <Space size={10} direction="vertical"/>
                    <RectangleSelectionGroup className="flex-row w-full" items={classDurations} value={selectedDuration.toString()} onValueChange={(value) => setSelectedDuration(parseInt(value))} />
                    <Space size={16} direction="vertical"/>
                    
                    {/*  */}
                    <Text weight="medium" colorType="primary">Lorem ipsum:</Text>
                    <Space size={10} direction="vertical"/>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae accumsan erat. Praesent eu egestas lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin ultricies arcu ut augue condimentum varius. Aenean metus felis, tristique ut enim et, dignissim facilisis magna. Cras vestibulum turpis quis mi tincidunt porta. Proin maximus purus facilisis est fringilla egestas. Duis scelerisque quam vitae posuere sagittis. Sed interdum quis ante non semper. Nulla vitae magna imperdiet, pulvinar tellus maximus, scelerisque ex. Donec vitae orci blandit, pretium massa ac, porta justo. Integer ac suscipit diam. Nulla facilisi. Proin a ipsum dapibus, maximus augue id, lacinia sem. Nam venenatis gravida ligula, et aliquam justo hendrerit non.

Praesent efficitur aliquam finibus. Suspendisse vehicula ut magna non laoreet. Vivamus mollis bibendum ante non vehicula. Mauris massa elit, blandit a efficitur eu, dapibus et augue. Suspendisse lobortis aliquam urna, eget facilisis sapien volutpat eu. Morbi dignissim neque nec enim molestie hendrerit. Suspendisse vitae dolor massa. Fusce lacinia aliquet odio, aliquam commodo mi convallis ac. Sed iaculis pharetra erat, quis egestas lorem vestibulum non. Fusce tellus felis, feugiat ac interdum sit amet, gravida quis ex.


                    </div>
                    {/*  */}
                </div>
                <div className={actionsClasses}>
                    <Button colorType="secondary" icon="chat" />
                    <Button colorType="primary" label={t('teachers.book-lesson')} />
                </div>
            </div>
        </div>
    );
}