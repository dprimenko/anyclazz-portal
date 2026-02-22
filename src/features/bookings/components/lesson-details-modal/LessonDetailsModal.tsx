import { Modal } from "@/ui-library/components/modal/Modal";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Button } from "@/ui-library/components/ssr/button/Button";
import type { BookingWithTeacher } from "../../domain/types";
import { toTimezone } from "@/features/shared/utils/dateConfig";
import { useTranslations } from "@/i18n";
import styles from "./LessonDetailsModal.module.css";
import { useEffect } from "react";

export interface LessonDetailsModalProps {
    lesson: BookingWithTeacher;
    onClose: () => void;
    onCancel?: () => void;
    onSendMessage?: () => void;
    onJoin?: () => void;
}

export function LessonDetailsModal({ lesson, onClose, onCancel, onSendMessage, onJoin }: LessonDetailsModalProps) {
    const t = useTranslations();
    
    // Usar el timezone del booking (que viene del backend)
    const timezone = lesson.timezone || 'America/New_York';
    const startTime = toTimezone(lesson.startAt, timezone);
    const endTime = toTimezone(lesson.endAt, timezone);
    const duration = endTime.diff(startTime, 'minutes').minutes;
    
    return (
        <Modal onClose={onClose} width={480} withCloseIcon fitContent>
            <div className={styles.modal}>
                {/* Date Header */}
                <div className={styles.dateHeader}>
                    <Text size="text-xs" colorType="tertiary" weight="semibold" uppercase>
                        {startTime.toFormat('MMM').toUpperCase()}
                    </Text>
                    <Text size="text-xl" color="#F4A43A" weight="semibold">
                        {startTime.toFormat('dd')}
                    </Text>
                </div>

                {/* Class Title */}
                <Text textLevel="h2" size="text-lg" weight="semibold" colorType="primary" className="mb-1" textalign="center">
                    {t(`classtype.${lesson.classTypeId}`)}
                </Text>

                {/* Date and Time */}
                <div className={styles.infoRow}>
                    <Icon icon="calendar" iconWidth={20} iconHeight={20} />
                    <Text size="text-sm" colorType="secondary">
                        {startTime.toFormat('cccc, MMM dd, yyyy')}
                    </Text>
                </div>

                <div className={styles.infoRow}>
                    <Icon icon="time" iconWidth={20} iconHeight={20} />
                    <Text size="text-sm" colorType="secondary">
                        {startTime.toFormat('h:mm a')} - {endTime.toFormat('h:mm a')}
                    </Text>
                </div>

                {/* Lesson Details Section */}
                <div className={styles.detailsSection}>
                    <Text size="text-sm" weight="semibold" colorType="primary" className="mb-3">
                        {t('booking.lesson_details')}
                    </Text>

                    <div className={styles.detailsGrid}>
                        <div className={styles.detailRow}>
                            <Text size="text-sm" colorType="tertiary">{t('common.duration')}</Text>
                            <Text size="text-sm" colorType="secondary" weight="medium">{t('common.minutes_long', { minutes: duration })}</Text>
                        </div>
                        <div className={styles.detailRow}>
                            <Text size="text-sm" colorType="tertiary">{t('common.lesson_type')}</Text>
                            <Text size="text-sm" colorType="secondary" weight="medium">
                                {t(`classtype.${lesson.classTypeId}`)}
                            </Text>
                        </div>
                        <div className={styles.detailRow}>
                            <Text size="text-sm" colorType="tertiary">{t('common.price')}</Text>
                            <Text size="text-sm" colorType="secondary" weight="medium">
                                {lesson.classType.price.price ? `${t(`common.${lesson.classType.price.currencyCode.toLowerCase()}_price`, { amount: lesson.classType.price.price })}` : '-'}
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Teacher Section */}
                {lesson.teacher && (
                    <div className={styles.teacherSection}>
                        <Text size="text-sm" weight="semibold" colorType="primary" className="mb-3">
                            {t('common.teacher')}
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
                                    {lesson.teacher.subject.name["en"]}
                                </Text>
                            </div>
                        </div>
                    </div>
                )}

                {lesson.student && (
                    <div className={styles.teacherSection}>
                        <Text size="text-sm" weight="semibold" colorType="primary" className="mb-3">
                            {t('common.student')}
                        </Text>
                        <div className={styles.teacherInfo}>
                            <Avatar 
                                src={lesson.student.avatar} 
                                size={48} 
                            />
                            <div>
                                <Text size="text-sm" weight="semibold" colorType="primary">
                                    {lesson.student.name} {lesson.student.surname}
                                </Text>
                                <Text size="text-xs" colorType="tertiary">
                                    {t('common.student')}
                                </Text>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className={styles.actions}>
                    {onCancel && (
                        <Button 
                            label={t('dashboard.cancel_lesson')} 
                            colorType="secondary" 
                            fullWidth 
                            onClick={onCancel}
                        />
                    )}
                    {onSendMessage && (
                        <Button 
                            label={t('dashboard.chat')} 
                            colorType="secondary" 
                            fullWidth 
                            onClick={onSendMessage}
                        />
                    )}
                </div>

                {onJoin && (
                    <Button 
                        label={t('common.join')} 
                        colorType="primary" 
                        fullWidth 
                        onClick={onJoin}
                    />
                )}
            </div>
        </Modal>
    );
}
