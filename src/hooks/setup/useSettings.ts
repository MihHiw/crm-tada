"use client";
import { MOCK_USERS, User } from '@/mocks/user';
import { useState } from 'react';

export function useSettings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    // State mới để quản lý việc ẩn/hiện cho từng trường mật khẩu
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Hàm chuyển đổi trạng thái ẩn/hiện
    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const user = MOCK_USERS.find(u => u.role === 'admin');
        if (user) {
            // Loại bỏ password để tránh cảnh báo biến không sử dụng
            return (({ password, ...userWithoutPassword }) => userWithoutPassword)(user);
        }
        return null;
    });

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        if (activeTab === 'security') {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                alert("Mật khẩu mới không khớp!");
                setIsSaving(false);
                return;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSaving(false);
        alert("Cập nhật thành công!");
    };

    return {
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        passwordData,
        setPasswordData,
        showPassword,           // Trả về để UI sử dụng
        togglePasswordVisibility, // Trả về để UI sử dụng
        isSaving,
        handleSaveProfile
    };
}