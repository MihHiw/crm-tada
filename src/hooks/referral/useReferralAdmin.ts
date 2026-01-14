import { mockCategories, mockServices } from '@/mocks'; // Import nguồn dữ liệu chuẩn
import { useMemo, useState } from 'react';

// --- 1. TYPE DEFINITIONS ---

export type RoleType = 'sale' | 'ktv' | 'ctv';

export interface RoleGroup {
    id: RoleType;
    name: string;
    label: string; // Label hiển thị trên cột (VD: HOA HỒNG TƯ VẤN)
}

// Item hiển thị trên bảng (Dịch vụ + Mức hoa hồng hiện tại)
export interface ServiceCommissionItem {
    id: string;
    name: string;
    category_name: string;
    base_price: number;
    current_commission: number; // % Hoa hồng
}

// Nhóm dịch vụ theo danh mục
export interface CommissionGroup {
    category_id: number;
    category_name: string;
    items: ServiceCommissionItem[];
}

// Dữ liệu mẫu cho các nhóm vai trò
export const ROLE_GROUPS: RoleGroup[] = [
    { id: 'sale', name: 'Sale / Tư vấn', label: 'HOA HỒNG TƯ VẤN' },
    { id: 'ktv', name: 'Kỹ thuật viên', label: 'HOA HỒNG THỰC HIỆN' },
    { id: 'ctv', name: 'Cộng tác viên', label: 'HOA HỒNG GIỚI THIỆU' },
];

// --- 2. HOOK ---

export const useReferral = () => {
    // --- STATE QUẢN LÝ ---

    const [selectedRoleGroup, setSelectedRoleGroup] = useState<RoleGroup>(ROLE_GROUPS[0]);
    const [serviceSearch, setServiceSearch] = useState('');

    // Giả lập Database lưu cấu hình hoa hồng
    // Key: `${service_id}_${role}` -> Value: Commission %
    // VD: 'srv-01_sale' -> 5
    const [commissionDB, setCommissionDB] = useState<Record<string, number>>(() => {
        // Init dữ liệu giả ngẫu nhiên ban đầu
        const initialData: Record<string, number> = {};
        mockServices.forEach(s => {
            initialData[`${s.id}_sale`] = 3;  // Mặc định Sale 3%
            initialData[`${s.id}_ktv`] = 10;  // Mặc định KTV 10%
            initialData[`${s.id}_ctv`] = 5;   // Mặc định CTV 5%
        });
        return initialData;
    });

    // State Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<{ id: string; name: string; value: string } | null>(null);

    // --- LOGIC XỬ LÝ DỮ LIỆU ---

    // Join Data: Categories + Services + CommissionDB
    const filteredServices = useMemo<CommissionGroup[]>(() => {
        // 1. Duyệt qua từng danh mục
        return mockCategories.map(cat => {
            // 2. Lấy các dịch vụ thuộc danh mục này
            const servicesInCat = mockServices.filter(s => s.category_id === cat.id);

            // 3. Map sang cấu trúc hiển thị và lấy hoa hồng tương ứng với Role đang chọn
            const items: ServiceCommissionItem[] = servicesInCat.map(s => {
                const key = `${s.id}_${selectedRoleGroup.id}`;
                return {
                    id: s.id,
                    name: s.name,
                    category_name: cat.name,
                    base_price: s.price,
                    current_commission: commissionDB[key] || 0, // Lấy từ DB giả lập
                };
            });

            // 4. Lọc theo từ khóa tìm kiếm
            const filteredItems = items.filter(item =>
                item.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                item.id.toLowerCase().includes(serviceSearch.toLowerCase())
            );

            return {
                category_id: cat.id,
                category_name: cat.name,
                items: filteredItems
            };
        }).filter(group => group.items.length > 0); // Chỉ lấy nhóm có item
    }, [selectedRoleGroup, serviceSearch, commissionDB]);

    // --- ACTIONS (XỬ LÝ SỰ KIỆN) ---

    const openEditModal = (id: string, name: string, currentValue: number) => {
        setEditingItem({
            id,
            name,
            value: String(currentValue)
        });
        setIsEditModalOpen(true);
    };

    const updateEditingValue = (newValue: string) => {
        setEditingItem(prev => prev ? { ...prev, value: newValue } : null);
    };

    const handleSaveCommission = (finalValueStr: string) => {
        if (!editingItem) return;

        const finalValue = parseFloat(finalValueStr);
        if (isNaN(finalValue)) {
            alert("Vui lòng nhập số hợp lệ");
            return;
        }

        // Cập nhật vào DB giả lập
        const key = `${editingItem.id}_${selectedRoleGroup.id}`;

        setCommissionDB(prev => ({
            ...prev,
            [key]: finalValue
        }));

        console.log(`Saved: Service ${editingItem.id} for Role ${selectedRoleGroup.id} = ${finalValue}%`);

        setIsEditModalOpen(false);
        setEditingItem(null);
    };

    const handleUpdateSystem = () => {
        // Logic gọi API lưu toàn bộ cấu hình lên server thật
        console.log("Syncing to server...", commissionDB);
        alert(`Đã lưu cấu hình hoa hồng cho nhóm: ${selectedRoleGroup.name}`);
    };

    return {
        // Data
        roleGroups: ROLE_GROUPS,
        selectedRoleGroup,
        filteredServices, // Dữ liệu bảng đã grouped
        roleLabel: selectedRoleGroup.label,

        // Search
        serviceSearch,
        setServiceSearch,

        // Role Selection
        setSelectedRoleGroup,

        // Modal & Editing
        isEditModalOpen,
        setIsEditModalOpen,
        editingItem,
        setEditingItem,

        // Actions
        openEditModal,
        updateEditingValue,
        handleSaveCommission,
        handleUpdateSystem
    };
};