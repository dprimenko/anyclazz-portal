import { type Teacher } from '../domain/types';

export interface ApiTeacher extends Omit<Teacher, 'classTypes'> {
    classTypes: {
        type: string;
        durations?: {
            duration: 30 | 60;
            price?: {
                price: number;
                currencyCode: string;
            }
        }[]
    }[];
}