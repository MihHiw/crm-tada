import { useEffect, useMemo, useState } from 'react';
import { mockPromotions } from '@/mocks'; 

interface DBPromotion {
  id: string;
  code: string;
  name: string;
  discount_type: 'percent' | 'fixed'; // Dựa trên mock data
  discount_value: number;
  max_discount_value?: number;
  min_order_value?: number;
  start_date: string;
  end_date: string;
}

// 2. INTERFACE: Dữ liệu cho UI (View Model)
export interface PromotionUI {
  id: string;
  title: string;
  name: string;
  description: string;
  code: string;
  discountAmount: string; // Formatted string (VD: "20%" hoặc "50.000đ")
  expiryDate: string;
  startDate: string;
  bannerUrl: string;
  targetType: 'all' | 'customer';
  allowedUserIds: string[];
  isActive: boolean;
}

// 3. HOOK: Fetch & Transform Data
const useFetchAllPromotions = () => {
  const [data, setData] = useState<PromotionUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Giả lập network delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        const now = new Date();

        // --- TRANSFORM LOGIC (Adapter) ---
        // Chuyển đổi từ DBPromotion (mock) -> PromotionUI
        const mappedData: PromotionUI[] = mockPromotions.map((p) => {
          // Ép kiểu p về DBPromotion để đảm bảo type safety khi truy cập field
          const raw = p as unknown as DBPromotion; 

          const endDate = new Date(raw.end_date);
          const startDate = new Date(raw.start_date);
          
          // Logic Active: Hiện tại phải nằm giữa ngày bắt đầu và kết thúc
          const isActive = now >= startDate && now <= endDate;

          // Format hiển thị giá trị giảm
          const discountDisplay = raw.discount_type === 'percent' 
            ? `${raw.discount_value}%` 
            : `${new Intl.NumberFormat('vi-VN').format(raw.discount_value)}đ`;

          // Giả lập Logic Target (Vì DB mock chưa có trường này)
          // Ví dụ: Code bắt đầu bằng 'VIP' hoặc 'PRIVATE' là dành riêng
          const isPrivate = raw.code.startsWith('VIP') || raw.code.startsWith('PRIVATE');

          return {
            id: raw.id,
            title: raw.name, // Map name -> title
            name: raw.name,
            code: raw.code,
            description: `Giảm ${discountDisplay} cho đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(raw.min_order_value || 0)}đ`,
            discountAmount: discountDisplay,
            expiryDate: raw.end_date,
            startDate: raw.start_date,
            
            // Giả lập banner
            bannerUrl: `https://placehold.co/600x200/orange/white?text=${encodeURIComponent(raw.code)}`,
            
            // Logic Target giả lập
            targetType: isPrivate ? 'customer' : 'all',
            allowedUserIds: [], 
            
            isActive: isActive, 
          };
        });

        setData(mappedData);
      } catch (err) {
        console.error("Lỗi tải khuyến mãi:", err);
        setError(err instanceof Error ? err : new Error("Lỗi không xác định khi tải dữ liệu"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error, setData };
};

// 4. HOOK CHÍNH: Logic Thống kê & Phân loại
export const usePromotions = () => {
  const { data: allPromotions, loading, error, setData } = useFetchAllPromotions();

  const stats = useMemo(() => {
    const publicPromos = allPromotions.filter(p => p.targetType === 'all');
    const privatePromos = allPromotions.filter(p => p.targetType === 'customer');
    
    const activePromos = allPromotions.filter(p => p.isActive);
    const inactivePromos = allPromotions.filter(p => !p.isActive);

    return {
      publicPromos,
      privatePromos,
      activePromos,
      inactivePromos,
      total: allPromotions.length
    };
  }, [allPromotions]);

  return {
    loading,
    error,
    allPromotions,
    publicPromotions: stats.publicPromos,
    privatePromotions: stats.privatePromos,
    stats: {
      total: stats.total,
      active: stats.activePromos.length,
      inactive: stats.inactivePromos.length,
      publicCount: stats.publicPromos.length,
      privateCount: stats.privatePromos.length,
    },
    setPromotions: setData
  };
};