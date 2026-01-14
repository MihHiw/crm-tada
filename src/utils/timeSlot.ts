export const generateTimeSlots = (): string[] => {
    const slots: string[] = [];

    for (let hour = 9; hour <= 20; hour++) {
        for (const minute of [0, 30]) {
            // Dừng lại nếu vượt quá 20:00 (hoặc 20:30 tùy theo yêu cầu của bạn)
            if (hour === 20 && minute === 30) break;

            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');

            slots.push(`${formattedHour}:${formattedMinute}`);
        }
    }

    return slots;
};