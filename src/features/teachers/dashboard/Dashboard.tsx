import { useTranslations } from '@/i18n';
import type { ui } from '@/i18n/ui';
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
import { PaymentsDashboardSummary } from '@/features/stripe-connect';
import type { PaymentsDashboardResponse } from '@/features/stripe-connect';
import { ClazzmateCard } from '@/features/shared/components/clazzmate-card/ClazzmateCard';
import { SavedTeacherCard } from '@/features/teachers/components/saved-teacher-card/SavedTeacherCard';
import type { Teacher } from '@/features/teachers/domain/types';
import type { ReferralData } from '@/features/shared/domain/referralTypes';

interface DashboardProps {
    upcomingLessons: BookingWithTeacher[];
    lastLessons: BookingWithTeacher[];
    user: AuthUser | null;
    token?: string;
    paymentsDashboard?: PaymentsDashboardResponse | null;
    lang?: keyof typeof ui;
    savedTeachers?: Teacher[];
    referralData?: ReferralData | null;
    inviteUrl?: string;
}

export function Dashboard({ upcomingLessons, lastLessons, user, token, paymentsDashboard, lang = 'en', savedTeachers = [], referralData, inviteUrl = '' }: DashboardProps) {
    const t = useTranslations({ lang });
    const [upcomingList, setUpcomingList] = useState(upcomingLessons);
    const [lastList, setLastList] = useState(lastLessons);
    const [refreshing, setRefreshing] = useState(false);
    
    // Crear repositorio en el cliente
    const repository = useMemo(() => new AnyclazzMyBookingsRepository(), []);

    const handleLessonCancelled = async () => {
        if (!token) return;
        setRefreshing(true);
        try {
            const [upcoming, last] = await Promise.all([
                repository.getBookings({ token, filter: 'upcoming', sort: 'desc', page: 1, size: 3 }),
                repository.getBookings({ token, filter: 'last', sort: 'desc', page: 1, size: 3 }),
            ]);
            setUpcomingList(upcoming.bookings);
            setLastList(last.bookings);
        } catch (error) {
            console.error('Error refreshing lessons:', error);
        } finally {
            setRefreshing(false);
        }
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
						{/* <a href="/teachers" className='w-full md:w-auto'>
							<Button 
								icon="calendar-plus" 
								label={t('dashboard.schedule_lesson')} 
								colorType="secondary"
								className="flex-1 md:flex-none"
								fullWidth
								onClick={() => window.location.href = '/teachers'}
							/>
						</a> */}

						<a href="/teachers" className='w-full md:w-auto'>
							<Button 
								icon="search" 
								iconColor='#FDD7A5'
								
								label={t('dashboard.find_teacher')} 
								colorType="primary"
								fullWidth
								className="flex-1 md:flex-none"
								onClick={() => window.location.href = '/teachers'}
							/>
						</a>
					</div>
				)}
            </div>

            <div className="flex flex-col gap-2">
			{paymentsDashboard && (
				<>
					<PaymentsDashboardSummary dashboard={paymentsDashboard} />
					<div className="mb-4" />
				</>
			)}
			<div className={user?.role === 'student' ? "grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start" : "flex flex-col gap-2"}>
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
					lessons={upcomingList} 
					user={user}
					token={token}				lang={lang}					loading={refreshing}
					onLessonCancelled={handleLessonCancelled}
						emptyState={user?.role === 'student' ? (
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
					lessons={lastList} 
					user={user}
					token={token}				lang={lang}					loading={refreshing}
					onLessonCancelled={handleLessonCancelled}
						emptyState={user?.role === 'student' ? (
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

			{/* Right Column - Student sidebar */}
			{user?.role === 'student' && (
				<div className="flex flex-col gap-4">
					<ClazzmateCard
						referralLink={inviteUrl}
						friendsInvited={referralData?.friends_invited ?? 0}
						creditsEarned={referralData?.available_credit_amount ?? 0}
						lang={lang}
					/>

					<Card bgColor='#FFFFFF' className="px-6 py-5">
						<div className="flex justify-between items-center mb-4">
							<Text textLevel="h2" size="text-lg" weight="semibold" colorType="primary">
								{t('dashboard.saved_teachers')}
							</Text>
							<a href="/me/saved-teachers" className="no-underline transition-opacity hover:opacity-70">
								<Text size="text-sm" colorType="accent" underline>
									{t('dashboard.view_all')}
								</Text>
							</a>
						</div>

						{savedTeachers.length > 0 ? (
							<div className="flex flex-col gap-2">
								{savedTeachers.slice(0, 4).map((teacher) => (
									<SavedTeacherCard
										key={teacher.id}
										teacher={teacher}
										isOnline={teacher.isOnline}
										onClick={() => window.location.href = `/teacher/${teacher.id}`}
									/>
								))}
							</div>
						) : (
							<EmptyState
								title={t('dashboard.no_saved_teachers')}
								description={t('dashboard.no_saved_teachers_description')}
							/>
						)}
					</Card>
				</div>
			)}
			</div>
		</div>
        </>
    );
}