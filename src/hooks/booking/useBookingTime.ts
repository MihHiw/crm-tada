export function useBookingTime() {
    const generateTimeSlots = () => {
        const slots: string[] = [];
        for (let hour = 9; hour <= 20; hour++) {
            // SỬA LỖI: Thay 'let' bằng 'const' cho biến minute
            for (const minute of [0, 30]) {
                if (hour === 20 && minute === 30) break;
                slots.push(
                    `${hour.toString().padStart(2, '0')}:${minute
                        .toString()
                        .padStart(2, '0')}`
                );
            }
        }
        return slots;
    };

    return { generateTimeSlots };
}