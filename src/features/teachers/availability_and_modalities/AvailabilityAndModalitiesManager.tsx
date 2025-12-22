import { useState } from 'react';
import { Text } from "@/ui-library/components/ssr/text/Text";
import type { Teacher, TeacherClassType } from "../domain/types";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { ClassModalitySelector } from "./components/ClassModalitySelector";
import { WeeklyAvailabilitySelector, type DayAvailability } from "./components/WeeklyAvailabilitySelector";
import { TeacherAvailabilityRepository } from "../infrastructure/TeacherAvailabilityRepository";
import { TeacherModalitiesRepository } from "../infrastructure/TeacherModalitiesRepository";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { Space } from '@/ui-library/components/ssr/space/Space';

export interface AvailabilityAndModalitiesManagerProps {
    teacher: Teacher;
    accessToken: string;
}

const availabilityRepo = new TeacherAvailabilityRepository();
const modalitiesRepo = new TeacherModalitiesRepository();

export function AvailabilityAndModalitiesManager({ teacher, accessToken }: AvailabilityAndModalitiesManagerProps) {
    const [selectedModalities, setSelectedModalities] = useState<TeacherClassType[]>(teacher.classTypes);
    const [selectedAvailability, setSelectedAvailability] = useState<DayAvailability[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleModalitiesChange = (modalities: TeacherClassType[]) => {
        console.log('Selected modalities:', modalities);
        setSelectedModalities(modalities);
    };

    const handleAvailabilityChange = (availability: DayAvailability[]) => {
        console.log('Selected availability:', availability);
        setSelectedAvailability(availability);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Guardar modalidades
            if (selectedModalities.length > 0) {
                //await modalitiesRepo.saveClassTypes(teacher.id, selectedModalities, accessToken);
            }

            console.log('Selected availability to save:', selectedAvailability);
            
            // Guardar disponibilidad
            if (selectedAvailability.length > 0) {
                await availabilityRepo.saveAvailability(
                    teacher.id,
                    selectedAvailability,
                    accessToken,
                    'Europe/Madrid'
                );
            }
            
            console.log('Configuration saved successfully');
        } catch (error) {
            console.error('Failed to save configuration:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-6 flex flex-col gap-8">
            <div className="flex flex-col gap-[2px]">
                <Text size="text-lg" weight="semibold" colorType="primary">Set Your Availability & Modalities</Text>
                <Text size="text-md" colorType="tertiary">Manage your teaching formats, availability, and lesson pricing — all in one place. Select how you teach, when you're available, and the duration of your lessons. Prices will automatically adjust based on the formats and durations you set. You can update this anytime if your schedule or preferences change.</Text>
            </div>
            <Divider margin={24}/>

            <ClassModalitySelector 
                selectedClassTypes={teacher.classTypes}
                onChange={handleModalitiesChange}
            />

            <WeeklyAvailabilitySelector 
                onChange={handleAvailabilityChange}
            />

            <div className="flex justify-end mt-8">
                <Button 
                    onClick={handleSave}
                    colorType="primary"
                    disabled={isSaving}
                    label={isSaving ? 'Guardando...' : 'Guardar'}
                >
                    
                </Button>
            </div> 
            <Space size={16} />
        </div>
    );
}