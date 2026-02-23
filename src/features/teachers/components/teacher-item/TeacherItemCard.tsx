import type { Teacher } from "../../domain/types";
import { useTranslations } from "@/i18n";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { isSuperTutor } from "@/features/teachers/utils/superTutorHelpers";

export interface TeacherItemCardProps {
    teacher: Teacher;
    onBook: (teacher: Teacher) => void;
}

export function TeacherItemCard({ teacher, onBook }: TeacherItemCardProps) {
    const t = useTranslations();
    
    return (
        <>
            <div 
                className="bg-white rounded-2xl p-5 min-w-[280px] flex flex-col gap-4 border border-neutral-200">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar 
                            src={teacher.avatar} 
                            size={48} 
                            alt={`${teacher.name} ${teacher.surname}`}
                            hasVerifiedBadge={isSuperTutor(teacher.superTutorTo)}
                        />
                        <div className="flex flex-col">
                            <Text size="text-sm" weight="semibold" colorType="primary">
                                {teacher.name} {teacher.surname}
                            </Text>
                            <Text size="text-xs" colorType="tertiary">
                                {t('common.teacher')}
                            </Text>
                        </div>
                    </div>
                </div>
    
                {/* Details */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Text size="text-sm" className='text-[var(--color-neutral-500)]'>Rate:</Text>
                        <div className="flex flex-row gap-1">
                            <Text size="text-sm" colorType="primary" weight="medium">4.9/5</Text>
                            <Text size="text-sm" colorType="tertiary">202 reviews</Text>
                        </div>
                    </div>
    
                    <div className="flex items-center gap-2">
                        <Text size="text-sm" className='text-[var(--color-neutral-500)]'>Subject:</Text>
                        <Text size="text-sm" colorType="secondary">Spanish Teacher</Text>
                    </div>
                </div>
    
                {/* Action Button */}
                <div className="flex flex-row gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button size="lg" icon="chat" />
                    <Button label={t('teachers.book')} colorType="primary" size="lg" fullWidth onClick={() => onBook(teacher)} />
                </div>
            </div>
        </>
    );
}