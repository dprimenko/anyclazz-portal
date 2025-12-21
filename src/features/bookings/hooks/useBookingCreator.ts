import type { Teacher, TeacherClassType } from "@/features/teachers/domain/types";
import { useCallback, useEffect, useState } from "react";
import { AnyclazzMyBookingsRepository } from "../infrastructure/AnyclazzMyBookingsRepository";
import { DateTime } from "luxon";
import type { CreateBookingParams } from "../domain/types";

export interface BookingCreatorProps {
    teacher: Teacher;
    accessToken: string;
}

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

    const createBooking = useCallback(async (bookingData: CreateBookingParams) => {
        try {
            const booking = await repository.createBooking(bookingData);
            return booking;
        } catch (error: unknown) {
            if (error instanceof Error && error.cause === 'TIME_SLOT_UNAVAILABLE') {
                alert("El slot ya ha sido reservado. Por favor, selecciona otro.");
                return;
            }
            alert("Ha ocurrido un error al crear la reserva. Por favor, inténtalo de nuevo.");
            return;
        }
    }, []);

    const selectClassType = useCallback((classTypeId: string) => {
        const classType = teacher.classTypes.find((ct) => ct.type === classTypeId);
        if (!classType) {
            return;
        }
        setSelectedClass(classType);
    }, [teacher]);

    useEffect(() => {
        fetchAvailability();
    }, [selectedDuration, selectedDate]);
    
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
        createBooking,
    };
}