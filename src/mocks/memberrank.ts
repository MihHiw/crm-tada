import { MemberRank } from '@/types/types';

export const mockMemberRanks: MemberRank[] = [
    { id: 1, name: 'Thành viên mới', min_spend: 0, discount_percent: 0, icon_url: '/icons/bronze.png' },
    { id: 2, name: 'Bạc (Silver)', min_spend: 5000000, discount_percent: 5, icon_url: '/icons/silver.png' },
    { id: 3, name: 'Vàng (Gold)', min_spend: 15000000, discount_percent: 10, icon_url: '/icons/gold.png' },
    { id: 4, name: 'Kim Cương (Diamond)', min_spend: 50000000, discount_percent: 15, icon_url: '/icons/diamond.png' },
];
