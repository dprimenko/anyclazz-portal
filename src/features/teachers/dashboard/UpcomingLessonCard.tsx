import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { Chip } from '@/ui-library/components/ssr/chip/Chip';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { DateTime } from '@/features/shared/utils/dateConfig';
import type { BookingWithTeacher } from '@/features/bookings/domain/types';
import { useTranslations } from '@/i18n';
import type { AuthUser } from '@/features/auth/domain/types';
import { isSuperTutor } from '@/features/teachers/utils/superTutorHelpers';

interface UpcomingLessonCardProps {
    lesson: BookingWithTeacher;
    user: AuthUser | null;
    onCardClick: () => void;
}

export function UpcomingLessonCard({ lesson, user, onCardClick }: UpcomingLessonCardProps) {
    const t = useTranslations();
    const startTime = DateTime.fromISO(lesson.startAt);
    const endTime = DateTime.fromISO(lesson.endAt);
    const duration = endTime.diff(startTime, 'minutes').minutes;
    
    const isOnline = lesson.classTypeId.includes('online');
    const person = user?.role === 'student' ? lesson.teacher : lesson.student;
    
    if (!person) return null;

    return (
        <div 
            className="bg-white rounded-2xl p-5 min-w-[280px] flex flex-col gap-4 border border-neutral-200"
            onClick={onCardClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar 
                        src={person.avatar} 
                        size={48} 
                        alt={`${person.name} ${person.surname}`}
                        hasVerifiedBadge={user?.role === 'student' && 'superTutorTo' in person ? isSuperTutor(person.superTutorTo) : false}
                    />
                    <div className="flex flex-col">
                        <Text size="text-sm" weight="semibold" colorType="primary">
                            {person.name} {person.surname}
                        </Text>
                        <Text size="text-xs" colorType="tertiary">
                            {user?.role === 'student' ? t('common.teacher') : t('common.student')}
                        </Text>
                    </div>
                </div>
                <button type="button" className="p-1">
                    <Icon icon="more-vertical" iconWidth={20} iconHeight={20} />
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
                    <Text size="text-sm" style={{ color: 'var(--color-neutral-500)' }}>Time:</Text>
                    <Text size="text-sm" colorType="secondary">{duration} min</Text>
                </div>

                <div className="flex items-center gap-2">
                    <Text size="text-sm" style={{ color: 'var(--color-neutral-500)' }}>Date:</Text>
                    <Text size="text-sm" colorType="secondary">{startTime.toFormat('ccc h:mm a')}</Text>
                </div>

                <div className="flex items-center gap-2">
                    <Text size="text-sm" style={{ color: 'var(--color-neutral-500)' }}>Mode:</Text>
                    <Text size="text-sm" colorType="secondary">Group</Text>
                </div>

                <div className="flex items-center gap-2">
                    <Text size="text-sm" style={{ color: 'var(--color-neutral-500)' }}>Type:</Text>
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
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                {user?.role === 'student' && lesson.paymentStatus !== 'completed' ? (
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
    );
}
