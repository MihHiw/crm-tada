// src/app/app/identityverification/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// Import đúng theo cấu trúc thư mục của bạn
import KYCFlow from '@/components/app/kyc/KYCFlow';

export default function IdentityVerificationPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const session = typeof window !== 'undefined' ? localStorage.getItem('user_session') : null;

            if (!session) {
                router.push('/login');
            } else {
                setIsAuthorized(true);
            }
        };

        checkAuth();
    }, [router]);

    // Hiển thị màn hình Loading trong lúc đợi kiểm tra hoặc chuyển trang
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-slate-500 font-medium text-sm">Đang kiểm tra bảo mật...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <KYCFlow />
        </div>
    );
}