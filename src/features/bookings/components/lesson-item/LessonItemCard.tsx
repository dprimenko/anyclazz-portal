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
import { toTimezone, DateTime } from "@/features/shared/utils/dateConfig";

export interface LessonItemCardProps {
    lesson: BookingWithTeacher;
    user: AuthUser | null;
    repository: BookingsRepository;
    token?: string;
    onLessonCancelled?: () => void;
}

export function LessonItemCard({ lesson, user, repository, token, onLessonCancelled }: LessonItemCardProps) {
    const t = useTranslations();
    
    const timezone = lesson.timezone || 'America/New_York';
    const startTime = toTimezone(lesson.startAt, timezone);
    const endTime = toTimezone(lesson.endAt, timezone);
    const duration = endTime.diff(startTime, 'minutes').minutes;
    const displayPerson = user?.role === 'teacher' ? lesson.student : lesson.teacher;

    const [selectedLesson, setSelectedLesson] = useState<BookingWithTeacher | null>(null);
    const [isCancelLessonModalOpen, setIsCancelLessonModalOpen] = useState(false);
    
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

    const isOnline = lesson.classTypeId.includes('online');

    const isPast = useMemo(() => {
        const now = DateTime.now();
        return startTime < now;
    }, [startTime]);

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

    if (!displayPerson) return null;
    
    return (
        <>
            <div 
                className="bg-white rounded-2xl p-5 min-w-[280px] flex flex-col gap-4 border border-neutral-200">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
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
                                colorType="primary"
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