export interface Student {
    id: string;
    name: string;
    surname: string;
    avatar?: string;
    timezone?: string;    // Timezone desde users table
}