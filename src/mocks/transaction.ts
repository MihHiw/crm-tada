export const TRANSACTION_MOCK = [
    { id: 'TRX-9823', date: '24/10/2023', time: '10:30 AM', customer: 'Nguyễn Văn A', customerId: 'KH-00129', type: 'Rút tiền', amount: -50000000, status: 'Hoàn thành' },
    { id: 'TRX-9824', date: '24/10/2023', time: '09:15 AM', customer: 'Trần Thị B', customerId: 'KH-00342', type: 'Nạp tiền', amount: 120000000, status: 'Chờ xử lý' },
    { id: 'TRX-9825', date: '23/10/2023', time: '16:45 PM', customer: 'Lê Văn C', customerId: 'KH-00101', type: 'Chuyển khoản', amount: -12500000, status: 'Thất bại' },
    { id: 'TRX-9826', date: '23/10/2023', time: '14:20 PM', customer: 'Phạm Minh D', customerId: 'KH-00566', type: 'Nạp tiền', amount: 5000000, status: 'Hoàn thành' },
    { id: 'TRX-9827', date: '22/10/2023', time: '08:00 AM', customer: 'Vũ Thị E', customerId: 'KH-00881', type: 'Thanh toán', amount: -2300000, status: 'Hoàn thành' },
];

export const TRANSACTION_STATS = [
    { label: 'Tổng giao dịch', value: '1,240', trend: '+5%', color: 'text-blue-500' },
    { label: 'Tổng giá trị', value: '4.2 tỷ đ', trend: '+12%', color: 'text-green-500' },
    { label: 'Chờ xử lý', value: '12', trend: '-2%', color: 'text-yellow-500' },
    { label: 'Hoàn thành hôm nay', value: '45', trend: '+8%', color: 'text-emerald-500' },
];