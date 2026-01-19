"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
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
        roleGroups,
        selectedRoleGroup,
        setSelectedRoleGroup,
        serviceSearch,
        setServiceSearch,
        filteredServices,
        roleLabel,
        handleUpdateSystem,
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
        // ROOT: Giữ h-screen overflow-hidden để cố định layout
        <div className="flex h-screen w-full overflow-hidden font-sans relative text-sm text-white">
            <GlobalBackground />

            {/* 1. SIDEBAR (Glass) */}
            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            {/* 2. VÙNG NỘI DUNG CHÍNH */}
            <main className="flex-1 h-full overflow-hidden relative z-10">

                {/* FIX: Container căn trái (mr-auto), padding (p-6) và flex-col để chia Header/Body */}
                <div className="w-full max-w-[1600px] mr-auto p-6 h-full flex flex-col gap-6">

                    {/* Header Section */}
                    <div className="flex justify-between items-center flex-shrink-0">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white ">Cấu hình chiết khấu hệ thống</h1>
                            <p className="text-sm text-white/60 mt-0.5 italic font-medium">Thiết lập tỷ lệ hoa hồng cho nhân sự và đối tác.</p>
                        </div>

                        <button
                            onClick={handleUpdateSystem}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all uppercase tracking-widest shadow-lg active:scale-95 border border-white/20 backdrop-blur-md"
                        >
                            Lưu cấu hình
                        </button>
                    </div>

                    {/* Content Body (Split Panes) */}
                    <div className="flex flex-1 overflow-hidden gap-6">

                        {/* CỘT TRÁI: NHÓM CHỨC VỤ (Glass Card) */}
                        <div className="w-80 flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-xl flex flex-col border border-white/10 overflow-hidden">
                            <div className="p-5 border-b border-white/10 bg-white/5">
                                <h3 className="font-bold text-white/60 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                    <Users size={16} /> Nhóm đối tượng áp dụng
                                </h3>
                            </div>

                            <div className="overflow-y-auto flex-1 py-3 px-3 custom-scrollbar">
                                {roleGroups.map((group) => (
                                    <div
                                        key={group.id}
                                        onClick={() => setSelectedRoleGroup(group)}
                                        className={`flex items-center gap-4 p-4 mb-2 rounded-2xl cursor-pointer transition-all duration-300 border ${selectedRoleGroup.id === group.id
                                            ? 'bg-emerald-500/20 border-emerald-500/30 shadow-lg'
                                            : 'bg-transparent border-transparent hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold shadow-inner border ${selectedRoleGroup.id === group.id
                                            ? 'bg-emerald-500 text-white border-emerald-400'
                                            : 'bg-white/10 text-white/40 border-white/5'
                                            }`}>
                                            {group.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-bold truncate text-[14px] ${selectedRoleGroup.id === group.id ? 'text-white' : 'text-white/60'}`}>
                                                {group.name}
                                            </div>
                                            <div className="text-[10px] uppercase font-bold tracking-tight text-white/30">{group.id}</div>
                                        </div>
                                        {selectedRoleGroup.id === group.id && (
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CỘT PHẢI: BẢNG DỊCH VỤ (Glass Card) */}
                        <div className="flex-1 min-w-0 bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden">

                            {/* Toolbar */}
                            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5 flex-shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl border ${isSale ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : isCTV ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-blue-500/20 border-blue-500/30 text-blue-300'}`}>
                                        {isSale ? <BadgePercent size={22} /> : isCTV ? <CheckCircle size={22} /> : <Hand size={22} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg leading-tight">Cấu hình: {selectedRoleGroup.name}</h3>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isSale ? 'text-amber-400' : isCTV ? 'text-emerald-400' : 'text-blue-400'}`}>
                                            {roleLabel}
                                        </p>
                                    </div>
                                </div>

                                {!isCTV && (
                                    <div className="relative max-w-xs flex-1 ml-10 group">
                                        <input
                                            type="text"
                                            value={serviceSearch}
                                            onChange={(e) => setServiceSearch(e.target.value)}
                                            placeholder="Tìm mã hoặc tên liệu trình..."
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm pr-10 outline-none focus:bg-black/40 focus:border-white/20 transition-all text-white placeholder-white/30"
                                        />
                                        <Search className="absolute right-3 top-2.5 text-white/40 group-focus-within:text-white" size={16} />
                                    </div>
                                )}
                            </div>

                            {isCTV ? (
                                /* GIAO DIỆN CTV - HOA HỒNG CỐ ĐỊNH */
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                        <Info size={48} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-2 tracking-tight">Chính sách hoa hồng giới thiệu</h4>
                                    <p className="text-white/60 max-w-md mb-10 leading-relaxed font-medium">
                                        Cộng tác viên nhận mức thưởng cố định trên mỗi khách hàng mới đặt lịch thành công lần đầu.
                                    </p>
                                    <div className="bg-white/10 border border-emerald-500/30 rounded-[2rem] px-12 py-10 shadow-2xl relative group hover:bg-white/15 transition-all">
                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] block mb-2">Định mức chi trả</span>
                                        <div className="text-5xl font-black text-white tracking-tight">100,000 đ <span className="text-xl opacity-50 font-medium">/ khách</span></div>
                                        <button
                                            onClick={() => openEditModal('FIXED_CTV', 'Hoa hồng giới thiệu', 100000)}
                                            className="absolute -top-3 -right-3 p-2.5 bg-[#1e293b] border border-white/20 rounded-full shadow-lg text-white/60 hover:text-emerald-400 hover:border-emerald-500 transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* GIAO DIỆN BẢNG CHO SALE & KTV */
                                <>
                                    <div className="grid grid-cols-12 bg-white/5 border-b border-white/10 px-6 py-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex-shrink-0 backdrop-blur-md">
                                        <div className="col-span-6">Thông tin liệu trình</div>
                                        <div className="col-span-3 text-center">Giá niêm yết</div>
                                        <div className="col-span-3 text-center">Mức hưởng (%)</div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
                                        {filteredServices.map((category) => (
                                            <div key={category.category_id}>
                                                {/* Category Header */}
                                                <div className="bg-black/40 px-6 py-2 border-y border-white/5 sticky top-0 z-10 backdrop-blur-md font-black text-[10px] text-white/50 uppercase tracking-widest shadow-lg">
                                                    {category.category_name}
                                                </div>

                                                {/* Service Items */}
                                                {category.items.map((item) => (
                                                    <div key={item.id} className="grid grid-cols-12 items-center px-6 py-4 border-b border-white/5 hover:bg-white/5 group transition-all">
                                                        <div className="col-span-6 flex gap-4 items-center">
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:bg-white/10 group-hover:text-white transition-colors">
                                                                {item.id.split('-').pop()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-bold text-white text-sm truncate group-hover:text-emerald-300 transition-colors">{item.name}</div>
                                                                <div className="text-[10px] text-white/30 font-mono tracking-tighter italic">#{item.id}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-3 text-center text-white/60 font-bold text-xs tracking-wide">
                                                            {new Intl.NumberFormat('vi-VN').format(item.base_price)}đ
                                                        </div>
                                                        <div className="col-span-3 flex justify-center">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`px-5 py-1.5 rounded-xl border font-black text-sm min-w-[80px] text-center shadow-lg backdrop-blur-sm transition-all duration-300 ${isSale
                                                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500'
                                                                    : 'bg-blue-500/10 border-blue-500/20 text-blue-300 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500'
                                                                    }`}>
                                                                    {item.current_commission}%
                                                                </div>
                                                                <button
                                                                    onClick={() => openEditModal(item.id, item.name, item.current_commission)}
                                                                    className="p-2 text-white/30 opacity-0 group-hover:opacity-100 transition-all hover:text-white hover:bg-white/10 rounded-lg"
                                                                >
                                                                    <Edit2 size={16} />
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
                    </div>
                </div>
            </main>

            {/* MODAL CẬP NHẬT (Dark Glass) */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-[#1e293b] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="font-black text-white text-xs uppercase tracking-widest text-center flex-1 ml-6">Điều chỉnh chiết khấu</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="mb-8 p-4 bg-black/20 rounded-2xl border border-dashed border-white/10 text-center">
                                <label className="block text-[10px] font-black text-white/40 uppercase mb-1 tracking-widest">Đang sửa cho: {selectedRoleGroup.name}</label>
                                <p className="text-sm font-bold text-emerald-400 leading-tight uppercase">{editingItem?.name}</p>
                            </div>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={editingItem?.value || ''}
                                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, value: e.target.value } : null)}
                                    className="w-full bg-black/30 border-2 border-white/10 rounded-3xl px-6 py-6 text-5xl font-black text-white text-center outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder-white/10"
                                    placeholder="0"
                                    autoFocus
                                />
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-white/20 pointer-events-none group-focus-within:text-emerald-500/50">
                                    {isCTV && editingItem?.id === 'FIXED_CTV' ? 'đ' : '%'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 bg-black/20 flex gap-4 border-t border-white/10">
                            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black text-white/40 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white transition-all uppercase text-[10px] tracking-widest">Hủy</button>
                            <button onClick={() => handleSaveCommission(editingItem?.value || '0')} className="flex-1 py-4 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg active:scale-95 uppercase text-[10px] tracking-widest">Cập nhật</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
};

export default ReferralManagement;