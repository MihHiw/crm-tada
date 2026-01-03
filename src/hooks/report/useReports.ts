"use client";
import { REPORT_STATS, REVENUE_CHART_DATA } from '@/mocks/report';
import { useMemo, useState } from 'react';

// Bỏ icon khỏi interface này để không còn lỗi Incompatible
interface StatItem {
    label: string;
    value: string;
    trend: string;
    color: string;
}

export function useReports() {
    const [timeRange, setTimeRange] = useState('30 ngày qua');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    // Xử lý stats: Chỉ lấy các thuộc tính text/color, bỏ qua icon từ Mock nếu có
    const stats = useMemo(() => {
        return REPORT_STATS.map(({ label, value, trend, color }) => ({
            label, value, trend, color
        })) as StatItem[];
    }, []);

    const chartData = useMemo(() => REVENUE_CHART_DATA, []);

    const openReportModal = (template: any) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const closeReportModal = () => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
    };

    const handleCreateReport = (formData: any) => {
        console.log("Dữ liệu báo cáo mới:", formData);
        alert(`Đang khởi tạo: ${selectedTemplate?.title}`);
        closeReportModal();
    };

    const exportData = () => {
        console.log("Đang xuất dữ liệu báo cáo cho khoảng thời gian:", timeRange);
    };

    return {
        timeRange,
        setTimeRange,
        stats,
        chartData,
        isModalOpen,
        selectedTemplate,
        openReportModal,
        closeReportModal,
        handleCreateReport,
        exportData
    };
}