import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { Gem, Leaf } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';



const VanillaSpa = () => {
    const { user, isAuthenticated, logout } = useAuthStore();




    if (!isAuthenticated || !user) {
        return null;
    }
    return (
        <div className="min-h-screenpx-20 pt-[72px] pb-[100px] bg-white font-sans text-slate-900 leading-tight">
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header user={user} logout={logout} />
            </div>
            <Head>
                <title>Về chúng tôi - Vanilla Beauty</title>
            </Head>

            <div className="w-full  md:max-w-none md:shadow-none bg-[#F8FAFC] min-h-screen relative  overflow-x-hidden flex flex-col mx-auto max-w-md shadow-2xl transition-all duration-300">

                {/* --- HEADER / HERO SECTION --- */}
                <section className="relative px-4 pt-6 pb-4 shrink-0 md:px-10 md:pt-10">

                    {/* Desktop: h-[500px] thay vì 600px để cân đối tầm nhìn */}
                    <div className="relative h-[350px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-xl transition-all">
                        <Image
                            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80"
                            alt="Không gian thư giãn tại Vanilla Spa"
                            fill
                            priority
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                            <span className="text-[#00AEEF] font-black text-xs md:text-sm tracking-[0.3em] uppercase mb-2">
                                Vanilla Spa
                            </span>
                            {/* Giảm md:text-6xl xuống md:text-5xl */}
                            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                Nơi vẻ đẹp <br /> thăng hoa
                            </h1>
                        </div>
                    </div>
                </section>

                {/* Giới hạn max-width 5xl (1024px) để chữ không bị dàn quá rộng */}
                <div className="md:max-w-5xl md:mx-auto md:w-full">

                    {/* --- CÂU CHUYỆN CỦA CHÚNG TÔI --- */}
                    <section className="px-6 py-8 md:py-16 md:px-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-[3px] bg-[#00AEEF] rounded-full"></div>
                            <span className="text-[#00AEEF] text-[10px] md:text-xs font-bold uppercase tracking-widest">Lịch sử</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 tracking-tight">Câu chuyện của chúng tôi</h2>
                        {/* Desktop: text-base (16px) là chuẩn nhất cho nội dung dài */}
                        <div className="space-y-4 text-slate-500 leading-relaxed text-sm md:text-base font-medium max-w-2xl">
                            <p>
                                Vanilla Spa được thành lập vào năm 2018 với mong muốn mang lại sự cân bằng giữa thể chất và tinh thần giữa cuộc sống đô thị bận rộn.
                            </p>
                            <p>
                                Chúng tôi tin rằng vẻ đẹp thực sự bắt nguồn từ sự thư thái bên trong. Mỗi liệu trình tại Vanilla đều được thiết kế tỉ mỉ để đánh thức mọi giác quan của bạn.
                            </p>
                        </div>
                    </section>

                    {/* --- SỨ MỆNH & GIÁ TRỊ --- */}
                    <section className="px-6 py-4 space-y-4 md:px-10 md:py-8">
                        <div className="mb-2">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Sứ mệnh & Giá trị</h2>
                            <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">
                                Những nguyên tắc cốt lõi định hình dịch vụ đẳng cấp.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-[#00AEEF]">
                                    <Leaf size={28} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-3">Sứ mệnh</h3>
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                                    Mang lại không gian thư giãn tuyệt đối và tái tạo năng lượng tích cực cho mọi khách hàng ghé thăm.
                                </p>
                            </div>

                            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-500">
                                    <Gem size={28} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-3">Giá trị</h3>
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                                    Tận tâm trong phục vụ, chuyên nghiệp trong kỹ thuật và cam kết sử dụng 100% sản phẩm tự nhiên.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* --- NGƯỜI SÁNG LẬP --- */}
                    <section className="px-6 py-10 md:py-16">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-center border border-slate-100 shadow-md relative overflow-hidden flex flex-col items-center md:flex-row md:text-left md:gap-10">
                            <div className="relative w-28 h-28 md:w-40 md:h-40 shrink-0 mb-5 md:mb-0">
                                <div className="absolute inset-0 rounded-full border-[3px] border-[#00AEEF] transform scale-110 border-dashed animate-[spin_15s_linear_infinite]"></div>
                                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <Image
                                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"
                                        alt="Chị Vân - Founder & CEO"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <div className="relative z-10 flex-1">
                                <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2 tracking-tight">Người sáng lập</h2>
                                <h3 className="text-xl font-black text-[#00AEEF]">Chị Vân</h3>
                                <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4">Founder & CEO</p>
                                <p className="italic text-slate-500 text-sm md:text-lg leading-relaxed font-medium">
                                    Tôi muốn Vanilla Spa không chỉ là nơi làm đẹp, mà là ngôi nhà thứ hai để bạn tìm lại chính mình sau những bộn bề.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* --- THỐNG KÊ --- */}
                    <section className="px-10 py-8 md:py-12 flex justify-between items-center text-center max-w-3xl mx-auto">
                        <div>
                            <div className="text-2xl md:text-4xl font-black text-slate-800">5+</div>
                            <div className="text-[10px] md:text-xs uppercase text-slate-400 font-bold tracking-widest mt-2">Năm</div>
                        </div>
                        <div className="w-[1px] h-10 bg-slate-200"></div>
                        <div>
                            <div className="text-2xl md:text-4xl font-black text-slate-800">10k+</div>
                            <div className="text-[10px] md:text-xs uppercase text-slate-400 font-bold tracking-widest mt-2">Khách</div>
                        </div>
                        <div className="w-[1px] h-10 bg-slate-200"></div>
                        <div>
                            <div className="text-2xl md:text-4xl font-black text-slate-800">20+</div>
                            <div className="text-[10px] md:text-xs uppercase text-slate-400 font-bold tracking-widest mt-2">Giải thưởng</div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default VanillaSpa;