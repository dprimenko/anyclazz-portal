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
import { useCallback, useMemo, useRef } from "react";
import { RectangleSelectionGroup } from "@/ui-library/components/form/rectangle-selection-group/RectangleSelectionGroup";
import { getClassTypeIcon } from "@/features/teachers/utils/classTypeIcon";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Calendar } from "@/ui-library/components/calendar/Calendar";
import { DateTime } from "luxon";
import { useTeachers } from "@/features/teachers/providers/TeachersProvider";
import { useBookingCreator } from "../../hooks/useBookingCreator";
import type { CreateBookingParams } from "../../domain/types";

export interface BookingCreatorProps {
    teacher: Teacher;
    onClose?: () => void;
}

export function BookingCreator({teacher, onClose}: BookingCreatorProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const { 
        accessToken,
    } = useTeachers();

    const {
        availableSlots,
        selectedClass,
        selectClassType,
        selectedDuration,
        setSelectedDuration,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        createBooking
    } = useBookingCreator({
        teacher,
        accessToken,
    });

    const t = useTranslations();
    const classes = classNames(styles["booking-creator__container"]);
    const leftSideClasses = classNames("w-full h-full p-6 flex flex-col", styles["booking-creator__left-side"]);
    const rightSideClasses = classNames("w-full h-full", styles["booking-creator__right-side"]);
    const rightSideContentClasses = classNames("flex flex-col w-full px-6 pt-6 gap-4", styles["booking-creator__right-side-content"]);
    const actionsClasses = classNames("flex flex-row w-full justify-between p-6", styles["booking-creator__actions"]);

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

    const classDurations = useMemo(() => [30,60].map((duration) => ({
        id: duration.toString(),
        children: (
            <div className="flex flex-row gap-1.5 w-full items-center">
                <Text textLevel="span" colorType="primary" size="text-sm" weight="medium">{t('common.minutes_long', { minutes: duration })}</Text>
            </div>
        ),
    })), [selectedClass, t]);

    const availableTimes = useMemo(() => availableSlots.map(({from}) => ({
        id: from,
        children: (
            <div className="flex flex-row gap-1.5 w-full items-center">
                <Text textLevel="span" colorType="primary" size="text-sm" weight="medium">{DateTime.fromISO(from).toFormat('HH:mm')}</Text>
            </div>
        ),
    })), [availableSlots, t]);

    const priceAmount = useMemo(() => {
        if (selectedClass.price === undefined) {
            return '';
        }
        return t(`common.${selectedClass.price?.currency.toLowerCase()}_price`, { amount: selectedClass.price?.amount.toFixed(2) });
    }, [selectedClass]);

    const formSubmitHandler = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedTime) {
            
            return;
        };
        const startAt = DateTime.fromISO(selectedTime!, { zone: 'Europe/Madrid' });
        const endAt = startAt.plus({ minutes: selectedDuration });
        
        const bookingData: CreateBookingParams = {
            teacherId: teacher.id,
            token: accessToken!,
            classTypeId: selectedClass.type,
            startAt: startAt.toISO()!,
            endAt: endAt.toISO()!,
            timeZone: 'Europe/Madrid',
        };
        
        createBooking(bookingData);
    }, [selectedTime, selectedDuration, selectedClass, teacher, accessToken]);

    return (
        <form ref={formRef} onSubmit={formSubmitHandler} className={classes}>
            <div className={leftSideClasses}>
                <Text weight="semibold" colorType="primary">{t('teachers.book-lesson')}</Text>
                <Space size={10} direction="vertical" />
                <Divider />
                <Space size={10} direction="vertical" />
                <div className="flex flex-row items-left">
                    <Avatar src={teacher.avatar} alt={`${teacher.name} ${teacher.surname}`} size={96} hasVerifiedBadge={teacher.isSuperTeacher} hasOutline />
                </div>
                <Space size={10} direction="vertical" />
                <div className="flex flex-row gap-2 items-center">
                    <Text textLevel="h4" size="text-md" weight="medium" colorType="primary">{teacher.name} {teacher.surname}</Text>
                    {teacher.isSuperTeacher && (
                        <Chip colorType="primary" rounded>
                            <Icon icon="verified" iconWidth={16} iconHeight={16} />
                            <Text size="inherit" textLevel="span" weight="medium" colorType="accent">{t('teachers.super-tutor')}</Text>
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
                <div className="flex-1"></div>
                {selectedClass && (
                    <div className={classNames("rounded-md bg-white p-5 w-full flex flex-col gap-2.5", styles['booking-creator__summary'])}>
                        <Text size="text-sm" colorType="primary">{t('common.price')}</Text>
                        <Text size="text-xl" colorType="primary" weight="medium">{priceAmount}</Text>
                        <Text size="text-xs" colorType="primary">{t(`classtype.${selectedClass.type}`)} · {t('common.minutes_short', { minutes: selectedDuration })}</Text>
                    </div>
                )}
            </div>
            <div className={rightSideClasses}>
                <div className={rightSideContentClasses}>
                    <div className="flex flex-col gap-2 w-full">
                        <Text weight="medium" colorType="primary">{t('booking.choose_classtype')}</Text>
                        <RectangleSelectionGroup items={classOptions} value={selectedClass.type} onValueChange={selectClassType} />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <Text weight="medium" colorType="primary">{t('booking.lesson_duration')}</Text>
                        <RectangleSelectionGroup className="flex-row w-full" cnn={{container: "grid grid-cols-2 gap-3"}} items={classDurations} value={selectedDuration.toString()} onValueChange={(value) => setSelectedDuration(parseInt(value))} />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <Text weight="medium" colorType="primary">{t('common.date_and_time')}</Text>
                        <Calendar selectedDate={selectedDate} onSelected={setSelectedDate} />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <Text weight="medium" colorType="primary">{t('booking.available_times')}</Text>
                        <RectangleSelectionGroup className="flex-row w-full" cnn={{container: "grid grid-cols-3 gap-3"}} items={availableTimes} value={selectedTime} onValueChange={(value) => setSelectedTime(value)} />
                    </div>
                </div>
                <div className={actionsClasses}>
                    <Button colorType="secondary" onlyText label={t('common.cancel')} onClick={onClose} />
                    <Button colorType="primary" label={t('teachers.book-lesson')} type="submit"/>
                </div>
            </div>
        </form>
    );
}