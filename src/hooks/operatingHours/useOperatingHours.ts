import { mockOperatingDays } from '@/mocks'; 
import { OperatingDay } from '@/types/types'; 
import { useEffect, useState } from 'react';

// --- 1. UI TYPES (Kiểu dữ liệu dùng cho giao diện) ---

export interface TimeSlot {
    start: string;
    end: string;
}

export interface DaySchedule {
    id: string;        // ID ngày (convert từ number sang string cho UI)
    dayIndex: number;  // 0: CN, 1: T2...
    label: string;     // VD: "Thứ 2"
    isOpen: boolean;
    shifts: TimeSlot[];
}

// Map để hiển thị tên ngày
const DAY_LABELS: Record<number, string> = {
    0: 'Chủ Nhật',
    1: 'Thứ 2',
    2: 'Thứ 3',
    3: 'Thứ 4',
    4: 'Thứ 5',
    5: 'Thứ 6',
    6: 'Thứ 7',
};

// --- 2. FAKE API SERVICE (ADAPTER) ---
// Chuyển đổi dữ liệu từ DB (OperatingDay) sang UI (DaySchedule) và ngược lại

const fakeApi = {
    getSchedule: async (): Promise<DaySchedule[]> => {
        await new Promise(resolve => setTimeout(resolve, 600)); // Delay giả lập

        // Transform: DB -> UI
        // DB chỉ lưu 1 khung giờ, ta convert thành mảng shifts có 1 phần tử
        return mockOperatingDays.map(day => ({
            id: day.id.toString(),
            dayIndex: day.day_of_week,
            label: DAY_LABELS[day.day_of_week] || 'Ngày lạ',
            isOpen: !day.is_closed,
            shifts: day.is_closed
                ? []
                : [{ start: day.open_time, end: day.close_time }]
        })).sort((a, b) => {
            // Sắp xếp T2->T7, CN cuối cùng hoặc T2 đầu tùy logic
            // Ở đây để T2 (1) -> T7 (6) -> CN (0)
            const adjustedA = a.dayIndex === 0 ? 7 : a.dayIndex;
            const adjustedB = b.dayIndex === 0 ? 7 : b.dayIndex;
            return adjustedA - adjustedB;
        });
    },

    saveSchedule: async (schedule: DaySchedule[]): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Transform: UI -> DB (Để log ra xem thử)
        const dbData: Partial<OperatingDay>[] = schedule.map(day => {
            // Logic: Nếu có ít nhất 1 shift thì lấy shift đầu tiên làm giờ mở cửa
            // Nếu UI cho phép nhiều shift, DB cần thiết kế lại. 
            // Ở đây ta giả định DB chỉ lưu 1 shift.
            const firstShift = day.shifts[0];
            return {
                id: Number(day.id),
                day_of_week: day.dayIndex,
                is_closed: !day.isOpen || !firstShift,
                open_time: firstShift?.start || '00:00',
                close_time: firstShift?.end || '00:00',
            };
        });

        console.log("Saving to DB:", dbData);
        return true; // Giả lập lưu thành công
    }
};

// --- 3. HOOK CHÍNH ---

export function useOperatingHours() {
    const [schedule, setSchedule] = useState<DaySchedule[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Load Data
    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await fakeApi.getSchedule();
                if (mounted) setSchedule(data);
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        loadData();

        return () => { mounted = false; };
    }, []);

    // Update Local State
    const updateLocalSchedule = (newSchedule: DaySchedule[]) => {
        setSchedule(newSchedule);
    };

    // Helper: Cập nhật nhanh một ngày cụ thể (để code UI gọn hơn)
    const updateDay = (dayId: string, updates: Partial<DaySchedule>) => {
        setSchedule(prev => prev.map(day =>
            day.id === dayId ? { ...day, ...updates } : day
        ));
    };

    // Save Data
    const saveChanges = async () => {
        try {
            setIsSaving(true);
            const success = await fakeApi.saveSchedule(schedule);

            if (success) {
                alert("Lưu giờ làm việc thành công!");
            } else {
                alert("Lưu thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            alert("Có lỗi xảy ra khi lưu dữ liệu.");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        schedule,
        isLoading,
        isSaving,
        updateLocalSchedule,
        updateDay, // Helper mới để update từng dòng dễ hơn
        saveChanges
    };
}