import { useState } from 'react';
import { useTranslations } from '@/i18n';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { PopMenu } from '@/ui-library/components/pop-menu/PopMenu';
import type { AdminStudent } from '../../domain/types';
import { timezoneToLocation } from '../../utils/timezoneToLocation';
import { StudentDetailDrawer } from '../student-detail-drawer/StudentDetailDrawer';

export interface StudentDirectoryItemProps {
    student: AdminStudent;
}

export function StudentDirectoryItem({ student }: StudentDirectoryItemProps) {
    const t = useTranslations();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const menuItems = [
        {
            icon: <Icon icon="user-circle" iconWidth={16} iconHeight={16} />,
            label: t('admin.student_directory.view_user'),
            onClick: () => setDrawerOpen(true),
        },
        {
            icon: <Icon icon="file-02" iconWidth={16} iconHeight={16} />,
            label: t('admin.student_directory.show_history'),
            onClick: () => { window.location.href = `/admin/student-directory/${student.id}/lessons?name=${encodeURIComponent(student.name + ' ' + student.surname)}`; },
        },
        // {
        //     icon: <Icon icon="slash-circle-01" iconWidth={16} iconHeight={16} />,
        //     label: t('admin.student_directory.block_account'),
        //     onClick: () => {},
        // },
    ];

    const location = timezoneToLocation(student.timezone);

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
                    <Avatar src={student.avatarUrl || undefined} size={48} alt={`${student.name} ${student.surname}`} />
                    <div className="flex flex-col gap-[2px]">
                        <Text size="text-sm" weight="semibold" colorType="primary">
                            {student.name} {student.surname}
                        </Text>
                        <Text size="text-xs" colorType="tertiary">{t('common.student')}</Text>
                    </div>
                </div>
                <PopMenu trigger={popMenuTrigger} items={menuItems} align="right" />
            </div>

            <div className="flex flex-col gap-1.5">
                {location && (
                    <div className="flex items-center gap-2">
                        <Icon icon="marker-pin-02" iconWidth={14} iconHeight={14} />
                        <Text size="text-sm" colorType="secondary">{location}</Text>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Icon icon="book-closed" iconWidth={14} iconHeight={14} />
                    <Text size="text-sm" colorType="secondary">
                        {student.totalLessons ?? 0} {t('common.lessons')}
                    </Text>
                </div>
            </div>
        </div>

        {/* Desktop table row */}
        <div className="hidden sm:block py-4">
            <div className="grid grid-cols-[3fr_2fr_1fr_40px] gap-4 items-center">
                {/* Student */}
                <div className="flex items-center gap-3">
                    <Avatar src={student.avatarUrl || undefined} size={40} alt={`${student.name} ${student.surname}`} />
                    <div className="flex flex-col gap-[2px]">
                        <Text size="text-sm" weight="medium" colorType="primary">
                            {student.name} {student.surname}
                        </Text>
                        <Text size="text-sm" colorType="tertiary">{t('common.student')}</Text>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <Text size="text-sm" colorType="secondary">{location}</Text>
                </div>

                {/* Lessons */}
                <div>
                    <Text size="text-sm" colorType="secondary">
                        {student.totalLessons ?? '—'}
                    </Text>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <PopMenu trigger={popMenuTrigger} items={menuItems} align="right" />
                </div>
            </div>
        </div>

        {drawerOpen && (
            <StudentDetailDrawer
                student={student}
                onClose={() => setDrawerOpen(false)}
            />
        )}
        </>
    );
}
