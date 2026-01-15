"use client";

import TierBadge from '@/components/admin/TierBadge';
import { DetailedCustomer } from '@/hooks/customerDetail/useCustomerDetail';
import { format, parseISO } from 'date-fns';
import { Calendar, CalendarCheck, Edit, LucideIcon, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

interface InfoRowProps {
    icon: LucideIcon;
    text: string;
}

const InfoRow = ({ icon: Icon, text }: InfoRowProps) => (
    <div className="flex items-center gap-3 py-2.5 text-gray-600 hover:text-gray-900 transition-colors group">
        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
            <Icon size={14} />
        </div>
        <span className="text-sm font-semibold tracking-tight">{text}</span>
    </div>
);

const ProfileCard = ({ customer }: { customer: DetailedCustomer }) => {
    // Lấy thông tin hạng từ membership mở rộng trong hook
    const tierName = customer.membership?.rank_name || 'Thành viên';

    // Format ngày sinh nếu có
    const formattedDob = customer.created_at
        ? format(parseISO(customer.created_at), 'dd/MM/yyyy')
        : 'Chưa cập nhật';

    return (
        <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-6">
            {/* Banner trang trí */}
            <div className="h-32 bg-gradient-to-br from-rose-100 via-orange-50 to-rose-50 relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            <div className="px-6 pb-8 relative">
                {/* Avatar & Badge */}
                <div className="relative -mt-12 mb-5 inline-block">
                    <div className="relative w-24 h-24">
                        <Image
                            src={customer.avatar_url || "https://i.pravatar.cc/150?u=fallback"}
                            alt={customer.full_name}
                            fill
                            sizes="96px"
                            className="rounded-3xl border-4 border-white shadow-xl object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 transform scale-110 shadow-lg rounded-full">
                        <TierBadge tier={tierName} />
                    </div>
                </div>

                {/* Thông tin chính */}
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                        {customer.full_name}
                    </h2>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mt-2 bg-rose-50 w-fit px-2 py-0.5 rounded">
                        Mã khách hàng: {customer.id.substring(0, 8).toUpperCase()}
                    </p>
                </div>

                {/* Nút thao tác nhanh */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <button className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-2xl text-xs font-bold hover:bg-black hover:shadow-lg hover:shadow-gray-200 transition-all active:scale-95">
                        <CalendarCheck size={16} /> Đặt lịch
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-700 py-3 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all active:scale-95">
                        <Edit size={16} /> Chỉnh sửa
                    </button>
                </div>

                {/* Danh sách thông tin chi tiết */}
                <div className="space-y-1 border-t border-gray-50 pt-6">
                    <InfoRow icon={Phone} text={customer.phone || "Chưa cập nhật"} />
                    <InfoRow icon={Mail} text={customer.email || 'Chưa cập nhật Email'} />
                    <InfoRow icon={MapPin} text={customer.address || 'Địa chỉ: Việt Nam'} />
                    <InfoRow icon={Calendar} text={`Ngày tham gia: ${formattedDob}`} />
                </div>

                {/* Trạng thái tài khoản */}
                <div className={`mt-6 p-3 rounded-2xl border flex items-center justify-center gap-2 ${customer.is_active ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${customer.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        Tài khoản: {customer.is_active ? 'Đang hoạt động' : 'Đang tạm khóa'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;