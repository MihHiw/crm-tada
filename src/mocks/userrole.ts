import { UserRole } from '@/types/types';

export const mockRoles: UserRole[] = [
    { id: 1, name: 'Admin', permissions: { all: true }, description: 'Quản trị viên hệ thống' },
    { id: 2, name: 'Manager', permissions: { manage_staff: true, view_reports: true }, description: 'Quản lý cửa hàng' },
    { id: 3, name: 'Staff', permissions: { view_schedule: true, update_booking: true }, description: 'Kỹ thuật viên / Nhân viên' },
    { id: 4, name: 'Customer', permissions: { book_appointment: true }, description: 'Khách hàng' },
];