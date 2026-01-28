import { Calendar as CCalendar } from "@/ui-library/shared/calendar";
import styles from "./Calendar.module.css";
import classNames from "classnames";

export interface CalendarProps {
    selectedDate: Date | undefined;
    onSelected: (date: Date | undefined) => void;
    availableDates?: Date[];
    onMonthChange?: (month: Date) => void;
}

export function Calendar({ selectedDate = new Date(), onSelected, availableDates = [], onMonthChange } : CalendarProps) {
    const labelClassnames = classNames("text-sm font-semibold", styles.calendar__label);
    const dayClassnames = classNames("relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-full [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none text-sm font-normal", styles['calendar__day']);
    const dayDisabledClassnames = classNames(styles['calendar__day--disabled']);
    const dayAvailableClassnames = classNames(styles['calendar__day--available']);
    const todayClassnames = classNames();
    const weekDaysClassnames = classNames("flex items-center h-[40px]");
    const weekDayClassnames = classNames("flex-1 font-medium text-sm select-none", styles.calendar__weekday);
    const chevronClassnames = classNames("size-5", styles.calendar__chevron);

    // Estilos para el botón del día
    const dayButtonClassnames = classNames(
        "w-full h-full rounded-full",
        styles['calendar__day__button']
    );

    // Helper para verificar si una fecha está en el array de fechas disponibles
    const isDateAvailable = (date: Date) => {
        return availableDates.some(availableDate => {
            const d1 = new Date(availableDate);
            const d2 = new Date(date);
            return d1.getFullYear() === d2.getFullYear() &&
                   d1.getMonth() === d2.getMonth() &&
                   d1.getDate() === d2.getDate();
        });
    };

    // Helper para verificar si una fecha es pasada
    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    };

    return (
        <div style={{ overflow: 'visible', width: '100%' }}>
            <CCalendar
                mode="single"
                selected={selectedDate}
                onSelect={onSelected}
                onMonthChange={onMonthChange}
                className="rounded-md border w-full"
                classNames={{ 
                    caption_label: labelClassnames, 
                    weekdays: weekDaysClassnames, 
                    weekday: weekDayClassnames, 
                    day: dayClassnames, 
                    day_button: dayButtonClassnames,
                    today: todayClassnames,
                    disabled: dayDisabledClassnames,
                    chevron: chevronClassnames,
                }}
                modifiers={{
                    available: (date) => isDateAvailable(date) && !isPastDate(date),
                }}
                modifiersClassNames={{
                    available: dayAvailableClassnames,
                }}
                disablePastMonths
                disabled={(date) => {
                    // Deshabilitar días pasados O días sin disponibilidad
                    return isPastDate(date) || !isDateAvailable(date);
                }}
            />
        </div>
    );
}