// src/pages/admin/customers/index.tsx
"use client";

import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';
import React from 'react';

// Hooks & Components
import CustomerRow from '@/components/admin/customer/CustomerRow';
import CustomerStats from '@/components/admin/customer/CustomerStats';
import CustomerToolbar from '@/components/admin/customer/CustomerToolbar';
import { Sidebar } from '@/components/admin/Sidebar';
import { useCustomerManagement, CustomerTableRow } from '@/hooks/customerManagement/useCustomerManagement';

export default function CustomerManagement() {
    const router = useRouter();
    const { state, setters, actions } = useCustomerManagement();
    
    // Sử dụng paginatedCustomers thay vì filteredCustomers để hỗ trợ phân trang
    const { 
        paginatedCustomers, 
        searchTerm, 
        filterTier, 
        currentPage, 
        totalPages,
        customers 
    } = state;

    const handleNavigateDetail = (id: string | number) => {
        router.push(`/admin/customerAdmin/${id}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-6 transition-all duration-300">
                <div className="w-full max-w-7xl mx-auto flex flex-col h-full">

                    {/* 1. Header Section */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 font-serif">Quản lý khách hàng</h1>
                            <p className="text-gray-500 text-sm">Quản lý hạng thành viên và lịch sử giao dịch của khách hàng.</p>
                        </div>
                        <button
                            onClick={actions.addCustomer}
                            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-200 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                        >
                            <Plus size={18} />
                            Thêm khách mới
                        </button>
                    </div>

                    {/* 2. Stats Section */}
                    {/* Giả sử component CustomerStats nhận danh sách customers để tự tính toán */}
                    <CustomerStats customers={customers} />

                    {/* 3. Table Section */}
                    <div className="bg-white rounded-[24px] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col overflow-hidden">

                        {/* Toolbar */}
                        <CustomerToolbar
                            filterTier={filterTier}
                            setFilterTier={(tier) => {
                                setters.setFilterTier(tier);
                                setters.setCurrentPage(1); // Reset về trang 1 khi lọc
                            }}
                            searchTerm={searchTerm}
                            setSearchTerm={(term) => {
                                setters.setSearchTerm(term);
                                setters.setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                            }}
                        />

                        {/* Table Data */}
                        <div className="overflow-auto w-full max-h-[600px]">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
                                    <tr className="text-gray-400 text-[11px] uppercase tracking-wider">
                                        <th className="px-6 py-4 font-bold whitespace-nowrap">Thông tin khách hàng</th>
                                        <th className="px-6 py-4 font-bold whitespace-nowrap text-center">Hạng</th>
                                        <th className="px-6 py-4 font-bold whitespace-nowrap">Số dư ví</th>
                                        <th className="px-6 py-4 font-bold whitespace-nowrap">Tổng chi tiêu</th>
                                        <th className="px-6 py-4 font-bold whitespace-nowrap">Lần cuối ghé</th>
                                        <th className="px-6 py-4 font-bold text-right whitespace-nowrap">Thao tác</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-50 bg-white">    
                                    {paginatedCustomers.length > 0 ? (
                                        paginatedCustomers.map((customer: CustomerTableRow) => (
                                            <CustomerRow
                                                key={customer.id}
                                                customer={customer}
                                                onRowClick={handleNavigateDetail}
                                                onFormatCurrency={actions.formatCurrency}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                                    <div className="p-4 bg-gray-50 rounded-full">
                                                        <Search size={40} className="text-gray-200" />
                                                    </div>
                                                    <p className="font-medium text-gray-500">Không tìm thấy khách hàng nào</p>
                                                    <p className="text-sm">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* 4. Pagination Footer */}
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Hiển thị trang <span className="font-bold text-gray-700">{currentPage}</span> / {totalPages || 1}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => actions.goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => actions.goToPage(i + 1)}
                                            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                                                currentPage === i + 1
                                                    ? 'bg-gray-900 text-white shadow-md'
                                                    : 'hover:bg-gray-200 text-gray-600'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => actions.goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}