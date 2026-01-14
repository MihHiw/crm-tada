import {
    mockBookings,
    mockMemberRanks,
    mockMemberships,
    mockUsers,
    mockWalletTransactions
} from '@/mocks';
import { Customer } from '@/types/customer';
import { useMemo, useState } from 'react';

// --- TYPES ---

export interface CustomerTableRow extends Customer {
    name: string;
    total_spending: number;
    visit_count: number;
    last_visit: string;
    tier: string;
    tierColor: string;
    wallet_balance: number;
    status: 'active' | 'inactive';
}

interface SortConfig {
    key: keyof CustomerTableRow;
    direction: 'asc' | 'desc';
}

// --- HOOK ---

export const useCustomerManagement = () => {
    // 1. DATA INITIALIZATION
    const initialData: CustomerTableRow[] = useMemo(() => {
        const rawCustomers = mockUsers.filter(u => u.role_id === 4);

        return rawCustomers.map((user) => {
            // Logic Rank
            const membership = mockMemberships.find(m => m.user_id === user.id);
            const rank = mockMemberRanks.find(r => r.id === membership?.rank_id);

            const tierName = rank?.name || 'Thành viên';
            const tierColor = rank?.icon_url || '#c0c0c0'; // Giả lập màu nếu thiếu field color

            // Logic Bookings
            const userBookings = mockBookings.filter(b => b.user_id === user.id);
            const totalSpent = userBookings
                .filter(b => b.status === 'completed')
                .reduce((sum, b) => sum + b.total_price, 0);

            const lastBooking = [...userBookings].sort((a, b) =>
                new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
            )[0];

            // Logic Wallet
            const walletBalance = mockWalletTransactions
                .filter(t => t.user_id === user.id && t.status === 'success')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                ...user,
                // --- FIX 1: Xử lý phone null an toàn ---
                phone: user.phone ?? "",

                name: user.full_name,
                avatar_url: user.avatar_url,
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
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // 2. FILTER LOGIC
    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const searchLower = searchTerm.trim().toLowerCase();
            const matchSearch =
                c.name.toLowerCase().includes(searchLower) ||
                c.phone.includes(searchTerm) ||
                (c.email && c.email.toLowerCase().includes(searchLower));

            const currentFilter = filterTier.toLowerCase();
            const customerTier = c.tier.toLowerCase();

            const matchTier =
                currentFilter === 'all' ||
                currentFilter === 'tất cả' ||
                customerTier.includes(currentFilter);

            return matchSearch && matchTier;
        });
    }, [customers, searchTerm, filterTier]);

    // 3. SORT LOGIC (Strict Type - No Any)
    const sortedCustomers = useMemo(() => {
        const sortableItems = [...filteredCustomers];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key;
                const aValue = a[key];
                const bValue = b[key];

                // --- FIX 2: So sánh an toàn dựa trên kiểu dữ liệu ---

                // Trường hợp so sánh số (VD: total_spending, wallet_balance)
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc'
                        ? aValue - bValue
                        : bValue - aValue;
                }

                // Trường hợp còn lại (string, boolean...), chuyển về string để so sánh
                const aStr = String(aValue ?? "").toLowerCase();
                const bStr = String(bValue ?? "").toLowerCase();

                if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredCustomers, sortConfig]);

    // 4. PAGINATION LOGIC
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

        addCustomer: () => { alert("Tính năng đang phát triển!"); },

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
                setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
            }
        },

        toggleSelection: (id: string) => {
            setSelectedIds(prev =>
                prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
            );
        },

        toggleAll: () => {
            if (selectedIds.length === paginatedCustomers.length) {
                setSelectedIds([]);
            } else {
                setSelectedIds(paginatedCustomers.map(c => c.id));
            }
        }
    };

    return {
        state: {
            customers,
            filteredCustomers,
            sortedCustomers,
            paginatedCustomers,
            searchTerm,
            filterTier,
            sortConfig,
            currentPage,
            totalPages,
            selectedIds
        },
        setters: {
            setSearchTerm,
            setFilterTier,
            setCurrentPage
        },
        actions
    };
};