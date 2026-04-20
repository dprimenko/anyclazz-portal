import type { BookingWithTeacher, BookingsRepository } from "../../domain/types";
import { useTranslations } from "@/i18n";
import type { AuthUser } from "@/features/auth/domain/types";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Chip } from "@/ui-library/components/ssr/chip/Chip";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { useMemo, useState } from "react";
import { LessonDetailsModal } from "../lesson-details-modal/LessonDetailsModal";
import { isSuperTutor } from "@/features/teachers/utils/superTutorHelpers";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { PopMenu } from "@/ui-library/components/pop-menu/PopMenu";
import cn from "classnames";
import { LessonCancelModal } from "../lesson-cancel-modal/LessonCancelModal";
import { DateTime, fromISOKeepZone } from "@/features/shared/utils/dateConfig";
import { RateTutorModal } from "../rate-tutor-modal/RateTutorModal";
import { ApiTeacherRepository } from "@/features/teachers/infrastructure/ApiTeacherRepository";

export interface LessonItemCardProps {
    lesson: BookingWithTeacher;
    user: AuthUser | null;
    repository: BookingsRepository;
    token?: string;
    onLessonCancelled?: () => void;
    lang?: string;
}

export function LessonItemCard({ lesson, user, repository, token, onLessonCancelled, lang }: LessonItemCardProps) {
    const t = useTranslations({ lang: lang as 'en' | 'es' | undefined });
    
    // Parsear manteniendo la zona horaria original del backend
    const startTime = fromISOKeepZone(lesson.startAt);
    const endTime = fromISOKeepZone(lesson.endAt);
    const duration = endTime.diff(startTime, 'minutes').minutes;
    const displayPerson = user?.role === 'teacher' ? lesson.student : lesson.teacher;
    const isGroup = lesson.classType?.isGroup ?? lesson.classTypeId?.includes('_group') ?? false;

    const [selectedLesson, setSelectedLesson] = useState<BookingWithTeacher | null>(null);
    const [isCancelLessonModalOpen, setIsCancelLessonModalOpen] = useState(false);
    const [isRateTutorModalOpen, setIsRateTutorModalOpen] = useState(false);
    const teacherRepository = useMemo(() => new ApiTeacherRepository(), []);
    
    const openLessonDetails = (lesson: BookingWithTeacher) => {
        setSelectedLesson(lesson);
    };

    const closeLessonDetails = () => {
        setSelectedLesson(null);
    };

    const openLessonCancel = () => {
		setIsCancelLessonModalOpen(true);
	};

    const closeLessonCancel = () => {
		setIsCancelLessonModalOpen(false);
	};

    const openRateTutor = () => {
		setIsRateTutorModalOpen(true);
	};

    const closeRateTutor = () => {
		setIsRateTutorModalOpen(false);
	};

    const isOnline = lesson.classTypeId.includes('online');

    const isPast = useMemo(() => {
        const now = DateTime.now();
        return startTime < now;
    }, [startTime]);

    const popMenuItems = useMemo(() => {
        return [
            ...(!isGroup ? [{
                label: "Chat",
                icon: <Icon icon="message-text-square-01" iconWidth={20} iconHeight={20} iconColor="#A4A7AE" />,
                onClick: () => {},
            }] : []),
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
            ] : []),
            ...(isPast && user?.role === 'student' ? [
                {
                    label: t('reviews.rate_tutor'),
                    icon: <Icon icon="star-outline" iconWidth={20} iconHeight={20} iconColor="#A4A7AE" />,
                    onClick: () => openRateTutor(),
                },
            ] : [])
        ];
    }, [lesson, isPast, isGroup, user?.role, t]);

    if (!displayPerson && !isGroup) return null;
    
    return (
        <>
            <div 
                className="bg-white rounded-2xl p-5 min-w-[280px] flex flex-col gap-4 border border-neutral-200">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {displayPerson ? (
                            <>
                                <Avatar 
                                    src={displayPerson.avatar} 
                                    size={48} 
                                    alt={`${displayPerson.name} ${displayPerson.surname}`}
                                    hasVerifiedBadge={user?.role === 'student' && 'superTutorTo' in displayPerson ? isSuperTutor(displayPerson.superTutorTo) : false}
                                />
                                <div className="flex flex-col">
                                    <Text size="text-sm" weight="semibold" colorType="primary">
                                        {displayPerson.name} {displayPerson.surname}
                                    </Text>
                                    <Text size="text-xs" colorType="tertiary">
                                        {user?.role === 'student' ? t('common.teacher') : t('common.student')}
                                    </Text>
                                </div>
                            </>
                        ) : (
                            <Chip colorType="primary" rounded>
                                <Text size="text-sm" textLevel="span" colorType="accent" weight="medium">{t('bookings.group_class')}</Text>
                            </Chip>
                        )}
                    </div>
                    <button type="button" className="p-1">
                        <PopMenu 
                            trigger={
                                <Icon icon="more-vertical" iconHeight={20} color="#A4A7AE" />
                            } 
                            direction="down" 
                            align="right"
                            items={popMenuItems}
                            spaceBetweenTriggerAndMenu={24}
                        />
                    </button>
                </div>
    
                {/* Details */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Text size="text-sm" style={{ color: 'var(--color-neutral-500)' }}>Class:</Text>
                        <Text size="text-sm" colorType="secondary" weight="medium">
                            {t(`classtype.${lesson.classTypeId}`)}
                        </Text>
                    </div>
    
                    <div className="flex items-center gap-2">
                        <Text size="text-sm" className='text-[var(--color-neutral-500)]'>Time:</Text>
                        <Text size="text-sm" colorType="secondary">{duration} min</Text>
                    </div>
    
                    <div className="flex items-center gap-2">
                        <Text size="text-sm" className='text-[var(--color-neutral-500)]'>Date:</Text>
                        <Text size="text-sm" colorType="secondary">{startTime.toFormat('ccc dd h:mm a')}</Text>
                    </div>
    
                    <div className="flex items-center gap-2">
                        <Text size="text-sm" className='text-[var(--color-neutral-500)]'>Mode:</Text>
                        <Text size="text-sm" colorType="secondary">Group</Text>
                    </div>
    
                    <div className="flex items-center gap-2">
                        <Text size="text-sm" className='text-[var(--color-neutral-500)]'>Type:</Text>
                        <Chip 
                            textColor={isOnline ? '#F4A43A' : '#175CD3'} 
                            bgColor={isOnline ? '#FFF9F2' : '#EFF8FF'} 
                            borderColor={isOnline ? '#FFEACF' : '#B2DDFF'}
                        >
                            <span className="text-xs font-medium">
                                {isOnline ? t('common.online') : t('common.onsite')}
                            </span>
                        </Chip>
                    </div>
                </div>
    
                {/* Action Button */}
                <div className={cn("mt-2", isPast && "hidden")} onClick={(e) => e.stopPropagation()}>
                    {user?.role === 'student' && (lesson.status === 'pending' || lesson.status === 'failed') ? (
                        <a href={`/booking/checkout/${lesson.id}`} className="block">
                            <Button 
                                label={t('common.pay')} 
                                colorType="secondary"
                                fullWidth
                            />
                        </a>
                    ) : lesson.meetingUrl ? (
                        <a href={lesson.meetingUrl} target="_blank" rel="noopener noreferrer" className="block">
                            <Button label={t('common.join')} colorType="primary" fullWidth />
                        </a>
                    ) : (
                        <Button label={t('common.join')} colorType="primary" disabled fullWidth />
                    )}
                </div>
            </div>
            {selectedLesson && (
                <LessonDetailsModal
                    lesson={selectedLesson}
                    onClose={closeLessonDetails}
                    lang={lang as 'en' | 'es' | undefined}
                    onCancel={() => {
                        openLessonCancel();
                        closeLessonDetails();
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
                    lang={lang as 'en' | 'es' | undefined}
                    onClose={closeLessonCancel}
                    onSuccess={() => {
                        closeLessonCancel();
                        onLessonCancelled?.();
                    }}
                />
            )}
            {isRateTutorModalOpen && token && lesson.teacher && (
                <RateTutorModal
                    teacherId={lesson.teacher.id}
                    teacherName={`${lesson.teacher.name} ${lesson.teacher.surname}`}
                    repository={teacherRepository}
                    token={token}
                    onClose={closeRateTutor}
                    onSuccess={() => {
                        closeRateTutor();
                        onLessonCancelled?.();
                    }}
                    lang={lang}
                />
            )}
        </>
    );
}