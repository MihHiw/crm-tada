"use client";
import { useAuthHeader } from '@/hooks/auth/useAuthHeader';
import Header from '@/components/app/Header';
import Footer from '@/components/app/Footer';
import {
    User as UserIcon,
    Mail,
    Phone,
    Shield,
    Camera,
    Edit3,
    CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
    const { user, loading } = useAuthHeader();

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Sử dụng Optional Chaining hoặc trả về null an toàn nếu không có user
    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            <Header />

            <main className="max-w-4xl mx-auto px-6 pt-10 lg:pt-16">
                {/* --- PHẦN ĐẦU: AVATAR & TIÊU ĐỀ --- */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60 relative overflow-hidden mb-8">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar với nút thay đổi ảnh */}
                        <div className="relative group">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-blue-500/20 uppercase tracking-tighter overflow-hidden">
                                {user?.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={user.name}
                                        fill
                                        className="rounded-3xl object-cover"
                                    />
                                ) : (
                                    user?.name?.charAt(0) || 'U'
                                )}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-xl shadow-lg border border-slate-100 text-blue-600 hover:scale-110 transition-transform active:scale-95">
                                <Camera size={18} />
                            </button>
                        </div>

                        <div className="text-center md:text-left space-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">{user?.fullName}</h1>
                                <CheckCircle2 size={20} className="text-blue-500" />
                            </div>
                            <p className="text-slate-500 font-medium italic lowercase">@{user?.name?.replace(/\s/g, '')}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100 flex items-center gap-1.5">
                                    <Shield size={14} /> {user?.role}
                                </span>
                            </div>
                        </div>

                        <button className="md:ml-auto flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10">
                            <Edit3 size={18} /> Chỉnh sửa hồ sơ
                        </button>
                    </div>

                    {/* Họa tiết trang trí nền */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 z-0"></div>
                </div>

                {/* --- PHẦN THÂN: THÔNG TIN CHI TIẾT --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Thẻ Thông tin cá nhân */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60 space-y-8">
                        <h3 className="text-lg font-black flex items-center gap-3">
                            <UserIcon className="text-blue-600" size={20} />
                            Chi tiết tài khoản
                        </h3>

                        <div className="space-y-6">
                            <InfoRow label="Tên người dùng" value={user?.name} />
                            <InfoRow label="Họ và tên" value={user?.fullName} />
                            <InfoRow label="Mã định danh" value={`#ID-${user?.id}`} />
                        </div>
                    </div>

                    {/* Thẻ Thông tin liên hệ */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200/60 space-y-8">
                        <h3 className="text-lg font-black flex items-center gap-3">
                            <Mail className="text-blue-600" size={20} />
                            Liên hệ & Bảo mật
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <Mail className="text-slate-400 mt-1" size={18} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email đăng nhập</p>
                                    <p className="text-sm font-bold text-slate-800">{user?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <Phone className="text-slate-400 mt-1" size={18} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</p>
                                    <p className="text-sm font-bold text-slate-800">{user?.phone || 'Chưa cập nhật'}</p>
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

// Component phụ hiển thị dòng thông tin
function InfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
            <span className="text-sm font-medium text-slate-400">{label}</span>
            <span className="text-sm font-bold text-slate-900">{value}</span>
        </div>
    );
}