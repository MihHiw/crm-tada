// components/kyc/StepProcessing.tsx
import { ScanFace } from "lucide-react";

export default function StepProcessing() {
    return (
        <div className="flex flex-col items-center justify-center pt-20 animate-in fade-in duration-700">
            <div className="relative mb-8">
                {/* Vòng xoay ngoài */}
                <div className="w-24 h-24 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                {/* Icon ở giữa */}
                <ScanFace className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-8 h-8 animate-pulse" />
            </div>

            <h3 className="text-xl font-bold text-slate-800">Đang xử lý dữ liệu AI...</h3>
            <p className="text-slate-500 mt-2 text-center max-w-xs text-sm">
                Hệ thống đang trích xuất thông tin từ ảnh chụp của bạn. Vui lòng không tắt trình duyệt.
            </p>
        </div>
    )
}