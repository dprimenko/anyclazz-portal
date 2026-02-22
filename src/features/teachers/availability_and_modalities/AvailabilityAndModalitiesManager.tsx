import { useState, useEffect } from 'react';
import { Text } from "@/ui-library/components/ssr/text/Text";
import type { Teacher, TeacherClassType } from "../domain/types";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { ClassModalitySelector } from "./components/ClassModalitySelector";
import { WeeklyAvailabilitySelector, type DayAvailability } from "./components/WeeklyAvailabilitySelector";
import { TeacherAvailabilityRepository } from "../infrastructure/TeacherAvailabilityRepository";
import { TeacherModalitiesRepository } from "../infrastructure/TeacherModalitiesRepository";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { Space } from '@/ui-library/components/ssr/space/Space';
import { useTranslations } from '@/i18n';

export interface AvailabilityAndModalitiesManagerProps {
    teacher: Teacher;
    accessToken: string;
}

const availabilityRepo = new TeacherAvailabilityRepository();
const modalitiesRepo = new TeacherModalitiesRepository();

export function AvailabilityAndModalitiesManager({ teacher, accessToken }: AvailabilityAndModalitiesManagerProps) {
    const t = useTranslations();
    const [selectedModalities, setSelectedModalities] = useState<TeacherClassType[]>(teacher.classTypes);
    const [selectedAvailability, setSelectedAvailability] = useState<DayAvailability[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAvailability = async () => {
            try {
                setIsLoading(true);
                const availability = await availabilityRepo.getAvailability(teacher.id, accessToken);
                setSelectedAvailability(availability);
            } catch (error) {
                console.error('Failed to load availability:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAvailability();
    }, [teacher.id, accessToken]);

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
                await modalitiesRepo.saveClassTypes(teacher.id, selectedModalities, accessToken);
            }

            console.log('Selected availability to save:', selectedAvailability);
            
            // Guardar disponibilidad
            if (selectedAvailability.length > 0) {
                await availabilityRepo.saveAvailability(
                    teacher.id,
                    selectedAvailability,
                    accessToken
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
                <Text size="text-lg" weight="semibold" colorType="primary">{t('teacher-profile.set_availability_modalities')}</Text>
                <Text size="text-md" colorType="tertiary">{t('teacher-profile.set_availability_modalities_description')}</Text>
            </div>
            <Divider margin={24}/>

            <ClassModalitySelector 
                selectedClassTypes={teacher.classTypes}
                onChange={handleModalitiesChange}
            />

            {!isLoading && (
                <WeeklyAvailabilitySelector 
                    availability={selectedAvailability}
                    onChange={handleAvailabilityChange}
                />
            )}

            <div className="flex justify-end mt-8 mb-8">
                <Button 
                    onClick={handleSave}
                    colorType="primary"
                    disabled={isSaving}
                    label={isSaving ? t('common.saving') : t('common.save')}
                />
            </div> 
        </div>
    );
}