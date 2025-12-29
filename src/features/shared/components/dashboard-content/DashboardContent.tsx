import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import type { BookingWithTeacher } from "@/features/bookings/domain/types";
import type { Teacher } from "@/features/teachers/domain/types";
import { useTranslations } from "@/i18n";
import { DateTime } from "luxon";
import { useState } from "react";
import { LessonDetailsModal } from "@/features/bookings/components/lesson-details-modal/LessonDetailsModal";
import { PopMenu } from "@/ui-library/components/pop-menu/PopMenu";
import styles from "./DashboardContent.module.css";

export interface DashboardContentProps {
    userName: string;
    upcomingLessons: BookingWithTeacher[];
    lastLessons: BookingWithTeacher[];
    savedTeachers: Teacher[];
    clazzmate: {
        referralLink: string;
        friendsInvited: number;
        creditsEarned: number;
    };
}

export function DashboardContent({ userName, upcomingLessons, lastLessons, savedTeachers, clazzmate }: DashboardContentProps) {
    const t = useTranslations();
    const [copied, setCopied] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<BookingWithTeacher | null>(null);

    const openLessonDetails = (lesson: BookingWithTeacher) => {
        setSelectedLesson(lesson);
    };

    const closeLessonDetails = () => {
        setSelectedLesson(null);
    };


    const handleCopyLink = () => {
        navigator.clipboard.writeText(clazzmate.referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <Text textLevel="h1" size="display-xs" colorType="primary" weight="semibold">
                        {t('dashboard.welcome_back', { name: userName })}
                    </Text>
                    <Text textLevel="p" colorType="tertiary" className="mt-1">
                        {t('dashboard.ready_to_continue')}
                    </Text>
                </div>
                <div className={styles.headerButtons}>
                    <Button 
                        icon="calendar-plus" 
                        label={t('dashboard.schedule_lesson')} 
                        colorType="secondary"
                    />
                    <Button 
                        icon="search" 
                        label={t('dashboard.find_teacher')} 
                        colorType="primary"
                    />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className={styles.grid}>
                {/* Left Column - Lessons */}
                <div className={styles.lessonsColumn}>
                    {/* Upcoming Lessons */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Text textLevel="h2" size="text-lg" weight="semibold" colorType="primary">
                                {t('dashboard.upcoming_lessons')}
                            </Text>
                            <a href="/me/upcoming-lessons" className={styles.viewAll}>
                                <Text size="text-sm" colorType="accent">
                                    {t('dashboard.view_all')}
                                </Text>
                            </a>
                        </div>
                        
                        {/* Mobile Cards View */}
                        <div className={styles.mobileCards}>
                            <div>
                            {upcomingLessons.map((lesson) => {
                                const startTime = DateTime.fromISO(lesson.startAt);
                                const endTime = DateTime.fromISO(lesson.endAt);
                                const duration = endTime.diff(startTime, 'minutes').minutes;
                                const price = lesson.teacher.classTypes[0]?.price?.amount || 0;
                                
                                return (
                                    <div key={lesson.id} className={styles.lessonCard}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.teacher}>
                                                <Avatar src={lesson.teacher.avatar} size={40} hasVerifiedBadge={lesson.teacher.isSuperTeacher} />
                                                <div>
                                                    <Text size="text-sm" weight="semibold" colorType="primary">
                                                        {lesson.teacher.name} {lesson.teacher.surname}
                                                    </Text>
                                                    <Text size="text-xs" colorType="tertiary">
                                                        {lesson.teacher.subject.name.en}
                                                    </Text>
                                                </div>
                                            </div>
                                            <PopMenu
                                                trigger={<Icon icon="more-vertical" iconWidth={20} iconHeight={20} />}
                                                items={[
                                                    {
                                                        icon: <Icon icon="chat" iconWidth={16} iconHeight={16} />,
                                                        label: t('dashboard.chat'),
                                                        onClick: () => console.log('Chat')
                                                    },
                                                    {
                                                        icon: <Icon icon="book" iconWidth={16} iconHeight={16} />,
                                                        label: t('dashboard.details'),
                                                        onClick: () => openLessonDetails(lesson)
                                                    },
                                                    {
                                                        icon: <Icon icon="trash-can" iconWidth={16} iconHeight={16} />,
                                                        label: t('dashboard.cancel_lesson'),
                                                        onClick: () => console.log('Cancel lesson')
                                                    }
                                                ]}
                                            />
                                        </div>
                                        <div className={styles.cardDetails}>
                                            <Text size="text-sm" colorType="secondary" weight="medium">
                                                Class: {lesson.classType}
                                            </Text>
                                            <Text size="text-sm" colorType="secondary">
                                                Time: {duration} min
                                            </Text>
                                            <Text size="text-sm" colorType="secondary">
                                                Date: {startTime.toFormat('ccc h:mm a')}
                                            </Text>
                                            <Text size="text-sm" colorType="secondary">
                                                Mode: Group
                                            </Text>
                                            <Text size="text-sm" colorType="secondary">
                                                Price: €{price}
                                            </Text>
                                            <div className="flex items-center gap-2">
                                                <Text size="text-sm" colorType="secondary">Type:</Text>
                                                <span className={lesson.status === 'online' ? styles.badgeOnline : styles.badgeOnsite}>
                                                    {lesson.status === 'online' ? 'Online' : 'On-site'}
                                                </span>
                                            </div>
                                        </div>
                                        <Button label="Join" colorType="primary" fullWidth />
                                    </div>
                                );
                            })}
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className={styles.table}>
                            <div className={styles.tableHeader}>
                                <Text size="text-xs" colorType="tertiary" className={styles.col1}>Teacher</Text>
                                <Text size="text-xs" colorType="tertiary" className={styles.col2}>Class</Text>
                                <Text size="text-xs" colorType="tertiary" className={styles.col3}>Date</Text>
                                <Text size="text-xs" colorType="tertiary" className={styles.col4}>Type</Text>
                                <div className={styles.col5}></div>
                            </div>
                            {upcomingLessons.map((lesson) => {
                                const startTime = DateTime.fromISO(lesson.startAt);
                                return (
                                    <div key={lesson.id} className={styles.tableRow}>
                                        <div className={styles.col1}>
                                            <div className={styles.teacher}>
                                                <Avatar src={lesson.teacher.avatar} size={40} hasVerifiedBadge={lesson.teacher.isSuperTeacher} />
                                                <div>
                                                    <Text size="text-sm" weight="semibold" colorType="primary">{lesson.teacher.name} {lesson.teacher.surname}</Text>
                                                    <Text size="text-xs" colorType="tertiary">{lesson.teacher.subject.name.en}</Text>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.col2}>
                                            <Text size="text-sm" colorType="secondary">{lesson.classType}</Text>
                                        </div>
                                        <div className={styles.col3}>
                                            <Text size="text-sm" colorType="secondary">{startTime.toFormat('ccc HH:mm')}</Text>
                                        </div>
                                        <div className={styles.col4}>
                                            <span className={lesson.status === 'online' ? styles.badgeOnline : styles.badgeOnsite}>
                                                {lesson.status === 'online' ? 'Online' : 'On-site'}
                                            </span>
                                        </div>
                                        <div className={styles.col5}>
                                            <div className={styles.actions}>
                                                <Button label={t('common.join')} colorType="primary" />
                                                <PopMenu
                                                    trigger={<Icon icon="more-vertical" iconWidth={20} iconHeight={20} />}
                                                    items={[
                                                        {
                                                            icon: <Icon icon="chat" iconWidth={16} iconHeight={16} />,
                                                            label: t('dashboard.chat'),
                                                            onClick: () => console.log('Chat')
                                                        },
                                                        {
                                                            icon: <Icon icon="book" iconWidth={16} iconHeight={16} />,
                                                            label: t('dashboard.details'),
                                                            onClick: () => openLessonDetails(lesson)
                                                        },
                                                        {
                                                            icon: <Icon icon="trash-can" iconWidth={16} iconHeight={16} />,
                                                            label: t('dashboard.cancel_lesson'),
                                                            onClick: () => console.log('Cancel lesson')
                                                        }
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Last Lessons */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Text textLevel="h2" size="text-lg" weight="semibold" colorType="primary">
                                {t('dashboard.last_lessons')}
                            </Text>
                            <a href="/me/last-lessons" className={styles.viewAll}>
                                <Text size="text-sm" colorType="accent">
                                    {t('dashboard.view_all')}
                                </Text>
                            </a>
                        </div>
                        
                        {/* Mobile Cards View */}
                        <div className={styles.mobileCards}>
                            <div>
                            {lastLessons.map((lesson) => {
                                const startTime = DateTime.fromISO(lesson.startAt);
                                const endTime = DateTime.fromISO(lesson.endAt);
                                const duration = endTime.diff(startTime, 'minutes').minutes;
                                const price = lesson.teacher.classTypes[0]?.price?.amount || 0;
                                
                                return (
                                    <div key={lesson.id} className={styles.lessonCard}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.teacher}>
                                                <Avatar src={lesson.teacher.avatar} size={40} hasVerifiedBadge={lesson.teacher.isSuperTeacher} />
                                                <div>
                                                    <Text size="text-sm" weight="semibold" colorType="primary">
                                                        {lesson.teacher.name} {lesson.teacher.surname}
                                                    </Text>
                                                    <Text size="text-xs" colorType="tertiary">
                                                        {lesson.teacher.subject.name.en}
                                                    </Text>
                                                </div>
                                            </div>
                                            <PopMenu
                                                trigger={<Icon icon="more-vertical" iconWidth={20} iconHeight={20} />}
                                                items={[
                                                    {
                                                        icon: <Icon icon="chat" iconWidth={16} iconHeight={16} />,
                                                        label: t('dashboard.chat'),
                                                        onClick: () => console.log('Chat')
                                                    },
                                                    {
                                                        icon: <Icon icon="book" iconWidth={16} iconHeight={16} />,
                                                        label: t('dashboard.details'),
                                                        onClick: () => openLessonDetails(lesson)
                                                    }
                                                ]}
                                            />
                                        </div>
                                        <div className={styles.cardDetails}>
                                            <Text size="text-sm" colorType="secondary" weight="medium">
                                                Class: {lesson.classType}
                                            </Text>
                                            <Text size="text-sm" colorType="secondary">
                                                Time: {duration} min
                                            </Text>
                                            <Text size="text-sm" colorType="secondary">
                                                Date: {startTime.toFormat('ccc h:mm a')}
                                            </Text>
                                            <Text size="text-sm" colorType="secondary">
                                                Mode: Group
                                            </Text>
                                            <Text size="text-sm" colorType="secondary">
                                                Price: €{price}
                                            </Text>
                                            <div className="flex items-center gap-2">
                                                <Text size="text-sm" colorType="secondary">Type:</Text>
                                                <span className={lesson.status === 'online' ? styles.badgeOnline : styles.badgeOnsite}>
                                                    {lesson.status === 'online' ? 'Online' : 'On-site'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className={styles.table}>
                            <div className={styles.tableHeader}>
                                <Text size="text-xs" colorType="tertiary" className={styles.col1}>Teacher</Text>
                                <Text size="text-xs" colorType="tertiary" className={styles.col2}>Class</Text>
                                <Text size="text-xs" colorType="tertiary" className={styles.col3}>Date</Text>
                                <Text size="text-xs" colorType="tertiary" className={styles.col4}>Type</Text>
                                <div className={styles.col5}></div>
                            </div>
                            {lastLessons.map((lesson) => {
                                const startTime = DateTime.fromISO(lesson.startAt);
                                return (
                                    <div key={lesson.id} className={styles.tableRow}>
                                        <div className={styles.col1}>
                                            <div className={styles.teacher}>
                                                <Avatar src={lesson.teacher.avatar} size={40} hasVerifiedBadge={lesson.teacher.isSuperTeacher} />
                                                <div>
                                                    <Text size="text-sm" weight="semibold" colorType="primary">{lesson.teacher.name} {lesson.teacher.surname}</Text>
                                                    <Text size="text-xs" colorType="tertiary">{lesson.teacher.subject.name.en}</Text>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.col2}>
                                            <Text size="text-sm" colorType="secondary">{lesson.classType}</Text>
                                        </div>
                                        <div className={styles.col3}>
                                            <Text size="text-sm" colorType="secondary">{startTime.toFormat('ccc HH:mm')}</Text>
                                        </div>
                                        <div className={styles.col4}>
                                            <span className={lesson.status === 'online' ? styles.badgeOnline : styles.badgeOnsite}>
                                                {lesson.status === 'online' ? 'Online' : 'On-site'}
                                            </span>
                                        </div>
                                        <div className={styles.col5}>
                                            <PopMenu
                                                trigger={<Icon icon="more-vertical" iconWidth={20} iconHeight={20} />}
                                                items={[
                                                    {
                                                        icon: <Icon icon="chat" iconWidth={16} iconHeight={16} />,
                                                        label: t('dashboard.chat'),
                                                        onClick: () => console.log('Chat')
                                                    },
                                                    {
                                                        icon: <Icon icon="book" iconWidth={16} iconHeight={16} />,
                                                        label: t('dashboard.details'),
                                                        onClick: () => openLessonDetails(lesson)
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Right Column - Sidebar */}
                <div className={styles.sidebar}>
                    {/* Clazzmate */}
                    <section className={styles.clazzmateCard}>
                        <div className={styles.clazzmateHeader}>
                            <div className={styles.clazzmateIcon}>
                                <Icon icon="access" iconWidth={20} iconHeight={20} />
                            </div>
                            <Text textLevel="h3" size="text-lg" weight="semibold" colorType="primary">
                                Clazzmate
                            </Text>
                        </div>
                        
                        <Text size="text-sm" colorType="tertiary" className="mb-4">
                            {t('clazzmate.invite_earn')}
                        </Text>
                        <Text size="text-xs" colorType="tertiary" className="mb-4">
                            {t('clazzmate.description')}
                        </Text>

                        <div className={styles.referralLink}>
                            <Text size="text-sm" colorType="secondary" className="flex-1 truncate">
                                {clazzmate.referralLink}
                            </Text>
                            <button onClick={handleCopyLink} className={styles.copyButton}>
                                <Icon icon={copied ? "check" : "copy"} iconWidth={16} iconHeight={16} />
                            </button>
                        </div>

                        <div className={styles.clazzmateStats}>
                            <div>
                                <Text size="text-xs" colorType="tertiary">{t('clazzmate.friends_invited')}</Text>
                                <Text size="text-xl" weight="semibold" colorType="primary" className="mt-1">{clazzmate.friendsInvited}</Text>
                            </div>
                            <div>
                                <Text size="text-xs" colorType="tertiary">{t('clazzmate.credits_earned')}</Text>
                                <Text size="text-xl" weight="semibold" colorType="primary" className="mt-1">€{clazzmate.creditsEarned.toFixed(2)}</Text>
                            </div>
                        </div>
                    </section>

                    {/* Saved Teachers */}
                    <section className={styles.savedTeachersSection}>
                        <div className={styles.sectionHeader}>
                            <Text textLevel="h3" size="text-lg" weight="semibold" colorType="primary">
                                {t('dashboard.saved_teachers')}
                            </Text>
                            <a href="/me/saved-teachers" className={styles.viewAll}>
                                <Text size="text-sm" colorType="accent">
                                    {t('dashboard.view_all')}
                                </Text>
                            </a>
                        </div>
                        
                        <div className={styles.teachersList}>
                            {savedTeachers.map((teacher) => (
                                <div key={teacher.id} className={styles.savedTeacher}>
                                    <div className="relative">
                                        <Avatar src={teacher.avatar} size={40} hasVerifiedBadge={teacher.isSuperTeacher} />
                                        {teacher.isOnline && <div className={styles.onlineDot} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Text size="text-sm" weight="semibold" colorType="primary" className="truncate">
                                            {teacher.name} {teacher.surname}
                                        </Text>
                                        <Text size="text-xs" colorType="tertiary" className="truncate">
                                            {teacher.subject.name.en}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Lesson Details Modal */}
            {selectedLesson && (
                <LessonDetailsModal
                    lesson={selectedLesson}
                    onClose={closeLessonDetails}
                    onCancel={() => {
                        console.log('Cancel lesson');
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
        </div>
    );
}
