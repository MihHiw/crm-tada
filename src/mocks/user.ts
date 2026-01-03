// 1. Định nghĩa kiểu dữ liệu User mở rộng
export interface User {
    id: string;
    email: string;
    name: string;     
    fullName: string;   
    phone: string;    
    role: 'admin' | 'user';
    avatar?: string;
}

// 2. Danh sách người dùng để kiểm tra
export const MOCK_USERS: (User & { password: string })[] = [
    {
        id: '1',
        email: 'admin@tada.com',
        password: '123',
        name: 'Quản trị viên',
        fullName: 'Trần Văn Tú',
        phone: '0988 123 456',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
    },
    {
        id: '2',
        email: 'user@tada.com',
        password: '123',
        name: 'Người dùng mẫu',
        fullName: 'Nguyễn Thị Mẫu',
        phone: '0912 345 678',
        role: 'user',
    }
];