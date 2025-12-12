import { type Teacher } from '../domain/types';

export interface ApiTeacher extends Omit<Teacher, 'classTypes'> {
    classTypes: {
        type: string;
        price: {
            price: number;
            currencyCode: string;
        }
    }[];
}