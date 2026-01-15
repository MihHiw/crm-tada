// src/hooks/customerDetail/useCustomerDetail.ts

import {
  mockBookings,
  mockMemberRanks,
  mockMemberships,
  mockServices,
  mockUsers,
  mockWalletTransactions
} from '@/mocks';
import { useCallback, useEffect, useState } from 'react';

// Import đúng từ file type trung tâm
import {
  Customer,
  CustomerStats,
  ServiceHistoryItem,
  TransactionHistoryItem
} from '@/types/customer';

import { Membership } from '@/types/types';

// --- TYPES ---

// Interface NoteItem
export interface NoteItem {
  id: string;
  content: string;
  type: 'normal' | 'important';
  author: string;
  createdAt: string;
  authorAvatar?: string;
}

// Interface chi tiết khách hàng
export interface DetailedCustomer extends Customer {
  membership: (Membership & { rank_name: string; rank_color: string }) | null;
  stats: CustomerStats;
  history: ServiceHistoryItem[];
  transactions: TransactionHistoryItem[];
  notes: NoteItem[];
}

// 1. Interface cho dữ liệu cần Update (Thêm mới)
export interface UpdateCustomerInput {
  full_name: string;
  phone: string;
  email: string;
}

// --- HOOK ---

export const useCustomerDetail = (customerId: string) => {
  const [customer, setCustomer] = useState<DetailedCustomer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerData = useCallback(async () => {
    if (!customerId) return;

    setLoading(true);
    try {
      // Giả lập delay mạng
      await new Promise(resolve => setTimeout(resolve, 600));

      const userRaw = mockUsers.find(u => u.id === customerId);
      if (!userRaw) throw new Error("Không tìm thấy khách hàng");

      const membershipRaw = mockMemberships.find(m => m.user_id === customerId);
      let membershipData = null;

      if (membershipRaw) {
        const rank = mockMemberRanks.find(r => r.id === membershipRaw.rank_id);
        membershipData = {
          ...membershipRaw,
          rank_name: rank?.name || 'Thành viên',
          rank_color: rank?.icon_url || '#c0c0c0',
        };
      }

      // Xử lý lịch sử đặt lịch
      const userBookings: ServiceHistoryItem[] = mockBookings
        .filter(b => b.user_id === customerId)
        .map(b => {
          const service = mockServices.find(s => s.id === b.service_id);
          const staff = mockUsers.find(u => u.id === b.staff_id);
          return {
            id: b.id,
            date: b.start_time,
            service_name: service?.name || 'Dịch vụ đã xóa',
            staff_name: staff?.full_name || 'Chưa phân công',
            price: b.total_price,
            status: b.status,
          };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Xử lý lịch sử giao dịch ví
      const userTransactions: TransactionHistoryItem[] = mockWalletTransactions
        .filter(t => t.user_id === customerId)
        .map(t => ({
          id: t.id,
          date: t.created_at,
          amount: t.amount,
          type: t.type,
          description: t.description || '',
          status: t.status
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const completedBookings = userBookings.filter(b => b.status === 'completed');

      // Tính toán thống kê
      const stats: CustomerStats = {
        totalSpent: userBookings.reduce((sum, b) => sum + (b.status === 'completed' ? b.price : 0), 0),
        visitCount: completedBookings.length,
        lastVisit: completedBookings.length > 0 ? completedBookings[0].date : null,
        walletBalance: userTransactions
          .filter(t => t.status === 'success')
          .reduce((sum, t) => sum + t.amount, 0),
        upcomingBookings: userBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length,
      };

      // Tạo object dữ liệu đầy đủ
      const detailedCustomer: DetailedCustomer = {
        id: userRaw.id,
        full_name: userRaw.full_name,
        phone: userRaw.phone || '',
        email: userRaw.email,
        avatar_url: userRaw.avatar_url,
        role_id: userRaw.role_id,
        is_active: userRaw.is_active,
        created_at: userRaw.created_at,
        balance: userRaw.balance, // Map thêm balance gốc nếu cần

        membership: membershipData,
        stats: stats,
        history: userBookings,
        transactions: userTransactions,
        notes: [
          {
            id: 'init-note',
            content: 'Khách hàng thân thiết, ưu tiên xếp lịch vào cuối tuần.',
            type: 'important',
            author: 'Quản lý',
            createdAt: new Date().toISOString(),
            authorAvatar: 'https://ui-avatars.com/api/?name=Admin&background=random'
          }
        ],
      };

      setCustomer(detailedCustomer);
      setError(null);

    } catch (err) {
      console.error("Fetch detail error:", err);
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  // --- ACTIONS ---

  const addNote = async (content: string) => {
    if (!customer) return;

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      content: content,
      type: 'normal',
      author: 'Tôi',
      createdAt: new Date().toISOString(),
      authorAvatar: 'https://ui-avatars.com/api/?name=Me&background=random'
    };

    setCustomer(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notes: [newNote, ...prev.notes]
      };
    });
  };

  // 2. Hàm Update Customer (Thêm mới)
  const updateCustomer = (data: UpdateCustomerInput) => {
    if (!customer) return;

    // TODO: Gọi API cập nhật lên server tại đây (await api.put...)
    console.log("Saving customer data to API:", data);

    // Cập nhật State Local (Optimistic Update)
    setCustomer(prev => {
      if (!prev) return null;
      return {
        ...prev,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email
      };
    });
  };

  return {
    customer,
    loading,
    error,
    refetch: fetchCustomerData,
    addNote,
    updateCustomer // Export hàm này
  };
};