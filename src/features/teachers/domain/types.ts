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
    price?: Price; // ✨ Precio directo del classType (usado en bookings)
}

export interface TeacherAddress {
    street?: string | null;
    city: string;
    state?: string | null;
    country: string;
    fullAddress: string;
}

export interface Teacher {
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string | null;
    portrait?: string | null;
    portraitImage?: string | null;
    studentLevel?: TeacherStudentLevel;
    subjectCategory: TeacherSubjectCategory;
    subject: TeacherSubject;
    classTypes: TeacherClassType[];
    rating?: number;
    reviewsNumber?: number;
    studentsNumber?: number;
    lessonsNumber?: number;
    superTutorTo?: string | null;
    isOnline?: boolean;
    speaksLanguages?: TeacherLanguage[];
    shortPresentation?: string;
    videoPresentation?: string;
    videoPresentationStatus?: 'processing' | 'ready' | 'failed' | null;
    about?: string;
    academicBackground?: string;
    certifications?: string;
    skills?: string;
    beganTeachingAt?: string;
    teacherAddress?: TeacherAddress;
    timezone?: string;
    createdAt: string;
}

export interface GetTeacherParams extends CommonParams {
    teacherId: string;
}

export interface ListTeachersParams extends CommonParams {
    page: number;
    size: number;
    query?: string;
    country?: string;
    city?: string;
    classTypeId?: string;
    minPrice?: number;
    maxPrice?: number;
    subjectCategoryId?: string;
    subjectId?: string;
    speakLanguage?: string;
    studentLevelId?: string;
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
    name?: string;
    surname?: string;
    studentLevelId?: string;
    subjectCategoryId?: string;
    subjectId?: string;
    nationalityId?: string;
    address?: {
        street?: string;
        city: string;
        state?: string;
        country: string;
        fullAddress?: string;
    };
    timezone?: string;
    speaksLanguages?: TeacherLanguage[];
    beganTeachingAt?: string;
    shortPresentation?: string;
    avatar?: File;
    portrait?: File;
    about?: string;
    videoPresentation?: string | File;
    academicBackground?: string;
    certifications?: string;
    skills?: string;
}

export interface UpdateTeacherParams extends CommonParams {
    teacherId: string;
    data: UpdateTeacherData;
}

export interface GetTeacherReviewsParams extends CommonParams {
    teacherId: string;
    page?: number;
    size?: number;
}

export interface Review {
    id: string;
    teacherId: string;
    studentId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    student: {
        id: string;
        name: string;
        surname: string;
        avatar?: string;
    };
}

export interface GetTeacherReviewsResponse {
    reviews: Review[];
    meta: {
        currentPage: number;
        lastPage: number;
        size: number;
        total: number;
    };
}

export interface TeacherRepository {
    getTeacher(params: GetTeacherParams): Promise<Teacher>;
    listTeachers(params: ListTeachersParams): Promise<ListTeachersResponse>;
    updateTeacher(params: UpdateTeacherParams): Promise<void>;
    getTeacherReviews(params: GetTeacherReviewsParams): Promise<GetTeacherReviewsResponse>;
}