import { FetchClient } from '@/features/shared/services/httpClient';
import type { DayAvailability, TimeRange } from '../availability_and_modalities/components/WeeklyAvailabilitySelector';
import { getApiUrl } from '@/features/shared/services/environment';

interface AvailabilitySlot {
    startAt: string;
    endAt: string;
    timeZone: string;
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
        timeZone: string = 'Europe/Madrid'
    ): AvailabilitySlot[] {
        const slots: AvailabilitySlot[] = [];
        const today = new Date();
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(today.getMonth() + 3);

        // Map day names to JavaScript Date.getDay() numbers (0 = Sunday, 1 = Monday, etc.)
        const dayNameToNumber: Record<string, number> = {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 0,
        };

        // Iterate through each day from today to 3 months from now
        const currentDate = new Date(today);
        currentDate.setHours(0, 0, 0, 0);

        while (currentDate <= threeMonthsFromNow) {
            const dayOfWeek = currentDate.getDay();

            // Find matching weekly availability for this day of week
            for (const dayAvail of weeklyAvailability) {
                if (dayNameToNumber[dayAvail.day] === dayOfWeek && dayAvail.isAvailable && dayAvail.timeRanges && dayAvail.timeRanges.length > 0) {
                    // Create slots for each time range in this day
                    for (const timeRange of dayAvail.timeRanges) {
                        const startDate = new Date(currentDate);
                        const endDate = new Date(currentDate);

                        // Parse start time (format: "HH:mm")
                        const [startHour, startMinute] = timeRange.from.split(':').map(Number);
                        startDate.setHours(startHour, startMinute, 0, 0);

                        // Parse end time (format: "HH:mm")
                        const [endHour, endMinute] = timeRange.to.split(':').map(Number);
                        endDate.setHours(endHour, endMinute, 0, 0);

                        slots.push({
                            startAt: startDate.toISOString(),
                            endAt: endDate.toISOString(),
                            timeZone,
                        });
                    }
                }
            }

            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return slots;
    }

    /**
     * Transform date/time slots into weekly availability pattern
     */
    private transformSlotsToWeekly(slots: AvailabilitySlot[]): DayAvailability[] {
        const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const weeklyMap = new Map<string, Map<string, TimeRange>>();

        // Initialize all days
        dayNames.forEach(day => {
            weeklyMap.set(day, new Map());
        });

        // Group slots by day of week and time range
        slots.forEach(slot => {
            const date = new Date(slot.startAt);
            // Adjust getDay() to make Monday = 0 instead of Sunday = 0
            const dayIndex = (date.getDay() + 6) % 7;
            const dayOfWeek = dayNames[dayIndex];
            const from = date.toTimeString().slice(0, 5); // HH:mm
            const endDate = new Date(slot.endAt);
            const to = endDate.toTimeString().slice(0, 5); // HH:mm
            
            const timeRangeKey = `${from}-${to}`;
            const dayMap = weeklyMap.get(dayOfWeek)!;
            
            if (!dayMap.has(timeRangeKey)) {
                dayMap.set(timeRangeKey, {
                    id: `${Date.now()}-${Math.random()}`,
                    from,
                    to,
                    isEditing: false
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
        timeZone: string = 'Europe/Madrid'
    ): Promise<void> {
        const slots = this.transformWeeklyToDateSlots(weeklyAvailability, timeZone);

        try {
            const response = await this.client.post({
                url: `/teacher-availability/${teacherId}`,
                data: slots,
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
