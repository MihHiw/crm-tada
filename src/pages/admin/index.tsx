"use client";
import Sidebar from '@/components/admin/Sidebar';
import { Award, Rocket, ShieldCheck, Target, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function AboutTadaPage() {
    const [admin] = useState({ name: "Quản trị viên", role: "admin" });

    return (
        <div className="flex min-h-screen bg-[#0B0F1A]">
            {/* 1. Sidebar duy trì tính đồng bộ hệ thống */}
            <Sidebar adminName={admin.name} />

            <main className="flex-1 overflow-y-auto">
                {/* Hero Section - Giới thiệu tổng quan */}
                <section className="relative h-[400px] flex items-center justify-center overflow-hidden border-b border-gray-800">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <Image
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c"
                            alt="Tada Office"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="relative z-10 text-center px-6">
                        <h1 className="text-5xl font-extrabold text-white tracking-tighter mb-4">TADA GROUP</h1>
                        <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-sm">Kiến tạo tương lai tài chính số</p>
                        <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
                    </div>
                </section>

                <div className="max-w-6xl mx-auto p-8 space-y-12">
                    {/* Tầm nhìn & Sứ mệnh */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#161D2F] p-10 rounded-[40px] border border-gray-800 text-left">
                            <Target className="text-blue-500 mb-6" size={40} />
                            <h2 className="text-2xl font-bold text-white mb-4">Tầm nhìn</h2>
                            <p className="text-gray-400 leading-relaxed">
                                Trở thành tập đoàn công nghệ tài chính hàng đầu khu vực, tiên phong trong việc cung cấp các giải pháp quản trị thông minh và bền vững cho mọi doanh nghiệp.
                            </p>
                        </div>
                        <div className="bg-[#161D2F] p-10 rounded-[40px] border border-gray-800 text-left">
                            <Rocket className="text-emerald-500 mb-6" size={40} />
                            <h2 className="text-2xl font-bold text-white mb-4">Sứ mệnh</h2>
                            <p className="text-gray-400 leading-relaxed">
                                Tối ưu hóa hiệu quả vận hành và dòng tiền của khách hàng thông qua nền tảng công nghệ CRM đột phá, minh bạch và an toàn tuyệt đối.
                            </p>
                        </div>
                    </div>

                    {/* Giá trị cốt lõi */}
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white">Giá trị cốt lõi</h2>
                            <p className="text-gray-500 mt-2 text-sm italic">Những nguyên tắc vàng tạo nên thương hiệu Tada</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: ShieldCheck, title: "Tin cậy", desc: "Bảo mật và minh bạch dữ liệu là ưu tiên số một.", color: "text-blue-500" },
                                { icon: Users, title: "Khách hàng", desc: "Luôn đặt lợi ích khách hàng làm trọng tâm phát triển.", color: "text-purple-500" },
                                { icon: Award, title: "Sáng tạo", desc: "Không ngừng cải tiến để mang lại giá trị đột phá.", color: "text-orange-500" }
                            ].map((val, i) => (
                                <div key={i} className="bg-[#161D2F] p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all text-left">
                                    <val.icon className={`${val.color} mb-4`} size={32} />
                                    <h3 className="text-white font-bold mb-2">{val.title}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Content */}
                    <div className="bg-gradient-to-r from-blue-600/10 to-transparent p-12 rounded-[48px] border border-blue-500/20 text-left relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-xl">
                                <h2 className="text-2xl font-bold text-white mb-4">Sẵn sàng đồng hành cùng Tada?</h2>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Được thành lập từ năm 2020, Tada Group đã hỗ trợ hơn 1.000 doanh nghiệp trong việc chuyển đổi số và quản trị tài chính tập trung.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-center px-6">
                                    <p className="text-3xl font-bold text-white">50+</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1 text-center">Chuyên gia</p>
                                </div>
                                <div className="w-[1px] h-12 bg-gray-800"></div>
                                <div className="text-center px-6">
                                    <p className="text-3xl font-bold text-white">24/7</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1 text-center">Hỗ trợ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}