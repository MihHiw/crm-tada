// components/kyc/StepFaceScan.tsx
import { ScanFace } from "lucide-react";

interface Props {
    onFinish: () => void;
}

export default function StepFaceScan({ onFinish }: Props) {
    return (
        <div className="text-center pt-8 animate-in zoom-in duration-300">
            <div className="relative w-56 h-56 mx-auto mb-8">
                {/* Vòng tròn lan tỏa */}
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
                <div className="absolute inset-4 border-4 border-blue-100 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40 animation-delay-500"></div>

                {/* Khung chính */}
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-600 relative bg-slate-50 flex items-center justify-center shadow-xl">
                    <ScanFace className="w-24 h-24 text-slate-300" />

                    {/* Thanh quét ngang */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-400 shadow-[0_0_20px_rgba(74,222,128,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-2 text-slate-900">Xác thực khuôn mặt</h3>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                Giữ điện thoại ngang tầm mắt. Không đeo kính râm hoặc khẩu trang.
            </p>

            <button
                onClick={onFinish}
                className="w-full bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
                Bắt đầu quét
            </button>
        </div>
    )
}