import { useTranslations } from '@/i18n';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Card } from '@/ui-library/components/ssr/card/Card';
import type { BookingWithTeacher } from '@/features/bookings/domain/types';
import { EmptyState } from '@/ui-library/components/ssr/empty-state/EmptyState';
import type { AuthUser } from '@/features/auth/domain/types';
import 'swiper/css';
import { LessonsTable } from '@/features/bookings/components/lessons-table/LessonsTable';
import { useState, useMemo } from 'react';
import { AnyclazzMyBookingsRepository } from '@/features/bookings/infrastructure/AnyclazzMyBookingsRepository';

interface DashboardProps {
    lang: string;
    upcomingLessons: BookingWithTeacher[];
    lastLessons: BookingWithTeacher[];
    user: AuthUser | null;
    token?: string;
}

export function Dashboard({ lang, upcomingLessons, lastLessons, user, token }: DashboardProps) {
    const t = useTranslations({ lang: lang as 'en' | 'es' });
    const [refreshKey, setRefreshKey] = useState(0);
    
    // Crear repositorio en el cliente
    const repository = useMemo(() => new AnyclazzMyBookingsRepository(), []);

    const handleLessonCancelled = () => {
        // Trigger a refresh by changing the key
        setRefreshKey(prev => prev + 1);
        // In a real app, you'd want to refresh the data from the server
        window.location.reload();
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
						<a href="/teachers">
							<Button 
								icon="calendar-plus" 
								label={t('dashboard.schedule_lesson')} 
								colorType="secondary"
								className="flex-1 md:flex-none"
								onClick={() => window.location.href = '/teachers'}
							/>
						</a>

						<a href="/teachers">
							<Button 
								icon="search" 
								iconColor='#FDD7A5'
								
								label={t('dashboard.find_teacher')} 
								colorType="primary"
								className="flex-1 md:flex-none"
								onClick={() => window.location.href = '/teachers'}
							/>
						</a>
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
					
					<LessonsTable 
						lessons={upcomingLessons} 
						user={user}
						token={token}
						onLessonCancelled={handleLessonCancelled}					lang={lang}						emptyState={user?.role === 'student' ? (
							<EmptyState
								title={t('dashboard.no_upcoming_lessons')}
								description={t('dashboard.no_upcoming_lessons_description')}
								buttonLabel={t('dashboard.find_teacher')}
								buttonIcon="search"
								onClickAction={() => window.location.href = '/teachers'}
								buttonColorType="primary"
							/>
						) : (
							<EmptyState
								title={t('dashboard.no_upcoming_lessons.teacher')}
								description={t('dashboard.no_upcoming_lessons_description.teacher')}
							/>
						)}
					/>
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
					
					<LessonsTable 
						lessons={lastLessons} 
						user={user}
						token={token}
						onLessonCancelled={handleLessonCancelled}					lang={lang}						emptyState={user?.role === 'student' ? (
							<EmptyState
								title={t('dashboard.no_past_lessons')}
								description={t('dashboard.no_past_lessons_description')}
								buttonLabel={t('dashboard.book_first_lesson')}
								onClickAction={() => window.location.href = '/teachers'}
								buttonColorType="primary"
							/>
						) : (
							<EmptyState
								title={t('dashboard.no_past_lessons.teacher')}
								description={t('dashboard.no_past_lessons_description.teacher')}
							/>
						)}
					/>
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
        </>
    );
}