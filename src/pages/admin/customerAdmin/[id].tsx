"use client";

import { ClipboardList, Edit3, MessageSquare, Phone, Plus } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import CustomerNotes from '@/components/admin/customer/CustomerNotes';
import ServiceHistory from '@/components/admin/customer/ServiceHistory';
import { useCustomerDetail } from '@/hooks/customerDetail/useCustomerDetail';

export default function CustomerDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { customer, loading } = useCustomerDetail(id);

    const rankName = customer?.membership?.rank_name || 'Thành viên';
    const rankColor = customer?.membership?.rank_color || '#c0c0c0';
    const points = customer?.membership?.current_points || 0;

    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserRole(parsedUser.role);
            } catch (error) {
                console.error("Lỗi đọc role:", error);
            }
        }
    }, []);

    const isKTV = userRole === 'ktv';

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-pulse text-[#27AE60] font-bold uppercase tracking-widest">Đang tải hồ sơ khách hàng...</div>
        </div>
    );

    if (!customer) return (
        <div className="flex h-screen items-center justify-center flex-col gap-4 bg-gray-50">
            <p className="text-gray-500 font-medium">Không tìm thấy thông tin khách hàng trong hệ thống</p>
            <button onClick={() => router.back()} className="bg-white px-6 py-2 rounded-xl shadow-sm border border-gray-200 text-[#27AE60] font-bold hover:bg-gray-50 transition-all">Quay lại</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-10 text-[#2D3748]">
            <main className="max-w-[1240px] mx-auto pt-6 px-4">
                {/* BREADCRUMB */}
                <div className="flex items-center gap-2 text-[14px] text-gray-500 mb-6 font-medium">
                    <span className="cursor-pointer hover:text-[#27AE60]" onClick={() => router.push('/admin/staff/customers/')}>Khách hàng</span>
                    <span>&rsaquo;</span>
                    <span className="text-gray-800 font-bold">Hồ sơ: {customer.full_name}</span>
                </div>

                {/* 2. HEADER PROFILE CARD */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                                src={customer.avatar_url || "https://i.pravatar.cc/150?u=default"}
                                alt={customer.full_name}
                                fill
                                className="rounded-full object-cover border-4 border-[#F7FAFC] shadow-sm"
                                sizes="96px"
                            />
                            {!isKTV && (
                                <span
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase shadow-sm whitespace-nowrap z-10"
                                    style={{ backgroundColor: rankColor }}
                                >
                                    {rankName}
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#1A202C]">{customer.full_name}</h2>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                {!isKTV && (
                                    <div className="flex items-center gap-2 bg-[#F0FFF4] px-3 py-1 rounded-md border border-[#C6F6D5]">
                                        <div className="w-2 h-2 rounded-full bg-[#38A169]"></div>
                                        <span className="text-[#2F855A] text-xs font-bold">
                                            Điểm tích lũy: {points.toLocaleString()} XP
                                        </span>
                                    </div>
                                )}
                                <span className="text-gray-400 text-xs font-medium px-2 py-1 bg-gray-50 rounded">ID: {customer.id}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${customer.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                    {customer.is_active ? 'Hoạt động' : 'Tạm khóa'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <div className="flex gap-3">
                            {!isKTV && (
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-[#EDF2F7] rounded-lg text-sm font-bold text-[#2D3748] hover:bg-gray-200 transition-colors">
                                    <Edit3 size={16} /> Sửa
                                </button>
                            )}
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-[#EDF2F7] rounded-lg text-sm font-bold text-[#2D3748] hover:bg-gray-200 transition-colors">
                                <MessageSquare size={16} /> Tin nhắn
                            </button>
                        </div>
                        {!isKTV && (
                            <button className="w-full bg-[#00E676] text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#00c864] transition-all shadow-md shadow-green-100">
                                <Plus size={18} /> Đặt lịch hẹn
                            </button>
                        )}
                    </div>
                </div>

                {/* 3. CONTENT GRID */}
                <div className="grid grid-cols-12 gap-6">
                    {/* LEFT COLUMN */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-[#1A202C] mb-6 flex items-center gap-2">
                                <ClipboardList size={20} className="text-[#27AE60]" />
                                Thông tin liên hệ
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#F0FFF4] flex items-center justify-center text-[#38A169] shadow-sm"><Phone size={18} /></div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Số điện thoại</p>
                                        <p className="text-sm font-bold tracking-wider">{customer.phone || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-tight">Đặc điểm làn da</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-[#FFF9E6] text-[#D69E2E] px-3 py-1 rounded-full text-[11px] font-bold border border-[#FAF089]">Hỗn hợp thiên dầu</span>
                                        <span className="bg-[#FFF5F5] text-[#E53E3E] px-3 py-1 rounded-full text-[11px] font-bold border border-[#FED7D7]">Dễ kích ứng</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50">
                                    <p className="text-xs text-[#27AE60] font-bold mb-2 uppercase text-[10px] tracking-widest">Chỉ dẫn chuyên môn cho KTV</p>
                                    <div className="bg-[#F0FFF4] p-4 rounded-xl border border-dashed border-[#68D391]">
                                        <p className="text-xs font-medium leading-relaxed italic text-gray-600">
                                            Khách không thích nói chuyện nhiều lúc làm dịch vụ. Dị ứng với hương liệu mạnh. Ưu tiên nằm phòng yên tĩnh.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        {/* THỐNG KÊ CHI TIÊU */}
                        {!isKTV && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Tổng chi tiêu', value: `${customer.stats.totalSpent.toLocaleString()} đ` },
                                    { label: 'Số lần đến', value: customer.stats.visitCount },
                                    { label: 'Lần cuối', value: customer.stats.lastVisit ? new Date(customer.stats.lastVisit).toLocaleDateString('vi-VN') : 'Chưa có' },
                                    { label: 'Số dư ví', value: `${customer.stats.walletBalance.toLocaleString()} đ`, color: 'text-red-500' },
                                ].map((stat, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">{stat.label}</p>
                                        <p className={`text-[17px] font-black ${stat.color || 'text-[#1A202C]'}`}>{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* LỊCH SỬ DỊCH VỤ */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5 flex justify-between items-center border-b border-gray-50 bg-gray-50/30">
                                <h3 className="font-bold text-[#1A202C] flex items-center gap-2">
                                    <ClipboardList size={18} className="text-gray-400" />
                                    Lịch sử dịch vụ gần đây
                                </h3>
                                <button className="text-[#38A169] text-xs font-bold hover:underline">Xem báo cáo chi tiết</button>
                            </div>
                            <div className="p-2">
                                <ServiceHistory history={customer.history} hidePrice={isKTV} />
                            </div>
                        </div>

                        {/* GHI CHÚ NỘI BỘ */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Nhật ký chăm sóc khách hàng</h3>
                            <CustomerNotes notes={customer.notes} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}