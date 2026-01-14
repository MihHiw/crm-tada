"use client";
import { CUSTOMERS_DATA } from '@/mocks/customer';
import { DollarSign, TrendingUp, UserPlus, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

export function useDashboardData(filter: any, isConfirmed: boolean) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isConfirmed) return;

        let isMounted = true;

        // FIX LỖI REACT: Dùng hàm riêng để khởi động loading, tránh setState trực tiếp trong body useEffect
        const startLoading = () => {
            if (isMounted) setIsLoading(true);
        };
        startLoading();

        const timer = setTimeout(() => {
            let totalCurrentDebtRaw = 0;
            let totalLoanRaw = 0;

            // FIX LỖI ESLint: Dùng const vì Set và Array không bị gán lại (re-assign)
            const activeCustomerIds = new Set<string>();
            const filteredTransactions: any[] = [];

            CUSTOMERS_DATA.forEach(customer => {
                // 1. Kiểm tra địa lý (Vùng/Tỉnh/Quận)
                const matchRegion = filter.region === "Tất cả" || customer.address.region === filter.region;
                const matchProvince = filter.province === "Tất cả" || customer.address.province === filter.province;
                const matchCity = filter.city === "Tất cả" || customer.address.city === filter.city;

                if (matchRegion && matchProvince && matchCity) {
                    customer.products.forEach(p => {
                        // 2. Tách chuỗi ngày tháng dd/mm/yyyy
                        const dateParts = p.loanDate.split('/');
                        if (dateParts.length < 3) return;

                        const loanMonth = dateParts[1]; // Vị trí mm
                        const loanYear = dateParts[2];  // Vị trí yyyy

                        // FIX LỖI LOGIC LỌC THÁNG: 
                        // Đảm bảo so sánh chính xác chuỗi (Ví dụ: "05" === "05")
                        const matchMonth = filter.month === "Tất cả" || loanMonth === filter.month;
                        const matchYear = filter.year === "Tất cả" || loanYear === filter.year;

                        if (matchMonth && matchYear) {
                            totalCurrentDebtRaw += p.remainingAmount;
                            totalLoanRaw += p.loanAmount;
                            activeCustomerIds.add(customer.id);

                            filteredTransactions.push({
                                id: p.id,
                                name: customer.name,
                                type: p.name,
                                val: p.loanAmount.toLocaleString('vi-VN') + " đ",
                                status: p.remainingAmount === 0 ? "Hoàn thành" : "Đang nợ",
                                rawDate: p.loanDate
                            });
                        }
                    });
                }
            });

            const formatCurrency = (num: number) => {
                if (num >= 1000000000) return (num / 1000000000).toFixed(2) + " tỷ đ";
                if (num >= 1000000) return (num / 1000000).toFixed(0) + " triệu đ";
                return num.toLocaleString('vi-VN') + " đ";
            };

            if (isMounted) {
                setData({
                    stats: [
                        { label: 'Dư nợ hiện tại', val: formatCurrency(totalCurrentDebtRaw), color: 'text-blue-500', icon: Wallet, trend: "+5.2%" },
                        { label: 'Vốn giải ngân', val: formatCurrency(totalLoanRaw), color: 'text-purple-500', icon: DollarSign, trend: "+2.1%" },
                        { label: 'Hiệu suất thu hồi', val: totalLoanRaw > 0 ? ((1 - totalCurrentDebtRaw / totalLoanRaw) * 100).toFixed(1) + "%" : "0%", color: 'text-orange-500', icon: TrendingUp, trend: "+0.4%" },
                        { label: 'Hồ sơ hệ thống', val: activeCustomerIds.size.toString(), color: 'text-pink-500', icon: UserPlus, trend: "+" + activeCustomerIds.size },
                    ],
                    recentTransactions: filteredTransactions
                        .sort((a, b) => {
                            // Sắp xếp ngày mới nhất lên đầu
                            const dateA = a.rawDate.split('/').reverse().join('');
                            const dateB = b.rawDate.split('/').reverse().join('');
                            return dateB.localeCompare(dateA);
                        })
                        .slice(0, 5),
                    allocations: [
                        { label: "Sản xuất", percent: 65, color: "bg-blue-500" },
                        { label: "Tiêu dùng", percent: 20, color: "bg-indigo-500" },
                        { label: "Khác", percent: 15, color: "bg-emerald-500" },
                    ]
                });
                setIsLoading(false);
            }
        }, 500);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [isConfirmed, filter]);

    return {
        stats: data?.stats || [],
        allocations: data?.allocations || [],
        recentTransactions: data?.recentTransactions || [],
        loading: isLoading
    };
}