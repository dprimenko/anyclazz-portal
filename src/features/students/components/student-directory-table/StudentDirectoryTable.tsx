import { useTranslations } from '@/i18n';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { ProgressIndicator } from '@/ui-library/components/progress-indicator';
import { EmptyState } from '@/ui-library/components/ssr/empty-state/EmptyState';
import { StudentDirectoryItem } from '../student-directory-item/StudentDirectoryItem';
import type { AdminStudent } from '../../domain/types';

interface StudentDirectoryTableProps {
    students: AdminStudent[];
    loading?: boolean;
}

export function StudentDirectoryTable({ students, loading = false }: StudentDirectoryTableProps) {
    const t = useTranslations();

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-10">
                <ProgressIndicator size="lg" />
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <EmptyState
                title={t('admin.student_directory.no_students')}
                description={t('admin.student_directory.no_students_description')}
            />
        );
    }

    return (
        <div className="w-full">
            <div className="hidden sm:grid grid-cols-[3fr_2fr_1fr_40px] gap-4 py-3 border-b border-[var(--color-neutral-200)]">
                <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.student')}</Text>
                <Text size="text-xs" colorType="tertiary" weight="semibold">{t('common.location')}</Text>
                <Text size="text-xs" colorType="tertiary" weight="semibold">{t('admin.student_directory.lessons_column')}</Text>
                <div />
            </div>
            <div className="flex flex-col gap-3 sm:gap-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                {students.map((student) => (
                    <div key={student.id} className="sm:border-b sm:border-[var(--color-neutral-200)] sm:last:border-b-0">
                        <StudentDirectoryItem student={student} />
                    </div>
                ))}
            </div>
        </div>
    );
}
