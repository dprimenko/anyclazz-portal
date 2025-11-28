import { Modal } from "@/ui-library/components/modal/Modal";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Button } from "@/ui-library/components/ssr/button/Button";
import type { BookingWithTeacher } from "../../domain/types";
import { DateTime } from "luxon";
import { useTranslations } from "@/i18n";
import styles from "./LessonDetailsModal.module.css";

export interface LessonDetailsModalProps {
    lesson: BookingWithTeacher;
    onClose: () => void;
    onCancel?: () => void;
    onSendMessage?: () => void;
    onJoin?: () => void;
}

export function LessonDetailsModal({ lesson, onClose, onCancel, onSendMessage, onJoin }: LessonDetailsModalProps) {
    const t = useTranslations();
    const startTime = DateTime.fromISO(lesson.startAt);
    const endTime = DateTime.fromISO(lesson.endAt);
    const duration = endTime.diff(startTime, 'minutes').minutes;

    return (
        <Modal onClose={onClose} width={480}>
            <div className={styles.modal}>
                {/* Close Button */}
                <button onClick={onClose} className={styles.closeButton}>
                    <Icon icon="close" iconWidth={24} iconHeight={24} />
                </button>

                {/* Date Header */}
                <div className={styles.dateHeader}>
                    <Text size="text-xs" colorType="accent" weight="semibold" uppercase>
                        {startTime.toFormat('MMM').toUpperCase()}
                    </Text>
                    <Text size="text-xl" colorType="accent" weight="semibold">
                        {startTime.toFormat('dd')}
                    </Text>
                </div>

                {/* Class Title */}
                <Text textLevel="h2" size="text-lg" weight="semibold" colorType="primary" className="mb-1">
                    Class: {lesson.classType}
                </Text>
                <Text size="text-sm" colorType="tertiary" className="mb-6">
                    {lesson.teacher.name} {lesson.teacher.surname} - {startTime.toFormat('cccc, MMM dd, yyyy')}
                </Text>

                {/* Date and Time */}
                <div className={styles.infoRow}>
                    <Icon icon="calendar" iconWidth={20} iconHeight={20} />
                    <Text size="text-sm" colorType="secondary">
                        {startTime.toFormat('cccc, MMM dd, yyyy')}
                    </Text>
                </div>

                <div className={styles.infoRow}>
                    <Icon icon="clock" iconWidth={20} iconHeight={20} />
                    <Text size="text-sm" colorType="secondary">
                        {startTime.toFormat('h:mm a')} - {endTime.toFormat('h:mm a')}
                    </Text>
                </div>

                {/* Lesson Details Section */}
                <div className={styles.detailsSection}>
                    <Text size="text-sm" weight="semibold" colorType="primary" className="mb-3">
                        Lesson details
                    </Text>

                    <div className={styles.detailsGrid}>
                        <div className={styles.detailRow}>
                            <Text size="text-sm" colorType="tertiary">Duration</Text>
                            <Text size="text-sm" colorType="secondary" weight="medium">{duration} minutes</Text>
                        </div>
                        <div className={styles.detailRow}>
                            <Text size="text-sm" colorType="tertiary">Lesson type</Text>
                            <Text size="text-sm" colorType="secondary" weight="medium">
                                {lesson.status === 'online' ? 'Online' : 'On-site'}
                            </Text>
                        </div>
                        <div className={styles.detailRow}>
                            <Text size="text-sm" colorType="tertiary">Mode</Text>
                            <Text size="text-sm" colorType="secondary" weight="medium">Individual</Text>
                        </div>
                        <div className={styles.detailRow}>
                            <Text size="text-sm" colorType="tertiary">Online class</Text>
                            <Text size="text-sm" colorType="secondary" weight="medium">
                                €{lesson.teacher.classTypes[0]?.price?.amount.toFixed(2) || '0.00'}
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Teacher Section */}
                <div className={styles.teacherSection}>
                    <Text size="text-sm" weight="semibold" colorType="primary" className="mb-3">
                        Teacher
                    </Text>
                    <div className={styles.teacherInfo}>
                        <Avatar 
                            src={lesson.teacher.avatar} 
                            size={48} 
                            hasVerifiedBadge={lesson.teacher.isSuperTeacher}
                        />
                        <div>
                            <Text size="text-sm" weight="semibold" colorType="primary">
                                {lesson.teacher.name} {lesson.teacher.surname}
                            </Text>
                            <Text size="text-xs" colorType="tertiary">
                                {lesson.teacher.subject.name.en}
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <Button 
                        label="Cancel lesson" 
                        colorType="secondary" 
                        fullWidth 
                        onClick={onCancel}
                    />
                    <Button 
                        label="Send message" 
                        colorType="secondary" 
                        fullWidth 
                        onClick={onSendMessage}
                    />
                </div>

                <Button 
                    label="Join" 
                    colorType="primary" 
                    fullWidth 
                    onClick={onJoin}
                />
            </div>
        </Modal>
    );
}
