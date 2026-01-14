import { useMemo, useState } from 'react';

// Interface cho Service
export interface Service {
    _id: string;
    id?: string;
    name: string;
    price: number;
    duration_min: number;
    category_id?: string;
    description?: string;
}

export const useServiceFilter = (services: Service[] = []) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const filteredServices = useMemo(() => {
        if (!services) return [];

        return services.filter((service) => {
            // --- A. Logic lọc theo Search Term (Tìm theo tên) ---
            const matchesSearch = service.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            // --- B. Logic lọc theo Category ---
            let matchesCategory = true;
            if (selectedCategory !== 'all') {
                const categoryMap: Record<string, string> = {
                    'cat_botox': 'botox',
                    'cat_filler': 'filler',
                    'cat_hifu': 'hifu',
                    'cat_laser': 'laser'
                };

                const targetKeyword = categoryMap[selectedCategory];

                // Khớp nếu category_id trùng hoặc tên dịch vụ chứa từ khóa của danh mục đó
                matchesCategory =
                    service.category_id === selectedCategory ||
                    service.name.toLowerCase().includes(targetKeyword);
            }

            // Kết quả là phải thỏa mãn cả hai điều kiện
            return matchesSearch && matchesCategory;
        });
    }, [services, selectedCategory, searchTerm]); // Thêm searchTerm vào dependencies

    // 3. Trả về thêm searchTerm và setSearchTerm
    return {
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        filteredServices
    };
};