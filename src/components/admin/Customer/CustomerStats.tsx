// src/components/admin/customer/CustomerStats.tsx
import { CustomerTableRow } from '@/hooks/customerManagement/useCustomerManagement';
import { Users, Crown, Wallet, TrendingUp } from 'lucide-react';

interface CustomerStatsProps {
    customers: CustomerTableRow[];
}

export default function CustomerStats({ customers }: CustomerStatsProps) {
    // Tự tính toán stats dựa trên dữ liệu thật từ hook
    const totalCustomers = customers.length;
    
    const vipCustomers = customers.filter(c => 
        c.tier.toLowerCase() === 'vip' || c.tier.toLowerCase() === 'diamond'
    ).length;

    const totalWalletBalance = customers.reduce((sum, c) => sum + (c.wallet_balance || 0), 0);
    
    const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spending || 0), 0);

    const statsData = [
        { label: 'Tổng khách hàng', value: totalCustomers, icon: Users, color: 'bg-blue-50 text-blue-600' },
        { label: 'Khách hàng VIP', value: vipCustomers, icon: Crown, color: 'bg-purple-50 text-purple-600' },
        { label: 'Số dư ví hệ thống', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalWalletBalance), icon: Wallet, color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Tổng chi tiêu (Revenue)', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue), icon: TrendingUp, color: 'bg-rose-50 text-rose-600' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}