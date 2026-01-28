import { useState, useMemo } from "react";
import styles from "./Calendar.module.css";
import classNames from "classnames";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";

export interface SimpleCalendarProps {
    selectedDate: Date | undefined;
    onSelected: (date: Date | undefined) => void;
    availableDates?: Date[];
    onMonthChange?: (month: Date) => void;
}

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function SimpleCalendar({ 
    selectedDate, 
    onSelected, 
    availableDates = [], 
    onMonthChange 
}: SimpleCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };

    const isDateAvailable = (date: Date) => {
        return availableDates.some(availableDate => isSameDay(availableDate, date));
    };

    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        // Convertir domingo (0) a 7 para que lunes sea 1
        return day === 0 ? 7 : day;
    };

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        
        const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];
        
        // Días del mes anterior (para completar la primera semana)
        const prevMonthDays = getDaysInMonth(year, month - 1);
        for (let i = firstDay - 1; i > 0; i--) {
            const date = new Date(year, month - 1, prevMonthDays - i + 1);
            days.push({ date, isCurrentMonth: false });
        }
        
        // Días del mes actual
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push({ date, isCurrentMonth: true });
        }
        
        // Días del mes siguiente solo para completar la última semana
        const totalDays = days.length;
        const daysInLastWeek = totalDays % 7;
        if (daysInLastWeek > 0) {
            const remainingDays = 7 - daysInLastWeek;
            for (let i = 1; i <= remainingDays; i++) {
                const date = new Date(year, month + 1, i);
                days.push({ date, isCurrentMonth: false });
            }
        }
        
        return days;
    }, [currentMonth]);

    const numberOfWeeks = Math.ceil(calendarDays.length / 7);

    const handlePrevMonth = () => {
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        const today = new Date();
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // No permitir ir a meses anteriores al mes actual
        if (newMonth >= currentMonthStart) {
            setCurrentMonth(newMonth);
            onMonthChange?.(newMonth);
        }
    };

    const handleNextMonth = () => {
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(newMonth);
        onMonthChange?.(newMonth);
    };

    const handleDayClick = (date: Date) => {
        if (!isPastDate(date) && isDateAvailable(date)) {
            onSelected(date);
        }
    };

    const today = new Date();
    const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && 
                          currentMonth.getFullYear() === today.getFullYear();

    return (
        <div className="w-full rounded-md border border-neutral-200" style={{ overflow: 'visible' }}>
            <div className="px-4 py-2.5" style={{ overflow: 'visible' }}>
                {/* Header con navegación */}
                <div className="flex items-center justify-between h-8 mb-4" style={{ overflow: 'visible' }}>
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={isCurrentMonth}
                        className={classNames(
                            "size-8 p-0 flex items-center justify-center rounded-md hover:bg-neutral-100 disabled:opacity-0 disabled:pointer-events-none",
                            styles.calendar__chevron
                        )}
                        style={{ overflow: 'visible' }}
                    >
                        <Icon icon="arrow-left" iconWidth={20} iconHeight={20} />
                    </button>
                    
                    <span className={classNames("text-sm font-semibold", styles.calendar__label)}>
                        {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className={classNames(
                            "size-8 p-0 flex items-center justify-center rounded-md hover:bg-neutral-100",
                            styles.calendar__chevron
                        )}
                        style={{ overflow: 'visible' }}
                    >
                        <Icon icon="arrow-right" iconWidth={20} iconHeight={20} />
                    </button>
                </div>

                {/* Días de la semana */}
                <div className="flex items-center h-10 mb-2" style={{ overflow: 'visible' }}>
                    {WEEKDAYS.map((day, index) => (
                        <div
                            key={index}
                            className={classNames("flex-1 font-medium text-sm text-center select-none", styles.calendar__weekday)}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grilla de días */}
                <div className="flex flex-col gap-2" style={{ overflow: 'visible' }}>
                    {Array.from({ length: numberOfWeeks }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex w-full" style={{ overflow: 'visible' }}>
                            {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map(({ date, isCurrentMonth }, dayIndex) => {
                                const isSelected = selectedDate && isSameDay(date, selectedDate);
                                const isPast = isPastDate(date);
                                const isAvailable = isDateAvailable(date) && !isPast;
                                const isDisabled = isPast || !isDateAvailable(date);

                                // Ocultar días que no pertenecen al mes actual
                                if (!isCurrentMonth) {
                                    return (
                                        <div
                                            key={dayIndex}
                                            className="relative w-full h-full p-0 text-center aspect-square select-none flex-1"
                                            style={{ visibility: 'hidden', overflow: 'visible' }}
                                        />
                                    );
                                }

                                return (
                                    <div
                                        key={dayIndex}
                                        className={classNames(
                                            "relative w-full h-full p-0 text-center aspect-square select-none text-sm font-normal flex-1",
                                            styles['calendar__day'],
                                            isPast && styles['calendar__day--disabled']
                                        )}
                                        style={{ overflow: 'visible' }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => handleDayClick(date)}
                                            disabled={isDisabled}
                                            className={classNames(
                                                "w-full h-full rounded-full flex items-center justify-center",
                                                styles['calendar__day__button'],
                                                isAvailable && styles['calendar__day--available'],
                                                isSelected && "!bg-primary-700 !text-white !border-primary-700"
                                            )}
                                            data-selected-single={isSelected}
                                            style={{ overflow: 'visible' }}
                                        >
                                            {date.getDate()}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
