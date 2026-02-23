export interface Review {
    id: string;
    teacherId: string;
    student: {
        id: string;
        name: string;
        surname: string;
        avatar?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}