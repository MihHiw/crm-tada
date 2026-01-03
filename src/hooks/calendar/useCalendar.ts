"use client";
import { CALENDAR_STATS, TODAY_SCHEDULE, TODO_LIST } from '@/mocks/calendar';
import { useMemo, useState } from 'react';

export function useCalendar() {
    const [viewMode, setViewMode] = useState<'Tháng' | 'Tuần' | 'Ngày'>('Tháng');

    // Logic xử lý ngày tháng thực tế
    const [date, setDate] = useState(new Date(2023, 10, 1)); // Mặc định Tháng 11/2023

    const currentMonthDisplay = useMemo(() => {
        return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    }, [date]);

    const changeMonth = (offset: number) => {
        const newDate = new Date(date.getFullYear(), date.getMonth() + offset, 1);
        setDate(newDate);
    };

    const handleSync = () => alert("Đang đồng bộ dữ liệu...");
    const createEvent = () => alert("Mở form tạo sự kiện mới");

    return {
        viewMode,
        setViewMode,
        currentMonth: currentMonthDisplay,
        changeMonth,
        stats: CALENDAR_STATS,
        schedule: TODAY_SCHEDULE,
        todos: TODO_LIST,
        handleSync,
        createEvent
    };
}