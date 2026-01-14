"use client";
import { DollarSign, Phone, Plus, User, X, Mail } from 'lucide-react';
import React, { useState } from 'react';

interface CreateLoanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export default function CreateLoanModal({ isOpen, onClose, onSubmit }: CreateLoanModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        initialLoan: 0,
        category: 'Vay tiêu dùng',
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Tạo số hồ sơ ngẫu nhiên dạng HS-XXXXX khớp với mẫu
        const randomCode = 'HS-' + Math.floor(10000 + Math.random() * 90000);
        
        // Cấu trúc dữ liệu chuẩn khớp hoàn toàn với mẫu khách hàng Lê Văn C
        const newCustomer = {
            id: Math.random().toString(36).substr(2, 5),
            loanCode: randomCode,
            name: formData.name,
            role: 'Khách hàng (User)',
            status: 'Pending', // Mặc định chờ duyệt
            joinedDate: new Date().getMonth() + 1 + '/' + new Date().getFullYear(),
            createdAt: new Date().toLocaleDateString('vi-VN'),
            isVip: false,
            avatar: '', // Có thể bổ sung logic chọn ảnh sau
            phone: formData.phone,
            email: formData.email,
            metrics: { 
                creditScore: '---/850', // Hồ sơ mới chưa có điểm CIC
            }, 
            products: [
                {
                    id: 'p-' + Date.now(),
                    name: formData.category,
                    category: 'Giải ngân 100%',
                    icon: formData.category === 'Vay mua xe' ? '🚗' : '💼',
                    loanAmount: Number(formData.initialLoan),
                    remainingAmount: Number(formData.initialLoan), // Mới vay nên nợ = gốc
                    loanDate: new Date().toLocaleDateString('vi-VN'),
                    isPaid: false, //
                    statusLabel: 'Đang thẩm định',
                    profit: 'Đang tính toán' //
                }
            ]
        };

        onSubmit(newCustomer);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#161D2F] border border-gray-800 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1F2937]/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Plus className="text-emerald-500" size={24} /> Tạo hồ sơ vay mới
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {/* Họ tên */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Họ và tên khách hàng</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                required
                                type="text"
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                                placeholder="Nguyễn Văn A..."
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Số điện thoại */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Số điện thoại</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    required
                                    type="tel"
                                    className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                                    placeholder="090..."
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        {/* Loại hình vay */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Loại hình vay</label>
                            <select
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl py-3 px-4 text-sm text-white focus:border-emerald-500 outline-none transition-all appearance-none"
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Vay tiêu dùng">Vay tiêu dùng</option>
                                <option value="Vay kinh doanh">Vay kinh doanh</option>
                                <option value="Vay mua xe">Vay mua xe</option>
                                <option value="Vay sản xuất">Vay sản xuất</option>
                            </select>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                required
                                type="email"
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                                placeholder="example@gmail.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Số tiền */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Số tiền đề nghị vay (VNĐ)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                            <input
                                required
                                type="number"
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-all"
                                placeholder="Ví dụ: 500000000"
                                onChange={(e) => setFormData({ ...formData, initialLoan: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl mt-4 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                        Khởi tạo hồ sơ ngay
                    </button>
                </form>
            </div>
        </div>
    );
}