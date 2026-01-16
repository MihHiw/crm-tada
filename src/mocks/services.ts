import { Service } from '@/types/types';

export const mockServices: Service[] = [
    {
        id: 'prod-01',
        category_id: 1, // Ví dụ: 1 = Web Development / AI Solutions
        name: 'AI Landing Page',
        description: 'Phí setup $500/lần + $0.05/request (Free <100 req/tháng). Năng lực triển khai: 10 page/tháng.',
        price: 500, // Giá setup cơ bản ($)
        duration_minutes: 0, 
        is_active: true,
        image_url: 'https://placehold.co/600x400?text=AI+Landing+Page',
    },
    {
        id: 'prod-02',
        category_id: 2, // Ví dụ: 2 = Marketing Tools
        name: 'Referral System',
        description: 'Tăng tỷ lệ khách giới thiệu. $100/1k khách - $300/10k khách. Xóa quảng cáo: $0.1/active user. Năng lực: 200 DN/tháng.',
        price: 100, // Giá gói khởi điểm ($)
        duration_minutes: 0,
        is_active: true,
        image_url: 'https://placehold.co/600x400?text=Referral+System',
    },
    {
        id: 'prod-03',
        category_id: 2, 
        name: 'No Paid Ads Marketing System',
        description: 'Hệ thống Marketing không quảng cáo trả phí. $20/acc/tháng (yêu cầu mua tối thiểu 5 acc).',
        price: 100, // $20 * 5 acc = $100 (Giá trị đơn hàng tối thiểu)
        duration_minutes: 0,
        is_active: true,
        image_url: 'https://placehold.co/600x400?text=No+Paid+Ads',
    },
];