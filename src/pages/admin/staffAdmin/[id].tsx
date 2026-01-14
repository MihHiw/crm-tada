"use client";

import { useStaff } from '@/hooks/staff/useStaff';
import {
    ArrowLeft,
    Calendar,
    Mail,
    MapPin,
    Phone,
    Star,
    TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const StaffDetail = () => {
    const router = useRouter();
    const params = useParams();
    // Sử dụng Optional Chaining để tránh lỗi khi params chưa có
    const id = params?.id as string;

    const { staffs } = useStaff();

    // Thêm một state để kiểm tra xem component đã mount (hiển thị) ở client chưa
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 1. Tìm nhân viên (Sử dụng Optional Chaining cho staffs)
    // Nếu staffs là null/undefined, nó sẽ trả về undefined thay vì báo lỗi
    const staffMember = staffs?.find((s) => s?.id === id);

    // 2. Chặn render khi chưa mount hoặc dữ liệu đang tải để tránh lỗi "Prerendering"
    if (!isMounted || !staffs) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F7F4]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    // 3. Xử lý trường hợp không tìm thấy nhân viên
    if (!staffMember) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-500 mb-4">Không tìm thấy thông tin nhân viên này.</p>
                <button
                    onClick={() => router.back()}
                    className="text-emerald-600 font-bold hover:underline"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F7F4] p-6 text-slate-800">
            {/* Header & Back Button */}
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-slate-500 hover:text-emerald-600 transition-all font-medium"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Quay lại danh sách
                </button>
                <div className="flex gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${staffMember.status === 'Đang làm việc'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                        ● {staffMember.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cột trái: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                        <div className="relative w-40 h-40 mx-auto mb-6">
                            <Image
                                src={staffMember.avatar || '/default-avatar.png'} // Thêm ảnh fallback
                                alt={staffMember.name || 'Staff'}
                                fill
                                className="rounded-full object-cover border-8 border-emerald-50 shadow-sm"
                                unoptimized
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900">{staffMember.name}</h2>
                        <p className="text-emerald-600 font-semibold mb-2">{staffMember.role}</p>
                        <div className="flex justify-center items-center gap-1 text-amber-500 font-bold mb-6">
                            <Star size={18} fill="currentColor" />
                            <span>{staffMember.rating} / 5.0</span>
                        </div>

                        <div className="space-y-4 text-left border-t border-slate-50 pt-6">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Thông tin liên hệ</p>
                            <div className="flex items-center text-slate-600 group cursor-pointer">
                                <div className="bg-slate-50 p-2 rounded-lg mr-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                    <Phone size={18} />
                                </div>
                                <span className="text-sm font-medium">{staffMember.phone}</span>
                            </div>
                            <div className="flex items-center text-slate-600 group cursor-pointer">
                                <div className="bg-slate-50 p-2 rounded-lg mr-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <span className="text-sm font-medium">{staffMember.email}</span>
                            </div>
                            <div className="flex items-center text-slate-600 group cursor-pointer">
                                <div className="bg-slate-50 p-2 rounded-lg mr-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <span className="text-sm font-medium">{staffMember.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Hiệu suất & Lịch trình */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <TrendingUp className="text-emerald-500" />
                                Hiệu suất công việc
                            </h3>
                            <span className="text-sm text-slate-400 font-medium">Tháng 12/2025</span>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div className="bg-slate-50 p-6 rounded-2xl">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Hoa hồng đạt được</p>
                                <p className="text-3xl font-black text-slate-900">{staffMember.commission}</p>
                            </div>
                            <div className="bg-emerald-500 p-6 rounded-2xl text-white">
                                <p className="text-xs font-bold text-emerald-100 uppercase mb-2">Tiến độ mục tiêu</p>
                                <p className="text-3xl font-black">{staffMember.target?.percent || 0}%</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold">
                                <span>Tiến độ mục tiêu tháng</span>
                                <span>{staffMember.target?.current || 0} / {staffMember.target?.max || 0}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                    style={{ width: `${staffMember.target?.percent || 0}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lịch làm việc */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Calendar className="text-emerald-600" size={22} />
                            Lịch hẹn hôm nay
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="w-16 text-sm font-bold text-emerald-600">09:00</span>
                                <div className="ml-4 border-l-2 border-emerald-200 pl-4">
                                    <p className="font-bold text-slate-800">Massage Thụy Điển</p>
                                    <p className="text-xs text-slate-500">Khách hàng: Chị Lan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDetail;
