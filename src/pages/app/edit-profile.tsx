import { userAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Camera, ChevronLeft, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';

const EditProfilePage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    // --- 1. LẤY DỮ LIỆU TỪ PROFILE ---
    const { user } = useAuthStore();
    const { data: profileData, isLoading } = useQuery('profile', () => userAPI.getProfile());

    const profile = profileData?.data?.data?.user || user;

    if (isLoading) return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-400 text-sm font-medium">
            Đang tải hồ sơ...
        </div>
    );

    return (
        <div className="min-h-screen px-32 bg-slate-100 md:bg-slate-200 font-sans text-slate-900 leading-tight flex justify-center">
            <Head>
                <title>Chỉnh sửa hồ sơ - Vanilla Beauty</title>
            </Head>

            {/* Container chính: Desktop mở rộng toàn màn hình, Mobile giới hạn khung App */}
            <div className="w-full md:max-w-none bg-[#F8FAFC] min-h-screen relative shadow-2xl md:shadow-none overflow-x-hidden flex flex-col transition-all duration-300 mx-auto max-w-md">

                {/* --- HEADER --- */}
                <div className="relative bg-[#00AEEF] pt-6 pb-24 md:pb-36 rounded-b-[2.5rem] md:rounded-b-[3.5rem] shadow-md overflow-hidden shrink-0 text-center">
                    <div className="max-w-4xl mx-auto px-6 relative z-20">
                        <div className="absolute top-0 left-0 flex justify-between w-full items-center">
                            <button
                                onClick={() => router.back()}
                                className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white active:scale-90 transition-all hover:bg-white/30"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button className="text-white/80 font-bold text-xs md:text-sm uppercase tracking-widest px-2 active:opacity-50">Lưu</button>
                        </div>

                        <h1 className="text-sm md:text-base font-bold text-white uppercase tracking-[0.2em] mt-2">Chỉnh sửa hồ sơ</h1>

                        {/* --- AVATAR SECTION --- */}
                        <div className="flex flex-col items-center mt-6 md:mt-10">
                            <div className="relative group">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[3px] md:border-[4px] border-white shadow-xl overflow-hidden bg-white flex items-center justify-center relative">
                                    {profile?.avatar ? (
                                        <Image
                                            src={profile.avatar}
                                            alt="Avatar"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl md:text-5xl font-bold text-[#00AEEF]">
                                            {profile?.name?.charAt(0) || 'U'}
                                        </span>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-white p-1.5 md:p-2 rounded-full shadow-lg border border-slate-100 text-[#00AEEF] active:scale-90 transition-all">
                                    <Camera className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                            </div>
                            <p className="text-white/70 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] mt-3">
                                Chạm để đổi ảnh đại diện
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- FORM INPUTS --- */}
                {/* max-w-4xl giúp bố cục trên desktop không bị bự và dàn trải */}
                <main className="px-5 -mt-12 md:-mt-16 space-y-6 relative z-10 max-w-4xl mx-auto w-full flex-1">
                    <div className="bg-white rounded-[1.8rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 p-6 md:p-10 space-y-5 md:space-y-8">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                            {/* Họ và tên */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                                <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100 focus-within:border-[#00AEEF] transition-all shadow-inner">
                                    <User size={16} className="text-slate-400" />
                                    <input
                                        type="text"
                                        key={profile?.name}
                                        defaultValue={profile?.name || ""}
                                        className="bg-transparent border-none outline-none flex-1 ml-3 text-xs md:text-sm text-slate-700 font-medium placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email liên hệ</label>
                                <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100 focus-within:border-[#00AEEF] transition-all shadow-inner">
                                    <Mail size={16} className="text-slate-400" />
                                    <input
                                        type="email"
                                        key={profile?.email}
                                        defaultValue={profile?.email || ""}
                                        className="bg-transparent border-none outline-none flex-1 ml-3 text-xs md:text-sm text-slate-700 font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                            {/* Số điện thoại */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                                <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100 focus-within:border-[#00AEEF] transition-all shadow-inner">
                                    <Phone size={16} className="text-slate-400" />
                                    <input
                                        type="tel"
                                        key={profile?.phone}
                                        defaultValue={profile?.phone || ""}
                                        className="bg-transparent border-none outline-none flex-1 ml-3 text-xs md:text-sm text-slate-700 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Mật khẩu */}
                            <div className="space-y-1.5 relative">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bảo mật</label>
                                <div className="flex items-center bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100 focus-within:border-[#00AEEF] transition-all shadow-inner relative">
                                    <Lock size={16} className="text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        defaultValue="********"
                                        readOnly
                                        className="bg-transparent border-none outline-none flex-1 ml-3 text-xs md:text-sm text-slate-400 tracking-widest cursor-not-allowed"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-slate-300 hover:text-[#00AEEF] pl-2"
                                    >
                                        <EyeOff size={16} />
                                    </button>
                                </div>
                                <div className="flex justify-end pt-1">
                                    <Link href="/app/change-password" title="Đổi mật khẩu" className="text-[#00AEEF] text-[9px] md:text-[10px] font-bold uppercase hover:underline">
                                        Đổi mật khẩu?
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- FOOTER ACTIONS --- */}
                    <div className="pt-4 space-y-4 pb-16 max-w-xs mx-auto w-full text-center">
                        <button className="w-full bg-[#00AEEF] text-white font-bold py-3.5 rounded-full shadow-lg shadow-blue-100 active:scale-[0.98] transition-all text-[11px] md:text-xs uppercase tracking-widest">
                            Cập nhật thông tin
                        </button>

                        <button className="inline-block text-rose-500 text-[10px] md:text-[11px] font-bold uppercase tracking-widest hover:underline transition underline-offset-4 active:opacity-50">
                            Xóa tài khoản vĩnh viễn
                        </button>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default EditProfilePage;