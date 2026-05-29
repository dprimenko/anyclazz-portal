import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useIsMobile } from '@/ui-library/hooks/useIsMobile';
import { useTranslations, getCurrentLang } from '@/i18n';
import { Avatar } from '@/ui-library/components/ssr/avatar/Avatar';
import { Text } from '@/ui-library/components/ssr/text/Text';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';
import { Button } from '@/ui-library/components/ssr/button/Button';
import { Chip } from '@/ui-library/components/ssr/chip/Chip';
import { TextWithIcon } from '@/ui-library/components/ssr/text-with-icon/TextWithIcon';
import { ClassTypes } from '@/features/teachers/components/class-types/ClassTypes';
import { ApiTeacherRepository } from '@/features/teachers/infrastructure/ApiTeacherRepository';
import { isSuperTutor } from '@/features/teachers/utils/superTutorHelpers';
import { cities } from '@/features/teachers/onboarding/data/cities';
import type { Teacher } from '@/features/teachers/domain/types';
import type { AdminTeacher } from '../domain/types';

interface TeacherDetailDrawerProps {
    teacher: AdminTeacher;
    token: string;
    onClose: () => void;
}

const DEFAULT_PORTRAIT = 'https://anyclazz.b-cdn.net/fe57ea75605c476cadd30a1f53474fc1eacc7c28.jpg';

function formatLocation(address?: Teacher['teacherAddress'], lang: 'en' | 'es' = 'en'): string | null {
    if (!address?.city && !address?.country) return null;
    const cityCode = address.city ?? '';
    const country = address.country?.toUpperCase() ?? '';
    const cityEntry = cities.find(c => c.city === cityCode);
    const cityName = cityEntry ? cityEntry.name[lang] : cityCode;
    if (cityName && country) return `${cityName}, ${country}`;
    return cityName || country || null;
}

function DrawerContent({ teacher, adminTeacher, onClose }: { teacher: Teacher | null; adminTeacher: AdminTeacher; onClose: () => void }) {
    const t = useTranslations();
    const lang = getCurrentLang();

    const name = teacher ? `${teacher.name} ${teacher.surname}` : `${adminTeacher.name} ${adminTeacher.surname}`;
    const avatar = teacher?.avatar ?? adminTeacher.avatar ?? undefined;
    const portrait = teacher?.portrait ?? DEFAULT_PORTRAIT;
    const superTutorTo = teacher?.superTutorTo ?? adminTeacher.superTutorTo;
    const isSuper = isSuperTutor(superTutorTo);

    const hasConfiguredPrices = teacher?.classTypes?.some(ct =>
        ct.durations?.some(d => d.price?.amount != null)
    ) ?? false;

    const location = teacher ? formatLocation(teacher.teacherAddress, lang) : null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-neutral-200)] flex-shrink-0">
                <Text size="text-sm" weight="semibold" colorType="primary">
                    {t('common.teacher')}
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
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                {/* Portrait */}
                <div className="relative">
                    <img
                        src={portrait}
                        alt={name}
                        className="w-full object-cover rounded-xl"
                        style={{ height: '140px' }}
                    />
                </div>

                <div className="px-5 pb-6">
                    {/* Avatar overlapping portrait */}
                    <div style={{ marginTop: '-34px', marginBottom: '12px' }}>
                        <Avatar
                            src={avatar}
                            size={72}
                            alt={name}
                            hasVerifiedBadge={isSuper}
                            hasOutline
                        />
                    </div>

                    {/* Name + Super Tutor badge */}
                    <div className="flex flex-row gap-2 items-center flex-wrap mb-1">
                        <Text size="text-lg" weight="semibold" colorType="primary">{name}</Text>
                        {isSuper && (
                            <Chip colorType="primary" rounded>
                                <Icon icon="verified" iconWidth={14} iconHeight={14} />
                                <Text size="inherit" textLevel="span" weight="medium" colorType="accent">
                                    {t('teachers.super-tutor')}
                                </Text>
                            </Chip>
                        )}
                    </div>

                    {teacher ? (
                        <>
                            {/* Rating + stats */}
                            <div className="flex flex-row gap-3 flex-wrap mb-4">
                                {(teacher.averageRating ?? 0) > 0 && (
                                    <TextWithIcon icon="star" colorType="primary" size="text-sm" weight="medium">
                                        {teacher.averageRating!.toFixed(1)}
                                    </TextWithIcon>
                                )}
                                {(teacher.reviewsNumber ?? 0) > 0 && (
                                    <Text colorType="tertiary" size="text-sm">
                                        {teacher.reviewsNumber} {t('common.reviews')}
                                    </Text>
                                )}
                                <TextWithIcon icon="people" colorType="tertiary" size="text-sm">
                                    {teacher.studentsNumber ?? 0} {t('common.students')}
                                </TextWithIcon>
                                <TextWithIcon icon="book" colorType="tertiary" size="text-sm">
                                    {teacher.lessonsNumber ?? 0} {t('common.lessons')}
                                </TextWithIcon>
                            </div>

                            {/* About */}
                            {teacher.about && (
                                <div className="mb-4">
                                    <Text size="text-sm" weight="semibold" colorType="primary" className="mb-1">
                                        {t('teacher-profile.about_me')}
                                    </Text>
                                    <div
                                        className="text-sm text-[var(--color-text-secondary)]"
                                        dangerouslySetInnerHTML={{ __html: teacher.about }}
                                    />
                                </div>
                            )}

                            {/* Location */}
                            {location && (
                                <div className="flex items-center gap-1.5 mb-4">
                                    <Icon icon="marker-pin-02" iconWidth={16} iconHeight={16} />
                                    <Text size="text-sm" colorType="secondary">{location}</Text>
                                </div>
                            )}

                            {/* Class types & prices */}
                            {hasConfiguredPrices && (
                                <div className="mb-4">
                                    <ClassTypes classTypes={teacher.classTypes} lang={lang} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-[var(--color-primary-700)] border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 px-5 py-4 border-t border-[var(--color-neutral-200)] flex-shrink-0">
                {/* <Button label={t('admin.teacher_directory.block_account')} colorType="secondary" onClick={() => {}} /> */}
                <Button label={t('admin.teacher_directory.show_history')} colorType="secondary" onClick={() => { window.location.href = `/admin/teacher-directory/${adminTeacher.id}/lessons?name=${encodeURIComponent(adminTeacher.name + ' ' + adminTeacher.surname)}`; }} />
            </div>
        </div>
    );
}

export function TeacherDetailDrawer({ teacher: adminTeacher, token, onClose }: TeacherDetailDrawerProps) {
    const isMobile = useIsMobile();
    const [teacher, setTeacher] = useState<Teacher | null>(null);

    useEffect(() => {
        const repo = new ApiTeacherRepository();
        repo.getTeacher({ token, teacherId: adminTeacher.id })
            .then(setTeacher)
            .catch(console.error);
    }, [adminTeacher.id, token]);

    const modalRoot = document.getElementById('portal-root');
    if (!modalRoot) return null;

    const content = <DrawerContent teacher={teacher} adminTeacher={adminTeacher} onClose={onClose} />;

    if (isMobile) {
        return ReactDOM.createPortal(
            <div
                style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end' }}
                onClick={onClose}
            >
                <div
                    style={{ width: '100%', maxHeight: '90vh', backgroundColor: 'white', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {content}
                </div>
            </div>,
            modalRoot,
        );
    }

    return ReactDOM.createPortal(
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'flex-end' }}
            onClick={onClose}
        >
            <div
                style={{ width: '360px', height: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                onClick={(e) => e.stopPropagation()}
            >
                {content}
            </div>
        </div>,
        modalRoot,
    );
}
