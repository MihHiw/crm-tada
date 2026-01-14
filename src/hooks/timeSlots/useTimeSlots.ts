import { mockOperatingDays } from '@/mocks'; // Import standardized mock data
import { useEffect, useState } from 'react';

// --- Types ---
export interface Shift {
    start: string;
    end: string;
}

export interface DaySchedule {
    id: string;   // 'mon', 'tue', etc. or numeric ID converted to string
    dayIndex: number; // 0=Sun, 1=Mon...
    label: string;
    isOpen: boolean;
    shifts: Shift[];
}

// --- Helper: Pure function to generate time slots ---
const generateSlotsFromShifts = (shifts: Shift[], intervalMinutes: number): string[] => {
    const slots: string[] = [];

    shifts.forEach((shift) => {
        const [startHour, startMinute] = shift.start.split(':').map(Number);
        const [endHour, endMinute] = shift.end.split(':').map(Number);

        const current = new Date();
        current.setHours(startHour, startMinute, 0, 0);

        const end = new Date();
        end.setHours(endHour, endMinute, 0, 0);

        // Loop until current time reaches end time
        while (current < end) {
            const timeString = current.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
            });
            slots.push(timeString);
            current.setMinutes(current.getMinutes() + intervalMinutes);
        }
    });

    return slots;
};

// --- Helper: Map JS Day Index to Label ---
const DAY_LABELS: Record<number, string> = {
    0: 'Chủ Nhật',
    1: 'Thứ 2',
    2: 'Thứ 3',
    3: 'Thứ 4',
    4: 'Thứ 5',
    5: 'Thứ 6',
    6: 'Thứ 7',
};

// --- Main Hook ---
export function useTimeSlots(dateString: string, interval = 30) {
    const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
    const [slots, setSlots] = useState<string[]>([]);
    const [isShopClosed, setIsShopClosed] = useState<boolean>(false);
    const [dayLabel, setDayLabel] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [closingTime, setClosingTime] = useState<string | null>(null);

    // 1. Fetch & Transform Data (DB -> UI)
    useEffect(() => {
        const loadSchedule = async () => {
            setIsLoading(true);
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 300));

                // Transform mockOperatingDays (DB format) to DaySchedule (UI format)
                const transformedData: DaySchedule[] = mockOperatingDays.map(day => ({
                    id: day.day_of_week.toString(),
                    dayIndex: day.day_of_week,
                    label: DAY_LABELS[day.day_of_week],
                    isOpen: !day.is_closed,
                    shifts: day.is_closed
                        ? []
                        : [{ start: day.open_time, end: day.close_time }]
                }));

                setScheduleData(transformedData);
            } catch (error) {
                console.error("Failed to load schedule", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSchedule();
    }, []);

    // 2. Calculate Slots based on Date
    useEffect(() => {
        // Reset state if no date or no data
        if (!dateString || scheduleData.length === 0) {
            setSlots([]);
            setDayLabel('');
            setClosingTime(null);
            return;
        }

        const dateObj = new Date(dateString);
        const dayIndex = dateObj.getDay(); // 0 (Sun) - 6 (Sat)

        // Find schedule matching the selected date's day of week
        const currentDaySchedule = scheduleData.find((d) => d.dayIndex === dayIndex);

        if (currentDaySchedule) {
            setDayLabel(currentDaySchedule.label);

            // Check if closed
            if (!currentDaySchedule.isOpen || !currentDaySchedule.shifts || currentDaySchedule.shifts.length === 0) {
                setIsShopClosed(true);
                setSlots([]);
                setClosingTime(null);
            } else {
                setIsShopClosed(false);
                const generatedSlots = generateSlotsFromShifts(currentDaySchedule.shifts, interval);
                setSlots(generatedSlots);

                // Set closing time based on the last shift
                const lastShift = currentDaySchedule.shifts[currentDaySchedule.shifts.length - 1];
                setClosingTime(lastShift.end);
            }
        } else {
            // Fallback if day not found in config
            setIsShopClosed(true);
            setSlots([]);
        }
    }, [dateString, scheduleData, interval]);

    return {
        slots,
        isShopClosed,
        dayLabel,
        isLoading,
        closingTime
    };
}