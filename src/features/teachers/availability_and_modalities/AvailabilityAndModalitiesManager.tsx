import { Text } from "@/ui-library/components/ssr/text/Text";
import type { Teacher, TeacherClassType } from "../domain/types";
import { Divider } from "@/ui-library/components/ssr/divider/Divider";
import { ClassModalitySelector } from "./components/ClassModalitySelector";
import { WeeklyAvailabilitySelector, type DayAvailability } from "./components/WeeklyAvailabilitySelector";

export interface AvailabilityAndModalitiesManagerProps {
    teacher: Teacher;
}

export function AvailabilityAndModalitiesManager({ teacher }: AvailabilityAndModalitiesManagerProps) {
    const handleModalitiesChange = (modalities: TeacherClassType[]) => {
        console.log('Selected modalities:', modalities);
        // Aquí puedes manejar el cambio, por ejemplo actualizar el estado o llamar una API
    };

    const handleAvailabilityChange = (availability: DayAvailability[]) => {
        console.log('Selected availability:', availability);
        // Aquí puedes manejar el cambio de disponibilidad
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
        </div>
    );
}