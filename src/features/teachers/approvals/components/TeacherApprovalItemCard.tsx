import type { TeacherApproval } from "../domain/types";
import { getCurrentLang, useTranslations } from "@/i18n";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/shared/button";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { DateTime } from "luxon";
import { cities } from '@/features/teachers/onboarding/data/cities';

export interface TeacherApprovalItemCardProps {
    teacher: TeacherApproval;
    onApprove: (teacher: TeacherApproval) => void;
    onReject: (teacher: TeacherApproval) => void;
    isLoading?: boolean;
}

export function TeacherApprovalItemCard({ teacher, onApprove, onReject, isLoading }: TeacherApprovalItemCardProps) {
    const t = useTranslations();
    const lang = getCurrentLang();
    
    const formatDate = (dateString: string) => {
        const dt = DateTime.fromISO(dateString);
        return dt.toFormat('MMM dd, yyyy \u2013 HH:mm (ZZZZ)');
    };

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
        <div 
            className="bg-white rounded-2xl p-5 min-w-[280px] flex flex-col gap-4 border border-neutral-200">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar 
                        src={teacher.avatar || undefined} 
                        size={48} 
                        alt={`${teacher.name} ${teacher.surname}`}
                    />
                    <div className="flex flex-col">
                        <Text size="text-sm" weight="semibold" colorType="primary">
                            {teacher.name} {teacher.surname}
                        </Text>
                        <Text size="text-xs" colorType="tertiary">
                            {teacher.email}
                        </Text>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Text size="text-sm" className='text-[var(--color-neutral-500)]'>{t('common.registered')}:</Text>
                    <Text size="text-sm" colorType="secondary">{formatDate(teacher.createdAt)}</Text>
                </div>

                <div className="flex items-center gap-2">
                    <Text size="text-sm" className='text-[var(--color-neutral-500)]'>{t('common.location')}:</Text>
                    <Text size="text-sm" colorType="secondary">{location}</Text>
                </div>

                <div className="flex items-center gap-2">
                    <Text size="text-sm" className='text-[var(--color-neutral-500)]'>{t('common.teaches')}:</Text>
                    <Text size="text-sm" colorType="secondary">{subject}</Text>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-row gap-2">
                    <Button 
                        size="icon-lg" 
                        variant="ghost"
                        onClick={() => window.location.href = `/teacher/${teacher.id}`}
                        disabled={isLoading}
                    >
                        <Icon icon="eye" iconWidth={20} iconHeight={20} />
                    </Button>
                    <Button 
                        size="icon-lg" 
                        variant="ghost"
                        onClick={() => window.location.href = `/messages/${teacher.id}`}
                        disabled={isLoading}
                    >
                        <Icon icon="chat" iconWidth={20} iconHeight={20} />
                    </Button>
                </div>
                <Button 
                    size="lg" 
                    variant="default"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onApprove(teacher)}
                    disabled={isLoading}
                >
                    <Icon icon="check" iconWidth={16} iconHeight={16} />
                    {t('common.approve')}
                </Button>
                <Button 
                    size="lg" 
                    variant="destructive"
                    className="w-full"
                    onClick={() => onReject(teacher)}
                    disabled={isLoading}
                >
                    <Icon icon="x" iconWidth={16} iconHeight={16} />
                    {t('common.reject')}
                </Button>
            </div>
        </div>
    );
}
