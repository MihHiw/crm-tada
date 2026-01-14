import {
    Bell,
    Calendar,
    Camera,
    ChevronLeft,
    ChevronRight,
    FileText,
    Lock,
    MapPin,
    ShieldCheck,
    Trash2
} from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';

// --- DEFINING TYPES (FIX ESLINT ANY ERROR) ---
interface PermissionItemProps {
    icon: ReactNode;
    color: string;
    title: string;
    desc: string;
    checked: boolean;
    onToggle: () => void;
}

interface LegalItemProps {
    icon: ReactNode;
    title: string;
    isDestructive?: boolean;
}

const PrivacyPage = () => {
    const router = useRouter();

    const [permissions, setPermissions] = useState({
        location: true,
        camera: false,
        notifications: true,
        syncCalendar: false
    });

    const togglePermission = (key: keyof typeof permissions) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-slate-100 md:bg-slate-200 font-sans text-slate-900 leading-tight flex justify-center">
            <Head>
                <title>Quyền riêng tư - Vanilla Beauty</title>
            </Head>

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
                        <h1 className="text-sm md:text-base font-bold text-white uppercase tracking-[0.2em] mt-2">Quyền riêng tư</h1>
                    </div>
                </div>

                {/* --- PROTECTION STATUS CARD --- */}
                <div className="px-5 -mt-12 md:-mt-16 relative z-10 shrink-0 max-w-4xl mx-auto w-full">
                    <div className="bg-white rounded-[1.8rem] p-5 md:p-6 shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.01]">
                        <div className="flex-1 pr-4">
                            <h2 className="text-xs md:text-sm font-bold text-slate-800 tracking-tight">Dữ liệu được bảo vệ</h2>
                            <p className="text-[9px] md:text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                                Tài khoản của bạn đang ở trạng thái an toàn tuyệt đối theo tiêu chuẩn mã hóa mới nhất.
                            </p>
                        </div>
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-full flex items-center justify-center text-[#00AEEF] shadow-inner">
                            <Lock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT --- */}
                <main className="px-5 mt-6 space-y-6 flex-1 max-w-4xl mx-auto w-full pb-10">

                    <section className="space-y-3">
                        <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Quyền truy cập thiết bị</h3>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                            <PermissionItem
                                icon={<MapPin className="w-4.5 h-4.5" />}
                                color="bg-emerald-50 text-emerald-500"
                                title="Vị trí"
                                desc="Gợi ý spa gần bạn nhất dựa trên tọa độ thực tế."
                                checked={permissions.location}
                                onToggle={() => togglePermission('location')}
                            />
                            <PermissionItem
                                icon={<Camera className="w-4.5 h-4.5" />}
                                color="bg-amber-50 text-amber-500"
                                title="Camera"
                                desc="Chụp ảnh da để phân tích bằng công nghệ AI."
                                checked={permissions.camera}
                                onToggle={() => togglePermission('camera')}
                            />
                            <PermissionItem
                                icon={<Bell className="w-4.5 h-4.5" />}
                                color="bg-rose-50 text-rose-500"
                                title="Thông báo"
                                desc="Nhắc nhở lịch hẹn và ưu đãi dành riêng cho bạn."
                                checked={permissions.notifications}
                                onToggle={() => togglePermission('notifications')}
                            />
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Kết nối hệ thống</h3>
                        <div className="bg-white rounded-[1.8rem] shadow-sm border border-slate-100 p-4 md:p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-11 md:h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                                    <Calendar className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <p className="text-xs md:text-sm font-bold text-slate-700">Đồng bộ lịch</p>
                                    <p className="text-[9px] md:text-[10px] text-slate-400 font-medium">Thêm lịch hẹn trực tiếp vào điện thoại của bạn.</p>
                                </div>
                            </div>
                            <Switch checked={permissions.syncCalendar} onChange={() => togglePermission('syncCalendar')} />
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Thông tin pháp lý</h3>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                            <LegalItem icon={<ShieldCheck className="w-4.5 h-4.5" />} title="Chính sách quyền riêng tư" />
                            <LegalItem icon={<FileText className="w-4.5 h-4.5" />} title="Điều khoản dịch vụ" />
                            <LegalItem icon={<Trash2 className="w-4.5 h-4.5" />} title="Yêu cầu xóa dữ liệu vĩnh viễn" isDestructive />
                        </div>
                    </section>


                </main>
            </div>
        </div>
    );
};

/* --- SUB-COMPONENTS WITH STRICT TYPING --- */

const PermissionItem = ({ icon, color, title, desc, checked, onToggle }: PermissionItemProps) => (
    <div className="flex items-center justify-between p-4 md:p-5 hover:bg-slate-50 transition-colors group">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 md:w-11 md:h-11 ${color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                {icon}
            </div>
            <div>
                <p className="text-xs md:text-sm font-bold text-slate-700">{title}</p>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-medium pr-4">{desc}</p>
            </div>
        </div>
        <Switch checked={checked} onChange={onToggle} />
    </div>
);

const LegalItem = ({ icon, title, isDestructive = false }: LegalItemProps) => (
    <button className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-slate-50 active:bg-slate-100 transition-all text-left group">
        <div className="flex items-center gap-4">
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-sm ${isDestructive ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>
                {icon}
            </div>
            <span className={`text-xs md:text-sm font-bold ${isDestructive ? 'text-rose-500' : 'text-slate-700'}`}>{title}</span>
        </div>
        <ChevronRight className={`w-4 h-4 ${isDestructive ? 'text-rose-200' : 'text-slate-300'} group-hover:translate-x-1 transition-transform`} />
    </button>
);

const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="relative inline-flex items-center cursor-pointer shrink-0 active:scale-95 transition-transform">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
        <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00AEEF] shadow-inner"></div>
    </label>
);

export default PrivacyPage;