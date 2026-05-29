import { useState } from 'react';
import { useTranslations, getCurrentLang } from '@/i18n';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { PopMenu } from '@/ui-library/components/pop-menu/PopMenu';
import { isSuperTutor } from '@/features/teachers/utils/superTutorHelpers';
import { cities } from '@/features/teachers/onboarding/data/cities';
import type { AdminTeacher } from '../domain/types';
import { TeacherDetailDrawer } from './TeacherDetailDrawer';

export interface TeacherDirectoryItemProps {
    teacher: AdminTeacher;
    token: string;
}

function formatLocation(location?: AdminTeacher['location'], lang: 'en' | 'es' = 'en'): string {
    if (!location?.city && !location?.country) return '-';
    const cityCode = location.city ?? '';
    const country = location.country?.toUpperCase() ?? '';
    const cityEntry = cities.find(c => c.city === cityCode);
    const cityName = cityEntry ? cityEntry.name[lang] : cityCode;
    if (cityName && country) return `${cityName}, ${country}`;
    return cityName || country;
}

export function TeacherDirectoryItem({ teacher, token }: TeacherDirectoryItemProps) {
    const t = useTranslations();
    const lang = getCurrentLang();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const subjectName = teacher.subject?.name[lang] ?? '-';
    const score = teacher.averageRating > 0 ? `${teacher.averageRating.toFixed(1)}/5` : '-';

    const menuItems = [
        {
            icon: <Icon icon="user-circle" iconWidth={16} iconHeight={16} />,
            label: t('admin.teacher_directory.view_user'),
            onClick: () => setDrawerOpen(true),
        },
        {
            icon: <Icon icon="file-02" iconWidth={16} iconHeight={16} />,
            label: t('admin.teacher_directory.show_history'),
            onClick: () => { window.location.href = `/admin/teacher-directory/${teacher.id}/lessons?name=${encodeURIComponent(teacher.name + ' ' + teacher.surname)}`; },
        },
        // {
        //     icon: <Icon icon="slash-circle-01" iconWidth={16} iconHeight={16} />,
        //     label: t('admin.teacher_directory.block_account'),
        //     onClick: () => {},
        // },
    ];

    const location = formatLocation(teacher.location, lang);

    const popMenuTrigger = (
        <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-100 transition-colors bg-transparent border-none cursor-pointer"
            aria-label={t('common.actions')}
        >
            <Icon icon="more-vertical" iconWidth={20} iconHeight={20} />
        </button>
    );

    return (
        <>
            {/* Mobile card */}
            <div className="sm:hidden bg-white rounded-xl border border-[var(--color-neutral-200)] p-4 w-full flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={teacher.avatar || undefined}
                            size={48}
                            alt={`${teacher.name} ${teacher.surname}`}
                            hasVerifiedBadge={isSuperTutor(teacher.superTutorTo)}
                        />
                        <div className="flex flex-col gap-[2px]">
                            <a href={`/teacher/${teacher.id}`} className="no-underline hover:opacity-70 transition-opacity">
                                <Text size="text-sm" weight="semibold" colorType="primary">
                                    {teacher.name} {teacher.surname}
                                </Text>
                            </a>
                            <Text size="text-xs" colorType="tertiary">{subjectName}</Text>
                        </div>
                    </div>
                    <PopMenu trigger={popMenuTrigger} items={menuItems} align="right" />
                </div>

                {location !== '-' && (
                    <div className="flex items-center gap-2">
                        <Icon icon="marker-pin-02" iconWidth={14} iconHeight={14} />
                        <Text size="text-sm" colorType="secondary">{location}</Text>
                    </div>
                )}

                <div className="flex gap-6 flex-wrap border-t border-[var(--color-neutral-200)] pt-3">
                    <div className="flex flex-col items-center gap-0.5">
                        <Text size="text-sm" weight="semibold" colorType="primary">{teacher.lessonsNumber}</Text>
                        <Text size="text-xs" colorType="tertiary">{t('admin.teacher_directory.lessons_column')}</Text>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <Text size="text-sm" weight="semibold" colorType="primary">{teacher.studentsNumber}</Text>
                        <Text size="text-xs" colorType="tertiary">{t('admin.teacher_directory.students_column')}</Text>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <Text size="text-sm" weight="semibold" colorType="primary">{teacher.reviewsNumber}</Text>
                        <Text size="text-xs" colorType="tertiary">{t('admin.teacher_directory.reviews_column')}</Text>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <Text size="text-sm" weight="semibold" colorType="primary">{score}</Text>
                        <Text size="text-xs" colorType="tertiary">{t('admin.teacher_directory.score_column')}</Text>
                    </div>
                </div>
            </div>

            {/* Desktop table row */}
            <div className="hidden sm:block py-4">
                <div className="grid grid-cols-[3fr_1.5fr_0.8fr_1.5fr_0.8fr_0.8fr_0.8fr_40px] gap-4 items-center">
                    {/* Teacher */}
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={teacher.avatar || undefined}
                            size={40}
                            alt={`${teacher.name} ${teacher.surname}`}
                            hasVerifiedBadge={isSuperTutor(teacher.superTutorTo)}
                        />
                        <div className="flex flex-col gap-[2px]">
                            <a href={`/teacher/${teacher.id}`} className="no-underline hover:opacity-70 transition-opacity">
                                <Text size="text-sm" weight="medium" colorType="primary">
                                    {teacher.name} {teacher.surname}
                                </Text>
                            </a>
                            <Text size="text-sm" colorType="tertiary">{subjectName}</Text>
                        </div>
                    </div>

                    {/* Location */}
                    <Text size="text-sm" colorType="secondary">{location}</Text>

                    {/* Lessons */}
                    <Text size="text-sm" colorType="secondary">{teacher.lessonsNumber}</Text>

                    {/* Teaches */}
                    <Text size="text-sm" colorType="secondary">{subjectName}</Text>

                    {/* Students */}
                    <Text size="text-sm" colorType="secondary">{teacher.studentsNumber}</Text>

                    {/* Reviews */}
                    <Text size="text-sm" colorType="secondary">{teacher.reviewsNumber}</Text>

                    {/* Score */}
                    <Text size="text-sm" colorType="secondary">{score}</Text>

                    {/* Actions */}
                    <div className="flex justify-end">
                        <PopMenu trigger={popMenuTrigger} items={menuItems} align="right" />
                    </div>
                </div>
            </div>

            {drawerOpen && (
                <TeacherDetailDrawer
                    teacher={teacher}
                    token={token}
                    onClose={() => setDrawerOpen(false)}
                />
            )}
        </>
    );
}
