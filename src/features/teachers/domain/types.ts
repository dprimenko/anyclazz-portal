import type { CommonParams, Price, Translations } from "../../shared/domain/types";

export interface TeacherSubjectCategory {
    id: string;
    name: Translations;
}

export interface TeacherSubject {
    id: string;
    name: Translations;
}

export interface TeacherStudentLevel {
    id: string;
    name: Translations;
}

export interface TeacherLanguage {
    language: string;
    proficiencyLevel: string;
}

export enum ClassType {
    onlineSingle = 'online_single',
    onlineGroup = 'online_group',
    onsiteSingle = 'onsite_single',
    onsiteGroup = 'onsite_group'
}

export interface DurationPrice {
    duration: 30 | 60;
    price?: Price;
}

export interface TeacherClassType {
    type: ClassType;
    durations?: DurationPrice[];
}

export interface TeacherAddress {
    countryISO2: string;
    cityISO2: string;
    fullAddress?: string;
}

export interface Teacher {
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string;
    portrait?: string;
    studentLevel?: TeacherStudentLevel;
    subjectCategory: TeacherSubjectCategory;
    subject: TeacherSubject;
    classTypes: TeacherClassType[];
    rating?: number;
    reviewsNumber?: number;
    studentsNumber?: number;
    lessonsNumber?: number;
    isSuperTeacher: boolean;
    isOnline?: boolean;
    speaksLanguages?: TeacherLanguage[];
    shortPresentation?: string;
    videoPresentation?: string;
    about?: string;
    academicBackground?: string;
    certifications?: string;
    skills?: string;
    beganTeachingAt?: string;
    teacherAddress?: TeacherAddress;
    createdAt: string;
}

export interface GetTeacherParams extends CommonParams {
    teacherId: string;
}

export interface ListTeachersParams extends CommonParams {
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

export interface UpdateTeacherData {
    studentLevelId?: string;
    subjectCategoryId?: string;
    subjectId?: string;
    nationalityId?: string;
    address?: {
        countryISO2: string;
        cityISO2: string;
        fullAddress?: string;
    };
    speaksLanguages?: TeacherLanguage[];
    beganTeachingAt?: string;
    shortPresentation?: string;
}

export interface UpdateTeacherParams extends CommonParams {
    teacherId: string;
    data: UpdateTeacherData;
}

export interface TeacherRepository {
    getTeacher(params: GetTeacherParams): Promise<Teacher>;
    listTeachers(params: ListTeachersParams): Promise<ListTeachersResponse>;
    updateTeacher(params: UpdateTeacherParams): Promise<void>;
}