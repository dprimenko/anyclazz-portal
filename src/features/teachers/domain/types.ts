import type { Price, Translations } from "../../shared/domain/types";

export interface TeacherCategory {
    id: string;
    name: Translations;
}

export interface TeacherSubject {
    id: string;
    name: Translations;
}

export enum ClassType {
    onlineSingle = 'online_single',
    onlineGroup = 'online_group',
    onsiteSingle = 'onsite_single',
    onsiteGroup = 'onsite_group'
}

export interface TeacherLanguage {
    language: string;
    proficiencyLevel: string;
}

export interface TeacherClassType {
    type: ClassType;
    price?: Price;
    durations: (30 | 60)[];
}

export interface TeacherAddress {
    countryISO2: string;
    cityISO2: string;
    fullAddress: string;
}

export interface Teacher {
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string;
    portrait?: string;
    category: TeacherCategory[];
    subject: TeacherSubject;
    classTypes: TeacherClassType[];
    rating?: number;
    reviewsNumber?: number;
    studentsNumber?: number;
    lessonsNumber?: number;
    isSuperTeacher: boolean;
    speaksLanguages: TeacherLanguage[];
    shortPresentation?: string;
    videoPresentation?: string;
    about?: string;
    academicBackground?: string;
    certifications?: string;
    skills?: string;
    beganTeachingAt: string;
    teacherAddress: TeacherAddress;
    createdAt: string;
}

export interface GetTeacherParams {
    id: string;
}

export interface ListTeachersParams {
    page: number;
    size: number;
    query?: string;
}

export interface ListTeachersResponse {
    teachers: Teacher[];
    meta: {
        currentPage: number;
        lastPage: number;
        size: number;
        total: number;
    };
}

export interface DeleteTeacherParams {
    id: string;
}

export interface TeacherRepository {
    getTeacher(params: GetTeacherParams): Promise<Teacher>;
    listTeachers(params: ListTeachersParams): Promise<ListTeachersResponse>;
    createTeacher(teacher: Teacher): Promise<void>;
    updateTeacher(teacher: Teacher): Promise<void>;
    deleteTeacher(params: DeleteTeacherParams): Promise<void>;
}