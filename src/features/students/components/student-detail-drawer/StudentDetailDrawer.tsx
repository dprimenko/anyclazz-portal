import ReactDOM from 'react-dom';
import { useIsMobile } from '@/ui-library/hooks/useIsMobile';
import { useTranslations } from '@/i18n';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Button } from '@/ui-library/components/ssr/button/Button';
import type { AdminStudent } from '../../domain/types';
import { timezoneToLocation } from '../../utils/timezoneToLocation';

interface StudentDetailDrawerProps {
    student: AdminStudent;
    onClose: () => void;
}

function DrawerContent({ student, onClose }: StudentDetailDrawerProps) {
    const t = useTranslations();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-neutral-200)] flex-shrink-0">
                <Text size="text-sm" weight="semibold" colorType="primary">
                    {t('common.student')}
                </Text>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-100 transition-colors bg-transparent border-none cursor-pointer"
                    aria-label={t('common.close')}
                >
                    <Icon icon="close" iconWidth={20} iconHeight={20} iconColor="#A4A7AE" />
                </button>
            </div>

            {/* Scrollable body */}
            <div className="flex flex-col gap-4 p-6" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                <Avatar
                    src={student.avatarUrl || undefined}
                    size={80}
                    alt={`${student.name} ${student.surname}`}
                />

                <div className="flex flex-col gap-1">
                    <Text size="text-lg" weight="semibold" colorType="primary">
                        {student.name} {student.surname}
                    </Text>

                    {student.totalLessons !== undefined && (
                        <div className="flex items-center gap-1.5">
                            <Icon icon="book-closed" iconWidth={16} iconHeight={16} />
                            <Text size="text-sm" colorType="secondary">
                                {student.totalLessons} {t('common.lessons')}
                            </Text>
                        </div>
                    )}

                    <Text size="text-sm" colorType="secondary">
                        {timezoneToLocation(student.timezone)}
                    </Text>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 px-6 py-4 border-t border-[var(--color-neutral-200)] flex-shrink-0">
                {/* <Button label={t('admin.student_directory.block_account')} colorType="secondary" onClick={() => {}} /> */}
                <Button label={t('admin.student_directory.show_history')} colorType="secondary" onClick={() => { window.location.href = `/admin/student-directory/${student.id}/lessons?name=${encodeURIComponent(student.name + ' ' + student.surname)}`; }} />
            </div>
        </div>
    );
}

export function StudentDetailDrawer({ student, onClose }: StudentDetailDrawerProps) {
    const isMobile = useIsMobile();
    const modalRoot = document.getElementById('portal-root');

    if (!modalRoot) return null;

    // Mobile: bottom sheet
    if (isMobile) {
        return ReactDOM.createPortal(
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'flex-end',
                }}
                onClick={onClose}
            >
                <div
                    style={{
                        width: '100%',
                        maxHeight: '85vh',
                        backgroundColor: 'white',
                        borderTopLeftRadius: '1rem',
                        borderTopRightRadius: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DrawerContent student={student} onClose={onClose} />
                </div>
            </div>,
            modalRoot,
        );
    }

    // Desktop: right-side drawer
    return ReactDOM.createPortal(
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                display: 'flex',
                justifyContent: 'flex-end',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    width: '320px',
                    height: '100%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <DrawerContent student={student} onClose={onClose} />
            </div>
        </div>,
        modalRoot,
    );
}
