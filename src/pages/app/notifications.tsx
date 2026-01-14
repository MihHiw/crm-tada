import {
    Bell,
    CheckCircle2,
    ChevronLeft,
    Clock,
    DownloadCloud,
    Leaf,
    Tag
} from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';

// --- ĐỊNH NGHĨA INTERFACE (FIX LỖI ANY) ---
interface NotificationToggleProps {
    icon: ReactNode;
    color: string;
    title: string;
    desc: string;
    checked: boolean;
    onToggle: () => void;
}

const NotificationSettingsPage = () => {
    const router = useRouter();

    // State quản lý các tùy chọn thông báo
    const [settings, setSettings] = useState({
        all: true,
        reminders: true,
        status: true,
        promotions: false,
        services: true,
        updates: true
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-slate-100 md:bg-slate-200 font-sans text-slate-900 leading-tight flex justify-center">
            <Head>
                <title>Cài đặt thông báo - Vanilla Beauty</title>
            </Head>

            {/* Container chính: Desktop mở rộng toàn màn hình, Mobile giới hạn khung App */}
            <div className="w-full md:max-w-none bg-[#F8FAFC] min-h-screen relative pb-20 overflow-x-hidden flex flex-col transition-all duration-300 mx-auto max-w-md md:shadow-none shadow-2xl">

                {/* --- HEADER --- */}
                <div className="relative bg-[#00AEEF] pt-6 pb-24 md:pb-36 rounded-b-[2.5rem] md:rounded-b-[3.5rem] shadow-md overflow-hidden shrink-0 text-center">
                    <div className="max-w-5xl mx-auto px-6 relative z-20">
                        <div className="absolute top-0 left-0">
                            <button
                                onClick={() => router.back()}
                                className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white active:scale-90 transition-all hover:bg-white/30"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                        <h1 className="text-sm md:text-base font-bold text-white uppercase tracking-[0.2em] mt-2">Cài đặt thông báo</h1>
                    </div>
                </div>

                {/* --- TỔNG QUAN (Master Switch) --- */}
                <div className="px-5 -mt-12 md:-mt-16 relative z-10 shrink-0 max-w-4xl mx-auto w-full">
                    <div className="bg-white rounded-[1.8rem] p-5 md:p-6 shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.01]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#00AEEF]">
                                <Bell className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xs md:text-sm font-bold text-slate-800 tracking-tight">Tất cả thông báo</h2>
                                <p className="text-[9px] md:text-[10px] text-slate-400 mt-1 font-medium">Bật hoặc tắt toàn bộ thông báo từ ứng dụng.</p>
                            </div>
                        </div>
                        <Switch checked={settings.all} onToggle={() => handleToggle('all')} />
                    </div>
                </div>

                {/* --- NỘI DUNG CHI TIẾT --- */}
                <main className="px-5 mt-8 space-y-8 flex-1 max-w-4xl mx-auto w-full pb-10">

                    {/* Nhóm 1: Lịch hẹn */}
                    <section className="space-y-3">
                        <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Lịch hẹn & Dịch vụ</h3>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                            <NotificationToggle
                                icon={<Clock className="w-4.5 h-4.5" />}
                                color="bg-emerald-50 text-emerald-500"
                                title="Nhắc nhở lịch hẹn"
                                desc="Nhận thông báo 1 giờ trước giờ hẹn của bạn."
                                checked={settings.reminders}
                                onToggle={() => handleToggle('reminders')}
                            />
                            <NotificationToggle
                                icon={<CheckCircle2 className="w-4.5 h-4.5" />}
                                color="bg-blue-50 text-[#00AEEF]"
                                title="Cập nhật trạng thái"
                                desc="Khi lịch hẹn được xác nhận hoặc thay đổi."
                                checked={settings.status}
                                onToggle={() => handleToggle('status')}
                            />
                        </div>
                    </section>

                    {/* Nhóm 2: Ưu đãi */}
                    <section className="space-y-3">
                        <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Ưu đãi & Tin tức</h3>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                            <NotificationToggle
                                icon={<Tag className="w-4.5 h-4.5" />}
                                color="bg-rose-50 text-rose-500"
                                title="Khuyến mãi & Quà tặng"
                                desc="Các voucher và ưu đãi dành riêng cho bạn."
                                checked={settings.promotions}
                                onToggle={() => handleToggle('promotions')}
                            />
                            <NotificationToggle
                                icon={<Leaf className="w-4.5 h-4.5" />}
                                color="bg-amber-50 text-amber-500"
                                title="Dịch vụ mới"
                                desc="Thông báo khi có liệu trình làm đẹp mới."
                                checked={settings.services}
                                onToggle={() => handleToggle('services')}
                            />
                        </div>
                    </section>

                    {/* Nhóm 3: Hệ thống */}
                    <section className="space-y-3">
                        <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Hệ thống</h3>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-4 md:p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-11 md:h-11 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                    <DownloadCloud className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <p className="text-xs md:text-sm font-bold text-slate-700">Cập nhật ứng dụng</p>
                                    <p className="text-[9px] md:text-[10px] text-slate-400 font-medium">Thông tin về phiên bản mới nhất từ Vanilla.</p>
                                </div>
                            </div>
                            <Switch checked={settings.updates} onToggle={() => handleToggle('updates')} />
                        </div>
                    </section>


                </main>
            </div>
        </div>
    );
};

/* --- COMPONENTS CON TỐI ƯU --- */

const NotificationToggle = ({ icon, color, title, desc, checked, onToggle }: NotificationToggleProps) => (
    <div className="flex items-center justify-between p-4 md:p-5 hover:bg-slate-50 transition-colors group">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 md:w-11 md:h-11 ${color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                {icon}
            </div>
            <div>
                <p className="text-xs md:text-sm font-bold text-slate-700">{title}</p>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-medium pr-4 leading-relaxed">{desc}</p>
            </div>
        </div>
        <Switch checked={checked} onToggle={onToggle} />
    </div>
);

const Switch = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
    <label className="relative inline-flex items-center cursor-pointer shrink-0 active:scale-95 transition-transform">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onToggle} />
        <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00AEEF] shadow-inner"></div>
    </label>
);

export default NotificationSettingsPage;