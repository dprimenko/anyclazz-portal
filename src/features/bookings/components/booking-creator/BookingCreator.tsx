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
import { SimpleCalendar } from "@/ui-library/components/calendar/SimpleCalendar";
import { DateTime, fromISOKeepZone } from "@/features/shared/utils/dateConfig";
import { useTeachers } from "@/features/teachers/providers/TeachersProvider";
import { useBookingCreator } from "../../hooks/useBookingCreator";
import type { CreateBookingParams } from "../../domain/types";
import { useIsMobile } from "@/ui-library/hooks/useIsMobile";
import { proficiencyLevels } from "@/features/teachers/onboarding/data/proficiencyLevels";
import { getLangFromUrl } from "@/i18n";
import { isSuperTutor } from "@/features/teachers/utils/superTutorHelpers";

export interface BookingCreatorProps {
    teacher: Teacher;
    onClose?: () => void;
}

export function BookingCreator({teacher, onClose}: BookingCreatorProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const { 
        accessToken,
    } = useTeachers();

    const isMobile = useIsMobile();

    const {
        availableSlots,
        availableDates,
        selectedClass,
        selectClassType,
        selectedDuration,
        setSelectedDuration,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        createBooking,
        currentMonth,
        setCurrentMonth,
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
        children: () => classOptionChildren(classType),
    })), [teacher]);

    const classDurations = useMemo(() => [30,60].map((duration) => ({
        id: duration.toString(),
        children: () => (
            <div className="flex flex-row gap-1.5 w-full items-center">
                <Text textLevel="span" colorType="primary" size="text-sm" weight="medium">{t('common.minutes_long', { minutes: duration })}</Text>
            </div>
        ),
    })), [selectedClass, t]);

    const availableTimes = useMemo(() => availableSlots.map(({startAt, timezone}) => {
        // Parsear el ISO manteniendo la zona horaria original del backend
        const dateTime = fromISOKeepZone(startAt, timezone);
        const formattedTime = dateTime.toFormat('HH:mm');
        const timezoneFormat = dateTime.toFormat('ZZZZ');
        
        return {
            id: startAt,
            children: () => (
                <div className="flex flex-col gap-0.5 w-full items-center">
                    <Text textLevel="span" colorType="primary" size="text-sm" weight="medium">{formattedTime}</Text>
                    <Text textLevel="span" colorType="tertiary" size="text-xs">{timezoneFormat}</Text>
                </div>
            ),
        };
    }), [availableSlots]);

    const priceAmount = useMemo(() => {
        console.log(selectedClass);
        if (selectedClass.durations === undefined) {
            return '';
        }
        const selectedPriceDuration = selectedClass.durations.find(d => d.duration === selectedDuration);
        if (!selectedPriceDuration) {
            return '';
        }
        return t(`common.${selectedPriceDuration.price?.currency.toLowerCase()}_price`, { amount: selectedPriceDuration.price?.amount.toFixed(2) });
    }, [selectedClass, selectedDuration, t]);

    const formSubmitHandler = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedTime) {
            alert(t('booking.select_time_required'));
            return;
        }
        
        // La fecha selectedTime ya viene con timezone incluido en formato ISO8601
        const startAt = DateTime.fromISO(selectedTime);
        const endAt = startAt.plus({ minutes: selectedDuration });
        
        const bookingData: CreateBookingParams = {
            teacherId: teacher.id,
            token: accessToken!,
            classTypeId: selectedClass.type,
            startAt: startAt.toISO()!,
            endAt: endAt.toISO()!,
        };
        
        const booking = await createBooking(bookingData);

        window.location.href = `/booking/checkout/${booking?.id}`;
    }, [selectedTime, selectedDuration, selectedClass, teacher, accessToken, availableSlots]);

    return (
        <form ref={formRef} onSubmit={formSubmitHandler} className={classes}>
            {/* Mobile Header - solo visible en móvil */}
            <div className={styles['booking-creator__mobile-header']}>
                <div className="flex items-center justify-between">
                    <Text weight="semibold" colorType="primary">{t('teachers.book-lesson')}</Text>
                    <button type="button" onClick={onClose} className="p-2">
                        <Icon icon="close" iconWidth={20} iconHeight={20} iconColor="#A4A7AE" />
                    </button>
                </div>
            </div>

            {/* Mobile Content - contenido scrollable en móvil */}
            <div className={styles['booking-creator__mobile-content']}>
                <div className={leftSideClasses}>
                    <Text weight="semibold" colorType="primary" className={styles['booking-creator__desktop-title']}>{t('teachers.book-lesson')}</Text>
                    {!isMobile && (
                        <>
                            <Divider className={styles['booking-creator__desktop-title']} />
                            <Space size={10} direction="vertical" className={styles['booking-creator__desktop-title']} />
                        </>
                    )}
                    <div className="flex flex-row items-left">
                        <Avatar src={teacher.avatar} alt={`${teacher.name} ${teacher.surname}`} size={isMobile ? 72 : 96} hasVerifiedBadge={isSuperTutor(teacher.superTutorTo)} hasOutline />
                    </div>
                    <Space size={10} direction="vertical" />
                    <div className="flex flex-row gap-2 items-center">
                        <Text textLevel="h4" size="text-md" weight="medium" colorType="primary">{teacher.name} {teacher.surname}</Text>
                        {isSuperTutor(teacher.superTutorTo) && (
                            <Chip colorType="primary" rounded>
                                <Icon icon="verified" iconWidth={16} iconHeight={16} />
                                <Text size="inherit" textLevel="span" weight="medium" colorType="accent">{t('teachers.super-tutor')}</Text>
                            </Chip>
                        )}
                    </div>
                    <Space size={10} direction="vertical"/>
                    <div className="flex flex-row gap-2 items-center">
                        <TextWithIcon icon="star" textLevel="span" weight="medium" colorType="primary" size="text-sm">{teacher.averageRating?.toFixed(1)}</TextWithIcon>
                        <Text colorType="tertiary" textLevel="span" size="text-sm">{teacher.reviewsNumber} {t('common.reviews')}</Text>
                    </div>
                    <Space size={16} direction="vertical"/>
                    <div className="flex flex-row items-center">
                        <Text colorType="tertiary" size="text-sm">
                            {t('teachers.speaks')}{' '}
                            {teacher.speaksLanguages.map((language) => {
                                const level = proficiencyLevels.find(l => l.code === language.proficiencyLevel);
                                const levelName = level ? level.name[getLangFromUrl(new URL(window.location.href))] : language.proficiencyLevel;
                                return `${t(`common.language.${language.language}`)} (${levelName})`;
                            }).join(', ')}
                        </Text>
                    </div>
                    <Space size={16} direction="vertical"/>
                    <div className="hidden md:flex md:w-full">
                        {teacher.videoPresentation && teacher.videoPresentationStatus === 'ready' && (
                            <div className="mb-8">
                                <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
                                    <video 
                                        controls 
                                        className="w-full h-full"
                                        src={teacher.videoPresentation}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex-1"></div>
                    {selectedClass && (
                        <div className={classNames("rounded-md bg-white p-5 w-full flex flex-col gap-2.5", styles['booking-creator__summary'], styles['booking-creator__desktop-summary'])}>
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
                        <div className="flex flex-col gap-2 w-full" style={{ overflow: 'visible' }}>
                            <Text weight="medium" colorType="primary">{t('common.date_and_time')}</Text>
                            <div style={{ overflow: 'visible' }}>
                                <SimpleCalendar 
                                    selectedDate={selectedDate} 
                                    onSelected={(date) => date && setSelectedDate(date)} 
                                    availableDates={availableDates}
                                    onMonthChange={setCurrentMonth}
                                />
                            </div>
                        </div>
                        {availableSlots.length > 0 && (
                            <div className="flex flex-col gap-2 w-full">
                                <Text weight="medium" colorType="primary">{t('booking.available_times')}</Text>
                                <RectangleSelectionGroup className="flex-row w-full" cnn={{container: "grid grid-cols-3 gap-3"}} items={availableTimes} value={selectedTime} onValueChange={(value) => setSelectedTime(value)} />
                            </div>
                        )}
                    </div>
                    <div className={classNames(actionsClasses, styles['booking-creator__desktop-actions'])}>
                        <Button colorType="secondary" onlyText label={t('common.cancel')} onClick={onClose} />
                        <Button colorType="primary" label={t('teachers.book-now')} type="submit"/>
                    </div>
                </div>
            </div>

            {/* Mobile Footer - solo visible en móvil */}
            <div className={styles['booking-creator__mobile-footer']}>
                {selectedClass && (
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                            <Text size="text-xl" colorType="primary" weight="medium">{priceAmount}</Text>
                            <Text size="text-xs" colorType="secondary">{t(`classtype.${selectedClass.type}`)} · {t('common.minutes_short', { minutes: selectedDuration })}</Text>
                        </div>
                    </div>
                )}
                <Button colorType="primary" label={t('teachers.book-now')} type="submit" className="w-full" />
            </div>
        </form>
    );
}