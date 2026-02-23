import { FetchClient } from '@/features/shared/services/httpClient';
import type { DayAvailability, TimeRange } from '../availability_and_modalities/components/WeeklyAvailabilitySelector';
import { getApiUrl } from '@/features/shared/services/environment';
import { DateTime, fromISOKeepZone } from '@/features/shared/utils/dateConfig';

export interface AvailabilitySlot {
    startAt: string;      // ISO 8601 con timezone incluido
    endAt: string;        // ISO 8601 con timezone incluido
    timeZone?: string;    // Timezone de referencia (todavía presente en availability)
}

export class TeacherAvailabilityRepository {
    private client: FetchClient;

    constructor() {
        this.client = new FetchClient(getApiUrl());
    }

    /**
     * Transform weekly availability pattern into actual date/time slots
     * for the next 3 months from today
     */
    private transformWeeklyToDateSlots(
        weeklyAvailability: DayAvailability[],
        timezone: string = 'America/New_York'
    ): AvailabilitySlot[] {
        const slots: AvailabilitySlot[] = [];
        
        // Usar la zona horaria del profesor para generar los slots
        const today = DateTime.now().setZone(timezone).startOf('day');
        const threeMonthsFromNow = today.plus({ months: 3 });

        // Map day names to weekday numbers (USA format: 0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayNameToWeekday: Record<string, number> = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
        };

        // Iterate through each day from today to 3 months from now
        let currentDate = today;

        while (currentDate <= threeMonthsFromNow) {
            // Convert Luxon weekday (1=Monday, 7=Sunday) to USA format (0=Sunday, 1=Monday, ...)
            const dayOfWeek = currentDate.weekday === 7 ? 0 : currentDate.weekday;

            // Find matching weekly availability for this day of week
            for (const dayAvail of weeklyAvailability) {
                if (dayNameToWeekday[dayAvail.day] === dayOfWeek && dayAvail.isAvailable && dayAvail.timeRanges && dayAvail.timeRanges.length > 0) {
                    // Create slots for each time range in this day
                    for (const timeRange of dayAvail.timeRanges) {
                        // Parse start time (format: "HH:mm")
                        const [startHour, startMinute] = timeRange.from.split(':').map(Number);
                        const startDateTime = currentDate.set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 });

                        // Parse end time (format: "HH:mm")
                        const [endHour, endMinute] = timeRange.to.split(':').map(Number);
                        const endDateTime = currentDate.set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 });

                        slots.push({
                            startAt: startDateTime.toISO()!,
                            endAt: endDateTime.toISO()!
                        });
                    }
                }
            }

            // Move to next day
            currentDate = currentDate.plus({ days: 1 });
        }

        return slots;
    }

    /**
     * Transform date/time slots into weekly availability pattern
     */
    private transformSlotsToWeekly(slots: AvailabilitySlot[]): DayAvailability[] {
        // USA format: Sunday is the first day of the week
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const weeklyMap = new Map<string, Map<string, TimeRange>>();

        // Initialize all days
        dayNames.forEach(day => {
            weeklyMap.set(day, new Map());
        });

        // Group slots by day of week and time range
        slots.forEach(slot => {
            // Parsear manteniendo la zona horaria original del backend
            const startDateTime = fromISOKeepZone(slot.startAt);
            const endDateTime = fromISOKeepZone(slot.endAt);
            
            // Convert Luxon weekday (1=Monday, 7=Sunday) to USA format (0=Sunday, 1=Monday, ...)
            const dayIndex = startDateTime.weekday === 7 ? 0 : startDateTime.weekday;
            const dayOfWeek = dayNames[dayIndex];
            
            const from = startDateTime.toFormat('HH:mm');
            const to = endDateTime.toFormat('HH:mm');
            
            const timeRangeKey = `${from}-${to}`;
            const dayMap = weeklyMap.get(dayOfWeek)!;
            
            if (!dayMap.has(timeRangeKey)) {
                dayMap.set(timeRangeKey, {
                    id: `${Date.now()}-${Math.random()}`,
                    from,
                    to
                });
            }
        });

        // Convert to DayAvailability array
        return dayNames.map(day => {
            const timeRangesMap = weeklyMap.get(day)!;
            const timeRanges = Array.from(timeRangesMap.values());
            
            return {
                day,
                isAvailable: timeRanges.length > 0,
                timeRanges
            };
        });
    }

    /**
     * Get teacher availability and transform to weekly format
     */
    async getAvailability(
        teacherId: string,
        token: string
    ): Promise<DayAvailability[]> {
        try {
            const response = await this.client.get({
                url: `/teacher-availability`,
                token,
            });

            if (!response.ok) {
                throw new Error(`Failed to get availability: ${response.statusText}`);
            }

            const slots: AvailabilitySlot[] = await response.json();
            return this.transformSlotsToWeekly(slots);
        } catch (error) {
            console.error('Error getting teacher availability:', error);
            throw error;
        }
    }

    /**
     * Save teacher availability for the next 3 months
     */
    async saveAvailability(
        teacherId: string,
        weeklyAvailability: DayAvailability[],
        token: string,
        timezone: string = 'America/New_York'
    ): Promise<void> {
        const slots = this.transformWeeklyToDateSlots(weeklyAvailability, timezone);

        try {
            const response = await this.client.post({
                url: `/teacher-availability/${teacherId}`,
                data: slots as any, // Array de slots, JSON.stringify lo manejará
                token,
                headers: {
                    'X-User-Roles': 'teacher'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to save availability: ${response.statusText}`);
            }

            console.log(`Successfully saved ${slots.length} availability slots for teacher ${teacherId}`);
        } catch (error) {
            console.error('Error saving teacher availability:', error);
            throw error;
        }
    }
}
