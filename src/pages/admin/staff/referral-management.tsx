"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import { useReferral } from '@/hooks/referral/useReferralAdmin';
import {
    BadgePercent,
    CheckCircle,
    Edit2,
    Hand,
    Info,
    Search,
    Users,
    X
} from 'lucide-react';

const ReferralManagement = () => {
    const {
        roleGroups,           // Danh sách 3 nhóm: Sale, KTV, CTV
        selectedRoleGroup,    // Nhóm đang chọn
        setSelectedRoleGroup,
        serviceSearch,
        setServiceSearch,
        filteredServices,     // Dữ liệu đã grouped: { category_name, items: [] }
        roleLabel,            // Label hoa hồng (VD: HOA HỒNG TƯ VẤN)
        handleUpdateSystem,   // Nút lưu tổng
        isEditModalOpen,
        setIsEditModalOpen,
        editingItem,
        setEditingItem,
        openEditModal,
        handleSaveCommission
    } = useReferral();

    const isSale = selectedRoleGroup.id === 'sale';
    const isCTV = selectedRoleGroup.id === 'ctv';

    return (
        <div className="flex h-screen w-full bg-[#fcfcfc] overflow-hidden font-sans relative text-sm">
            {/* 1. SIDEBAR */}
            <Sidebar />

            {/* 2. VÙNG NỘI DUNG CHÍNH */}
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden lg:ml-64">
                <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-gray-800 uppercase">Cấu hình chiết khấu hệ thống</h1>
                        <p className="text-xs text-gray-400 mt-0.5 italic">Thiết lập tỷ lệ hoa hồng cho nhân sự và đối tác</p>
                    </div>
                    <button
                        onClick={handleUpdateSystem}
                        className="bg-gray-900 text-white px-5 py-2 rounded-lg font-bold text-xs hover:bg-black transition-all uppercase tracking-widest shadow-md active:scale-95"
                    >
                        Lưu cấu hình
                    </button>
                </header>

                <main className="flex flex-1 overflow-hidden p-6 gap-6 bg-[#f9fafb]">
                    {/* CỘT TRÁI: NHÓM CHỨC VỤ */}
                    <div className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-sm flex flex-col border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-50 bg-white">
                            <h3 className="font-bold text-gray-400 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                <Users size={16} /> Nhóm đối tượng áp dụng
                            </h3>
                        </div>

                        <div className="overflow-y-auto flex-1 py-3 px-3 custom-scrollbar">
                            {roleGroups.map((group) => (
                                <div
                                    key={group.id}
                                    onClick={() => setSelectedRoleGroup(group)}
                                    className={`flex items-center gap-4 p-4 mb-2 rounded-2xl cursor-pointer transition-all duration-300 border ${
                                        selectedRoleGroup.id === group.id
                                            ? 'bg-slate-50 border-slate-200 shadow-sm transform scale-[1.02]'
                                            : 'bg-white border-transparent hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold shadow-inner border ${
                                        selectedRoleGroup.id === group.id
                                            ? 'bg-white text-gray-800 border-slate-200'
                                            : 'bg-gray-100 text-gray-400 border-gray-50'
                                    }`}>
                                        {group.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold truncate text-[14px] ${selectedRoleGroup.id === group.id ? 'text-slate-800' : 'text-gray-600'}`}>
                                            {group.name}
                                        </div>
                                        <div className="text-[10px] uppercase font-bold tracking-tight text-gray-400">{group.id}</div>
                                    </div>
                                    {selectedRoleGroup.id === group.id && (
                                        <div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)] animate-pulse"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CỘT PHẢI: BẢNG DỊCH VỤ */}
                    <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                        <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-white flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl border ${isSale ? 'bg-amber-50 border-amber-100 text-amber-600' : isCTV ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                    {isSale ? <BadgePercent size={22} /> : isCTV ? <CheckCircle size={22} /> : <Hand size={22} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight">Cấu hình: {selectedRoleGroup.name}</h3>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isSale ? 'text-amber-500' : isCTV ? 'text-emerald-500' : 'text-blue-500'}`}>
                                        {roleLabel}
                                    </p>
                                </div>
                            </div>
                            
                            {!isCTV && (
                                <div className="relative max-w-xs flex-1 ml-10">
                                    <input
                                        type="text"
                                        value={serviceSearch}
                                        onChange={(e) => setServiceSearch(e.target.value)}
                                        placeholder="Tìm mã hoặc tên liệu trình..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm pr-10 outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all"
                                    />
                                    <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
                                </div>
                            )}
                        </div>

                        {isCTV ? (
                            /* GIAO DIỆN CTV - HOA HỒNG CỐ ĐỊNH */
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-emerald-50/10">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100 shadow-sm">
                                    <Info size={40} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Chính sách hoa hồng giới thiệu</h4>
                                <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
                                    Cộng tác viên nhận mức thưởng cố định trên mỗi khách hàng mới đặt lịch thành công lần đầu.
                                </p>
                                <div className="bg-white border border-emerald-100 rounded-3xl px-12 py-8 shadow-xl relative group">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] block mb-2">Định mức chi trả</span>
                                    <div className="text-4xl font-black text-emerald-700">100,000 đ <span className="text-lg opacity-50">/ khách</span></div>
                                    <button 
                                        onClick={() => openEditModal('FIXED_CTV', 'Hoa hồng giới thiệu', 100000)}
                                        className="absolute -top-2 -right-2 p-2 bg-white border border-gray-100 rounded-full shadow-md text-gray-400 hover:text-emerald-500 transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* GIAO DIỆN BẢNG CHO SALE & KTV */
                            <>
                                <div className="grid grid-cols-12 bg-gray-50/50 border-b border-gray-100 px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex-shrink-0">
                                    <div className="col-span-6">Thông tin liệu trình</div>
                                    <div className="col-span-3 text-center">Giá niêm yết</div>
                                    <div className="col-span-3 text-center">Mức hưởng (%)</div>
                                </div>

                                <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
                                    {filteredServices.map((category) => (
                                        <div key={category.category_id}>
                                            {/* Category Header */}
                                            <div className="bg-gray-50/30 px-6 py-2 border-y border-gray-50 sticky top-0 z-10 backdrop-blur-sm font-black text-[10px] text-slate-400 uppercase tracking-widest">
                                                {category.category_name}
                                            </div>

                                            {/* Service Items */}
                                            {category.items.map((item) => (
                                                <div key={item.id} className="grid grid-cols-12 items-center px-6 py-4 border-b border-gray-50 hover:bg-slate-50/50 group transition-all">
                                                    <div className="col-span-6 flex gap-4 items-center">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-white transition-colors">
                                                            {item.id.split('-').pop()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-gray-700 text-sm truncate">{item.name}</div>
                                                            <div className="text-[10px] text-gray-400 font-mono tracking-tighter italic">#{item.id}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3 text-center text-gray-500 font-medium">
                                                        {new Intl.NumberFormat('vi-VN').format(item.base_price)}đ
                                                    </div>
                                                    <div className="col-span-3 flex justify-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`px-5 py-1.5 rounded-xl border-2 font-black text-sm min-w-[80px] text-center shadow-sm transition-all duration-300 ${
                                                                isSale 
                                                                ? 'border-amber-100 bg-amber-50/30 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' 
                                                                : 'border-blue-100 bg-blue-50/30 text-blue-600 group-hover:bg-blue-500 group-hover:text-white'
                                                            }`}>
                                                                {item.current_commission}%
                                                            </div>
                                                            <button
                                                                onClick={() => openEditModal(item.id, item.name, item.current_commission)}
                                                                className="p-1.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-all hover:text-rose-500"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>

            {/* MODAL CẬP NHẬT */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest text-center flex-1 ml-6">Điều chỉnh chiết khấu</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Đang sửa cho: {selectedRoleGroup.name}</label>
                                <p className="text-sm font-bold text-gray-700 leading-tight uppercase">{editingItem?.name}</p>
                            </div>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={editingItem?.value || ''}
                                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, value: e.target.value } : null)}
                                    className="w-full bg-white border-2 border-gray-900 rounded-3xl px-6 py-6 text-5xl font-black text-gray-900 text-center outline-none focus:ring-8 focus:ring-rose-50 transition-all"
                                    placeholder="0"
                                    autoFocus
                                />
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-200 pointer-events-none group-focus-within:text-rose-200">
                                    {isCTV && editingItem?.id === 'FIXED_CTV' ? 'đ' : '%'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-4 border-t border-gray-100">
                            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black text-gray-400 bg-white border border-gray-200 hover:bg-gray-100 transition-all uppercase text-[10px] tracking-widest">Hủy</button>
                            <button onClick={() => handleSaveCommission(editingItem?.value || '0')} className="flex-1 py-4 rounded-2xl font-black text-white bg-gray-900 hover:bg-black transition-all shadow-xl active:scale-95 uppercase text-[10px] tracking-widest">Cập nhật</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferralManagement;