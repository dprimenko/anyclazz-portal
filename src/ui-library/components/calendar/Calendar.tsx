import { Calendar as CCalendar } from "@/components/ui/calendar";
import { DateTime } from "luxon";
import styles from "./Calendar.module.css";
import classNames from "classnames";

export interface CalendarProps {
    selectedDate: Date | undefined;
    onSelected: (date: Date | undefined) => void;
}

export function Calendar({ selectedDate = new Date(), onSelected } : CalendarProps) {
    const labelClassnames = classNames("text-sm font-semibold", styles.calendar__label);
    const dayClassnames = classNames("relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-full [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none text-sm font-normal", styles['calendar__day']);
    const dayDisabledClassnames = classNames(styles['calendar__day--disabled']);
    const todayClassnames = classNames();
    const weekDaysClassnames = classNames("flex items-center h-[40px]");
    const weekDayClassnames = classNames("flex-1 font-medium text-sm select-none", styles.calendar__weekday);
    const chevronClassnames = classNames("size-5", styles.calendar__chevron);

    // Estilos para el botón del día
    const dayButtonClassnames = classNames(
        "w-full h-full rounded-full",
        styles['calendar__day__button']
    );

    return (
        <CCalendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelected}
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
            disablePastMonths
            disabled={(date) => DateTime.fromJSDate(date) < DateTime.now().startOf('day')}
        />
    );
}