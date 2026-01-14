import { mockReferrals, mockUsers } from "@/mocks";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";

// --- 1. DEFINITIONS ---

// Định nghĩa Type Status cụ thể (Thay vì dùng string hoặc any)
export type CommissionStatus = 'completed' | 'pending' | 'cancelled';

export type StaffRole = 'sale' | 'ktv' | 'ctv';

export interface CommissionRecord {
  id: string;
  transactionCode: string;
  fullName: string;
  phone: string;
  avatar: string | null;
  role: StaffRole;
  serviceName: string;
  commission: number;
  joinedDate: string;
  status: CommissionStatus; 
}

export interface CommissionStats {
  totalCommission: number;
  ktvTotal: number; ktvPending: number;
  saleTotal: number; salePending: number;
  ctvTotal: number; ctvPending: number;
  topKTV: { name: string; revenue: number };
  topSaleActual: { name: string; revenue: number };
}

const getRoleString = (roleId: number): StaffRole => {
  if (roleId === 2) return 'ktv';
  if (roleId === 3) return 'sale';
  return 'ctv';
};

export const useTechcommission = () => {
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [stats, setStats] = useState<CommissionStats>({
    totalCommission: 0,
    ktvTotal: 0, ktvPending: 0,
    saleTotal: 0, salePending: 0,
    ctvTotal: 0, ctvPending: 0,
    topKTV: { name: "Chưa có", revenue: 0 },
    topSaleActual: { name: "Chưa có", revenue: 0 }
  });

  // --- 2. LOGIC ---
  const calculateAllStats = useCallback((data: CommissionRecord[]) => {
    const getTopByRole = (roleName: StaffRole) => {
      const filtered = data.filter(i => i.role === roleName && i.status === 'completed');
      const revenueMap: Record<string, number> = {};
      filtered.forEach(curr => {
        revenueMap[curr.fullName] = (revenueMap[curr.fullName] || 0) + curr.commission;
      });
      const topName = Object.keys(revenueMap).reduce((a, b) => revenueMap[a] > revenueMap[b] ? a : b, "");
      return { name: topName || "N/A", revenue: revenueMap[topName] || 0 };
    };

    const initialStats = {
      ktvTotal: 0, saleTotal: 0, ctvTotal: 0,
      ktvPending: 0, salePending: 0, ctvPending: 0
    };

    const calculated = data.reduce((acc, item) => {
      if (item.status === 'cancelled') return acc; // Bỏ qua đơn hủy

      const amount = item.commission;
      const isCompleted = item.status === 'completed';

      const keyPrefix = item.role;
      const keySuffix = isCompleted ? 'Total' : 'Pending';
      const key = `${keyPrefix}${keySuffix}` as keyof typeof initialStats;

      if (acc.hasOwnProperty(key)) acc[key] += amount;
      return acc;
    }, initialStats);

    setStats({
      ...calculated,
      totalCommission: calculated.ktvTotal + calculated.saleTotal + calculated.ctvTotal,
      topKTV: getTopByRole('ktv'),
      topSaleActual: getTopByRole('sale')
    });
  }, []);

  // --- 3. FETCH ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const mappedData: CommissionRecord[] = mockReferrals.map(ref => {
        const user = mockUsers.find(u => u.id === ref.referrer_id);
        const role = getRoleString(user?.role_id || 4);

        // FIX LỖI 1: Ép kiểu an toàn, fallback về 'pending' nếu data rác
        // as CommissionStatus thay vì as any
        const safeStatus = (ref.status as CommissionStatus) || 'pending';

        return {
          id: ref.id,
          transactionCode: ref.id.toUpperCase(),
          fullName: user?.full_name || 'Người dùng ẩn',
          phone: user?.phone || '',
          avatar: user?.avatar_url || null,
          role: role,
          serviceName: role === 'ctv' ? 'Giới thiệu khách hàng' : 'Hoa hồng dịch vụ',
          commission: ref.commission_amount,
          joinedDate: ref.created_at,
          status: safeStatus,
        };
      });

      setCommissions(mappedData);
      calculateAllStats(mappedData);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [calculateAllStats]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- 4. ACTIONS ---

  // FIX LỖI 2: Định nghĩa type cho newStatus là CommissionStatus
  const updateStatus = async (id: string, newStatus: CommissionStatus) => {
    const updated = commissions.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setCommissions(updated);
    calculateAllStats(updated);
  };

  const deleteCommission = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) return;
    const updated = commissions.filter(item => item.id !== id);
    setCommissions(updated);
    calculateAllStats(updated);
  };

  const editCommission = async (id: string, amount: number) => {
    const updated = commissions.map(item =>
      item.id === id ? { ...item, commission: amount } : item
    );
    setCommissions(updated);
    calculateAllStats(updated);
  };

  const exportToExcel = () => {
    if (commissions.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }
    const excelData = commissions.map(item => ({
      "Mã GD": item.transactionCode,
      "Họ Tên": item.fullName,
      "Vai Trò": item.role.toUpperCase(),
      "Hoa Hồng": item.commission,
      "Trạng Thái": item.status === 'completed' ? 'Đã thanh toán' : 'Chờ xử lý'
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bao_Cao");
    XLSX.writeFile(wb, `Bao_Cao_Hoa_Hong.xlsx`);
  };

  return {
    commissions,
    loading,
    stats,
    exportToExcel,
    updateStatus,
    deleteCommission,
    editCommission,
    refresh: fetchData
  };
};