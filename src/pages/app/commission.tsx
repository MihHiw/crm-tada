import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import { ReferralExtended, useFinanceData } from '@/hooks/finance/useFinanceData';
import { useAuthStore } from '@/store/authStore';
import { CheckCircle2, Clock, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

// Định nghĩa lại TabType
type TabType = 'all' | 'completed' | 'pending' | 'cancelled';

export default function CommissionPage() {
    // 1. Sử dụng hook mới
    const { referrals, loading } = useFinanceData();
    const { user, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState<TabType>('all');

    // 2. Tính toán thống kê (Stats)
    const stats = useMemo(() => {
        const totalCommission = referrals.reduce((sum, ref) => {
            // Chỉ tính hoa hồng nếu trạng thái là 'completed' (hoặc tuỳ logic kinh doanh)
            return ref.status === 'completed' ? sum + ref.commission_amount : sum;
        }, 0);

        return {
            totalCommission,
            totalFriends: referrals.length,
            currency: 'đ',
            // Lấy mã giới thiệu từ user hiện tại (giả định có trường referralCode hoặc dùng phone)
            referralCode: user?.phone?.slice(-4) || 'XXXX',
        };
    }, [referrals, user]);

    // 3. Lọc và Nhóm dữ liệu theo tháng
    const groupedData = useMemo(() => {
        // B1: Lọc theo tab
        const filtered = referrals.filter(item => {
            if (activeTab === 'all') return true;
            return item.status === activeTab;
        });

        // B2: Sắp xếp mới nhất trước
        const sorted = [...filtered].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // B3: Nhóm theo tháng (VD: "Tháng 02/2025")
        const groups: Record<string, ReferralExtended[]> = {};

        sorted.forEach(item => {
            const date = new Date(item.created_at);
            const monthKey = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;

            if (!groups[monthKey]) {
                groups[monthKey] = [];
            }
            groups[monthKey].push(item);
        });

        // B4: Chuyển về dạng mảng để render
        return Object.entries(groups).map(([month, items]) => ({
            month,
            data: items
        }));

    }, [referrals, activeTab]);

    // 4. Render Icon dựa trên trạng thái
    const renderIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={20} />
                    </div>
                );
            case 'pending':
                return (
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Clock size={20} />
                    </div>
                );
            default: // cancelled hoặc khác
                return (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <Users size={20} />
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header user={user} logout={logout} />
            </div>

            <main className="flex-1 overflow-y-auto pt-[85px] pb-[100px] px-4 w-full max-w-7xl mx-auto space-y-8">
                {/* --- Stats Card --- */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden shrink-0">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>

                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider mb-1">Tổng hoa hồng CTV</p>
                            <h2 className="text-3xl font-black">{stats.totalCommission.toLocaleString()}{stats.currency}</h2>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-right">
                            <p className="text-[10px] text-emerald-50 mb-0.5">Mã giới thiệu</p>
                            <p className="text-sm font-bold font-mono">{stats.referralCode}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-black/10 p-3 rounded-2xl border border-white/10">
                        <div className="flex-1 border-r border-white/20">
                            <p className="text-emerald-100 text-[10px] uppercase tracking-wider mb-0.5">Tổng giới thiệu</p>
                            <p className="font-bold text-lg">{stats.totalFriends} người</p>
                        </div>
                        <div className="flex-1 pl-4">
                            <p className="text-emerald-100 text-[10px] uppercase tracking-wider mb-0.5">Đơn vị</p>
                            <p className="font-bold text-lg">{stats.currency}</p>
                        </div>
                    </div>
                </div>

                {/* --- Tabs --- */}
                <div className="bg-gray-200/50 p-1 rounded-2xl flex font-bold text-xs shrink-0 backdrop-blur-sm border border-gray-200">
                    {(['all', 'completed', 'PENDING'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 rounded-xl transition-all uppercase tracking-tighter ${activeTab === tab
                                ? 'bg-white text-emerald-700 shadow-md ring-1 ring-black/5'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'all' ? 'Tất cả' : tab === 'completed' ? 'Đã duyệt' : 'Đang chờ'}
                        </button>
                    ))}
                </div>

                {/* --- List Data --- */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500 font-medium">Đang tải lịch sử...</p>
                    </div>
                ) : (
                    <div className="space-y-6 pb-4">
                        {groupedData.length === 0 ? (
                            <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-300">
                                <Users className="mx-auto text-gray-300 mb-3" size={40} />
                                <p className="text-gray-400 font-medium">Chưa có dữ liệu hoa hồng nào</p>
                            </div>
                        ) : (
                            groupedData.map((group, index) => (
                                <div key={index}>
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                        <div className="h-4 w-1 bg-emerald-500 rounded-full"></div>
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                                            {group.month}
                                        </h3>
                                    </div>
                                    <div className="space-y-3">
                                        {group.data.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow"
                                            >
                                                {/* ICON TRẠNG THÁI */}
                                                <div className="flex-shrink-0 mr-4">
                                                    {renderIcon(item.status)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 text-[15px] leading-tight mb-0.5 truncate">
                                                        {item.referred_user_name} {/* Hiển thị tên người được giới thiệu */}
                                                    </h4>
                                                    <p className="text-[11px] text-gray-400 font-mono mb-2 uppercase tracking-widest">
                                                        ID: {item.id.slice(0, 8)}...
                                                    </p>

                                                    <div className="flex items-center">
                                                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${item.status === 'completed'
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            : (item.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-gray-100 text-gray-500 border-gray-200')
                                                            }`}>
                                                            {item.status === 'completed' ? 'Thành công' : (item.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* AMOUNT & DATE */}
                                                <div className="text-right ml-2 flex-shrink-0">
                                                    <p className={`font-black text-sm ${item.commission_amount > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                        {item.commission_amount > 0 ? `+${item.commission_amount.toLocaleString()}` : '0'}đ
                                                    </p>
                                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                                                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            <div className="flex-none bg-white border-t border-gray-100">
                <BottomNav />
            </div>
        </div>
    );
}