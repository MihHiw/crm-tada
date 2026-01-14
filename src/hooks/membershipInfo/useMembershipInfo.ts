import { useMemo } from 'react';

interface ApiRank {
    id: string;
    name: string;
    discount: number;
    color: string;
    min_point: number;
}

interface ApiMembership {
    card_number: string;
    rank: ApiRank;
    points: number;
    expiry_date: string;
}
export const useMembershipInfo = (membership: ApiMembership | null | undefined) => {
    return useMemo(() => {
        const currentRank = membership?.rank;
        const points = membership?.points || 0;

        // Giả sử mốc điểm tiếp theo là 10000 hoặc tùy chỉnh theo hạng
        const nextTierPoints = 10000;
        const progress = Math.min((points / nextTierPoints) * 100, 100);

        return {
            rankName: currentRank?.name || "Thành viên",
            rankColor: currentRank?.color || "#94a3b8",
            points,
            cardNumber: membership?.card_number || "N/A",
            expiryDate: membership?.expiry_date || "Chưa cập nhật",
            discount: currentRank?.discount || 0,
            progress
        };
    }, [membership]);
};