import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Text } from "@/ui-library/components/ssr/text/Text";
import type { Teacher } from "@/features/teachers/domain/types";
import { Card } from "@/ui-library/components/ssr/card/Card";

export interface SavedTeacherCardProps {
    teacher: Teacher;
    isOnline?: boolean;
    onClick?: () => void;
}

export function SavedTeacherCard({ teacher, isOnline = false, onClick }: SavedTeacherCardProps) {
    return (
        <Card
            className="flex flex-row gap-3 p-4"
        >
            <div className="relative">
                <Avatar
                    src={teacher.avatar}
                    alt={`${teacher.name} ${teacher.surname}`}
                    size={40}
                    hasVerifiedBadge={teacher.isSuperTeacher}
                />
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-[var(--color-success-500)]" />
                )}
            </div>

            <div className="flex-1 flex flex-col justify-center gap-0.5 min-w-0">
                <Text textLevel="h4" size="text-sm" weight="semibold" colorType="primary" className="truncate">
                    {teacher.name} {teacher.surname}
                </Text>
                <Text size="text-xs" colorType="tertiary" className="truncate">
                    {teacher.subject.name.en || 'English teacher'}
                </Text>
            </div>
        </Card>
    );
}
