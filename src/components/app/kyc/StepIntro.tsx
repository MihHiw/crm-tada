// components/kyc/StepIntro.tsx
"use client";

import { ArrowRight, Award, CheckCircle2, CreditCard } from "lucide-react";
// Đã xóa import useRouter vì nút Back giờ nằm ở Header chung

interface Props {
    onNext: () => void;
}

export default function StepIntro({ onNext }: Props) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            {/* --- PHẦN NỘI DUNG --- */}
            <div className="flex-1">
                <div className="mb-8 text-center">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 text-slate-900">
                        Yêu cầu xác thực nâng cao
                    </h2>
                    <p className="text-slate-500 text-sm md:text-base max-w-xs mx-auto">
                        Để đảm bảo bảo mật tối đa, chúng tôi cần xác thực 02 loại giấy tờ của bạn.
                    </p>
                </div>

                {/* Danh sách giấy tờ */}
                <div className="space-y-4 mb-8">
                    {/* Card 1: CCCD */}
                    <div className="group flex items-center p-4 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 hover:shadow-md transition-all duration-300 cursor-default">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                            <CreditCard size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 text-base">1. Căn cước công dân</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Gắn chip, còn hạn sử dụng</p>
                        </div>
                        <CheckCircle2 className="text-blue-600 w-5 h-5" />
                    </div>

                    {/* Card 2: Bằng lái */}
                    <div className="group flex items-center p-4 rounded-2xl border border-orange-100 bg-orange-50/50 hover:bg-orange-50 hover:shadow-md transition-all duration-300 cursor-default">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Award size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 text-base">2. Bằng lái xe</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Thẻ nhựa PET cứng</p>
                        </div>
                        <CheckCircle2 className="text-orange-600 w-5 h-5" />
                    </div>
                </div>

                <div className="bg-slate-100/80 p-4 rounded-xl mb-6">
                    <p className="text-xs md:text-sm text-slate-600 text-center leading-relaxed">
                        ⏳ Thời gian ước tính: <strong>2-3 phút</strong>.<br />
                        Vui lòng chuẩn bị sẵn giấy tờ và đảm bảo đủ ánh sáng.
                    </p>
                </div>
            </div>

            {/* --- PHẦN NÚT BẤM (Footer) --- */}
            <div className="mt-auto md:mt-0">
                <button
                    onClick={onNext}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98]"
                >
                    Bắt đầu ngay <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}