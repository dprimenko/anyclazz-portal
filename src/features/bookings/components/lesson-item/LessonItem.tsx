import type { BookingWithTeacher, BookingsRepository } from "../../domain/types";
import { getCurrentLang, useTranslations } from "@/i18n";
import type { AuthUser } from "@/features/auth/domain/types";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Chip } from "@/ui-library/components/ssr/chip/Chip";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { useMemo, useState } from "react";
import { LessonDetailsModal } from "../lesson-details-modal/LessonDetailsModal";
import { cn } from "@/lib/utils";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { PopMenu } from "@/ui-library/components/pop-menu/PopMenu";
import { LessonCancelModal } from "../lesson-cancel-modal/LessonCancelModal";
import { DateTime, fromISOKeepZone } from "@/features/shared/utils/dateConfig";
import { formatPrice } from "@/features/shared/utils/formatPrice";

export interface LessonItemProps {
    lesson: BookingWithTeacher;
    user: AuthUser | null;
    repository: BookingsRepository;
    token?: string;
    isHighlited?: boolean;
    bordered?: boolean;
    innerTableHeader?: boolean;
    onLessonCancelled?: () => void;
}

export function LessonItem({ lesson, user, repository, token, isHighlited, bordered, innerTableHeader, onLessonCancelled }: LessonItemProps) {
    const t = useTranslations();
    
    // Parsear manteniendo la zona horaria original del backend
    const startTime = fromISOKeepZone(lesson.startAt);
    const endTime = fromISOKeepZone(lesson.endAt);
    const duration = endTime.diff(startTime, 'minutes').minutes;
    const displayPerson = user?.role === 'teacher' ? lesson.student : lesson.teacher;

    const [selectedLesson, setSelectedLesson] = useState<BookingWithTeacher | null>(null);
    const [isCancelLessonModalOpen, setIsCancelLessonModalOpen] = useState(false);
	
	const openLessonDetails = (lesson: BookingWithTeacher) => {
		setSelectedLesson(lesson);
	};

    const openLessonCancel = () => {
		setIsCancelLessonModalOpen(true);
	};

	const closeLessonDetails = () => {
		setSelectedLesson(null);
	};

    const closeLessonCancel = () => {
		setIsCancelLessonModalOpen(false);
	};

    const isOnline = (lessonTypeId: string) => {
        return lessonTypeId.includes('online');
    }
    
    const price = useMemo(() => {
        return formatPrice(lesson.classType.price?.price ?? 0, lesson.classType.price?.currency ?? 'USD', getCurrentLang());
    }, [lesson]);

    const isPast = useMemo(() => {
        const now = DateTime.now();
        return startTime < now || lesson.status === 'completed';
    }, [startTime, lesson.status]);

    if (!displayPerson) return null;

    const popMenuItems = useMemo(() => {
        return [
            {
                label: "Chat",
                icon: <Icon icon="message-text-square-01" iconWidth={20} iconHeight={20} iconColor="#A4A7AE" />,
                onClick: () => {},
            },
            {
                label: "Details",
                icon: <Icon icon="file-02" iconWidth={20} iconHeight={20} iconColor="#A4A7AE" />,
                onClick: () => openLessonDetails(lesson),
            },
            ...(!isPast ? [
                {
                    label: "Cancel Lesson",
                    icon: <Icon icon="trash-can" iconWidth={20} iconHeight={20} iconColor="#A4A7AE" />,
                    onClick: () => openLessonCancel(),
                },
            ] : [])
        ];
    }, [lesson]);

    const containerClasses = cn(
        "py-4",
        bordered ? "" : "",
        isHighlited ? "rounded-md border-1 border-[var(--color-primary-200)] bg-[var(--color-primary-100)] p-5" : ""
    );

    const classNames = cn(
        "grid grid-cols-[2fr_2fr_1.5fr_1.5fr_1fr_1.5fr] gap-4 items-center",
    );

    return (
        <>
            <div className={containerClasses}>
                <div className={classNames}>
                    {displayPerson ? (
                        <div className="flex items-center">
                            <div className="flex items-center gap-3">
                                <Avatar src={displayPerson.avatar} size={40} alt={`${displayPerson.name} ${displayPerson.surname}`} />
                                <div className="flex flex-col gap-[2px]">
                                    <a href={user?.role === 'student' && lesson.teacher ? `/teacher/${lesson.teacher.id}` : '#'}>
                                        <Text size="text-sm" weight="medium" colorType="primary" underline>{displayPerson.name}{' '}{displayPerson.surname}</Text>
                                    </a>
                                    {user?.role === 'student' && <Text size="text-sm" colorType="tertiary">{t('common.teacher_of', { subject: displayPerson.subject.name[getCurrentLang()] })}</Text>}
                                    {user?.role === 'teacher' && <Text size="text-sm" colorType="tertiary">{t('common.student')}</Text>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Text size="text-sm" colorType="tertiary">{t('common.loading')}...</Text>
                        </div>
                    )}
                    <div className="flex flex-col">
                        {innerTableHeader && <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.date')}</Text>}
                        <Text size="text-sm" colorType="secondary">{startTime.toFormat('cccc dd HH:mm')}</Text>
                    </div>
                    <div className="flex flex-col">
                        {innerTableHeader && <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.duration')}</Text>}
                        <Text size="text-sm" colorType="secondary">{duration} min</Text>
                    </div>
                    <div className="flex flex-col">
                        {innerTableHeader && <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.price')}</Text>}
                        <Text size="text-sm" colorType="secondary">{price}</Text>
                    </div>
                    <div className="flex items-center">
                        <Chip textColor={isOnline(lesson.classTypeId) ? '#F4A43A' : '#175CD3'} bgColor={isOnline(lesson.classTypeId) ? '#FFF9F2' : '#EFF8FF'} borderColor={isOnline(lesson.classTypeId) ? '#FFEACF' : '#B2DDFF'}>
                            <span className="text-xs font-medium">
                                {isOnline(lesson.classTypeId) ? t('common.online') : t('common.onsite')}
                            </span>
                        </Chip>
                    </div>
                    <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                        <div className={cn("flex gap-2 justify-end", isPast && "invisible")}>
                            {user?.role === 'student' && (lesson.status === 'pending' || lesson.status === 'failed') ? (
                                <a href={`/booking/checkout/${lesson.id}`}>
                                    <Button
                                        label={t('common.pay')}
                                        colorType="secondary"
                                    />
                                </a>
                            ) : lesson.meetingUrl ? (
                                <a href={lesson.meetingUrl} target="_blank" rel="noopener noreferrer">
                                    <Button label={t('common.join')} colorType="primary" />
                                </a>
                            ) : (
                                <Button label={t('common.join')} colorType="primary" disabled />
                            )}
                        </div>
                        <div className="flex justify-end">
                            <div className="w-[20px] grid place-items-center cursor-pointer">
                                <PopMenu 
                                    trigger={
                                        <Icon icon="more-vertical" iconHeight={20} color="#A4A7AE" />
                                    } 
                                    direction="down" 
                                    align="right"
                                    items={popMenuItems}
                                    spaceBetweenTriggerAndMenu={24}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedLesson && (
                <LessonDetailsModal
                    lesson={selectedLesson}
                    onClose={closeLessonDetails}
                    onCancel={() => {
                        closeLessonDetails();
                        openLessonCancel();
                    }}
                    onSendMessage={() => {
                        console.log('Send message');
                        closeLessonDetails();
                    }}
                    onJoin={() => {
                        console.log('Join lesson');
                        closeLessonDetails();
                    }}
                />
            )}
            {isCancelLessonModalOpen && token && (
                <LessonCancelModal
                    lesson={lesson}
                    repository={repository}
                    token={token}
                    onClose={closeLessonCancel}
                    onSuccess={() => {
                        closeLessonCancel();
                        onLessonCancelled?.();
                    }}
                />
            )}
        </>
    );
}