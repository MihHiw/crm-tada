import {
    mockBookings,
    mockMemberRanks,
    mockMemberships,
    mockUsers,
    mockWalletTransactions
} from '@/mocks';
// Import interface chuẩn từ file bạn vừa cung cấp
import { Customer } from '@/types/customer';
import { useMemo, useState } from 'react';

// --- EXTENDED TYPES ---

// Mở rộng Customer gốc để thêm các trường hiển thị (Display Fields)
export interface CustomerTableRow extends Customer {
    // Các trường tính toán thêm cho bảng
    name: string; // Alias của full_name để tiện sort/search
    tier: string;
    tierColor: string;
    total_spending: number;
    visit_count: number;
    last_visit: string;
    wallet_balance: number; // Map từ balance hoặc tính toán
    status: 'active' | 'inactive'; // Map từ is_active
}

interface SortConfig {
    key: keyof CustomerTableRow;
    direction: 'asc' | 'desc';
}

// Interface cho dữ liệu từ Form thêm mới
export interface NewCustomerInput {
    full_name: string;
    phone: string;
    email: string;
    tier: string;
}

// --- HOOK ---

export const useCustomerManagement = () => {
    // 1. DATA INITIALIZATION
    const initialData: CustomerTableRow[] = useMemo(() => {
        // Giả sử mockUsers có cấu trúc tương tự Customer nhưng có thể thiếu vài trường
        const rawCustomers = mockUsers.filter(u => u.role_id === 4);

        return rawCustomers.map((user) => {
            const membership = mockMemberships.find(m => m.user_id === user.id);
            const rank = mockMemberRanks.find(r => r.id === membership?.rank_id);
            const tierName = rank?.name || 'Thành viên';
            const tierColor = rank?.icon_url || '#94a3b8';

            const userBookings = mockBookings.filter(b => b.user_id === user.id);
            const totalSpent = userBookings
                .filter(b => b.status === 'completed')
                .reduce((sum, b) => sum + b.total_price, 0);

            const lastBooking = [...userBookings].sort((a, b) =>
                new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
            )[0];

            const walletBalance = mockWalletTransactions
                .filter(t => t.user_id === user.id && t.status === 'success')
                .reduce((sum, t) => sum + t.amount, 0);

            // Mapping dữ liệu Mock sang chuẩn Customer Interface
            return {
                // Spread các trường có sẵn
                id: user.id,
                full_name: user.full_name,
                email: user.email || null,
                phone: user.phone || null,
                avatar_url: user.avatar_url || null,
                role_id: user.role_id,
                is_active: user.is_active,
                created_at: user.created_at || new Date().toISOString(),
                balance: walletBalance, // Map vào field balance gốc

                // Các trường mở rộng (CustomerTableRow)
                name: user.full_name, // Alias
                total_spending: totalSpent,
                wallet_balance: walletBalance,
                visit_count: userBookings.length,
                last_visit: lastBooking ? lastBooking.start_time : '',
                tier: tierName,
                tierColor: tierColor,
                status: user.is_active ? 'active' : 'inactive',
            };
        });
    }, []);

    const [customers, setCustomers] = useState<CustomerTableRow[]>(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTier, setFilterTier] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    // 2. FILTER LOGIC
    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const searchLower = searchTerm.trim().toLowerCase();
            const phoneStr = c.phone || ""; // Xử lý null
            const emailStr = c.email || ""; // Xử lý null

            const matchSearch =
                c.full_name.toLowerCase().includes(searchLower) ||
                phoneStr.includes(searchTerm) ||
                emailStr.toLowerCase().includes(searchLower);

            const currentFilter = filterTier.toLowerCase();
            const customerTier = c.tier.toLowerCase();

            const matchTier =
                currentFilter === 'all' ||
                currentFilter === 'tất cả' ||
                customerTier.includes(currentFilter);

            return matchSearch && matchTier;
        });
    }, [customers, searchTerm, filterTier]);

    // 3. SORT LOGIC
    const sortedCustomers = useMemo(() => {
        const sortableItems = [...filteredCustomers];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key;
                const aValue = a[key];
                const bValue = b[key];

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                }

                const aStr = String(aValue ?? "").toLowerCase();
                const bStr = String(bValue ?? "").toLowerCase();

                if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredCustomers, sortConfig]);

    // 4. PAGINATION
    const paginatedCustomers = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);
    }, [sortedCustomers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);

    // 5. ACTIONS
    const actions = {
        formatCurrency: (val: number) =>
            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),

        // --- CẬP NHẬT: Tạo object đúng chuẩn Customer Interface ---
        addCustomer: (data: NewCustomerInput) => {
            // Logic giả lập màu rank
            let color = '#94a3b8';
            if (data.tier === 'Gold') color = '#eab308';
            if (data.tier === 'Diamond') color = '#06b6d4';
            if (data.tier === 'Silver') color = '#94a3b8';

            const newId = Math.random().toString(36).substr(2, 9);
            const now = new Date().toISOString();

            const newCustomer: CustomerTableRow = {
                // --- Fields bắt buộc của Customer Interface ---
                id: newId,
                full_name: data.full_name,
                phone: data.phone || null,
                email: data.email || null,
                role_id: 4, // Mặc định role Khách hàng
                is_active: true,
                created_at: now,
                updated_at: now,
                avatar_url: null,
                balance: 0,
                note: 'Khách hàng mới tạo',

                // --- Fields mở rộng của CustomerTableRow ---
                name: data.full_name,
                tier: data.tier,
                tierColor: color,
                total_spending: 0,
                wallet_balance: 0,
                visit_count: 0,
                last_visit: '',
                status: 'active',
            };

            setCustomers(prev => [newCustomer, ...prev]);
        },

        goToPage: (page: number) => {
            if (page >= 1 && page <= totalPages) setCurrentPage(page);
        },

        requestSort: (key: keyof CustomerTableRow) => {
            let direction: 'asc' | 'desc' = 'asc';
            if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
                direction = 'desc';
            }
            setSortConfig({ key, direction });
        },

        deleteCustomer: (id: string) => {
            if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
                setCustomers(prev => prev.filter(c => c.id !== id));
            }
        },
    };

    return {
        state: {
            customers,
            filteredCustomers,
            paginatedCustomers,
            searchTerm,
            filterTier,
            currentPage,
            totalPages,
        },
        setters: {
            setSearchTerm,
            setFilterTier,
            setCurrentPage
        },
        actions
    };
};