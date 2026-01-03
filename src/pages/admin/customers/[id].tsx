"use client";
import { useCustomerByID } from '@/hooks/customer/useCustomerByID';
import { Calendar, Edit3, Loader2, Mail, MoreHorizontal, Phone, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

// Import các components con
import CustomerProfile from '@/components/admin/Customer/CustomerProfile';
import ProductList from '@/components/admin/Customer/ProductList';

export default function CustomerDetailPage() {
    const params = useParams();
    // Đảm bảo id luôn là string, nếu không có id thì không fetch
    const id = typeof params?.id === 'string' ? params.id : '';
    const { customer, loading } = useCustomerByID(id);

    // 1. Xử lý trạng thái đang tải
    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#0B0F1A]">
            <Loader2 className="text-blue-500 animate-spin" size={40} />
        </div>
    );

    // 2. Xử lý trạng thái không có dữ liệu (Quan trọng để tránh lỗi khi build)
    if (!customer) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0B0F1A] text-white">
            <p className="mb-4 text-gray-400">Đang tải dữ liệu hoặc khách hàng không tồn tại...</p>
            <Link href="/admin/customers/customer" className="text-blue-500 hover:underline">
                Quay lại danh sách
            </Link>
        </div>
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto text-white">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <nav className="text-sm text-gray-500 mb-2">
                        <Link href="/admin" className="hover:text-white transition-colors">Trang chủ</Link>
                        <span className="mx-2">/</span>
                        <Link href="/admin/customers/customer" className="hover:text-white transition-colors">Khách hàng</Link>
                        <span className="mx-2">/</span>
                        <span className="text-blue-500">{customer?.name || 'Loading...'}</span>
                    </nav>

                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold">{customer?.name}</h1>
                        {customer?.isVip && (
                            <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-2 py-0.5 rounded font-bold">VIP</span>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                        Mã KH: {"#"}{customer?.id} • Khách hàng từ: {customer?.joinedDate}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button className="bg-[#1F2937] px-4 py-2 rounded-xl text-sm border border-gray-700 hover:bg-gray-700 transition-all">
                        <Edit3 size={16} className="inline mr-2" />Chỉnh sửa
                    </button>
                    <button className="bg-blue-600 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 transition-all">
                        <Plus size={16} className="inline mr-2" />Tạo Deal Mới
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Cột trái */}
                <div className="col-span-12 lg:col-span-4">
                    {/* Truyền dữ liệu an toàn với optional chaining hoặc kiểm tra tồn tại */}
                    <CustomerProfile customer={customer} />
                </div>

                {/* Cột phải */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-[#161D2F] p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
                        <div className="flex gap-4">
                            <span className="text-sm text-gray-500 self-center">Tác vụ nhanh:</span>
                            <ActionButton icon={<Phone size={14} />} label="Ghi cuộc gọi" />
                            <ActionButton icon={<Mail size={14} />} label="Gửi Email" />
                            <ActionButton icon={<Calendar size={14} />} label="Đặt lịch hẹn" />
                        </div>
                        <MoreHorizontal size={20} className="text-gray-500 cursor-pointer" />
                    </div>

                    <div className="flex gap-8 border-b border-gray-800">
                        <button className="pb-4 text-sm font-bold text-blue-500 border-b-2 border-blue-500">Tổng quan</button>
                        <button className="pb-4 text-sm font-bold text-gray-500 hover:text-white transition-colors">Lịch sử tương tác</button>
                        <button className="pb-4 text-sm font-bold text-gray-500 hover:text-white transition-colors">Tài sản & Đầu tư</button>
                    </div>

                    <div className="bg-[#161D2F] rounded-[32px] p-6 border border-gray-800 space-y-4 shadow-sm">
                        <h3 className="font-bold">Ghi chú mới</h3>
                        <div className="relative">
                            <textarea
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl p-4 text-sm h-24 focus:outline-none focus:border-blue-500 transition-all resize-none"
                                placeholder="Nhập ghi chú nhanh..."
                            ></textarea>
                            <button className="absolute bottom-4 right-4 bg-blue-600 px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all active:scale-95">
                                Lưu ghi chú
                            </button>
                        </div>
                    </div>

                    {/* Kiểm tra mảng products trước khi truyền vào component con */}
                    <ProductList products={customer?.products || []} />
                </div>
            </div>
        </div>
    );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button className="flex items-center gap-2 bg-[#0B0F1A] px-4 py-2 rounded-xl text-xs font-bold border border-gray-800 hover:bg-gray-800 transition-all active:scale-95">
            <span className="text-blue-500">{icon}</span> {label}
        </button>
    );
}