import { CustomerTableRow } from '@/hooks/customerManagement/useCustomerManagement';
import { Crown, TrendingUp, Users, Wallet } from 'lucide-react';

interface CustomerStatsProps {
    customers: CustomerTableRow[];
}

export default function CustomerStats({ customers }: CustomerStatsProps) {
    const totalCustomers = customers.length;

    const vipCustomers = customers.filter(c =>
        c.tier.toLowerCase() === 'vip' || c.tier.toLowerCase() === 'diamond'
    ).length;

    const totalWalletBalance = customers.reduce((sum, c) => sum + (c.wallet_balance || 0), 0);

    const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spending || 0), 0);

    // THAY ĐỔI: Màu sắc icon nền tối hơn (opacity thấp) và chữ sáng hơn
    const statsData = [
        { label: 'Tổng khách hàng', value: totalCustomers, icon: Users, color: 'bg-blue-500/20 text-blue-300' },
        { label: 'Khách hàng VIP', value: vipCustomers, icon: Crown, color: 'bg-purple-500/20 text-purple-300' },
        { label: 'Số dư ví hệ thống', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalWalletBalance), icon: Wallet, color: 'bg-emerald-500/20 text-emerald-300' },
        { label: 'Tổng chi tiêu (Revenue)', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue), icon: TrendingUp, color: 'bg-rose-500/20 text-rose-300' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
                <div
                    key={index}
                    // THAY ĐỔI: bg-white/5 (kính), border-white/10, text-white
                    className="bg-white/5 backdrop-blur-xl p-6 rounded-[24px] border border-white/10 shadow-lg flex items-center gap-4 hover:bg-white/10 transition-all"
                >
                    <div className={`p-3 rounded-2xl ${stat.color}`}>
                        <stat.icon size={24} />
                    </div>
                    <div>
                        {/* THAY ĐỔI: text-white/60 */}
                        <p className="text-xs text-white/60 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                        {/* THAY ĐỔI: text-white */}
                        <h3 className="text-xl font-bold text-white tracking-tight">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}