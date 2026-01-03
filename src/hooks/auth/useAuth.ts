import { MOCK_USERS } from '@/mocks/user';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useAuth = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const login = async (email: string, pass: string) => {
        setLoading(true);
        setError('');

        try {
            // Mô phỏng gọi API
            const user = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const foundUser = MOCK_USERS.find(
                        (u) => u.email === email && u.password === pass
                    );
                    if (foundUser) resolve(foundUser);
                    else reject(new Error("Email hoặc mật khẩu không chính xác!"));
                }, 1500);
            }) as any;

            localStorage.setItem('user_session', JSON.stringify(user));

            // Phân quyền điều hướng
            if (user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/app');
            }

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
        router.push('/login');
    };

    return { login, logout, loading, error };
};