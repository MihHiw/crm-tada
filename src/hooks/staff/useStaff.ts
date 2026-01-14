import { useMemo, useState } from 'react';
import { mockUsers, mockReferrals } from '@/mocks'; // Import nguồn dữ liệu chuẩn

// --- 1. INTERFACES (View Model) ---

export interface StaffTarget {
  current: string;
  max: string;
  percent: number;
}

// Interface này khớp với những gì UI Staff Admin cần
export interface StaffUI {
  id: string;
  name: string;
  role: string;
  subRole: string; // VD: "Senior", "Junior" (Mock data chưa có, sẽ giả lập)
  phone: string;
  email: string;
  address: string;
  commission: string; // Tổng hoa hồng
  rating: number;     // Giả lập
  status: 'Đang làm việc' | 'Đang nghỉ' | 'Tạm vắng';
  avatar: string;
  target: StaffTarget; // Giả lập
}

// Map Role ID sang Text
const ROLE_MAP: Record<number, string> = {
  1: 'Quản trị viên',
  2: 'Kỹ thuật viên',
  3: 'Sale / Tư vấn',
};

// --- 2. HOOK ---

export const useStaff = () => {
  // 1. KHỞI TẠO DỮ LIỆU (Lazy Initialization)
  // Chỉ tính toán map dữ liệu 1 lần khi mount
  const [staffs, setStaffs] = useState<StaffUI[]>(() => {
    // A. Lọc ra nhân viên (Role != 4)
    const rawStaffs = mockUsers.filter(u => u.role_id !== 4);

    return rawStaffs.map(u => {
      // B. Tính hoa hồng từ bảng Referral
      const totalCommission = mockReferrals
        .filter(ref => ref.referrer_id === u.id)
        .reduce((sum, ref) => sum + ref.commission_amount, 0);

      // C. Giả lập Target (Do DB chưa có bảng Target)
      const targetMax = 50000000; // 50tr
      const percent = Math.min(100, Math.round((totalCommission / targetMax) * 100));

      // D. Map sang StaffUI
      return {
        id: u.id,
        name: u.full_name,
        role: ROLE_MAP[u.role_id] || 'Nhân viên',
        subRole: u.role_id === 1 ? 'Manager' : 'Staff', // Mock logic
        phone: u.phone || 'Chưa cập nhật',
        email: u.email || '',
        address: 'Hồ Chí Minh', // Mock data user chưa có address
        commission: new Intl.NumberFormat('vi-VN').format(totalCommission),
        rating: 4.5 + (Math.random() * 0.5), // Random 4.5 -> 5.0
        status: u.is_active ? 'Đang làm việc' : 'Đang nghỉ',
        avatar: u.avatar_url || `https://ui-avatars.com/api/?name=${u.full_name}`,
        target: {
          current: `${(totalCommission / 1000000).toFixed(1)}tr`,
          max: '50tr',
          percent: percent
        }
      };
    });
  });

  const [selectedId, setSelectedId] = useState<string>(staffs[0]?.id || "");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("Tất cả");

  // --- 3. LOGIC CRUD (Client-side) ---

  // Thêm nhân viên
  const addStaff = (newStaffData: Omit<StaffUI, 'id'>) => {
    const id = `NV${Math.floor(Math.random() * 9000) + 1000}`;
    const newStaff: StaffUI = { ...newStaffData, id };
    
    setStaffs(prev => [newStaff, ...prev]);
    return newStaff;
  };

  // Cập nhật nhân viên
  const updateStaff = (id: string, updatedData: Partial<StaffUI>) => {
    setStaffs(prev => prev.map(s => 
      s.id === id ? { ...s, ...updatedData } : s
    ));
  };

  // Xóa nhân viên
  const deleteStaff = (id: string) => {
    setStaffs(prev => {
      const newList = prev.filter(s => s.id !== id);
      if (id === selectedId) {
        setSelectedId(newList[0]?.id || "");
      }
      return newList;
    });
  };

  // --- 4. LOGIC THỐNG KÊ & LỌC ---

  const stats = useMemo(() => ({
    total: staffs.length,
    active: staffs.filter(s => s.status === 'Đang làm việc').length,
    away: staffs.filter(s => s.status === 'Tạm vắng').length,
    off: staffs.filter(s => s.status === 'Đang nghỉ').length
  }), [staffs]);

  const filteredStaffs = useMemo(() => {
    return staffs.filter(staff => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        staff.name.toLowerCase().includes(searchLower) ||
        staff.id.toLowerCase().includes(searchLower) ||
        staff.phone.includes(searchTerm);

      const matchesStatus =
        filterStatus === "Tất cả" || staff.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [staffs, searchTerm, filterStatus]);

  const selectedStaff = useMemo(() => {
    return staffs.find(s => s.id === selectedId) || null;
  }, [staffs, selectedId]);

  // --- 5. EXPORT ---

  return {
    staffs: filteredStaffs, // Danh sách hiển thị (đã lọc)
    allStaffs: staffs,      // Danh sách gốc (để tính toán nếu cần)
    selectedStaff,
    searchTerm,
    filterStatus,
    stats,
    
    // Actions
    selectStaff: setSelectedId,
    handleSearch: setSearchTerm,
    handleFilterStatus: setFilterStatus,
    addStaff,
    updateStaff,
    deleteStaff
  };
};