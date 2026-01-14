// src/hooks/useCustomerDetail.ts

import { useCallback, useEffect, useState } from 'react';
import { 
  mockUsers, 
  mockMemberships, 
  mockBookings, 
  mockWalletTransactions, 
  mockServices, 
  mockMemberRanks 
} from '@/mocks'; 

// --- SỬA IMPORT TẠI ĐÂY ---
import { 
  Customer, 
  CustomerStats, 
  ServiceHistoryItem, 
  TransactionHistoryItem 
} from '@/types/customer'; // Import từ file vừa tạo ở Bước 1

import { Membership } from '@/types/types'; // Import Membership từ file types gốc

// --- ĐỊNH NGHĨA LẠI INTERFACE CHO UI ---

export interface NoteItem {
  id: string;
  content: string;
  type: 'normal' | 'important';
  author: string;
  createdAt: string;
}

// Kế thừa Customer để có sẵn trường 'id', 'full_name'... => Sửa lỗi số 2
export interface DetailedCustomer extends Customer {
  membership: (Membership & { rank_name: string; rank_color: string }) | null;
  stats: CustomerStats;
  history: ServiceHistoryItem[];
  transactions: TransactionHistoryItem[];
  notes: NoteItem[];
}

// --- HOOK (Giữ nguyên logic cũ) ---
export const useCustomerDetail = (customerId: string) => {
  const [customer, setCustomer] = useState<DetailedCustomer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerData = useCallback(async () => {
    if (!customerId) return;
    
    setLoading(true);
    try {
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
          rank_color: rank?.icon_url || '#000',
        };
      }

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
      
      const stats: CustomerStats = {
        totalSpent: userBookings.reduce((sum, b) => sum + (b.status === 'completed' ? b.price : 0), 0),
        visitCount: completedBookings.length,
        lastVisit: completedBookings.length > 0 ? completedBookings[0].date : null,
        walletBalance: userTransactions
            .filter(t => t.status === 'success')
            .reduce((sum, t) => sum + t.amount, 0),
        upcomingBookings: userBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length,
      };

      // Object này giờ đã khớp hoàn toàn với DetailedCustomer (có id từ userRaw)
      const detailedCustomer: DetailedCustomer = {
        id: userRaw.id,
        full_name: userRaw.full_name,
        phone: userRaw.phone || '',
        email: userRaw.email,
        avatar_url: userRaw.avatar_url,
        address: 'Chưa cập nhật',
        role_id: userRaw.role_id,
        is_active: userRaw.is_active,
        created_at: userRaw.created_at,
        
        membership: membershipData,
        stats: stats,
        history: userBookings,
        transactions: userTransactions,
        notes: [],
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

  return { customer, loading, error, refetch: fetchCustomerData };
};