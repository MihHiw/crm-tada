import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import Head from 'next/head';
import React, { InputHTMLAttributes, useState } from 'react';

// --- INTERFACES ---
const MAP_LOCATION = "484A Nguyễn Thị Thập, Tân Quy, Quận 7, Thành phố Hồ Chí Minh";
const EMBE_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.953887010464!2d106.7024844!3d10.738038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f11dd8d16f5%3A0x69190a62228e49a8!2s484a%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Th%E1%BA%ADp%2C%20T%C3%A2n%20Quy%2C%20Qu%E1%BA%ADn%207!5e0!3m2!1svi!2s!4v1703900000000!5m2!1svi!2s";

interface ContactInfoItemProps {
    icon: React.ReactNode;
    title: string;
    content: React.ReactNode;
}

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}


const ContactPage = () => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { user, logout } = useAuthStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };


    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 leading-tight flex justify-center">
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header user={user} logout={logout} />
            </div>
            <Head>
                <title>Liên hệ - Vanilla Beauty</title>
            </Head>

            <div className="w-full md:max-w-none md:shadow-none bg-[#F8FAFC] min-h-screen relative pb-20 overflow-x-hidden flex flex-col mx-auto max-w-md shadow-2xl transition-all duration-300">

                {/* --- HEADER --- */}
                {/* Giải pháp: Bọc nút Back vào trong Container giới hạn max-width để nó "xích" vào trong */}
                <section className="relative pt-20 pb-10 text-center md:pt-32 md:pb-20 bg-white md:bg-transparent shrink-0">
                    <div className="max-w-6xl mx-auto px-6 relative">


                        <h1 className="text-3xl md:text-5xl font-bold text-[#5D4037] mb-4 tracking-tight">Liên Hệ Với Vanilla</h1>
                        <div className="w-16 h-1 bg-[#00AEEF] mx-auto rounded-full"></div>
                        <p className="mt-6 text-slate-500 max-w-xl mx-auto text-sm md:text-lg font-medium leading-relaxed">
                            Hãy để chúng tôi lắng nghe nhu cầu của bạn và giúp bạn tìm lại sự cân bằng trong cuộc sống.
                        </p>
                    </div>
                </section>

                {/* --- NỘI DUNG CHÍNH --- */}
                <main className="md:max-w-6xl md:mx-auto md:w-full px-6 py-8 md:py-16">
                    <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-start">

                        {/* Cột 1: Thông tin chi tiết & Bản đồ */}
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 tracking-tight">Thông Tin Chi Tiết</h2>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                    <ContactInfoItem
                                        icon={<MapPin size={20} />}
                                        title="Địa chỉ"
                                        content={MAP_LOCATION}
                                    />
                                    <ContactInfoItem
                                        icon={<Phone size={20} />}
                                        title="Hotline đặt lịch"
                                        content={<a href="tel:0899739739" className="hover:text-[#00AEEF] transition-colors">0899 739 739</a>}
                                    />
                                    <ContactInfoItem
                                        icon={<Mail size={20} />}
                                        title="Email hỗ trợ"
                                        content="vanilla.tadabiz@gmail.com"
                                    />
                                    <ContactInfoItem
                                        icon={<Clock size={20} />}
                                        title="Giờ làm việc"
                                        content="9:00 – 18:00 (Hàng ngày)"
                                    />
                                </div>
                            </div>

                            <div className="w-full h-80 md:h-[400px] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl transition-all">
                                <iframe
                                    title="Vanilla Spa Location"
                                    src={EMBE_URL}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                        {/* Cột 2: Form liên hệ */}
                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="mb-8">
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Gửi Lời Nhắn</h3>
                                        <p className="text-xs md:text-sm text-slate-400 italic">* Chúng tôi sẽ phản hồi bạn trong vòng 24 giờ làm việc.</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <FormInput label="Họ và tên" placeholder="Nguyễn Văn A" required />
                                        <FormInput label="Số điện thoại" type="tel" placeholder="090..." required />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dịch vụ quan tâm</label>
                                        <select className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] focus:outline-none cursor-pointer text-sm font-medium text-slate-700 transition-all">
                                            <option>Chăm sóc da mặt</option>
                                            <option>Massage Body</option>
                                            <option>Gội đầu dưỡng sinh</option>
                                            <option>Khác...</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Lời nhắn của bạn</label>
                                        <textarea rows={4} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] focus:outline-none transition-all text-sm font-medium text-slate-700" placeholder="Bạn muốn tư vấn thêm về điều gì?"></textarea>
                                    </div>

                                    <button type="submit" className="w-full bg-[#00AEEF] text-white py-4 md:py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 group shadow-lg shadow-blue-100 active:scale-95 hover:bg-[#0096ce] uppercase text-sm tracking-widest">
                                        Gửi Thông Tin
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                                        <MessageCircle size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">Cảm ơn bạn!</h3>
                                        <p className="text-slate-500 mt-2 font-medium">Lời nhắn đã được gửi thành công.<br />Vanilla Spa sẽ liên hệ lại sớm nhất.</p>
                                    </div>
                                    <button onClick={() => setSubmitted(false)} className="text-[#00AEEF] font-bold text-sm uppercase tracking-widest underline underline-offset-8 hover:text-blue-600 transition-colors">Gửi thêm tin nhắn</button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

/* --- COMPONENT CON VỚI TYPESCRIPT CHUẨN --- */

const ContactInfoItem = ({ icon, title, content }: ContactInfoItemProps) => (
    <div className="flex gap-4 group">
        <div className="w-12 h-12 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm border border-slate-100 text-[#00AEEF] group-hover:bg-[#00AEEF] group-hover:text-white transition-all duration-300">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
            <p className="text-sm md:text-base font-bold text-slate-700 leading-tight">{content}</p>
        </div>
    </div>
);

const FormInput = ({ label, ...props }: FormInputProps) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <input
            {...props}
            className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] focus:outline-none text-sm font-medium text-slate-700 transition-all placeholder:text-slate-300"
        />
    </div>
);

export default ContactPage;