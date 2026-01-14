// Định nghĩa kiểu dữ liệu chi tiết cho từng sản phẩm vay
interface LoanProduct {
    id: string;
    name: string;
    category: string;
    icon: string;
    loanAmount: number;
    remainingAmount: number;
    loanDate: string;
    profit: string;
    isPaid: boolean;
    statusLabel: string;
}

interface Address {
    region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
    province: string; // Tỉnh/Thành phố trực thuộc TW
    city?: string;    // Quận/Huyện/Thành phố thuộc tỉnh
    detail: string;   // Số nhà, tên đường, phường/xã
}

interface Customer {
    id: string;
    loanCode: string;
    name: string;
    role: string;
    status: string;
    joinedDate: string;
    createdAt: string;
    isVip: boolean;
    avatar: string;
    phone: string;
    email: string;
    metrics: {
        totalLoan?: string;
        currentDebt?: string;
        creditScore: string;
    };
    products: LoanProduct[];
    address: Address;
}

export const formatCurrency = (amount: number): string => {
    if (amount >= 1000000000) {
        return `${(amount / 1000000000).toFixed(1)} Tỷ đ`;
    }
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(0)} Triệu đ`;
    }
    return `${amount.toLocaleString('vi-VN')} đ`;
};

const RAW_CUSTOMERS_DATA: Customer[] = [
    {
        id: '88231',
        loanCode: 'HS-99281',
        name: 'Nguyễn Văn A',
        role: 'Khách hàng (User)',
        status: 'Active',
        joinedDate: '12/2021',
        createdAt: '20/05/2024',
        isVip: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        phone: '0909 123 456',
        email: 'vana.01@gmail.com',
        address: {
            region: 'Miền Nam',
            province: 'Bình Dương',
            city: 'Thành phố Thủ Dầu Một',
            detail: 'Đường Phú Lợi, Phường Phú Hòa'
        },
        metrics: { creditScore: '780/850' },
        products: [
            {
                id: 'p1',
                name: 'Vay mua xe',
                category: 'Giải ngân 100%',
                icon: '🚗',
                loanAmount: 1500000000,
                remainingAmount: 0,
                loanDate: '15/01/2024',
                isPaid: true,
                statusLabel: 'Hoàn thành',
                profit: 'Lãi 8%/năm'
            },
            {
                id: 'p2',
                name: 'Thẻ tín dụng Platinum',
                category: 'Hạn mức 200Tr',
                icon: '💳',
                loanAmount: 200000000,
                remainingAmount: 12000000,
                loanDate: '10/02/2025',
                isPaid: false,
                statusLabel: 'Đang trả góp',
                profit: 'Dư nợ: 12Tr'
            }
        ]
    },
    {
        id: '88233',
        loanCode: 'HS-99283',
        name: 'Lê Văn C',
        role: 'Khách hàng (User)',
        status: 'Active',
        joinedDate: '03/2023',
        createdAt: '20/05/2024',
        isVip: true,
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
        phone: '0988 777 888',
        email: 'vanc.biz@gmail.com',
        address: {
            region: 'Miền Trung',
            province: 'Đà Nẵng',
            city: 'Quận Hải Châu',
            detail: '155 Phan Chu Trinh'
        },
        metrics: { creditScore: '810/850' },
        products: [
            {
                id: 'p3',
                name: 'Vay sản xuất',
                category: 'Giải ngân 100%',
                icon: '🏭',
                loanAmount: 3500000000,
                remainingAmount: 2100000000,
                loanDate: '20/05/2024',
                isPaid: false,
                statusLabel: 'Đang lưu hành',
                profit: 'Lãi 9.5%/năm'
            }
        ]
    },
    {
        id: '88234',
        loanCode: 'HS-99284',
        name: 'Phạm Thị D',
        role: 'Khách hàng (User)',
        status: 'Active',
        joinedDate: '08/2024',
        createdAt: '01/09/2024',
        isVip: false,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        phone: '0933 111 222',
        email: 'thid.pham@gmail.com',
        address: {
            region: 'Miền Bắc',
            province: 'Hà Nội',
            city: 'Quận Cầu Giấy',
            detail: 'Số 12, Ngõ 45, Đường Trần Thái Tông'
        },
        metrics: { creditScore: '690/850' },
        products: [
            {
                id: 'p4',
                name: 'Vay tiêu dùng',
                category: 'Giải ngân 100%',
                icon: '🛍️',
                loanAmount: 50000000,
                remainingAmount: 0,
                loanDate: '01/09/2024',
                isPaid: true,
                statusLabel: 'Hoàn thành',
                profit: 'Lãi 12%/năm'
            },
            {
                id: 'p5',
                name: 'Vay thấu chi',
                category: 'Hạn mức 30Tr',
                icon: '💸',
                loanAmount: 30000000,
                remainingAmount: 15000000,
                loanDate: '15/03/2025',
                isPaid: false,
                statusLabel: 'Đang trả góp',
                profit: 'Dư nợ: 15Tr'
            }
        ]
    },
    {
        id: '88235',
        loanCode: 'HS-99285',
        name: 'Hoàng Văn E',
        role: 'Khách hàng (User)',
        status: 'Active',
        joinedDate: '01/2022',
        createdAt: '05/05/2026',
        isVip: false,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        phone: '0977 444 555',
        email: 'vane.bad@gmail.com',
        address: {
            region: 'Miền Nam',
            province: 'TP. Hồ Chí Minh',
            city: 'Quận 1',
            detail: 'Tòa nhà Bitexco, số 2 Hải Triều'
        },
        metrics: { creditScore: '450/850' },
        products: [
            {
                id: 'p6',
                name: 'Vay tín chấp',
                category: 'Giải ngân 100%',
                icon: '⚠️',
                loanAmount: 100000000,
                remainingAmount: 85000000,
                loanDate: '10/05/2026',
                isPaid: false,
                statusLabel: 'Quá hạn 30 ngày',
                profit: 'Lãi phạt 15%'
            }
        ]
    }
];

export const CUSTOMERS_DATA = RAW_CUSTOMERS_DATA.map(customer => {
    const totalLoan = customer.products.reduce((sum, p) => sum + p.loanAmount, 0);
    const currentDebt = customer.products.reduce((sum, p) => sum + p.remainingAmount, 0);

    return {
        ...customer,
        metrics: {
            ...customer.metrics,
            totalLoan: formatCurrency(totalLoan),
            currentDebt: formatCurrency(currentDebt)
        }
    };
});