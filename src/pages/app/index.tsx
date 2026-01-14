"use client";

import {
    ArrowRightLeft,
    Bell,
    CreditCard as CardIcon,
    ChevronRight,
    Eye,
    Headphones,
    Home,
    Landmark,
    LogOut,
    Plus,
    ScanFace,
    Settings,
    TrendingUp,
    Wallet
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserLightPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const session = localStorage.getItem('user_session');
            if (session) {
                setUser(JSON.parse(session));
            } else {
                setUser({ name: "Alex Nguyen", role: "user" });
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-500 font-medium">Loading app...</span>
                </div>
            </div>
        );
    }

    return (
        // [LAYOUT CHÍNH]: Flex row trên desktop để có Sidebar
        <div className="min-h-screen bg-slate-50 md:flex font-sans">

            {/* --- DESKTOP SIDEBAR (Ẩn trên Mobile) --- */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 p-6 z-30">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                        F
                    </div>
                    <h1 className="font-bold text-2xl text-slate-800">Finance<span className="text-blue-600">App</span></h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={Home} label="Dashboard" active />
                    <SidebarItem icon={Landmark} label="Loans" />
                    <SidebarItem icon={CardIcon} label="My Cards" />
                    <SidebarItem icon={TrendingUp} label="Reports" />
                    <SidebarItem icon={Settings} label="Settings" />
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <SidebarItem icon={Headphones} label="Support Center" />
                    <SidebarItem icon={LogOut} label="Log Out" color="text-red-500 hover:bg-red-50" />
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            {/* Trên Mobile: Giữ max-w-[400px] và căn giữa. Trên Desktop: Full width */}
            <main className="flex-1 flex justify-center md:block relative">
                <div className="w-full max-w-[450px] md:max-w-full bg-[#f8f9fe] md:bg-slate-50 min-h-screen md:h-auto shadow-2xl md:shadow-none overflow-hidden md:overflow-visible flex flex-col relative">

                    {/* --- HEADER --- */}
                    <header className="px-6 py-6 md:py-8 flex items-center justify-between bg-white/50 md:bg-transparent backdrop-blur-sm sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                            <div className="md:hidden w-10 h-10 rounded-full bg-orange-100 overflow-hidden relative border-2 border-white shadow-sm">
                                <Image
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium">Welcome back,</p>
                                <h3 className="text-slate-900 font-bold text-lg md:text-2xl">{user.name}</h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Desktop User Profile display */}
                            <div className="hidden md:flex items-center gap-3 mr-4 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                                <div className="w-8 h-8 rounded-full bg-orange-100 overflow-hidden relative">
                                    <Image
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                        alt="Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-sm font-bold text-slate-700 pr-2">{user.name}</span>
                            </div>

                            <button className="relative p-2.5 bg-white rounded-full shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                        </div>
                    </header>

                    {/* --- SCROLLABLE CONTENT --- */}
                    <div className="flex-1 px-6 pb-24 md:pb-8">

                        {/* [DESKTOP GRID SYSTEM] */}
                        {/* Mobile: 1 cột | Desktop: Chia 3 cột (2 phần trái, 1 phần phải) */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">

                            {/* --- CỘT TRÁI (Balance & Actions) --- */}
                            <div className="xl:col-span-2 space-y-6 md:space-y-8">
                                {/* BALANCE CARD */}
                                <div className="w-full bg-blue-600 rounded-[30px] p-6 md:p-8 text-white shadow-lg shadow-blue-500/30 relative overflow-hidden transition-transform hover:scale-[1.01] duration-300">
                                    <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-blue-100 text-sm font-medium">Available Credit Limit</p>
                                            <Eye size={20} className="text-blue-200 cursor-pointer hover:text-white" />
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-10">50,000,000 <span className="text-lg md:text-2xl font-normal text-blue-200">VND</span></h2>

                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Current Balance</p>
                                                <p className="text-white font-bold text-xl md:text-2xl">12,450,000 VND</p>
                                            </div>
                                            <button className="bg-white/20 backdrop-blur-md text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors">
                                                Manage &gt;
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* QUICK ACTIONS */}
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base md:text-lg mb-4">Quick Actions</h3>
                                    {/* Trên Desktop: 4 cột ngang | Mobile: 2 cột dọc */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <ActionCard
                                            icon={Wallet} color="text-blue-600" bg="bg-blue-50"
                                            title="Apply Loan"
                                            onClick={() => router.push('/app/loanapp')}
                                        />
                                        <ActionCard
                                            icon={ScanFace} color="text-pink-600" bg="bg-pink-50"
                                            title="eKYC"
                                            onClick={() => router.push('/app/identityverification')}
                                        />
                                        <ActionCard
                                            icon={TrendingUp} color="text-orange-500" bg="bg-orange-50"
                                            title="Credit Score"
                                            onClick={() => { }}
                                        />
                                        <ActionCard
                                            icon={ArrowRightLeft} color="text-purple-600" bg="bg-purple-50"
                                            title="Transfer"
                                            onClick={() => { }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* --- CỘT PHẢI (Score & Activity) --- */}
                            <div className="space-y-6 md:space-y-8">
                                {/* CREDIT SCORE WIDGET */}
                                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-bold text-slate-800 text-base">Credit Score</h4>
                                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">785</span>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
                                            Excellent! You are eligible for lower rates.
                                        </p>
                                        <button className="text-xs font-bold text-blue-600 mt-3 flex items-center hover:underline">
                                            View Detailed Report <ChevronRight size={12} />
                                        </button>
                                    </div>
                                    <div className="relative w-20 h-20 flex-shrink-0">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                                            <circle cx="40" cy="40" r="32" stroke="#3b82f6" strokeWidth="6" fill="transparent" strokeDasharray="200" strokeDashoffset="50" strokeLinecap="round" />
                                        </svg>
                                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-slate-700">Top 5%</span>
                                    </div>
                                </div>

                                {/* RECENT ACTIVITY */}
                                <div className="bg-white md:p-6 md:rounded-[24px] md:border md:border-slate-100 md:shadow-sm">
                                    <div className="flex justify-between items-center mb-5">
                                        <h3 className="font-bold text-slate-800 text-base md:text-lg">Recent Activity</h3>
                                        <button className="text-sm font-bold text-blue-600 hover:underline">See All</button>
                                    </div>
                                    <div className="space-y-4">
                                        <ActivityItem
                                            icon={<div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">🛍️</div>}
                                            title="Amazon Shopping"
                                            date="Oct 24, 2023 • Electronics"
                                            amount="-2,450,000"
                                            status="PENDING"
                                        />
                                        <ActivityItem
                                            icon={<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">💸</div>}
                                            title="Loan Repayment"
                                            date="Oct 20, 2023 • Personal Loan"
                                            amount="+5,000,000"
                                            status="SUCCESS"
                                            isPositive
                                        />
                                        <ActivityItem
                                            icon={<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">⚡</div>}
                                            title="Electricity Bill"
                                            date="Oct 18, 2023 • Utilities"
                                            amount="-850,000"
                                            status="COMPLETED"
                                        />
                                        <ActivityItem
                                            icon={<div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">🍔</div>}
                                            title="Food Delivery"
                                            date="Oct 15, 2023 • Food"
                                            amount="-150,000"
                                            status="COMPLETED"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* --- MOBILE BOTTOM NAVIGATION (Ẩn trên Desktop) --- */}
                    <div className="absolute md:hidden bottom-6 left-6 right-6 h-16 bg-white rounded-[24px] shadow-2xl flex items-center justify-between px-6 z-30">
                        <NavItem icon={Home} label="Home" active />
                        <NavItem icon={Landmark} label="Loans" />
                        <div className="relative -top-6">
                            <button className="w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-500/40 flex items-center justify-center text-white hover:scale-105 transition-transform active:scale-95">
                                <Plus size={28} />
                            </button>
                        </div>
                        <NavItem icon={CardIcon} label="Cards" />
                        <NavItem icon={Headphones} label="Support" />
                    </div>

                </div>
            </main>
        </div>
    );
}

// --- SUB COMPONENTS ---

function SidebarItem({ icon: Icon, label, active, color }: any) {
    return (
        <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'} ${color}`}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className="font-medium text-sm">{label}</span>
        </div>
    );
}

function ActionCard({ icon: Icon, color, bg, title, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className="bg-white p-4 md:p-5 rounded-[20px] shadow-sm border border-slate-50 flex flex-col items-start gap-3 md:gap-4 cursor-pointer hover:shadow-md transition-all active:scale-95 hover:-translate-y-1"
        >
            <div className={`w-10 h-10 md:w-12 md:h-12 ${bg} ${color} rounded-xl flex items-center justify-center`}>
                <Icon size={20} className="md:w-6 md:h-6" />
            </div>
            <span className="font-bold text-slate-700 text-xs md:text-sm">{title}</span>
        </div>
    );
}

function ActivityItem({ icon, title, date, amount, status, isPositive }: any) {
    return (
        <div className="flex items-center justify-between bg-white md:bg-transparent p-3 md:p-0 rounded-2xl border md:border-0 border-transparent hover:border-slate-100 transition-all">
            <div className="flex items-center gap-3 md:gap-4">
                {icon}
                <div>
                    <h4 className="font-bold text-slate-800 text-xs md:text-sm">{title}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">{date}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-bold text-xs md:text-sm ${isPositive ? 'text-green-600' : 'text-slate-800'}`}>{amount}</p>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-300 uppercase mt-0.5">{status}</p>
            </div>
        </div>
    );
}

function NavItem({ icon: Icon, label, active }: any) {
    return (
        <div className={`flex flex-col items-center gap-1 cursor-pointer ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{label}</span>
        </div>
    );
}