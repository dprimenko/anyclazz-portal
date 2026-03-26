import type { TeacherApprovalStatus } from '../domain/types';

export interface ApiTeacherApproval {
    id: string;
    email: string;
    name: string;
    surname: string;
    avatar: string;
    portraitImage: string | null;
    isSuperTeacher: boolean;
    superTutorTo: string | null;
    shortPresentation: string | null;
    videoPresentation: string | null;
    videoPresentationStatus: 'processing' | 'ready' | 'failed' | null;
    about: string | null;
    academicBackground: string | null;
    certifications: string | null;
    skills: string | null;
    timezone: string;
    beganTeachingAt: string | null;
    createdAt: string | null;
    status: TeacherApprovalStatus | null;
    statusUpdatedAt: string | null;
    studentLevel?: {
        id: string;
        name: { en: string; es: string };
    } | null;
    subject?: {
        id: string;
        name: { en: string; es: string };
    } | null;
    subjectCategory?: {
        id: string;
        name: { en: string; es: string };
        slug: string;
    } | null;
    classTypes: Array<{
        type: string;
        durations?: Array<{
            duration: number;
            price?: { price: number; currencyCode: string };
        }>;
    }>;
    speaksLanguages?: Array<{
        id: string;
        name: string;
        code: string;
    }>;
    teacherAddress?: {
        country: string;
        city: string;
    } | null;
    reviewsNumber: number;
    averageRating: number;
    studentsNumber: number;
    lessonsNumber: number;
    savedAt?: string | null;
}
