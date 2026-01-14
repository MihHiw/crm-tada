import { Button } from "@/components/admin/Button";
import { Bell, Globe, LayoutList, Search } from "lucide-react";

export const Header = () => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10 px-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 lg:hidden">
                <div className="p-2 bg-slate-100 rounded-md"><LayoutList className="w-5 h-5" /></div>
            </div>

            <div className="hidden lg:flex flex-col">
                <h2 className="text-xl font-bold text-slate-800">Tổng quan hệ thống</h2>
                <p className="text-xs text-slate-500">Thứ sáu, 19 tháng 12, 2025</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                    <Search className="w-4 h-4 text-slate-400 mr-2" />
                    <input type="text" placeholder="Tìm kiếm khách hàng..." className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400" />
                </div>
                <Button variant="ghost" className="relative p-2 rounded-full hover:bg-slate-100">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </Button>
                <Button variant="ghost" className="p-2 rounded-full hover:bg-slate-100">
                    <Globe className="w-5 h-5 text-slate-600" />
                </Button>
            </div>
        </header>
    );
};