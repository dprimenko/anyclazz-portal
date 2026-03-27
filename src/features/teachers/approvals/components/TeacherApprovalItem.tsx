import { getCurrentLang, useTranslations } from "@/i18n";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { cn } from "@/lib/utils";
import type { TeacherApproval, TeacherApprovalFilter } from "../domain/types";
import { DateTime } from "luxon";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { cities } from '@/features/teachers/onboarding/data/cities';

export interface TeacherApprovalItemProps {
    teacher: TeacherApproval;
    mode: TeacherApprovalFilter;
    onApprove: (teacher: TeacherApproval) => void;
    onReject: (teacher: TeacherApproval) => void;
    isLoading?: boolean;
}

export function TeacherApprovalItem({ teacher, onApprove, onReject, isLoading, mode }: TeacherApprovalItemProps) {
    const t = useTranslations();
    const lang = getCurrentLang();

    const formatDate = (dateString: string) => {
        const dt = DateTime.fromISO(dateString);
        return dt.toFormat('MMM dd, yyyy \u2013 HH:mm (ZZZZ)');
    };

    const containerClasses = cn(
        "py-4"
    );

    const classNames = cn(
        "grid grid-cols-[3fr_2fr_1fr_1.5fr_2fr] gap-4 items-center",
    );

    const location = teacher.location 
        ? (() => {
            const cityData = cities.find(c => 
                c.city === teacher.location?.city?.toLowerCase() && 
                c.country === teacher.location?.country?.toLowerCase()
            );
            
            if (cityData) {
                return `${cityData.name[lang]}, ${teacher.location.country?.toUpperCase()}`;
            } else {
                return `${teacher.location.city || ''}, ${teacher.location.country?.toUpperCase() || ''}`.trim().replace(/^,\s*|,\s*$/g, '');
            }
        })()
        : '-';

    const subject = teacher.subject?.name[lang] || '-';

    return (
        <div className={containerClasses}>
            <div className={classNames}>
                {/* Teacher */}
                <div className="flex items-center">
                    <div className="flex items-center gap-3">
                        <Avatar src={teacher.avatar || undefined} size={40} alt={`${teacher.name} ${teacher.surname}`} />
                        <div className="flex flex-col gap-[2px]">
                            <a href={`/teacher/${teacher.id}`}>
                                <Text size="text-sm" weight="medium" colorType="primary" underline>
                                    {teacher.name} {teacher.surname}
                                </Text>
                            </a>
                            <Text size="text-sm" colorType="tertiary">{teacher.email}</Text>
                        </div>
                    </div>
                </div>

                {/* Registered At */}
                <div className="flex flex-col">
                    <Text size="text-sm" colorType="secondary">
                        {formatDate(teacher.createdAt)}
                    </Text>
                </div>

                {/* Location */}
                <div className="flex flex-col">
                    <Text size="text-sm" colorType="secondary">
                        {location}
                    </Text>
                </div>

                {/* Teaches (Subject) */}
                <div className="flex flex-col">
                    <Text size="text-sm" colorType="secondary">
                        {subject}
                    </Text>
                </div>

                <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                    <div className={cn("flex gap-2 justify-end")}>
                        {mode === 'pending' && (
                            <Button label={t('common.reject')} colorType='secondary' icon="close" iconColor="#A4A7AE" onClick={() => onReject(teacher)} />
                        )}
                        <Button label={t('common.approve')} colorType='primary' icon="check" onClick={() => onApprove(teacher)}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
