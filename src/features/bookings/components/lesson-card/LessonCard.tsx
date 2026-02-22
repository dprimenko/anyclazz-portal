import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import type { BookingWithTeacher } from "../../domain/types";
import { toTimezone } from "@/features/shared/utils/dateConfig";
import classNames from "classnames";
import styles from "./LessonCard.module.css";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { isSuperTutor } from "@/features/teachers/utils/superTutorHelpers";

export interface LessonCardProps {
    booking: BookingWithTeacher;
    showActions?: boolean;
    onChat?: () => void;
    onDetails?: () => void;
    onCancel?: () => void;
}

export function LessonCard({ booking, showActions = false, onChat, onDetails, onCancel }: LessonCardProps) {
    const timezone = booking.timeZone || 'America/New_York';
    const startDateTime = toTimezone(booking.startAt, timezone);
    const dayOfWeek = startDateTime.toFormat('ccc');
    const time = startDateTime.toFormat('HH:mm');
    
    const containerClasses = classNames(
        "flex flex-row gap-4 p-4 rounded-lg border border-neutral-200 bg-white",
        styles.lessonCard
    );

    const statusChipClasses = classNames(
        "px-2 py-1 rounded text-xs font-medium",
        {
            [styles.statusOnline]: booking.status === 'online',
            [styles.statusOnsite]: booking.status === 'on-site'
        }
    );

    return (
        <div className={containerClasses}>
            <Avatar 
                src={booking.teacher?.avatar} 
                alt={`${booking.teacher?.name} ${booking.teacher?.surname}`}
                size={48}
                hasVerifiedBadge={isSuperTutor(booking.teacher?.superTutorTo)}
            />
            
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex flex-row items-center gap-2">
                    <Text textLevel="h4" size="text-sm" weight="semibold" colorType="primary">
                        {booking.teacher.name} {booking.teacher.surname}
                    </Text>
                </div>
                
                <Text size="text-xs" colorType="tertiary">
                    {booking.teacher.subject.name.en || 'English teacher'}
                </Text>
                
                <div className="flex flex-row items-center gap-4 mt-1">
                    <div className="flex flex-row items-center gap-1.5">
                        <Icon icon="calendar" iconWidth={14} iconHeight={14} />
                        <Text size="text-xs" colorType="secondary">
                            {dayOfWeek} {time}
                        </Text>
                    </div>
                    
                    <span className={statusChipClasses}>
                        {booking.status === 'online' ? 'Online' : 'On-site'}
                    </span>
                </div>
            </div>

            {showActions && (
                <div className="flex flex-row gap-2 items-start">
                    <Button 
                        icon="chat" 
                        size="sm" 
                        colorType="secondary" 
                        onClick={onChat}
                        className={styles.actionButton}
                    />
                    <button 
                        onClick={onDetails}
                        className={classNames("p-1.5", styles.moreButton)}
                    >
                        <Icon icon="more-vertical" iconWidth={16} iconHeight={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
