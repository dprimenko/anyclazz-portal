import type { Teacher, TeacherClassType } from "@/features/teachers/domain/types";
import { useCallback, useEffect, useState } from "react";
import { AnyclazzMyBookingsRepository } from "../infrastructure/AnyclazzMyBookingsRepository";
import { DateTime } from "luxon";

export interface BookingCreatorProps {
    teacher: Teacher;
    accessToken: string;
}

// const times = [
//     { startAt: `${todayFormatted}T08:00:00.000`, endAt: `${todayFormatted}T09:00:00.000`, timeZone: "Europe/Madrid" },
//     { startAt: `${todayFormatted}T09:00:00.000`, endAt: `${todayFormatted}T10:00:00.000`, timeZone: "Europe/Madrid" },
//     { startAt: `${todayFormatted}T10:00:00.000`, endAt: `${todayFormatted}T11:00:00.000`, timeZone: "Europe/Madrid" },
//     { startAt: `${todayFormatted}T11:00:00.000`, endAt: `${todayFormatted}T12:00:00.000`, timeZone: "Europe/Madrid" },
// ];

const repository = new AnyclazzMyBookingsRepository();

export function useBookingCreator({ teacher, accessToken }: BookingCreatorProps) {
    const [selectedClass, setSelectedClass] = useState<TeacherClassType>(teacher.classTypes[0]);
    const [selectedDuration, setSelectedDuration] = useState<number>(30);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | undefined>();

    const [fetchingAvailableSlots, setFetchingAvailableSlots] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [errorFetchingAvailableSlots, setErrorFetchingTeachers] = useState<string | undefined>(undefined);


    const fetchAvailability = useCallback(async () => {
        if (fetchingAvailableSlots) return;
        
        setFetchingAvailableSlots(true);

        async function fetch() {
            const slots = await repository.getTeacherAvailability({ 
                token: accessToken,
                teacherId: teacher.id,
                from: DateTime.fromJSDate(selectedDate).startOf('day').toISO(),
                to: DateTime.fromJSDate(selectedDate).endOf('day').toISO(),
                duration: selectedDuration,
            });
            setAvailableSlots(slots);
        }
    
        Promise.allSettled([
            fetch()
        ]).then(() => {
        }).catch(() => {
            // setErrorFetchingAvailableSlots(t('teachers.error_fetching_teachers'));
        }).finally(() => {
            setFetchingAvailableSlots(false);
        });
    }, [teacher, accessToken, selectedDuration, fetchingAvailableSlots]);

    const selectClassType = useCallback((classTypeId: string) => {
        const classType = teacher.classTypes.find((ct) => ct.type === classTypeId);
        if (!classType) {
            return;
        }
        setSelectedClass(classType);
        setSelectedDuration(30);
    }, [teacher]);

    useEffect(() => {
        fetchAvailability();
    }, []);
    
    return {
        availableSlots,
        selectedClass,
        selectedDuration,
        selectedDate,
        setSelectedDate,
        setSelectedDuration,
        selectedTime,
        setSelectedTime,
        selectClassType,
    };
}