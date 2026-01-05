"use client";
import Footer from '@/components/app/Footer';
import Header from '@/components/app/Header';
import { ArrowDownLeft, CreditCard, Plus, Send, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserLightPage() {
    const router = useRouter();
    const [user] = useState<any>((() => {
        if (typeof window !== 'undefined') {
            const session = localStorage.getItem('user_session');
            return session ? JSON.parse(session) : null;
        }
        return null;
    }));

    useEffect(() => {
        if (!user) router.push('/login');
    }, [user, router]);

    if (!user) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Đang tải...</div>;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Header userName={user.name} />

            <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-20">
                <div className="grid grid-cols-12 gap-10">

                    {/* Cột trái: Chiếm 8 cột */}
                    <div className="col-span-12 lg:col-span-8 space-y-12">

                        {/* Balance Card - Nâng cấp với Mesh Gradient */}
                        <div className="relative h-64 w-full bg-[#1e40af] rounded-[2.5rem] p-10 overflow-hidden shadow-2xl shadow-blue-500/20">
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-blue-100/70 text-sm font-medium uppercase tracking-[0.2em]">Tổng tài sản</p>
                                        <h2 className="text-5xl font-extrabold text-white tracking-tight">$24,500.00</h2>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                                        <CreditCard className="text-white" size={28} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="font-mono text-xl text-blue-100/80 tracking-[0.4em]">**** 8824</div>
                                    <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold text-white uppercase">Thẻ chính</div>
                                </div>
                            </div>

                            {/* Abstract Shapes for Depth */}
                            <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-blue-400 rounded-full blur-[100px] opacity-40"></div>
                            <div className="absolute bottom-[-30%] left-[-5%] w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-30"></div>
                        </div>

                        {/* Action Row - Tinh gọn lại */}
                        <div className="flex justify-around items-center bg-white py-8 px-4 rounded-[2rem] shadow-sm border border-slate-100">
                            <QuickAction icon={Send} label="Gửi" colorClass="bg-blue-600" />
                            <QuickAction icon={ArrowDownLeft} label="Nhận" colorClass="bg-emerald-500" />
                            <QuickAction icon={Wallet} label="Ví" colorClass="bg-violet-500" />
                            <QuickAction icon={Plus} label="Nạp" colorClass="bg-amber-500" />
                        </div>

                        {/* Transaction Section */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Giao dịch gần đây</h3>
                                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Xem tất cả</button>
                            </div>
                            <div className="space-y-3">
                                <TransactionItem title="Thanh toán Grab" date="Hôm nay, 12:45" amount="-15.20" isPositive={false} />
                                <TransactionItem title="Lương tháng 1" date="Hôm qua, 08:00" amount="2,500.00" isPositive={true} />
                            </div>
                        </div>
                    </div>

                    {/* Cột phải: Chiếm 4 cột - Widgets */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        {/* Widget mục tiêu tiết kiệm đẹp hơn */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <h4 className="font-black text-slate-800 text-lg mb-6">Mục tiêu tiết kiệm</h4>
                            <div className="space-y-6">
                                <div className="p-5 bg-slate-50 rounded-3xl">
                                    <div className="flex justify-between text-xs font-black uppercase mb-3 text-slate-400">
                                        <span>Macbook Pro M3</span>
                                        <span className="text-blue-600">65%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// --- Helper Components ---

// Thành phần Action Button mới tinh tế hơn
function QuickAction({ icon: Icon, label, colorClass }: any) {
    return (
        <div className="flex flex-col items-center gap-3 group cursor-pointer">
            <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300`}>
                <Icon size={24} className="text-white" />
            </div>
            <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 uppercase tracking-wider">{label}</span>
        </div>
    );
}

// Transaction Item với thiết kế hiện đại
function TransactionItem({ title, date, amount, isPositive }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    {/* Thêm logic Icon ở đây dựa trên title */}
                    <div className="font-bold text-lg">{title.charAt(0)}</div>
                </div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">{title}</p>
                    <p className="text-xs text-slate-400 font-medium">{date}</p>
                </div>
            </div>
            <div className={`font-bold text-base ${isPositive ? 'text-emerald-500' : 'text-slate-900'}`}>
                {isPositive ? '+' : ''}{amount}
            </div>
        </div>
    );
}
