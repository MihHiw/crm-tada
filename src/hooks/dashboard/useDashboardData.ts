"use client";
import { DollarSign, TrendingUp, UserPlus, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

export function useDashboardData() {
    // 1. Khởi tạo loading là true ngay từ đầu
    const [loading, setLoading] = useState(true);

    const chartData = [
        { name: 'Thg 1', value: 400 }, { name: 'Thg 2', value: 300 },
        { name: 'Thg 3', value: 600 }, { name: 'Thg 4', value: 450 },
        { name: 'Thg 5', value: 500 }, { name: 'Thg 6', value: 800 },
        { name: 'Thg 7', value: 650 }, { name: 'Thg 8', value: 400 },
        { name: 'Thg 9', value: 900 }, { name: 'Thg 10', value: 700 },
        { name: 'Thg 11', value: 850 }, { name: 'Thg 12', value: 600 },
    ];

    const stats = [
        { label: 'Tổng tài sản (AUM)', val: '24.5 tỷ VNĐ', trend: '+5.2%', color: 'text-blue-500', icon: Wallet },
        { label: 'Doanh thu (MRR)', val: '1.2 tỷ VNĐ', trend: '+2.1%', color: 'text-purple-500', icon: DollarSign },
        { label: 'Lợi nhuận ròng', val: '18.5%', trend: '+1.4%', color: 'text-orange-500', icon: TrendingUp },
        { label: 'Khách hàng mới', val: '45', trend: '+12%', color: 'text-pink-500', icon: UserPlus },
    ];

    const allocations = [
        { label: "Cổ phiếu", percent: 65, color: "bg-blue-500" },
        { label: "Trái phiếu", percent: 20, color: "bg-indigo-500" },
        { label: "Tiền mặt", percent: 15, color: "bg-emerald-500" },
    ];

    const recentTransactions = [
        { id: 1, name: "Trần Thị B", type: "Đầu tư Quỹ Mở", date: "Hôm nay, 14:20", val: "500.000.000 đ", status: "Hoàn thành" },
        { id: 2, name: "Nguyễn Văn A", type: "Tiết kiệm Premium", date: "Hôm qua, 09:15", val: "2.000.000.000 đ", status: "Đang xử lý" },
    ];

    useEffect(() => {

        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return {
        chartData,
        stats,
        allocations,
        recentTransactions,
        loading
    };
}