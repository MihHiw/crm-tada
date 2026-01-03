export const REPORT_STATS = [
    { label: 'Tổng doanh thu', value: '$1,250,000', trend: '+12%', color: 'text-blue-500' },
    { label: 'Lợi nhuận ròng', value: '$850,000', trend: '+8%', color: 'text-emerald-500' },
    { label: 'Chi phí thu hút khách', value: '$150', trend: '-5%', color: 'text-orange-500' },
    { label: 'Tỷ lệ rời bỏ', value: '2.4%', trend: '-0.2%', color: 'text-purple-500' },
];

export const REVENUE_CHART_DATA = [
    { month: 'Jan', revenue: 450000 }, { month: 'Feb', revenue: 520000 },
    { month: 'Mar', revenue: 480000 }, { month: 'Apr', revenue: 610000 },
    { month: 'May', revenue: 550000 }, { month: 'Jun', revenue: 670000 },
    { month: 'Jul', revenue: 420000 }, { month: 'Aug', revenue: 580000 },
    { month: 'Sep', revenue: 710000 }, { month: 'Oct', revenue: 630000 },
    { month: 'Nov', revenue: 850000 }, { month: 'Dec', revenue: 790000 },
];

export const REVENUE_ALLOCATION = [
    { label: 'Tư vấn', percent: 45, color: 'bg-blue-500' },
    { label: 'Đầu tư', percent: 30, color: 'bg-orange-500' },
    { label: 'Bảo hiểm', percent: 15, color: 'bg-emerald-500' },
    { label: 'Tín dụng', percent: 10, color: 'bg-purple-500' },
];

export const QUICK_REPORT_TEMPLATES = [
    {
        id: '1',
        title: 'Báo cáo doanh thu tháng',
        desc: 'Tổng hợp doanh thu, chi phí và lợi nhuận ròng.',
        iconColor: 'text-blue-500'
    },
    {
        id: '2',
        title: 'Báo cáo thuế',
        desc: 'Chuẩn bị dữ liệu cho việc kê khai thuế hàng quý.',
        iconColor: 'text-emerald-500'
    },
    {
        id: '3',
        title: 'Hiệu suất nhân viên',
        desc: 'Phân tích KPI và doanh số của từng nhân sự.',
        iconColor: 'text-orange-500'
    },
];