import { userAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import {
    Bell,
    Camera,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Mail,
    Phone,
    RefreshCw,
    Shield,
    User
} from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';

const SettingPage = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);

    const { user, logout } = useAuthStore();
    const { data: profileData } = useQuery('profile', () => userAPI.getProfile(), { retry: false });
    const profile = profileData?.data?.data?.user || user;

    const handleLogout = () => {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            logout();
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 leading-tight">
            <Head>
                <title>Cài đặt - Vanilla Beauty</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
            </Head>

            <div className="w-full relative pb-28 flex flex-col transition-all duration-300">

                {/* --- HEADER --- */}
                <div className="relative bg-[#00AEEF] pt-8 pb-20 rounded-b-[3rem] shadow-lg overflow-hidden shrink-0">
                    {/* Họa tiết trang trí */}
                    <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="max-w-md mx-auto px-6 relative z-20">
                        {/* Thanh điều hướng Header */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => router.back()}
                                className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white active:scale-95 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h1 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Thiết lập</h1>
                            <div className="w-9"></div> {/* Khoảng trống để cân bằng tiêu đề */}
                        </div>

                        {/* Profile Avatar Section */}
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">
                                    {profile?.avatar ? (
                                        <Image src={profile.avatar} alt="Avatar" width={96} height={96} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#00AEEF]">
                                            {profile?.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-slate-100 text-[#00AEEF] active:scale-90 transition-all">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-white mt-4">{profile?.name || 'Người dùng'}</h2>
                            <p className="text-white/80 text-xs font-medium bg-black/10 px-4 py-1 rounded-full mt-2 backdrop-blur-sm">
                                {profile?.membership?.rank?.name || 'Thành viên'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT --- */}
                <main className="px-5 -mt-10 space-y-6 relative z-30 max-w-md mx-auto w-full flex-1">

                    {/* 1. Form Thông tin cá nhân */}
                    <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                                <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-3.5 border border-slate-100 focus-within:border-[#00AEEF] transition-all">
                                    <User size={18} className="text-slate-400" />
                                    <input
                                        type="text"
                                        defaultValue={profile?.name || ''}
                                        className="bg-transparent border-none outline-none flex-1 ml-3 text-sm text-slate-700 font-semibold"
                                        placeholder="Nhập họ tên"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email liên hệ</label>
                                <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-3.5 border border-slate-100 focus-within:border-[#00AEEF] transition-all">
                                    <Mail size={18} className="text-slate-400" />
                                    <input
                                        type="email"
                                        defaultValue={profile?.email || ''}
                                        className="bg-transparent border-none outline-none flex-1 ml-3 text-sm text-slate-700 font-semibold"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                                <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-3.5 border border-slate-100 focus-within:border-[#00AEEF] transition-all">
                                    <Phone size={18} className="text-slate-400" />
                                    <input
                                        type="tel"
                                        defaultValue={profile?.phone || ''}
                                        className="bg-transparent border-none outline-none flex-1 ml-3 text-sm text-slate-700 font-semibold"
                                        placeholder="0xxx xxx xxx"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Cài đặt hệ thống */}
                    <section className="space-y-3">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Bảo mật & Ứng dụng</h3>
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">

                            <Link href="/app/change-password" object-cover className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all group">
                                <div className="flex items-center">
                                    <div className="bg-blue-50 p-2.5 rounded-xl text-[#00AEEF]">
                                        <RefreshCw size={18} />
                                    </div>
                                    <span className="ml-4 text-sm font-bold text-slate-700">Đổi mật khẩu</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center">
                                    <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500">
                                        <Bell size={18} />
                                    </div>
                                    <span className="ml-4 text-sm font-bold text-slate-700">Thông báo ưu đãi</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={notifications} onChange={() => setNotifications(!notifications)} />
                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00AEEF]"></div>
                                </label>
                            </div>

                            <Link href="/app/privacy" className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all group">
                                <div className="flex items-center">
                                    <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-500">
                                        <Shield size={18} />
                                    </div>
                                    <span className="ml-4 text-sm font-bold text-slate-700">Quyền riêng tư</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </section>

                    {/* 3. Nút hành động */}
                    <div className="pt-4 space-y-6 pb-10 flex flex-col items-center w-full">
                        <button className="w-full max-w-xs bg-[#00AEEF] text-white font-bold py-4 rounded-full shadow-lg shadow-blue-200 active:scale-[0.98] transition-all uppercase tracking-widest text-xs">
                            Lưu thay đổi
                        </button>

                        <button onClick={handleLogout} className="inline-flex items-center text-rose-500 text-xs font-bold hover:underline transition-all group">
                            <LogOut size={16} className="mr-2" />
                            Đăng xuất tài khoản
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingPage;