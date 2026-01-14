import {
    mockCategories,
    mockServicePackages,
    mockServices
} from '@/mocks';
import { useCallback, useEffect, useMemo, useState } from 'react';


export interface BookingBox {
    id: string;
    name: string;
    sessions: number;
    price: number;
    discountPercent: number;
}

export interface ServiceUI {
    id: string;
    _id: string; // [NEW] Thêm field này để tương thích logic cũ
    name: string;
    categoryId: string | number;
    categoryName: string;
    price: number;
    currency: string;

    durationMin: number;      // Style mới (CamelCase)
    duration_min: number;     // [NEW] Style cũ (Snake_case) để tương thích

    description: string;
    imageUrl: string;
    rating: number;
    applicableBoxes: BookingBox[];
}

export interface CategoryUI {
    id: string | number;
    name: string;
    slug?: string;
}

// --- 2. HOOK ---

export const useServicesData = () => {
    const [allServices, setAllServices] = useState<ServiceUI[]>([]);
    const [categories, setCategories] = useState<CategoryUI[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string | number>('all');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 600));

            // 1. Map Categories
            setCategories(mockCategories);

            // 2. Map Services & Join Data
            const mappedServices: ServiceUI[] = mockServices.map(service => {
                const category = mockCategories.find(c => c.id === service.category_id);
                const packages = mockServicePackages.filter(p => p.service_id === service.id);

                const boxes: BookingBox[] = packages.map(pkg => ({
                    id: pkg.id,
                    name: pkg.name,
                    sessions: pkg.quantity,
                    price: pkg.price,
                    discountPercent: Math.round((1 - pkg.price / (service.price * pkg.quantity)) * 100) || 0
                }));

                return {
                    id: service.id,
                    _id: service.id, // [FIX] Map thêm _id

                    name: service.name,
                    categoryId: service.category_id,
                    categoryName: category?.name || 'Danh mục khác',
                    price: service.price,
                    currency: 'VND',

                    durationMin: service.duration_minutes,
                    duration_min: service.duration_minutes, // [FIX] Map thêm duration_min

                    description: service.description || '',
                    imageUrl: service.image_url || 'https://placehold.co/400x300?text=Service',
                    rating: 5.0,
                    applicableBoxes: boxes
                };
            });

            setAllServices(mappedServices);

        } catch (err) {
            console.error("Lỗi tải dữ liệu dịch vụ:", err);
            const errorMessage = err instanceof Error ? err.message : "Đã có lỗi xảy ra khi tải dữ liệu";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 3. Logic lọc
    const filteredServices = useMemo(() => {
        if (selectedCategory === 'all') {
            return allServices;
        }
        return allServices.filter(s => s.categoryId == selectedCategory);
    }, [allServices, selectedCategory]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const filterServices = (categoryId: string | number) => {
        setSelectedCategory(categoryId);
    };

    return {
        services: filteredServices,
        categories,
        selectedCategory,
        isLoading,
        error,
        filterServices,
        refetch: loadInitialData
    };
};