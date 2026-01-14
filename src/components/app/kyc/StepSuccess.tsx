// components/kyc/StepSuccess.tsx
import { CheckCircle2 } from "lucide-react";
import router from "next/router";

export default function StepSuccess() {
    return (
        <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-500 py-10">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Gửi hồ sơ thành công!</h2>
            <p className="text-slate-500 text-center max-w-xs mb-8">
                Hệ thống đang đối chiếu thông tin bạn nhập với hình ảnh giấy tờ. Chúng tôi sẽ thông báo kết quả sớm nhất.
            </p>
            <button
                onClick={() => router.push('/app')}
                className="w-full bg-slate-100 text-slate-900 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
            >
                Quay về trang chủ
            </button>
        </div>
    );
}