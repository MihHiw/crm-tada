import { useEffect, useRef, useState } from 'react';

export function useHeaderVisibility(threshold: number = 50): boolean {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    // Định nghĩa kiểu number cho useRef
    const lastScrollY = useRef<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            // Kiểm tra window có tồn tại không (cho Next.js/SSR)
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;

                // Logic so sánh
                if (currentScrollY > lastScrollY.current && currentScrollY > threshold) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }

                lastScrollY.current = currentScrollY;
            }
        };

        // Thêm { passive: true } để tối ưu hiệu năng cuộn trên trình duyệt hiện đại
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return isVisible;
}