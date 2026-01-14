// components/kyc/StepInputForm.tsx
"use client";
import { UserInfo } from "@/styles/types"; // Nhớ sửa đường dẫn đúng với project của bạn
import { ArrowRight, Award, Calendar, Hash, MapPin, User } from "lucide-react";

interface Props {
    userInfo: UserInfo;
    setUserInfo: (info: UserInfo) => void;
    onNext: () => void;
}

// Input Field Component
const InputField = ({ label, value, icon: Icon, onChange, placeholder }: any) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Icon size={18} />
            </div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
            />
        </div>
    </div>
);

export default function StepInputForm({ userInfo, setUserInfo, onNext }: Props) {
    return (
        <div className="animate-in slide-in-from-bottom-8 duration-500 pb-20">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Thông tin cá nhân</h2>
                <p className="text-slate-500 text-sm">Vui lòng điền chính xác thông tin trên giấy tờ của bạn.</p>
            </div>

            <div className="space-y-5 bg-white">
                <InputField
                    label="Họ và tên"
                    value={userInfo.fullName} icon={User}
                    placeholder="VD: NGUYEN VAN A"
                    onChange={(e: any) => setUserInfo({ ...userInfo, fullName: e.target.value.toUpperCase() })}
                />
                <InputField
                    label="Số CCCD/CMND"
                    value={userInfo.idNumber} icon={Hash}
                    placeholder="12 chữ số"
                    onChange={(e: any) => setUserInfo({ ...userInfo, idNumber: e.target.value })}
                />
                <InputField
                    label="Số Giấy phép lái xe"
                    value={userInfo.licenseNumber} icon={Award}
                    placeholder="Số trên bằng lái PET"
                    onChange={(e: any) => setUserInfo({ ...userInfo, licenseNumber: e.target.value })}
                />
                <InputField
                    label="Ngày sinh"
                    value={userInfo.dob} icon={Calendar}
                    placeholder="DD/MM/YYYY"
                    onChange={(e: any) => setUserInfo({ ...userInfo, dob: e.target.value })}
                />
                <InputField
                    label="Địa chỉ thường trú"
                    value={userInfo.address} icon={MapPin}
                    placeholder="Theo trên CCCD"
                    onChange={(e: any) => setUserInfo({ ...userInfo, address: e.target.value })}
                />
            </div>

            {/* Nút Tiếp tục */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 z-20 md:absolute md:rounded-b-[2rem]">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={onNext}
                        // Kiểm tra đơn giản: Nếu chưa điền tên hoặc số CCCD thì disable
                        disabled={!userInfo.fullName || !userInfo.idNumber}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all"
                    >
                        Tiếp tục chụp ảnh <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}