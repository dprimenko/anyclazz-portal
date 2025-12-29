import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/ui-library/components/ssr/text/Text";
import { Icon } from "@/ui-library/components/ssr/icon/Icon";
import { useTranslations } from "@/i18n";

export interface TimeRange {
    id: string;
    from: string;
    to: string;
    isEditing?: boolean;
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
        const newTimeRange: TimeRange = {
            id: `${Date.now()}-${Math.random()}`,
            from: "09:00",
            to: "12:00",
            isEditing: true
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

    const handleEditTimeRange = (dayIndex: number, rangeId: string) => {
        const updated = [...weekAvailability];
        const range = updated[dayIndex].timeRanges.find(r => r.id === rangeId);
        if (range) {
            range.isEditing = true;
        }
        setWeekAvailability(updated);
    };

    const handleConfirmTimeRange = (dayIndex: number, rangeId: string, from: string, to: string) => {
        const updated = [...weekAvailability];
        const range = updated[dayIndex].timeRanges.find(r => r.id === rangeId);
        if (range) {
            range.from = from;
            range.to = to;
            range.isEditing = false;
        }
        setWeekAvailability(updated);
        onChange?.(updated);
    };

    const handleCancelEdit = (dayIndex: number, rangeId: string) => {
        const updated = [...weekAvailability];
        const rangeIndex = updated[dayIndex].timeRanges.findIndex(r => r.id === rangeId);
        
        if (rangeIndex !== -1) {
            const range = updated[dayIndex].timeRanges[rangeIndex];
            if (range.isEditing && range.from === "09:00" && range.to === "12:00") {
                // Si es un nuevo rango sin confirmar, eliminarlo
                updated[dayIndex].timeRanges.splice(rangeIndex, 1);
            } else {
                range.isEditing = false;
            }
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
                                        onEdit={() => handleEditTimeRange(dayIndex, range.id)}
                                        onConfirm={(from, to) => handleConfirmTimeRange(dayIndex, range.id, from, to)}
                                        onCancel={() => handleCancelEdit(dayIndex, range.id)}
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
    onEdit: () => void;
    onConfirm: (from: string, to: string) => void;
    onCancel: () => void;
}

function TimeRangeRow({ range, onDelete, onEdit, onConfirm, onCancel }: TimeRangeRowProps) {
    const t = useTranslations();
    const [from, setFrom] = useState(range.from);
    const [to, setTo] = useState(range.to);

    if (range.isEditing) {
        return (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-1 border-[#E9EAEB] p-3 rounded-md" suppressHydrationWarning>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[3.125rem] flex-1">
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <Text textLevel="label" size="text-xs" colorType="tertiary">
                            {t('teacher-profile.from')}
                        </Text>
                        <input
                            type="time"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-md text-sm w-full sm:w-32"
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <Text textLevel="label" size="text-xs" colorType="tertiary">
                            {t('teacher-profile.to')}
                        </Text>
                        <input
                            type="time"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-md text-sm w-full sm:w-32"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        onClick={onCancel}
                        className="text-gray-600 text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={() => onConfirm(from, to)}
                        className="text-[#F4A43A] text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                        {t('teacher-profile.confirm')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-1 border-[#E9EAEB] p-3 rounded-md" suppressHydrationWarning>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[3.125rem] flex-1">
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <Text textLevel="label" size="text-xs" colorType="tertiary">
                            {t('teacher-profile.from')}
                        </Text>
                        <input
                            type="time"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-md text-sm w-full sm:w-32"
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <Text textLevel="label" size="text-xs" colorType="tertiary">
                            {t('teacher-profile.to')}
                        </Text>
                        <input
                            type="time"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-md text-sm w-full sm:w-32"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        onClick={onCancel}
                        className="text-gray-600 text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={() => onConfirm(from, to)}
                        className="text-[#F4A43A] text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                        {t('teacher-profile.confirm')}
                    </button>
                </div>
            </div> */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-1 border-[#E9EAEB] p-3 rounded-md" suppressHydrationWarning>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[3.125rem] flex-1">
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <Text textLevel="span" size="text-xs" colorType="tertiary">
                            {t('teacher-profile.from')}
                        </Text>
                        <Text textLevel="span" size="text-sm" weight="medium" colorType="primary">
                            {range.from}
                        </Text>
                    </div>
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <Text textLevel="span" size="text-xs" colorType="tertiary">
                            {t('teacher-profile.to')}
                        </Text>
                        <Text textLevel="span" size="text-sm" weight="medium" colorType="primary">
                            {range.to}
                        </Text>
                    </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        onClick={onDelete}
                        className="text-gray-600 text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                        {t('teacher-profile.delete')}
                    </button>
                    <button
                        onClick={onEdit}
                        className="text-[#F4A43A] text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                        {t('teacher-profile.edit')}
                    </button>
                </div>
            </div>
        </>
    );
}
