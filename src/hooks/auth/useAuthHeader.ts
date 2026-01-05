"use client";
import { MOCK_USERS, User } from '@/mocks/user'; // Đảm bảo import cả Interface User
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useAuthHeader = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null); // Lưu thông tin user hiện tại
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Tự động lấy user từ localStorage khi load trang
    useEffect(() => {
        const session = localStorage.getItem('user_session');
        if (session) {
            setUser(JSON.parse(session));
        }
    }, []);

    const login = async (email: string, pass: string) => {
        setLoading(true);
        setError('');

        try {
            const foundUser = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const match = MOCK_USERS.find(
                        (u) => u.email === email && u.password === pass
                    );
                    if (match) resolve(match);
                    else reject(new Error("Email hoặc mật khẩu không chính xác!"));
                }, 1500);
            }) as any;

            // Lưu vào localStorage
            localStorage.setItem('user_session', JSON.stringify(foundUser));

            // Cập nhật State để UI thay đổi ngay lập tức
            setUser(foundUser);

            if (foundUser.role === 'admin') router.push('/admin');
            else router.push('/app');

            return { success: true };
        } catch (err: any) {
            const msg = err.message || "Đã xảy ra lỗi ngoài ý muốn.";
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('user_session');
        setUser(null);
        router.push('/login');
    };

    // Trả thêm biến 'user' ra ngoài
    return { user, login, logout, loading, error };
};