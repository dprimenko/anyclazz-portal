import { FetchClient } from '@/features/shared/services/httpClient';
import type { TeacherClassType } from '../domain/types';
import { getApiUrl } from '@/features/shared/services/environment/server';

interface ClassTypesPayload {
    classTypes: {
        type: string;
        durations: {
            duration: number;
            price: {
                price: number;
                currencyCode: string;
            };
        }[];
    }[];
}

export class TeacherModalitiesRepository {
    private client: FetchClient;

    constructor() {
        this.client = new FetchClient(getApiUrl());
    }

    /**
     * Transform TeacherClassType[] to API payload format
     */
    private transformToPayload(classTypes: TeacherClassType[]): ClassTypesPayload {
        return {
            classTypes: classTypes.map(ct => ({
                type: ct.type,
                durations: ct.durations.map(d => ({
                    duration: d.duration,
                    price: {
                        price: d.price.amount,
                        currencyCode: d.price.currency,
                    },
                })),
            })),
        };
    }

    /**
     * Save teacher class types (modalities)
     */
    async saveClassTypes(teacherId: string, classTypes: TeacherClassType[], token: string): Promise<void> {
        const payload = this.transformToPayload(classTypes);

        try {
            const response = await this.client.put({
                url: `/teachers/${teacherId}/class-types`,
                data: payload,
                token,
                headers: {
                    'X-User-Roles': 'teacher'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to save class types: ${response.statusText}`);
            }

            console.log(`Successfully saved class types for teacher ${teacherId}`);
        } catch (error) {
            console.error('Error saving teacher class types:', error);
            throw error;
        }
    }
}
