/**
 * Chuyển đổi số (number) sang chuỗi hiển thị (string) Tiếng Việt
 * Ví dụ: 1500000000 -> 1.5 Tỷ đ
 */
export const formatCurrency = (amount: number): string => {
    if (amount >= 1000000000) {
        return `${(amount / 1000000000).toFixed(1)} Tỷ đ`;
    }
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(0)} Triệu đ`;
    }
    return `${amount.toLocaleString('vi-VN')} đ`;
};