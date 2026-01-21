import { useState } from "react";
import { Switch } from "@/ui-library/shared/switch";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { useTranslations } from "@/i18n";

export interface TimeRange {
    id: string;
    from: string;
    to: string;
}

export interface DayAvailability {
    day: string;
    isAvailable: boolean;
    timeRanges: TimeRange[];
}

const DAYS_OF_WEEK_KEYS = [
    "monday",
    "tuesday", 
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
];

export interface WeeklyAvailabilitySelectorProps {
    availability?: DayAvailability[];
    onChange?: (availability: DayAvailability[]) => void;
}

export function WeeklyAvailabilitySelector({ availability, onChange }: WeeklyAvailabilitySelectorProps) {
    const t = useTranslations();
    const [weekAvailability, setWeekAvailability] = useState<DayAvailability[]>(
        availability || DAYS_OF_WEEK_KEYS.map(day => ({
            day,
            isAvailable: false,
            timeRanges: []
        }))
    );

    const handleDayToggle = (dayIndex: number) => {
        const updated = [...weekAvailability];
        updated[dayIndex].isAvailable = !updated[dayIndex].isAvailable;
        
        // Si se deshabilita el día, limpiar los rangos de tiempo
        if (!updated[dayIndex].isAvailable) {
            updated[dayIndex].timeRanges = [];
        }
        
        setWeekAvailability(updated);
        onChange?.(updated);
    };

    const handleAddTimeRange = (dayIndex: number) => {
        const updated = [...weekAvailability];
        const existingRanges = updated[dayIndex].timeRanges;
        
        let from = "09:00";
        let to = "11:00";
        
        // Si hay rangos existentes, calcular el nuevo rango basado en el último
        if (existingRanges.length > 0) {
            const lastRange = existingRanges[existingRanges.length - 1];
            const [lastHour, lastMinute] = lastRange.to.split(':').map(Number);
            
            // Siguiente hora después del último rango
            let nextHour = lastHour + 1;
            
            // Si supera las 23 horas, reiniciar a 00
            if (nextHour > 23) {
                nextHour = 0;
            }
            
            // Calcular hora final (2 horas después)
            let endHour = nextHour + 2;
            if (endHour > 23) {
                endHour = 23;
            }
            
            from = `${String(nextHour).padStart(2, '0')}:${String(lastMinute).padStart(2, '0')}`;
            to = `${String(endHour).padStart(2, '0')}:${String(lastMinute).padStart(2, '0')}`;
        }
        
        const newTimeRange: TimeRange = {
            id: `${Date.now()}-${Math.random()}`,
            from,
            to
        };
        updated[dayIndex].timeRanges.push(newTimeRange);
        setWeekAvailability(updated);
        onChange?.(updated);
    };

    const handleDeleteTimeRange = (dayIndex: number, rangeId: string) => {
        const updated = [...weekAvailability];
        updated[dayIndex].timeRanges = updated[dayIndex].timeRanges.filter(
            range => range.id !== rangeId
        );
        setWeekAvailability(updated);
        onChange?.(updated);
    };

    const handleTimeChange = (dayIndex: number, rangeId: string, field: 'from' | 'to', value: string) => {
        const updated = [...weekAvailability];
        const range = updated[dayIndex].timeRanges.find(r => r.id === rangeId);
        if (range) {
            range[field] = value;
        }
        setWeekAvailability(updated);
        onChange?.(updated);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-1 w-[312px]">
                <Text textLevel="h3" weight="semibold" colorType="primary">
                    {t('teacher-profile.choose_available_days')} <span className="text-[#F4A43A]">*</span>
                </Text>
                <Text textLevel="p" size="text-sm" colorType="tertiary">
                    {t('teacher-profile.add_time_ranges')}
                </Text>
            </div>

            <div className="flex flex-col gap-3 bg-white rounded-lg border border-gray-200 p-4 md:flex-grow-[1]">
                {weekAvailability.map((dayAvail, dayIndex) => (
                    <div key={dayAvail.day} className="flex flex-col gap-3">
                        {/* Day Header with Toggle */}
                        <div className="flex items-center justify-between py-2">
                            <Text textLevel="span" size="text-md" weight="semibold" colorType="primary">
                                {t(`common.days.${dayAvail.day}`)}
                            </Text>
                            <div className="flex items-center gap-2">
                                <Text textLevel="span" size="text-sm" colorType="tertiary">
                                    {t('teacher-profile.available')}
                                </Text>
                                <Switch
                                    checked={dayAvail.isAvailable}
                                    onCheckedChange={() => handleDayToggle(dayIndex)}
                                />
                            </div>
                        </div>

                        {/* Time Ranges */}
                        {dayAvail.isAvailable && (
                            <div className="flex flex-col gap-3 pl-0 md:pl-6">
                                {dayAvail.timeRanges.map((range) => (
                                    <TimeRangeRow
                                        key={range.id}
                                        range={range}
                                        onDelete={() => handleDeleteTimeRange(dayIndex, range.id)}
                                        onTimeChange={(field, value) => handleTimeChange(dayIndex, range.id, field, value)}
                                    />
                                ))}
                                
                                <button
                                    onClick={() => handleAddTimeRange(dayIndex)}
                                    className="self-end cursor-pointer flex items-center gap-2 text-[#535862] text-sm font-semibold hover:opacity-80 transition-opacity"
                                >
                                    <Icon icon="add" iconHeight={20} iconWidth={20} />
                                    {t('teacher-profile.add_another')}
                                </button>
                            </div>
                        )}

                        {/* Divider */}
                        {dayIndex < weekAvailability.length - 1 && (
                            <div className="border-t border-gray-100" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

interface TimeRangeRowProps {
    range: TimeRange;
    onDelete: () => void;
    onTimeChange: (field: 'from' | 'to', value: string) => void;
}

function TimeRangeRow({ range, onDelete, onTimeChange }: TimeRangeRowProps) {
    const t = useTranslations();

    return (
        <div className="flex flex-col flex-row items-start sm:items-center gap-3 border-1 border-[#E9EAEB] p-3 rounded-md" suppressHydrationWarning>
            <div className="flex flex-col flex-row items-start sm:items-center gap-3 md:gap-[3.125rem] flex-1">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <Text textLevel="label" size="text-xs" colorType="tertiary">
                        {t('teacher-profile.from')}
                    </Text>
                    <input
                        type="time"
                        value={range.from}
                        onChange={(e) => onTimeChange('from', e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-md text-sm w-full sm:w-32"
                    />
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <Text textLevel="label" size="text-xs" colorType="tertiary">
                        {t('teacher-profile.to')}
                    </Text>
                    <input
                        type="time"
                        value={range.to}
                        onChange={(e) => onTimeChange('to', e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-md text-sm w-full sm:w-32"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto pb-2 sm:pb-0">
                <button
                    onClick={onDelete}
                    className="text-gray-600 text-sm font-medium hover:opacity-80 transition-opacity"
                >
                    {t('teacher-profile.delete')}
                </button>
            </div>
        </div>
    );
}
