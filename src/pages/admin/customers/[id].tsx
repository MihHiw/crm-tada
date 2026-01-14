"use client";
import { useCustomerByID } from '@/hooks/customer/useCustomerByID';
import {
    Calendar, Edit3,
    FileCheck,
    History,
    Landmark,
    Loader2, Mail,
    MapPin // Thêm icon MapPin
    ,
    MoreHorizontal,
    Phone,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

import CustomerProfile from '@/components/admin/Customer/CustomerProfile';
import ProductList from '@/components/admin/Customer/ProductList';

export default function CustomerDetailPage() {
    const params = useParams();
    const id = typeof params?.id === 'string' ? params.id : '';
    const { customer, loading } = useCustomerByID(id);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0B0F1A]">
            <Loader2 className="text-emerald-500 animate-spin mb-4" size={40} />
            <p className="text-gray-400 text-sm animate-pulse">Đang tải hồ sơ tín dụng...</p>
        </div>
    );

    if (!customer) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0B0F1A] text-white">
            <p className="mb-4 text-gray-400">Hồ sơ khách hàng không tồn tại hoặc đã bị lưu trữ.</p>
            <Link href="/admin/customers/customer" className="bg-gray-800 px-6 py-2 rounded-xl text-sm hover:bg-gray-700 transition-all">
                Quay lại danh sách
            </Link>
        </div>
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto text-white">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <nav className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                        <Link href="/admin" className="hover:text-emerald-400 transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <Link href="/admin/customers/customer" className="hover:text-emerald-400 transition-colors">Tín dụng</Link>
                        <span>/</span>
                        <span className="text-emerald-500 font-bold">{customer.name}</span>
                    </nav>

                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
                        <div className="flex gap-2">
                            {customer.isVip && (
                                <span className="bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-0.5 rounded-lg border border-yellow-500/20 font-bold">VIP</span>
                            )}
                            <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${customer.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                {customer.status === 'Active' ? 'ĐÃ GIẢI NGÂN' : 'CHỜ DUYỆT'}
                            </span>
                        </div>
                    </div>

                    <div className="text-gray-500 text-sm mt-2 flex flex-wrap items-center gap-3">
                        <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300 font-mono text-xs">
                            {customer.loanCode}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <History size={14} /> Vay {customer.products?.length || 0} lần
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} /> Tạo: {customer.createdAt}
                        </span>
                        {/* HIỂN THỊ ĐỊA CHỈ: Chỉ render chuỗi, không render object */}
                        <span>•</span>
                        <span className="flex items-center gap-1 text-blue-400 font-medium">
                            <MapPin size={14} /> {customer.address.province} ({customer.address.region})
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="bg-[#1F2937] px-5 py-2.5 rounded-2xl text-sm border border-gray-700 hover:bg-gray-700 transition-all font-bold">
                        <Edit3 size={16} className="inline mr-2" />Chỉnh sửa
                    </button>
                    <button className="bg-emerald-600 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95">
                        <FileCheck size={16} className="inline mr-2" />Duyệt Giải Ngân
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* QUAN TRỌNG: CustomerProfile phải nhận đúng prop */}
                    <CustomerProfile customer={customer} />

                    <div className="bg-[#161D2F] p-6 rounded-[32px] border border-gray-800 shadow-sm space-y-5">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <ShieldCheck className="text-blue-400" size={18} /> Điểm CIC
                            </h3>
                            <span className="text-blue-400 font-bold text-lg">{customer.metrics.creditScore}</span>
                        </div>

                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-500 h-full transition-all duration-1000"
                                style={{ width: `${(parseInt(customer.metrics.creditScore.split('/')[0]) / 850) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-[#161D2F] p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                            <span className="text-xs text-gray-500 self-center font-medium mr-1">Xử lý hồ sơ:</span>
                            <ActionButton icon={<Phone size={14} />} label="Gọi nhắc nợ" />
                            <ActionButton icon={<Mail size={14} />} label="Gửi sao kê" />
                            <ActionButton icon={<Landmark size={14} />} label="Tất toán sớm" />
                        </div>
                        <MoreHorizontal size={20} className="text-gray-500 cursor-pointer hover:text-white" />
                    </div>

                    <div className="flex gap-8 border-b border-gray-800">
                        <button className="pb-4 text-sm font-bold text-emerald-500 border-b-2 border-emerald-500">Khoản vay hiện tại</button>
                        <button className="pb-4 text-sm font-bold text-gray-500 hover:text-white transition-colors">Lịch sử trả nợ</button>
                        <button className="pb-4 text-sm font-bold text-gray-500 hover:text-white transition-colors">Hồ sơ pháp lý</button>
                    </div>

                    <div className="bg-[#161D2F] rounded-[32px] p-6 border border-gray-800 space-y-4 shadow-sm">
                        <h3 className="font-bold text-sm">Ghi chú thẩm định nội bộ</h3>
                        <div className="relative">
                            <textarea
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl p-4 text-sm h-28 focus:outline-none focus:border-emerald-500 transition-all resize-none placeholder:text-gray-700 text-white"
                                placeholder="Nhập nhận xét về khả năng tài chính hoặc lịch sử trả nợ của khách hàng..."
                            ></textarea>
                            <button className="absolute bottom-4 right-4 bg-emerald-600 px-5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-600/10">
                                Lưu ghi chú
                            </button>
                        </div>
                    </div>

                    <ProductList products={customer.products || []} />
                </div>
            </div>
        </div>
    );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button className="flex items-center gap-2 bg-[#0B0F1A] px-4 py-2 rounded-xl text-[11px] font-bold border border-gray-800 hover:bg-gray-800 hover:border-emerald-500/50 transition-all active:scale-95 text-white">
            <span className="text-emerald-500">{icon}</span> {label}
        </button>
    );
}