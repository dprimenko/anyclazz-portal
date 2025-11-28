import { Avatar } from "@/ui-library/components/ssr/avatar/Avatar";
import { Text } from "@/ui-library/components/ssr/text/Text";
import type { Teacher } from "@/features/teachers/domain/types";
import classNames from "classnames";
import styles from "./SavedTeacherCard.module.css";

export interface SavedTeacherCardProps {
    teacher: Teacher;
    isOnline?: boolean;
    onClick?: () => void;
}

export function SavedTeacherCard({ teacher, isOnline = false, onClick }: SavedTeacherCardProps) {
    const containerClasses = classNames(
        "flex flex-row gap-3 p-3 rounded-lg border border-neutral-200 bg-white cursor-pointer",
        styles.savedTeacherCard
    );

    return (
        <div className={containerClasses} onClick={onClick}>
            <div className="relative">
                <Avatar 
                    src={teacher.avatar} 
                    alt={`${teacher.name} ${teacher.surname}`}
                    size={40}
                    hasVerifiedBadge={teacher.isSuperTeacher}
                />
                {isOnline && (
                    <div className={classNames("absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white", styles.onlineIndicator)} />
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
        </div>
    );
}
