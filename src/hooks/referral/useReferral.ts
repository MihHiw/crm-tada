import { useEffect, useState } from 'react';
import { mockReferrals, mockUsers } from '@/mocks'; // Import nguồn dữ liệu chuẩn

// 1. Cấu trúc Friend (View Model cho UI)
export interface Friend {
  id: string;
  fullName: string;
  phone: string;
  avatar: string | null;
  joinedDate: string; 
  commission: number;
  status: string; 
  role: 'sale' | 'ctv' | 'member'; 
}

export interface SummaryData {
  referralCode: string;
  referralLink: string;
  stats: {
    totalFriends: number;
    totalCommission: number;
    currency: string;
  };
}

export const useReferralData = (currentUserId: string = 'cust-02') => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Giả lập network delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        // --- BƯỚC 1: LỌC DANH SÁCH GIỚI THIỆU CỦA USER HIỆN TẠI ---
        const myReferrals = mockReferrals.filter(ref => ref.referrer_id === currentUserId);

        // --- BƯỚC 2: MAPPING DỮ LIỆU (JOIN Referral + User) ---
        const mappedFriends: Friend[] = myReferrals.map(ref => {
          // Tìm thông tin người được giới thiệu
          const user = mockUsers.find(u => u.id === ref.referred_user_id);
          
          // Fallback nếu không tìm thấy user
          const userName = user?.full_name || 'Người dùng ẩn';
          const userPhone = user?.phone || '***';
          
          // Map role_id sang string (Giả lập logic)
          let roleName: 'sale' | 'ctv' | 'member' = 'member';
          if (user?.role_id === 3) roleName = 'sale'; 
          
          return {
            id: ref.referred_user_id,
            fullName: userName,
            phone: userPhone,
            avatar: user?.avatar_url || null,
            joinedDate: ref.created_at,
            commission: ref.commission_amount,
            status: ref.status, // pending, completed...
            role: roleName,
          };
        });

        // --- BƯỚC 3: TÍNH TOÁN THỐNG KÊ ---
        const totalCommission = myReferrals.reduce((sum, item) => sum + item.commission_amount, 0);
        
        // Lấy thông tin user hiện tại để tạo mã giới thiệu
        const currentUser = mockUsers.find(u => u.id === currentUserId);
        const refCode = currentUser?.phone || 'UNKNOWN';

        const summaryData: SummaryData = {
          referralCode: refCode,
          referralLink: `https://vanillaspa.vn/register?ref=${refCode}`,
          stats: {
            totalFriends: myReferrals.length,
            totalCommission: totalCommission,
            currency: 'VND',
          }
        };

        setSummary(summaryData);
        setFriends(mappedFriends);

      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu giới thiệu.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUserId]);

  return { summary, friends, loading, error };
};