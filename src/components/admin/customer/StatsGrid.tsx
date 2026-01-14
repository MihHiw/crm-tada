import { LucideIcon, Sparkles, Ticket, Wallet } from 'lucide-react';

// 1. Định nghĩa interface cho từng mục StatItem
interface StatItemProps {
    label: string;
    value: string | number;
    icon: LucideIcon; // Sử dụng kiểu LucideIcon thay vì any
    color: string;
}

const StatItem = ({ label, value, icon: Icon, color }: StatItemProps) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-gray-200 transition-all">
        <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10 text-opacity-100`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
    </div>
);

// 2. Định nghĩa cấu trúc dữ liệu cho stats
interface CustomerStats {
    wallet: string | number;
    sessions: number;
    vouchers: number;
}

const StatsGrid = ({ stats }: { stats: CustomerStats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatItem label="Ví trả trước" value={stats.wallet} icon={Wallet} color="bg-blue-500" />
            <StatItem label="Liệu trình còn" value={`${stats.sessions} buổi`} icon={Sparkles} color="bg-rose-500" />
            <StatItem label="Voucher" value={`${stats.vouchers} mã`} icon={Ticket} color="bg-purple-500" />
        </div>
    );
};

export default StatsGrid;