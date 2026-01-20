import { useTranslations } from '@/i18n';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Card } from '@/ui-library/components/ssr/card/Card';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { DateTime } from '@/features/shared/utils/dateConfig';
import { Chip } from '@/ui-library/components/ssr/chip/Chip';
import type { BookingWithTeacher } from '@/features/bookings/domain/types';
import { EmptyState } from '@/ui-library/components/ssr/empty-state/EmptyState';
import type { AuthUser } from '@/features/auth/domain/types';
import { LessonDetailsModal } from '@/features/bookings/components/lesson-details-modal/LessonDetailsModal';
import { useState } from 'react';

interface DashboardProps {
    lang: string;
    upcomingLessons: BookingWithTeacher[];
    lastLessons: BookingWithTeacher[];
    user: AuthUser | null;
}

export function Dashboard({ lang, upcomingLessons, lastLessons, user }: DashboardProps) {
    const t = useTranslations();

    const isOnline = (lessonTypeId: string) => {
        return lessonTypeId.includes('online');
    }

	const [selectedLesson, setSelectedLesson] = useState<BookingWithTeacher | null>(null);
	
	const openLessonDetails = (lesson: BookingWithTeacher) => {
		setSelectedLesson(lesson);
	};

	const closeLessonDetails = () => {
		setSelectedLesson(null);
	};

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                <div className="flex-1 min-w-0">
                    {user && <Text textLevel="h3" size="display-xs" colorType="primary" weight="semibold">{t('dashboard.welcome_back', { name: user.firstName })}</Text>}
					{user?.role === 'teacher' && (
						<Text textLevel="h4" colorType="tertiary">{t('dashboard.ready_to_teach')}</Text>
					)}
                    {user?.role === 'student' && (
						<Text textLevel="h4" colorType="tertiary">{t('dashboard.ready_to_continue')}</Text>
					)}
                </div>
				{user?.role === 'student' && (
					<div className="flex gap-[0.75rem] w-full md:w-auto md:flex-shrink-0">
						<Button 
							icon="calendar-plus" 
							label={t('dashboard.schedule_lesson')} 
							colorType="secondary"
							className="flex-1 md:flex-none"
							onClick={() => window.location.href = '/teachers'}
						/>
						<Button 
							icon="search" 
							label={t('dashboard.find_teacher')} 
							colorType="primary"
							className="flex-1 md:flex-none"
							onClick={() => window.location.href = '/teachers'}
						/>
					</div>
				)}
            </div>

            <div className="flex flex-col gap-2">
			{/* Left Column - Lessons */}
			<div className="flex flex-col gap-2">
				<Card bgColor='#FFF9F3' className="px-6 py-5">
					<div className="flex justify-between items-center mb-4">
						<Text textLevel="h2" size="text-lg" weight="semibold" colorType="primary">
							{t('dashboard.upcoming_lessons')}
						</Text>
						<a href="/me/upcoming-lessons" className="no-underline transition-opacity hover:opacity-70">
							<Text size="text-sm" colorType="accent" underline>
								{t('dashboard.view_all')}
							</Text>
						</a>
					</div>
					
					{upcomingLessons.length > 0 && (
						<div className="w-full lg:block">
							<div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 py-3 border-b border-neutral-200">
								<Text size="text-xs" colorType="tertiary">{t('common.teacher')}</Text>
								<Text size="text-xs" colorType="tertiary">{t('common.date')}</Text>
								<Text size="text-xs" colorType="tertiary">{t('common.lesson_type')}</Text>
								<div></div>
							</div>
							{upcomingLessons.map((lesson) => {
								const startTime = DateTime.fromISO(lesson.startAt);
								return (
									<div key={lesson.id} className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 py-4 border-b border-neutral-100 last:border-b-0 items-center hover:bg-neutral-50" onClick={() => openLessonDetails(lesson)}>
										{lesson.student ? (
											<div className="flex items-center">
												<div className="flex items-center gap-3">
													<Avatar src={lesson.student.avatar} size={40} alt={`${lesson.student.name} ${lesson.student.surname}`} />
													<div>
														<Text size="text-sm" weight="semibold" colorType="primary">{lesson.student.name}{' '}{lesson.student.surname}</Text>
														<Text size="text-xs" colorType="tertiary">{t('common.student')}</Text>
													</div>
												</div>
											</div>
										) : lesson.teacher ? (
											<div className="flex items-center">
												<div className="flex items-center gap-3">
													<Avatar src={lesson.teacher.avatar} size={40} alt={`${lesson.teacher.name} ${lesson.teacher.surname}`} />
													<div>
														<Text size="text-sm" weight="semibold" colorType="primary">{lesson.teacher.name}{' '}{lesson.teacher.surname}</Text>
														<Text size="text-xs" colorType="tertiary">{t('common.teacher')}</Text>
													</div>
												</div>
											</div>
										) : (
											<div className="flex items-center">
												<Text size="text-sm" colorType="tertiary">{t('common.loading')}...</Text>
											</div>
										)}
										<div className="flex items-center">
											<Text size="text-sm" colorType="secondary">{startTime.toFormat('ccc HH:mm')}</Text>
										</div>
										<div className="flex items-center">
											<Chip textColor={isOnline(lesson.classTypeId) ? '#F4A43A' : '#175CD3'} bgColor={isOnline(lesson.classTypeId) ? '#FFF9F2' : '#EFF8FF'} borderColor={isOnline(lesson.classTypeId) ? '#FFEACF' : '#B2DDFF'}>
												<span className="text-xs font-medium">
													{isOnline(lesson.classTypeId) ? t('common.online') : t('common.onsite')}
												</span>
											</Chip>
										</div>
										<div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
											<div className="flex gap-2 justify-end">
												
												{user?.role === 'student' && lesson.paymentStatus !== 'completed' ? (
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
										</div>
									</div>
								);
							})}
						</div>
					)}

					{upcomingLessons.length === 0 && user?.role === 'student' && (
						<EmptyState
							title={t('dashboard.no_upcoming_lessons')}
							description={t('dashboard.no_upcoming_lessons_description')}
							buttonLabel={t('dashboard.find_teacher')}
							buttonIcon="search"
							onClickAction={() => window.location.href = '/teachers'}
							buttonColorType="primary"
						/>
					)}
					{upcomingLessons.length === 0 && user?.role === 'teacher' && (
						<EmptyState
							title={t('dashboard.no_upcoming_lessons.teacher')}
							description={t('dashboard.no_upcoming_lessons_description.teacher')}
						/>
					)}
				</Card>

				{/* Last Lessons */}
				<Card bgColor='#FFFFFF' className="px-6 py-5">
					<div className="flex justify-between items-center mb-4">
						<Text textLevel="h2" size="text-lg" weight="semibold" colorType="primary">
							{t('dashboard.last_lessons')}
						</Text>
						<a href="/me/last-lessons" className="no-underline transition-opacity hover:opacity-70">
							<Text size="text-sm" colorType="accent" underline>
								{t('dashboard.view_all')}
							</Text>
						</a>
					</div>
					
					{/* <div className={styles.mobileCards}>
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
					</div> */}

					{lastLessons.length > 0 && (
						<>
							<div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 py-3 border-b border-neutral-200">
								<Text size="text-xs" colorType="tertiary">{t('common.teacher')}</Text>
								<Text size="text-xs" colorType="tertiary">{t('common.date')}</Text>
								<Text size="text-xs" colorType="tertiary">{t('common.lesson_type')}</Text>
								<div></div>
							</div>
							{lastLessons.map((lesson) => {
								const startTime = DateTime.fromISO(lesson.startAt);
								return (
									<div key={lesson.id} className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 py-4 border-b border-neutral-100 last:border-b-0 items-center hover:bg-neutral-50">
										<div className="flex items-center">
											{lesson.student && (
												<div className="flex items-center">
													<div className="flex items-center gap-3">
														<Avatar src={lesson.student.avatar} size={40} />
														<div>
															<Text size="text-sm" weight="semibold" colorType="primary">{lesson.student.name}{' '}{lesson.student.surname}</Text>
															<Text size="text-xs" colorType="tertiary">{t('common.student')}</Text>
														</div>
													</div>
												</div>
											)}
											{lesson.teacher && (
												<div className="flex items-center">
													<div className="flex items-center gap-3">
														<Avatar src={lesson.teacher.avatar} size={40} />
														<div>
															<Text size="text-sm" weight="semibold" colorType="primary">{lesson.teacher.name}{' '}{lesson.teacher.surname}</Text>
															<Text size="text-xs" colorType="tertiary">{t('common.teacher')}</Text>
														</div>
													</div>
												</div>
											)}
										</div>
										<div className="flex items-center">
											<Text size="text-sm" colorType="secondary">{startTime.toFormat('ccc HH:mm')}</Text>
										</div>
										<div className="flex items-center">
											<Chip textColor={isOnline(lesson.classTypeId) ? '#F4A43A' : '#175CD3'} bgColor={isOnline(lesson.classTypeId) ? '#FFF9F2' : '#EFF8FF'} borderColor={isOnline(lesson.classTypeId) ? '#FFEACF' : '#B2DDFF'}>
												<span className="text-xs font-medium">
													{isOnline(lesson.classTypeId) ? t('common.online') : t('common.onsite')}
												</span>
											</Chip>
										</div>
										<div className="flex items-center">
											<div className="flex gap-2 justify-end">
												{/* <Button label={t('common.join')} colorType="primary" /> */}
											</div>
										</div>
									</div>
								);
							})}
						</>
					)}
					{lastLessons.length === 0 && user?.role === 'student' && (
						<EmptyState
							title={t('dashboard.no_past_lessons')}
							description={t('dashboard.no_past_lessons_description')}
							buttonLabel={t('dashboard.book_first_lesson')}
							onClickAction={() => window.location.href = '/teachers'}
							buttonColorType="primary"
						/>
					)}
					{lastLessons.length === 0 && user?.role === 'teacher' && (
						<EmptyState
							title={t('dashboard.no_past_lessons.teacher')}
							description={t('dashboard.no_past_lessons_description.teacher')}
						/>
					)}
				</Card>
			</div>

			{/* <div className={styles.sidebar}>
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
			</div> */}
		</div>
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
        </>
    );
}