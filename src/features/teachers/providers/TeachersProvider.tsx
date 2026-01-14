import { createContext, useContext, type ReactNode } from "react";
import { useTeacherList, type TeachersPageProps, type TeacherFilters } from "../hooks/useTeacherList";
import type { Teacher } from "../domain/types";

interface TeachersContextValue {
    accessToken: string;
    lang: string;
    teachers: Teacher[];
    totalTeachers: number;
    fetchingTeachers: boolean;
    errorFetchingTeachers: string | undefined;
    page: number;
    setPage: (page: number) => void;
    pages: number;
    refreshTeachers: () => void;
    filters: TeacherFilters;
    updateFilters: (filters: Partial<TeacherFilters>) => void;
    clearFilters: () => void;
    noResults: boolean;
}

const TeachersContext = createContext<TeachersContextValue | undefined>(undefined);

export interface TeachersProviderProps extends TeachersPageProps {
    children: ReactNode;
    lang: string;
}

export function TeachersProvider({ children, teacherRepository, accessToken, lang }: TeachersProviderProps) {
    const teachersState = useTeacherList({ teacherRepository, accessToken });

    return (
        <TeachersContext.Provider value={{ ...teachersState, lang }}>
            {children}
        </TeachersContext.Provider>
    );
}

export function useTeachers() {
    const context = useContext(TeachersContext);
    
    if (context === undefined) {
        throw new Error('useTeachers must be used within a TeachersProvider');
    }
    
    return context;
}
