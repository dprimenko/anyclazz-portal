import { useState, useMemo } from 'react';
import { useTranslations, getCurrentLang } from '@/i18n';
import type { ui } from '@/i18n/ui';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Chip } from '@/ui-library/components/ssr/chip/Chip';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Divider } from '@/ui-library/components/ssr/divider/Divider';
import { Space } from '@/ui-library/components/ssr/space/Space';
import { PageSelector } from '@/ui-library/components/page-selector';
import { ProgressIndicator } from '@/ui-library/components/progress-indicator';
import { EmptyState } from '@/ui-library/components/ssr/empty-state/EmptyState';
import { PopMenu } from '@/ui-library/components/pop-menu/PopMenu';
import { LessonDetailsModal } from '../lesson-details-modal/LessonDetailsModal';
import { ApiAdminBookingsRepository } from '../../infrastructure/ApiAdminBookingsRepository';
import { fromISOKeepZone, getUserTimezone } from '@/features/shared/utils/dateConfig';
import { formatPrice } from '@/features/shared/utils/formatPrice';
import type { BookingWithTeacher, GetBookingsResponse } from '../../domain/types';

const ITEMS_PER_PAGE = 20;

export interface AdminLessonsTableProps {
    initialLessons: GetBookingsResponse;
    token: string;
    entityId: string;
    /** 'student' = admin viewing a student's lessons (shows Teacher column)
     *  'teacher' = admin viewing a teacher's lessons (shows Student column) */
    perspective: 'student' | 'teacher';
    lang?: keyof typeof ui;
    /** Fallback subject name when lesson.teacher.subject is absent (e.g. teacher perspective) */
    subjectName?: string;
}

function LessonRow({ lesson, perspective, lang, subjectName }: { lesson: BookingWithTeacher; perspective: 'student' | 'teacher'; lang?: string; subjectName?: string }) {
    const t = useTranslations({ lang: lang as 'en' | 'es' | undefined });
    const currentLang = getCurrentLang();
    const [selectedLesson, setSelectedLesson] = useState<BookingWithTeacher | null>(null);

    const tz = getUserTimezone();
    const startTime = fromISOKeepZone(lesson.startAt).setZone(tz);
    const endTime = fromISOKeepZone(lesson.endAt).setZone(tz);
    const duration = endTime.diff(startTime, 'minutes').minutes;

    const isOnline = lesson.classTypeId?.includes('online');
    const isGroup = lesson.classType?.isGroup ?? lesson.classTypeId?.includes('_group') ?? false;

    const price = useMemo(() => {
        const amount = lesson.classType?.price?.price ?? lesson.payment?.amount;
        const currency = lesson.classType?.price?.currency ?? lesson.payment?.currency ?? 'EUR';
        if (amount == null) return '—';
        return formatPrice(amount, currency, lang || 'en');
    }, [lesson, lang]);

    const displayPerson = perspective === 'student' ? lesson.teacher : lesson.student;
    const subjectLabel = lesson.teacher?.subject?.name?.[currentLang] ?? subjectName ?? '—';

    const typeChip = (
        <Chip
            textColor={isOnline ? '#F4A43A' : '#175CD3'}
            bgColor={isOnline ? '#FFF9F2' : '#EFF8FF'}
            borderColor={isOnline ? '#FFEACF' : '#B2DDFF'}
        >
            <span className="text-xs font-medium">{isOnline ? t('common.online') : t('common.onsite')}</span>
        </Chip>
    );

    const menuItems = [
        {
            icon: <Icon icon="file-02" iconWidth={16} iconHeight={16} />,
            label: 'Details',
            onClick: () => setSelectedLesson(lesson),
        },
    ];

    const personLabel = perspective === 'student' ? t('common.teacher') : t('common.student');

    const mobileCard = (
        <div className="sm:hidden bg-white rounded-2xl p-4 w-full flex flex-col gap-3 border border-[var(--color-neutral-200)]">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar src={displayPerson?.avatar} size={48} alt={`${displayPerson?.name ?? ''} ${displayPerson?.surname ?? ''}`} />
                    <div className="flex flex-col gap-[2px]">
                        <Text size="text-sm" weight="semibold" colorType="primary">
                            {displayPerson?.name} {displayPerson?.surname}
                        </Text>
                        <Text size="text-xs" colorType="tertiary">{personLabel}</Text>
                    </div>
                </div>
                <PopMenu
                    trigger={<button type="button" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-100 transition-colors bg-transparent border-none cursor-pointer"><Icon icon="more-vertical" iconWidth={20} iconHeight={20} /></button>}
                    items={menuItems}
                    align="right"
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Text size="text-xs" className="text-[var(--color-neutral-500)]">{t('common.class')}:</Text>
                    <Text size="text-xs" colorType="secondary">{subjectLabel}</Text>
                </div>
                <div className="flex items-center gap-2">
                    <Text size="text-xs" className="text-[var(--color-neutral-500)]">{t('common.date')}:</Text>
                    <Text size="text-xs" colorType="secondary">{startTime.toFormat('ccc h:mma')}</Text>
                </div>
                {perspective === 'teacher' && (
                    <div className="flex items-center gap-2">
                        <Text size="text-xs" className="text-[var(--color-neutral-500)]">{t('common.mode')}:</Text>
                        <Text size="text-xs" colorType="secondary">
                            {duration} min · {isGroup ? t('common.group') : t('common.individual')}
                        </Text>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Text size="text-xs" className="text-[var(--color-neutral-500)]">{t('common.price')}:</Text>
                    <Text size="text-xs" colorType="secondary">{price}</Text>
                </div>
                <div className="flex items-center gap-2">
                    <Text size="text-xs" className="text-[var(--color-neutral-500)]">{t('common.type')}:</Text>
                    {typeChip}
                </div>
            </div>
        </div>
    );

    if (perspective === 'student') {
        // Cols: Teacher | Class | Date | Price | Type | •••
        return (
            <>
                {mobileCard}
                <div className="hidden sm:grid grid-cols-[2.5fr_1.5fr_1.5fr_1fr_1fr_40px] gap-4 items-center py-4 border-b border-[var(--color-neutral-200)] last:border-b-0">
                    <div className="flex items-center gap-3">
                        <Avatar src={displayPerson?.avatar} size={36} alt={`${displayPerson?.name ?? ''} ${displayPerson?.surname ?? ''}`} />
                        <div className="flex flex-col gap-[2px]">
                            <Text size="text-sm" weight="medium" colorType="primary">
                                {displayPerson?.name} {displayPerson?.surname}
                            </Text>
                            <Text size="text-xs" colorType="tertiary">{t('common.teacher')}</Text>
                        </div>
                    </div>
                    <Text size="text-sm" colorType="secondary">{subjectLabel}</Text>
                    <Text size="text-sm" colorType="secondary">{startTime.toFormat('ccc h:mma')}</Text>
                    <Text size="text-sm" colorType="secondary">{price}</Text>
                    <div className="flex">{typeChip}</div>
                    <div className="flex justify-end">
                        <PopMenu
                            trigger={<button type="button" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-100 transition-colors bg-transparent border-none cursor-pointer"><Icon icon="more-vertical" iconWidth={20} iconHeight={20} /></button>}
                            items={menuItems}
                            align="right"
                        />
                    </div>
                </div>
                {selectedLesson && (
                    <LessonDetailsModal
                        lesson={selectedLesson}
                        onClose={() => setSelectedLesson(null)}
                        lang={lang as 'en' | 'es' | undefined}
                        isAdmin
                    />
                )}
            </>
        );
    }

    // Teacher perspective
    // Cols: Student | Class | Time | Date | Mode | Price | Type | •••
    return (
        <>
            {mobileCard}
            <div className="hidden sm:grid grid-cols-[2fr_1.5fr_0.8fr_1.5fr_1fr_1fr_1fr_40px] gap-4 items-center py-4 border-b border-[var(--color-neutral-200)] last:border-b-0">
                <div className="flex items-center gap-3">
                    <Avatar src={displayPerson?.avatar} size={36} alt={`${displayPerson?.name ?? ''} ${displayPerson?.surname ?? ''}`} />
                    <div className="flex flex-col gap-[2px]">
                        <Text size="text-sm" weight="medium" colorType="primary">
                            {displayPerson?.name} {displayPerson?.surname}
                        </Text>
                        <Text size="text-xs" colorType="tertiary">{t('common.student')}</Text>
                    </div>
                </div>
                <Text size="text-sm" colorType="secondary">{subjectLabel}</Text>
                <Text size="text-sm" colorType="secondary">{duration} min</Text>
                <Text size="text-sm" colorType="secondary">{startTime.toFormat('ccc h:mma')}</Text>
                <Text size="text-sm" colorType="secondary">
                    {isGroup ? t('common.group') : t('common.individual')}
                </Text>
                <Text size="text-sm" colorType="secondary">{price}</Text>
                <div className="flex">{typeChip}</div>
                <div className="flex justify-end">
                    <PopMenu
                        trigger={<button type="button" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-100 transition-colors bg-transparent border-none cursor-pointer"><Icon icon="more-vertical" iconWidth={20} iconHeight={20} /></button>}
                        items={menuItems}
                        align="right"
                    />
                </div>
            </div>
            {selectedLesson && (
                <LessonDetailsModal
                    lesson={selectedLesson}
                    onClose={() => setSelectedLesson(null)}
                    lang={lang as 'en' | 'es' | undefined}
                    isAdmin
                />
            )}
        </>
    );
}

function AdminLessonsTableInner({ initialLessons, token, entityId, perspective, lang, subjectName }: AdminLessonsTableProps) {
    const t = useTranslations({ lang: lang as 'en' | 'es' | undefined });

    const repository = useMemo(() => new ApiAdminBookingsRepository(), []);
    const [lessons, setLessons] = useState(initialLessons);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const pages = lessons.meta.lastPage;

    const fetchPage = async (nextPage: number) => {
        setLoading(true);
        try {
            const data = perspective === 'student'
                ? await repository.getStudentBookings({ token, entityId, page: nextPage, size: ITEMS_PER_PAGE })
                : await repository.getTeacherBookings({ token, entityId, page: nextPage, size: ITEMS_PER_PAGE });
            setLessons(data);
            setPage(nextPage);
        } catch (err) {
            console.error('Error fetching admin bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-10">
                <ProgressIndicator size="lg" />
            </div>
        );
    }

    if (lessons.bookings.length === 0) {
        return (
            <EmptyState
                title={t('common.no_results')}
                description=""
            />
        );
    }

    const studentHeaders = (
        <div className="hidden sm:grid grid-cols-[2.5fr_1.5fr_1.5fr_1fr_1fr_40px] gap-4 py-3 border-b border-[var(--color-neutral-200)]">
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.teacher')}</Text>
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.class')}</Text>
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.date')}</Text>
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.price')}</Text>
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.type')}</Text>
            <div />
        </div>
    );

    const teacherHeaders = (
        <div className="hidden sm:grid grid-cols-[2fr_1.5fr_0.8fr_1.5fr_1fr_1fr_1fr_40px] gap-4 py-3 border-b border-[var(--color-neutral-200)]">
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.student')}</Text>
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.class')}</Text>
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.time')}</Text>
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.date')}</Text>
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.mode')}</Text>
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.price')}</Text>
            <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.type')}</Text>
            <div />
        </div>
    );

    return (
        <div className="flex flex-col gap-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="w-full overflow-x-auto">
                {perspective === 'student' ? studentHeaders : teacherHeaders}
                <div className="flex flex-col gap-3 sm:gap-0">
                {lessons.bookings.map((lesson) => (
                    <LessonRow key={lesson.id} lesson={lesson} perspective={perspective} lang={lang} subjectName={subjectName} />
                ))}
                </div>
            </div>

            {pages > 1 && (
                <>
                    <Divider />
                    <Space size={4} direction="vertical" />
                    <PageSelector
                        pages={pages}
                        currentPage={page}
                        maxPages={3}
                        disabled={loading}
                        onChangedPage={fetchPage}
                    />
                </>
            )}
        </div>
    );
}

export function AdminLessonsTable(props: AdminLessonsTableProps) {
    return (
        <LanguageProvider lang={props.lang ?? 'en'}>
            <AdminLessonsTableInner {...props} />
        </LanguageProvider>
    );
}
