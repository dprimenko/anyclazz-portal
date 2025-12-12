import { createContext, useContext, type ReactNode } from "react";
import { useTeacherList, type TeachersPageProps } from "../hooks/useTeacherList";
import type { Teacher } from "../domain/types";

interface TeachersContextValue {
    teachers: Teacher[];
    totalTeachers: number;
    fetchingTeachers: boolean;
    errorFetchingTeachers: string | undefined;
    page: number;
    setPage: (page: number) => void;
    pages: number;
    refreshTeachers: () => void;
    search: string;
    setSearch: (search: string) => void;
    noResults: boolean;
}

const TeachersContext = createContext<TeachersContextValue | undefined>(undefined);

export interface TeachersProviderProps extends TeachersPageProps {
    children: ReactNode;
}

export function TeachersProvider({ children, teacherRepository, accessToken }: TeachersProviderProps) {
    const teachersState = useTeacherList({ teacherRepository, accessToken });

    return (
        <TeachersContext.Provider value={teachersState}>
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
