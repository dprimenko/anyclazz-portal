import { useTranslations } from '@/i18n';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { ProgressIndicator } from '@/ui-library/components/progress-indicator';
import { EmptyState } from '@/ui-library/components/ssr/empty-state/EmptyState';
import { TeacherDirectoryItem } from './TeacherDirectoryItem';
import type { AdminTeacher } from '../domain/types';

interface TeacherDirectoryTableProps {
    teachers: AdminTeacher[];
    loading?: boolean;
    token: string;
}

export function TeacherDirectoryTable({ teachers, loading = false, token }: TeacherDirectoryTableProps) {
    const t = useTranslations();

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-10">
                <ProgressIndicator size="lg" />
            </div>
        );
    }

    if (teachers.length === 0) {
        return (
            <EmptyState
                title={t('admin.teacher_directory.no_teachers')}
                description={t('admin.teacher_directory.no_teachers_description')}
            />
        );
    }

    return (
        <div className="w-full">
            <div className="hidden sm:grid grid-cols-[3fr_1.5fr_0.8fr_1.5fr_0.8fr_0.8fr_0.8fr_40px] gap-4 py-3 border-b border-[var(--color-neutral-200)]">
                <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.teacher')}</Text>
                <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.location')}</Text>
                <Text size="text-xs" colorType="tertiary" weight="semibold">{t('admin.teacher_directory.lessons_column')}</Text>
                <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.teaches')}</Text>
                <Text size="text-xs" colorType="tertiary" weight="semibold">{t('admin.teacher_directory.students_column')}</Text>
                <Text size="text-xs" colorType="tertiary" weight="semibold">{t('admin.teacher_directory.reviews_column')}</Text>
                <Text size="text-xs" colorType="tertiary" weight="semibold">{t('admin.teacher_directory.score_column')}</Text>
                <div />
            </div>
            <div className="flex flex-col gap-3 sm:gap-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="sm:border-b sm:border-[var(--color-neutral-200)] sm:last:border-b-0">
                        <TeacherDirectoryItem teacher={teacher} token={token} />
                    </div>
                ))}
            </div>
        </div>
    );
}
