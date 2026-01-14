import { Service } from '@/types/types';

export const mockServices: Service[] = [
    {
        id: 'srv-01',
        category_id: 1,
        name: 'Lấy nhân mụn chuẩn y khoa',
        description: 'Quy trình 12 bước, không sưng đỏ.',
        price: 3500000,
        duration_minutes: 60,
        is_active: true,
        image_url: 'https://placehold.co/600x400?text=Mun',
    },
    {
        id: 'srv-02',
        category_id: 1,
        name: 'Cấy tảo xoắn Nano',
        description: 'Giúp da căng bóng, sáng mịn.',
        price: 5000000,
        duration_minutes: 75,
        is_active: true,
        image_url: 'https://placehold.co/600x400?text=Tao',
    },
    {
        id: 'srv-03',
        category_id: 2,
        name: 'Massage Body đá nóng',
        description: 'Thư giãn cơ, đả thông kinh lạc.',
        price: 4500000,
        duration_minutes: 90,
        is_active: true,
        image_url: 'https://placehold.co/600x400?text=Body',
    },
];
