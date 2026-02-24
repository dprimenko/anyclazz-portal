import { getCurrentLang, useTranslations } from "@/i18n";
import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { cn } from "@/lib/utils";
import type { Teacher } from "../../domain/types";
import { Button } from "@/ui-library/components/ssr/button/Button";

export interface TeacherItemProps {
    teacher: Teacher;
    onBook: (teacher: Teacher) => void;
}

export function TeacherItem({ teacher, onBook }: TeacherItemProps) {
    const t = useTranslations();

    const containerClasses = cn(
        "py-4"
    );

    const classNames = cn(
        "grid grid-cols-[2fr_2fr_2fr_1.5fr] gap-4 items-center",
    );

    return (
        <>
            <div className={containerClasses}>
                <div className={classNames}>
                    <div className="flex items-center">
                        <div className="flex items-center gap-3">
                            <Avatar src={teacher.avatar} size={40} alt={`${teacher.name} ${teacher.surname}`} />
                            <div className="flex flex-col gap-[2px]">
                                <a href={`/teacher/${teacher.id}`}>
                                    <Text size="text-sm" weight="medium" colorType="primary" underline>{teacher.name}{' '}{teacher.surname}</Text>
                                </a>
                                <Text size="text-sm" colorType="tertiary">{t('common.teacher_of', { subject: teacher.subject.name[getCurrentLang()] })}</Text>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-1">
                            <Text size="text-sm" colorType="primary" weight="medium">{teacher.averageRating}/5</Text>
                            <Text size="text-sm" colorType="tertiary">{teacher.reviewsNumber} reviews</Text>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <Text size="text-sm" colorType="secondary">Spanish Teacher</Text>
                    </div>
                    <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                        <div className={cn("flex gap-2 justify-end")}>
                            <Button size="lg" icon="chat" />
                            <Button label={t('teachers.book')} colorType="primary" size="lg" fullWidth onClick={() => onBook(teacher)} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}