import { BookingStatus } from '@/types/types';
import { isSameDay, isSameMonth, isSameYear, parseISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { BookingExtended, useBookings } from './useBookingData';


export type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';

export interface BookingStats {
    total: number;
    pendingCount: number;
    confirmedCount: number;
    revenue: number;
}


export const useBookingManagement = () => {
    const { bookings: serverBookings, loadingBookings } = useBookings();
    const [localBookings, setLocalBookings] = useState<BookingExtended[]>([]);

    useEffect(() => {
        setLocalBookings(serverBookings);
    }, [serverBookings]);

    const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // --- LOGIC LỌC (FILTERING) ---

    const filteredByTimeAndSearch = useMemo(() => {
        return localBookings.filter((b) => {
            // --- SỬA LỖI Ở ĐÂY ---
            // Dùng 'start_time' thay vì 'booking_date'
            // start_time là chuẩn ISO (VD: 2026-01-08T09:00:00) nên chứa đủ thông tin ngày
            const bookingDate = parseISO(b.start_time);
            const filterDate = parseISO(selectedDate);

            let matchesTime = true;
            if (timeFilter === 'today') {
                matchesTime = isSameDay(bookingDate, filterDate);
            } else if (timeFilter === 'month') {
                matchesTime = isSameMonth(bookingDate, filterDate);
            } else if (timeFilter === 'year') {
                matchesTime = isSameYear(bookingDate, filterDate);
            }

            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                b.customer_name.toLowerCase().includes(searchLower) ||
                b.customer_phone.includes(searchLower) ||
                b.id.toLowerCase().includes(searchLower);

            return matchesTime && matchesSearch;
        });
    }, [localBookings, timeFilter, selectedDate, searchTerm]);

    // Lọc tiếp theo Status
    const finalFilteredBookings = useMemo(() => {
        return filteredByTimeAndSearch.filter(b =>
            activeTab === 'all' ? true : b.status === activeTab
        );
    }, [filteredByTimeAndSearch, activeTab]);

    // --- THỐNG KÊ (STATS) ---
    const stats = useMemo<BookingStats>(() => {
        const sourceData = filteredByTimeAndSearch;
        return {
            total: sourceData.length,
            pendingCount: sourceData.filter(b => b.status === 'pending').length,
            confirmedCount: sourceData.filter(b => b.status === 'confirmed').length,
            revenue: sourceData
                .filter(b => b.status === 'completed')
                .reduce((acc, curr) => acc + curr.total_price, 0)
        };
    }, [filteredByTimeAndSearch]);

    // --- ACTIONS ---
    const actions = {
        formatCurrency: (amount: number) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        },
        // Action giả lập (Optimistic Update)
        updateStatus: (id: string, newStatus: BookingStatus) => {
            setLocalBookings(prev => prev.map(b =>
                b.id === id ? { ...b, status: newStatus } : b
            ));
        },
        approveBooking: (id: string) => actions.updateStatus(id, 'confirmed'),
        cancelBooking: (id: string) => actions.updateStatus(id, 'cancelled'),
        completeBooking: (id: string) => actions.updateStatus(id, 'completed'),
    };

    return {
        state: {
            bookings: localBookings,
            filteredBookings: finalFilteredBookings,
            loading: loadingBookings,
            activeTab,
            searchTerm,
            stats,
            timeFilter,
            selectedDate
        },
        setters: {
            setActiveTab,
            setSearchTerm,
            setTimeFilter,
            setSelectedDate
        },
        actions
    };
};