import { useState, useEffect } from 'react';
import { Text } from "@/ui-library/components/ssr/text/Text";
import type { Teacher, TeacherClassType } from "../domain/types";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { ClassModalitySelector } from "./components/ClassModalitySelector";
import { WeeklyAvailabilitySelector, type DayAvailability } from "./components/WeeklyAvailabilitySelector";
import { TeacherAvailabilityRepository } from "../infrastructure/TeacherAvailabilityRepository";
import { TeacherModalitiesRepository } from "../infrastructure/TeacherModalitiesRepository";
import { Button } from "@/ui-library/components/ssr/button/Button";
import { useTranslations } from '@/i18n';
import { publish } from '@/features/shared/services/domainEventsBus';
import { SharedDomainEvents } from '@/features/shared/domain/events';
import type { ToastProps } from '@/ui-library/components/toast/types';

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
        setSelectedModalities(modalities);
    };

    const handleAvailabilityChange = (availability: DayAvailability[]) => {
        setSelectedAvailability(availability);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (selectedModalities.length > 0) {
                await modalitiesRepo.saveClassTypes(teacher.id, selectedModalities, accessToken);
            }
            
            if (selectedAvailability.length > 0) {
                await availabilityRepo.saveAvailability(
                    teacher.id,
                    selectedAvailability,
                    accessToken,
                    teacher.timezone || 'America/New_York'
                );
            }
            
            publish<ToastProps>(SharedDomainEvents.showToast, {
                message: t('teacher-profile.availability_modalities_save_success'),
                variant: 'success',
            });
        } catch (error) {
            publish<ToastProps>(SharedDomainEvents.showToast, {
                message: t('teacher-profile.availability_modalities_save_error'),
                variant: 'error',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-6 flex flex-col gap-8" suppressHydrationWarning>
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
                    isLoading={isSaving}
                    label={isSaving ? t('common.saving') : t('common.save')}
                />
            </div> 
        </div>
    );
}