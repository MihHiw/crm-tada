export const CUSTOMERS_DATA = [
    {
        id: '88231',
        name: 'Nguyễn Văn A',
        role: 'CEO, Tech Solutions Ltd.',
        status: 'Active',
        joinedDate: '12/2021', // Xuất hiện dưới tên khách hàng trong ảnh
        isVip: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        phone: '0909 123 456',
        email: 'vana@example.com',
        address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',

        // Chỉ số tài chính
        metrics: {
            aum: '5.2 Tỷ đ',
            creditScore: '780/850',
            riskTolerance: 'Cân bằng', // Khẩu vị rủi ro trong ảnh
            servicePackage: 'Premium'  // Gói dịch vụ trong ảnh
        },

        // Sản phẩm đang sử dụng (Dựa theo bảng trong ảnh)
        products: [
            {
                id: 'p1',
                name: 'Tiết kiệm Premium',
                category: 'Kỳ hạn 12 tháng',
                icon: '🏦', // Hoặc dùng component icon từ Lucide
                value: '2.000.000.000 đ',
                profit: '+7.2% / năm',
                status: 'Active',
                statusLabel: 'Đang hoạt động'
            },
            {
                id: 'p2',
                name: 'Quỹ đầu tư VinaCapital',
                category: 'Cổ phiếu',
                icon: '📈',
                value: '1.500.000.000 đ',
                profit: '+12.5%',
                status: 'Active',
                statusLabel: 'Đang hoạt động'
            },
            {
                id: 'p3',
                name: 'Visa Signature',
                category: 'Hạn mức: 500Tr',
                icon: '💳',
                value: '- 45.000.000 đ',
                profit: 'Hạn trả: 15/05',
                status: 'Warning',
                statusLabel: 'Đến hạn'
            }
        ]
    },
    {
        id: '88232',
        name: 'Trần Thị B',
        role: 'Founder, Fashion Group',
        status: 'Inactive',
        joinedDate: '05/2022',
        isVip: false,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        phone: '0912 345 678',
        email: 'thib@fashion.vn',
        address: '456 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
        metrics: {
            aum: '1.8 Tỷ đ',
            creditScore: '650/850',
            riskTolerance: 'An toàn',
            servicePackage: 'Standard'
        },
        products: [
            {
                id: 'p4',
                name: 'Vay kinh doanh',
                category: 'Lãi suất 8.5%',
                icon: '💼',
                value: '1.000.000.000 đ',
                profit: 'Dư nợ giảm dần',
                status: 'Active',
                statusLabel: 'Đang hoạt động'
            }
        ]
    },
];